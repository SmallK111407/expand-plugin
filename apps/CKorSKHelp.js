import plugin from '../../../lib/plugins/plugin.js'
import { segment } from 'oicq';
import setting from '../models/setting.js';

const _path = process.cwd() + '/plugins/expand-plugin'

export class CKorSKHelp extends plugin {
    constructor (e) {
      super({
        name: '[拓展插件]更全面的绑定教程',
        dsc: '更全面的ck、sk绑定教程',
        event: 'message',
        priority: -100,
        rule: [
          {
            reg: '^#*(体力|ck|cookie|米游社|cookies|米游币|stoken|Stoken|sk)(帮助|教程|绑定)',
            fnc: 'Help'
          }
    ]
  })
}
    get appconfig () {
    return setting.getConfig("CKorSKHelp");
  }

  async Help () {
    if (!this.appconfig.enable) { return false; }
    await this.e.reply(`Cookie或Stoken绑定配置教程：${this.appconfig.docs}\n获取cookie或stoken后【私聊发送】进行绑定`)
    }}
