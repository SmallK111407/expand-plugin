import YAML from 'yaml'
import chokidar from 'chokidar'
import fs from 'node:fs'
import { _path, pluginResources, pluginRoot } from "./path.js";

class Setting {
  constructor () {
    /** 默认设置 */
    this.defPath = `${_path}/plugins/expand-plugin/defSet/`
    this.defSet = {}

    /** 用户设置 */
    this.configPath = `${_path}/plugins/expand-plugin/config/`
    this.config = {}

    this.dataPath = `${_path}/plugins/expand-plugin/data/`
    this.data = {}

    /** 监听文件 */
    this.watcher = { config: {}, defSet: {} }

  }

  // 配置对象化 用于锅巴插件界面填充
  merge () {
    let sets = {}
    let appsConfig = fs.readdirSync(this.defPath).filter(file => file.endsWith(".yaml"));
    for (let appConfig of appsConfig) {
      // 依次将每个文本填入键
      let filename = appConfig.replace(/.yaml/g, '').trim()
      sets[filename] = this.getConfig(filename)
    }
    return sets
  }

  // 配置对象分析 用于锅巴插件界面设置
  analysis(config) {
    for (let key of Object.keys(config)){
      this.setConfig(key, config[key])
    }
  }

  // 获取对应模块数据文件
  getData (path, filename) {
    path = `${this.dataPath}${path}/`
    try {
      if (!fs.existsSync(`${path}${filename}.yaml`)){ return false}
      return YAML.parse(fs.readFileSync(`${path}${filename}.yaml`, 'utf8'))
    } catch (error) {
      logger.error(`[${filename}] 读取失败 ${error}`)
      return false
    }
  }

  // 写入对应模块数据文件
  setData (path, filename, data) {
    path = `${this.dataPath}${path}/`
    try {
      if (!fs.existsSync(path)){
        // 递归创建目录
        fs.mkdirSync(path, { recursive: true });
      }
      fs.writeFileSync(`${path}${filename}.yaml`, YAML.stringify(data),'utf8')
    } catch (error) {
      logger.error(`[${filename}] 写入失败 ${error}`)
      return false
    }
  }

  // 获取对应模块默认配置
  getdefSet (apps) {
    return this.getYaml(apps, 'defSet')
  }

  // 获取对应模块用户配置
  getConfig (apps) {
    return { ...this.getdefSet(apps), ...this.getYaml(apps, 'config') }
  }

  // 设置对应模块用户配置
  setConfig (apps, Object) {
    return this.setYaml(apps, 'config', { ...this.getdefSet(apps), ...Object})
  }

  // 将对象写入YAML文件
  setYaml (apps, type, Object){
    let file = this.getFilePath(apps, type)
    try {
      fs.writeFileSync(file, YAML.stringify(Object),'utf8')
    } catch (error) {
      logger.error(`[${apps}] 写入失败 ${error}`)
      return false
    }
  }

  // 读取YAML文件 返回对象
  getYaml (apps, type) {
    let file = this.getFilePath(apps, type)
    if (this[type][apps]) return this[type][apps]

    try {
      this[type][apps] = YAML.parse(fs.readFileSync(file, 'utf8'))
    } catch (error) {
      logger.error(`[${apps}] 格式错误 ${error}`)
      return false
    }
    this.watch(file, apps, type)
    return this[type][apps]
  }

  // 获取YAML文件目录
  getFilePath (apps, type) {
    if (type === 'defSet') return `${this.defPath}${apps}.yaml`
    else {
      try {
        if (!fs.existsSync(`${this.configPath}${apps}.yaml`)) {
          fs.copyFileSync(`${this.defPath}${apps}.yaml`, `${this.configPath}${apps}.yaml`)
        }
      } catch (error) {
        logger.error(`拓展插件缺失默认文件[${apps}]${error}`)
      }
      return `${this.configPath}${apps}.yaml`
    }
  }


  // 监听配置文件
  watch (file, apps, type = 'defSet') {

    if (this.watcher[type][apps]) return

    const watcher = chokidar.watch(file)
    watcher.on('change', path => {
      delete this[type]
      logger.mark(`[拓展插件][修改配置文件][${type}][${apps}]`)
      if (this[`change_${apps}`]) {
        this[`change_${apps}`]()
      }
    })
    this.watcher[type] = watcher
  }
/**
   * 原神角色id转换角色名字
   */
roleIdToName (id) {
  let name = this.getdefSet('role' , 'name')
  if (name[id]) {
    return name[id][0]
  }

  return ''
}

/** 原神角色别名转id */
roleNameToID (keyword) {
  if (!isNaN(keyword)) keyword = Number(keyword)
  this.getAbbr()
  let roelId = this.nameID.get(String(keyword))
  return roelId || false
}
/** 获取角色别名 */
getAbbr () {
  if (this.nameID) return

  this.nameID = new Map()

  let nameArr = this.getdefSet('role', 'name')
  let nameArrUser = this.getConfig('role', 'name')

  let nameID = {}

  for (let i in nameArr) {
    nameID[nameArr[i][0]] = i
    for (let abbr of nameArr[i]) {
      this.nameID.set(String(abbr), i)
    }
  }

  for (let i in nameArrUser) {
    for (let abbr of nameArrUser[i]) {
      this.nameID.set(String(abbr), nameID[i])
    }
  }
}

/**
   * 获取消息内原神角色名称，uid
   * @param msg 判断消息
   * @param filterMsg 过滤消息
   * @return roleId 角色id
   * @return name 角色名称
   * @return alias 当前别名
   * @return uid 游戏uid
   */
getRole (msg, filterMsg = '') {
  let alias = msg.replace(/#|老婆|老公|[1|2|5-9][0-9]{8}/g, '').trim()
  if (filterMsg) {
    alias = alias.replace(new RegExp(filterMsg, 'g'), '').trim()
  }

  /** 判断是否命中别名 */
  let roleId = this.roleNameToID(alias)
  if (!roleId) return false
  /** 获取uid */
  let uid = this.getMsgUid(msg) || ''

  return {
    roleId,
    alias,
    name: this.roleIdToName(roleId)
  }
}

cpCfg (apps) {
  if (!fs.existsSync('./plugins/expand-plugin/config')) {
    fs.mkdirSync('./plugins/expand-plugin/config')
  }

  let set = `./plugins/expand-plugin/config/${apps}.yaml`
  if (!fs.existsSync(set)) {
    fs.copyFileSync(`./plugins/expand-plugin/defSet/${apps}.yaml`, set)
  }
}
}

export default new Setting()
