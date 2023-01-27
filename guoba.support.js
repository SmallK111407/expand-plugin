import setting from "./models/setting.js";
import lodash from "lodash";

// 支持锅巴
export function supportGuoba () {
    return {
      pluginInfo: {
        name: 'expand-plugin',
        title: '拓展插件',
        author: '@曉K',
        authorLink: 'https://gitee.com/SmallK111407',
        link: 'https://gitee.com/SmallK111407/expand-plugin',
        isV3: true,
        isV2: false,
        description: '提供#刻晴攻略5、#艾尔海森攻略6、#明日素材 等在云崽基础上拓展的功能',
        icon: 'bi:box-seam',
        iconColor: '#7ed99e'
      },
      // 配置项信息
    configInfo: {
        // 配置项 schemas
        schemas: [{
          field: 'RecordHelp.enable',
          label: '记录帮助',
          bottomHelpMessage: '是否覆盖云崽的记录帮助',
          component: 'Switch'
        }],

        getConfigData () {
            return setting.merge()
          },
          // 设置配置的方法（前端点确定后调用的方法）
          setConfigData (data, { Result }) {
            let config = {}
            for (let [keyPath, value] of Object.entries(data)) {
              lodash.set(config, keyPath, value)
            }
            config = lodash.merge({}, setting.merge, config)
            setting.analysis(config)
            return Result.ok({}, '保存成功~')
          }
        }
      }
    }