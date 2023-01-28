/*
* 此配置文件为系统使用，请勿修改，否则可能无法正常使用
*
* 如需自定义配置请复制修改上一级help_default.js
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

export const isSys = true
