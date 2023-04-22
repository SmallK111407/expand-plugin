import plugin from '../../../lib/plugins/plugin.js';
import setting from '../models/setting.js';

const _path = process.cwd() + '/plugins/expand-plugin'

export class RecordHelp extends plugin {
  constructor() {
    super({
      name: '[拓展插件]记录帮助',
      dsc: '适用扫码登录/密码登录的记录帮助，覆盖云崽自身记录帮助',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^#*(记录帮助|抽卡帮助|逍遥记录帮助|逍遥抽卡帮助|图鉴记录帮助|图鉴抽卡帮助)$',
          fnc: 'help'
        },
        {
          reg: '^#*(备用记录帮助|备用抽卡帮助|时雨记录帮助|时雨抽卡帮助)$',
          fnc: 'backhelp'
        },
        {
          reg: '^#*(米哈游登陆|米游社登陆)$',
          fnc: 'notice'
        }
      ]
    })
  }
  // 获取配置
  get appconfig() {
    return setting.getConfig("RecordHelp");
  }

  async help() {
    if (!this.appconfig.enable) { return false; }
    await this.e.reply(segment.image(`file:///${_path}/resources/RecordHelp/记录帮助.png`))
  }
  async backhelp() {
    if (!this.appconfig.enable) { return false; }
    await this.e.reply(segment.image(`file:///${_path}/resources/RecordHelp/记录帮助-TRSS.png`))
  }
  async notice() {
    await this.e.reply('温馨提示：是登录不是登陆')
  }
}