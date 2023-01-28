/**
* 请注意，系统不会读取help_default.js ！！！！
* 【请勿直接修改此文件，且可能导致后续冲突】
*
* 如需自定义可将文件【复制】一份，并重命名为 help.js
*
* */

export const helpCfg = {
  title: '拓展帮助',
  subTitle: 'Yunzai-Bot & Expand-Plugin',
  columnCount: 3,
  colWidth: 265,
  theme: 'all',
  themeExclude: ['default'],
  style: {
    fontColor: '#ceb78b',
    descColor: '#eee',
    contBgColor: 'rgba(6, 21, 31, .5)',
    contBgBlur: 3,
    headerBgColor: 'rgba(6, 21, 31, .4)',
    rowBgColor1: 'rgba(6, 21, 31, .2)',
    rowBgColor2: 'rgba(6, 21, 31, .35)'
  }
}

export const helpList = [{
  group: '拓展命令',
  list: [{
    icon: 61,
    title: '#记录帮助',
    desc: '适配TRSS-Plugin的记录帮助教程图'
  }, {
    icon: 63,
    title: '#刻晴攻略[1234567]',
    desc: '七家的角色攻略，6可能因为图片过大发不出'
  }, {
    icon: 66,
    title: '#明日素材',
    desc: '基于云崽的明日素材'
  }, {
    icon: 64,
    title: '#历史卡池(五星|四星)',
    desc: '同云崽的#原石预估'
  }]
}, {
  group: '管理命令，仅管理员可用',
  auth: 'master',
  list: [{
    icon: 85,
    title: '#拓展(强制)更新',
    desc: '更新拓展插件'
  }]
}]
