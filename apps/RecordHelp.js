import plugin from '../../../lib/plugins/plugin.js';
import setting from '../models/setting.js';

const _path = process.cwd() + '/plugins/expand-plugin'

export class RecordHelp extends plugin {
    constructor () {
      super({
        name: '[拓展插件]记录帮助',
        dsc: '适合TRSS-Plugin的记录帮助，覆盖云崽自身记录帮助',
        event: 'message',
        priority: 100,
        rule: [
            {
                reg: '^#*(记录帮助|抽卡帮助)$',
                fnc: 'help'
            }
        ]
    })
}
  // 获取配置
  get appconfig () {
    return setting.getConfig("RecordHelp");
  }

  async help () {
    if (!this.appconfig.enable) { return false; }
    await this.e.reply(segment.image(`file:///${_path}/resources/RecordHelp/记录帮助.png`))
    }}