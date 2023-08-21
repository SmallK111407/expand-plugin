import fs from 'node:fs'
import chalk from 'chalk'

if (!global.segment) {
  global.segment = (await import("oicq")).segment
}

let ret = []

logger.info(chalk.rgb(120, 255, 108)('---------QAQ---------'))
logger.info(chalk.rgb(120, 255, 108)(`拓展插件载入成功~qwq`))
logger.info(chalk.rgb(120, 255, 108)(`Created By 曉K`))
logger.info(chalk.rgb(120, 255, 108)(`本插件已跑路，后续只做存留功能维护！`))
logger.info(chalk.rgb(120, 255, 108)(`---------------------`));

const files = fs
  .readdirSync('./plugins/expand-plugin/apps')
  .filter((file) => file.endsWith('.js'))

  files.forEach((file) => {
    ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')
  
  if (ret[i].status != 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
    }
    apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}
export { apps }
