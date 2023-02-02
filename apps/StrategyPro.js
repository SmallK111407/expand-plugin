/** 导入plugin */
import plugin from '../../../lib/plugins/plugin.js'
import gsCfg from '../models/gsCfg.js'
import common from '../../../lib/common/common.js'
import { segment } from 'oicq'
import lodash from 'lodash'
import fs from 'node:fs'
import fetch from 'node-fetch'

gsCfg.cpCfg('StrategyPro', 'set')

export class strategy extends plugin {
  constructor () {
    super({
      name: '[拓展插件]米游社攻略Pro',
      dsc: '米游社攻略图Pro',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^#?(更新)?\\S+攻略([1-7])?$',
          fnc: 'strategy'
        },
        {
          reg: '^#?攻略(说明|帮助)?$',
          fnc: 'strategy_help'
        },
        {
          reg: '^#?设置默认攻略([1-7])?$',
          fnc: 'strategy_setting'
        }
      ]
    })
    
    this.set = gsCfg.getConfig('StrategyPro', 'set')

    this.path = `./data/strategy`

    this.url = 'https://bbs-api.mihoyo.com/post/wapi/getPostFullInCollection?&gids=2&order_type=2&collection_id='
    this.collection_id = [
      [],
      // 来源：西风驿站
      [839176, 839179, 839181, 1180811],
      // 来源：原神观测枢
      [813033],
      // 来源：派蒙喵喵屋
      [341284],
      // 来源：OH是姜姜呀(需特殊处理)
      [341523],
      // 来源：曉K → 废物一个
      [1582613],
      // 来源：轻松的蓝色三明治
      [1624518],
      // 来源：坤易
      [22148]
    ]

    this.source = ['西风驿站', '原神观测枢', '派蒙喵喵屋', 'OH是姜姜呀', '曉K', '轻松的蓝色三明治', '坤易']

    this.oss = '?x-oss-process=image//resize,s_1200/quality,q_90/auto-orient,0/interlace,1/format,jpg'
  }
  /** 初始化创建配置文件 */
  async init () {
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path)
    }
    /** 初始化子目录 */
    for (let subId of [1, 2, 3, 4, 5, 6, 7]) {
      let path = this.path + '/' + subId
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
      }
    }
  }

  /** #心海攻略 */
  async strategy () {
    let match = /^#?(更新)?(\S+)攻略([1-7])?$/.exec(this.e.msg)

    // let isUpdate = !!this.e.msg.includes('更新')
    let isUpdate = !!match[1]
    let roleName = match[2]
    let group = match[3] ? match[3] : this.set.defaultSource

    let role = gsCfg.getRole(roleName)

    if (!role) return false

    /** 主角特殊处理 */
    if (['10000005', '10000007', '20000000'].includes(String(role.roleId))) {
      let travelers = ['风主', '岩主', '雷主', '草主']
      if (!travelers.includes(role.alias)) {
        let msg = '请选择：'
        for (let sub of travelers) {
          msg += `${sub}攻略${group}、`
        }
        msg = msg.substring(0, msg.lastIndexOf('、'))
        await this.e.reply(msg)
        return
      } else {
        role.name = role.alias
      }
    }

    this.sfPath = `${this.path}/${group}/${role.name}.jpg`

    if (fs.existsSync(this.sfPath) && !isUpdate) {
      await this.e.reply(segment.image(`file://${this.sfPath}`))
      return
    }

    if (await this.getImg(role.name, group)) {
      await this.e.reply(segment.image(`file://${this.sfPath}`))
    }
  }

  /** #攻略帮助 */
  async strategy_help () {

    await this.e.reply('攻略帮助:\n#纳西妲攻略[1234567]\n#更新艾尔海森攻略[1234567]\n#设置默认攻略[1234567]\n示例: 心海攻略4\n\n攻略来源:\n1——西风驿站\n2——原神观测枢\n3——派蒙喵喵屋\n4——OH是姜姜呀\n5——曉K\n6——轻松的蓝色三明治\n7——坤易')
    
  }

  /** #设置默认攻略1 */
  async strategy_setting () {
    let match = /^#?设置默认攻略([1-7])?$/.exec(this.e.msg)
    let set = './plugins/expand-plugin/config/StrategyPro.set.yaml'
    let config = fs.readFileSync(set, 'utf8')
    let num = Number(match[1])
    if(isNaN(num)) {
    await this.e.reply('默认攻略设置方式为: \n#设置默认攻略[1234567] \n 请增加数字1-7其中一个')
		return
    }
    config = config.replace(/defaultSource: [1-7]/g, 'defaultSource: ' + Number(match[1]))
    fs.writeFileSync(set, config, 'utf8')

    await this.e.reply('默认攻略已设置为: ' + match[1])
  }
  /** 下载攻略图 */
  async getImg (name, group) {
    let msyRes = []
    this.collection_id[group].forEach((id) => msyRes.push(this.getData(this.url + id)))

    try {
      msyRes = await Promise.all(msyRes)
    } catch (error) {
      this.e.reply('暂无攻略数据，请稍后再试')
      logger.error(`米游社接口报错：${error}}`)
      return false
    }

    let posts = lodash.flatten(lodash.map(msyRes, (item) => item.data.posts))
    let url
    for (let val of posts) {
      /** 攻略图个别来源特殊处理 */
      if (group == 4) {
        if (val.post.structured_content.includes(name + '】')) {
          let content = val.post.structured_content.replace(/\\\/\{\}/g, '')
          let pattern = new RegExp(name + '】.*?image\\\\?":\\\\?"(.*?)\\\\?"');  // 常驻角色兼容
          let imgId = pattern.exec(content)[1]
          for (let image of val.image_list) {
            if (image.image_id == imgId) {
              url = image.url
              break
            }
          }
          break
        }
      } else {
        if (val.post.subject.includes(name)) {
          let max = 0
          val.image_list.forEach((v, i) => {
            if (Number(v.size) >= Number(val.image_list[max].size)) max = i
          })
          url = val.image_list[max].url
          break
        }
      }
    }

    if (!url) {
      this.e.reply(`暂无${name}攻略（${this.source[group - 1]}）\n请尝试其他的攻略来源查询\n#攻略帮助，查看说明`)
      return false
    }

    logger.mark(`${this.e.logFnc} 下载${name}攻略图`)

    if (!await common.downFile(url + this.oss, this.sfPath)) {
      return false
    }

    logger.mark(`${this.e.logFnc} 下载${name}攻略成功`)

    return true
  }

  /** 获取数据 */
  async getData (url) {
    let response = await fetch(url, { method: 'get' })
    if (!response.ok) {
      return false
    }
    const res = await response.json()
    return res
  }
}
