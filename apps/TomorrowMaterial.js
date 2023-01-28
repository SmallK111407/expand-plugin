import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import Tomorrow from '../models/tomorrow.js'

export class TomorrowMaterial extends plugin {
  constructor () {
    super({
      name: '[拓展插件]明日素材',
      dsc: '基于云崽的明日素材',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^#(明日|明天|下一天|第二天)*(素材|材料|天赋)[ |0-9]*$',
          fnc: 'tomorrow'
        }
      ]
    })
  }

  /** #明日素材 */
  async tomorrow () {
    let data = await new Tomorrow(this.e).getData()
    if (!data) return
    /** 生成图片 */
    let img = await puppeteer.screenshot('todayMaterial', data)
    if (img) await this.reply(img)
  }
}
