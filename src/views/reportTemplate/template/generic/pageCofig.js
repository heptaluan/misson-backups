/**
 * Created by 9I
 * @Date 2022/3/25
 * @description 通用版版本斐盼安/费盼康
 */

const PAGE_INFO_MAP = {
  '封面': { type: 'page-first', code: '', title: '封面', isNoFooter: true },
  '标题': { type: 'page-title', code: '', title: '标题' },
  '检测总览': { type: 'page-user', code: '', title: '一、检测总览' },
  '检测结果详细解读': { type: 'page-result', code: 'result', title: '二、检测结果详细解读' },
  // 医学影像附录
  '生化分子组学检测结果': { type: 'page-result-metabolism', code: '', title: '二、检测结果详细解读' },
  '表观基因组学检测结果': { type: 'page-result-gen', code: '', title: '二、检测结果详细解读' },
  '风险结果解读': { type: 'page-result-risk', code: '', title: '二、检测结果详细解读' },
  // 附录
  '附录-生化分子组学1': { type: 'page-appendix-1', code: '', title: '三、附录' },
  '附录-生化分子组学2': { type: 'page-appendix-2', code: '', title: '三、附录' },
  '附录-生化分子组学3': { type: 'page-appendix-3', code: '', title: '三、附录' },
  '附录-表观基因组学1': { type: 'page-appendix-gen', code: '', title: '三、附录' },
  '附录-表观基因组学2': { type: 'page-appendix-gen2', code: '', title: '三、附录' },
  '附录-表观基因组学3': { type: 'page-appendix-gen3', code: '', title: '三、附录' },

  '附录-健康问答': { type: 'page-appendix-healthQA', code: '', title: '三、附录' },
  '附录-健康问答2': { type: 'page-appendix-healthQA2', code: '', title: '三、附录' },
  '附录-健康问答3': { type: 'page-appendix-healthQA3', code: '', title: '三、附录' },
  '附录-健康问答4': { type: 'page-appendix-healthQA4', code: '', title: '三、附录' },

  '附录-公司简介': { type: 'page-introduction', code: 'introduction', title: '三、附录' },
  '附录-资质与认证': { type: 'page-qualification', code: 'qualification', title: '三、附录' },
  '附录-科研成果': { type: 'page-achievement', code: 'achievement', title: '三、附录' },
  '附录-合作伙伴': { type: 'page-partner', code: 'partner', title: '三、附录' },
  '参考文献': { type: 'page-explain', code: 'explain', title: '四、参考文献' },
  '致信': { type: 'page-letter', code: 'letter', title: '致信' },
  '封底': { type: 'page-last', code: '', title: '封底' }
}
// 斐盼安
const FA = {
  start: [
    '封面',
    '标题',
    '检测总览',
    '检测结果详细解读'
  ],
  end: [
    '生化分子组学检测结果',
    '风险结果解读',
    '附录-生化分子组学1',
    '附录-生化分子组学2',
    '附录-生化分子组学3',
    '附录-表观基因组学1',
    '附录-表观基因组学2',
    '附录-表观基因组学3',
    '附录-健康问答',
    '附录-健康问答2',
    '附录-健康问答3',
    '附录-健康问答4',
    '附录-公司简介',
    '附录-资质与认证',
    '附录-科研成果',
    '附录-合作伙伴',
    '参考文献',
    '致信',
    '封底',
  ]
}
// 斐盼康
const FK = {
  start: [
    '封面',
    '标题',
    '检测总览',
    '检测结果详细解读'
  ],
  end: [
    '生化分子组学检测结果',
    '表观基因组学检测结果',
    '风险结果解读',
    '附录-生化分子组学1',
    '附录-生化分子组学2',
    '附录-生化分子组学3',
    '附录-表观基因组学1',
    '附录-表观基因组学2',
    '附录-表观基因组学3',
    '附录-健康问答',
    '附录-健康问答2',
    '附录-健康问答3',
    '附录-健康问答4',
    '附录-公司简介',
    '附录-资质与认证',
    '附录-科研成果',
    '附录-合作伙伴',
    '参考文献',
    '致信',
    '封底',
  ]
}

/**
 * 获取报告的静态页面信息
 * @param {String} type 类型[斐盼安/FA,费盼康/FK]
 */
export function getStaticPageInfo ( type ) {
  let page = []
  const pageResArr = type.toUpperCase() === 'FA' ? FA : FK
  const pageBeforeResArr = pageResArr.start || []
  let pageAfterArr = pageResArr.end || []
  const PageBegin = []
  const PageEnd = []

  // 1、报告检测结果/之前的页面
  pageBeforeResArr.forEach((item) => {
    let v = PAGE_INFO_MAP[item]
    v ? PageBegin.push({name: item, ...v}) : console.error(`没有 ${item} (模版信息)`)
  })

  // 3、报告检测结果/之后的页面
  let endIndex = 0
  let menuRightList = []
  pageAfterArr.forEach((item) => {
    let v = PAGE_INFO_MAP[item]
    v ? PageEnd.push({name: item,...v}) : console.error(`没有 ${item} (模版信息)`)
  })
  return { PageBegin, PageEnd }
}

export const preHeight = 1.32 // 结节小结每行高度
export const tipHeight = 1.46 // 小结tips高度
export const preHeightImage = 8.255  // 影像每幅图高度