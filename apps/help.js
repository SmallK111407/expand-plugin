import lodash from 'lodash'
import fs from 'fs'
import { Cfg, Version, Common, Data } from '../components/index.js'
import HelpTheme from './help/HelpTheme.js'

const _path = process.cwd()
const helpPath = `${_path}/plugins/expand-plugin/resources/help`

export class help extends plugin {
	constructor() {
		super({
			name: '[拓展插件]帮助',
			dsc: '拓展帮助',
			event: 'message',
			priority: 100,
			rule: [
				{
					reg: "^#?(拓展|扩展|扩充|拓充|扩大)?(命令|帮助|菜单|help|说明|功能|指令|使用说明)$",
					fnc: 'help'
				},
        {
          reg: "^#?拓展版本$",
					fnc: 'versionInfo'
        }
			]
		})
	}

async help (e) {
  if ((!/拓展/.test(e.msg)) && (!/扩展/.test(e.msg)) && (!/扩充/.test(e.msg)) && (!/拓充/.test(e.msg)) && (!/扩大/.test(e.msg)) && !Cfg.get('sys.help', false)){
    return false
  }

  let custom = {}
  let help = {}
  if (fs.existsSync(`${helpPath}/help-cfg.js`)) {
    console.log('expand-plugin: 检测到存在help-cfg.js配置\n建议将help-cfg.js移为config/help.js或重新复制config/help_default.js进行配置~')
    help = await import(`file://${helpPath}/help-cfg.js?version=${new Date().getTime()}`)
  } else if (fs.existsSync(`${helpPath}/help-list.js`)) {
    console.log('expand-plugin: 检测到存在help-list.js配置，建议将help-list.js移为config/help.js或重新复制config/help_default.js进行配置~')
    help = await import(`file://${helpPath}/help-list.js?version=${new Date().getTime()}`)
  }

  let { diyCfg, sysCfg } = await Data.importCfg('help')

  // 兼容一下旧字段
  if (lodash.isArray(help.helpCfg)) {
    custom = {
      helpList: help.helpCfg,
      helpCfg: {}
    }
  } else {
    custom = help
  }

  let helpConfig = lodash.defaults(diyCfg.helpCfg || {}, custom.helpCfg, sysCfg.helpCfg)
  let helpList = diyCfg.helpList || custom.helpList || sysCfg.helpList

  let helpGroup = []

  lodash.forEach(helpList, (group) => {
    if (group.auth && group.auth === 'master' && !e.isMaster) {
      return true
    }

    lodash.forEach(group.list, (help) => {
      let icon = help.icon * 1
      if (!icon) {
        help.css = 'display:none'
      } else {
        let x = (icon - 1) % 10
        let y = (icon - x - 1) / 10
        help.css = `background-position:-${x * 50}px -${y * 50}px`
      }
    })

    helpGroup.push(group)
  })
  let themeData = await HelpTheme.getThemeData(diyCfg.helpCfg || {}, sysCfg.helpCfg || {})
  return await Common.render('help/index', {
    helpCfg: helpConfig,
    helpGroup,
    ...themeData,
    element: 'default'
  }, { e, scale: 1.2 })
}

async versionInfo (e) {
  return await Common.render('help/version-info', {
    currentVersion: Version.version,
    changelogs: Version.changelogs,
    elem: 'anemo'
  }, { e, scale: 1.2 })
}
}
