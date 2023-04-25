// https://TRSS.me yyds
import plugin from '../../../lib/plugins/plugin.js'
import setting from '../models/setting.js';

const _path = process.cwd() + '/plugins/expand-plugin'

export class RandomTRSS extends plugin {
    constructor(e) {
        super({
            name: '[拓展插件]随机TRSS图',
            dsc: '仅供娱乐，非讽刺，TRSS做得很好',
            event: 'message',
            priority: -100,
            rule: [
                {
                    reg: '^#*(随机|来一张|随鸡|随坤)(时雨|[Tt]+[Rr]+[Ss]+[Ss]|时雨图|时雨[弔吊叼屌刁]图)',
                    fnc: 'TRSS'
                }
            ]
        })
    }
    get appconfig() {
        return setting.getConfig("RandomTRSS");
    }
    async TRSS(e) {
        if (!this.appconfig.enable) { return false; }
        const files = fs.readdirSync(`${_path}/resources/TRSSimages/`)
        let number = Math.floor(Math.random() * files.length)
        await this.reply(segment.image(`${_path}/resources/TRSSimages/${files[number]}`))
        return true
    }
}