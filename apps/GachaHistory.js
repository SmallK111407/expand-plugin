import plugin from '../../../lib/plugins/plugin.js'
import MysNews from '../models/mysNews.js'

export class gachahistory extends plugin {
  constructor (e) {
    super({
      name: '[拓展插件]历史卡池',
      dsc: '历史卡池截图',
      event: 'message',
      priority: 100,
      rule: [
        {
            reg: '^#*(卡池|历史)(历史|卡池)(五星|5星)$',
            fnc: 'gachahistory5'
        },
        {
          reg: '^#*(卡池|历史)(历史|卡池)(四星|4星)$',
          fnc: 'gachahistory4'
      }
      ]
    })
   }

    async gachahistory5 () {
        let data = await new MysNews(this.e).gachahistory5()
        if (!data) return
        await this.reply(data)
      }
    async gachahistory4 () {
        let data = await new MysNews(this.e).gachahistory4()
        if (!data) return
        await this.reply(data)
      }
    }