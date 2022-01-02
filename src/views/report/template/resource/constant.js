/**
 * Created by 9I
 * @Date 2021/10/26
 * @description
 */

export const conclusion = {
  description: '经多组学分析，该受检者肺小结节良恶性评估为：',
  high: {
    hint: '提示您肺癌发生风险较高，建议进一步诊疗或严密跟踪。',
    content: '具体请临床医生结合患者的临床症状及本次检测结果进行综合分析。'
  },
  low: {
    hint: '提示您具有一定的肺癌发生风险。',
    content: '建议您与临床医生沟通，结合临床信息等结果，做好定期随访。'
  }
}

export const proteinResult = {
  interpretation: '上图结果为肺癌发生发展中某些显著性差异的内源性分子物质的含量情况，每个格子表示一种肿瘤生化分子，其中浅色部分表示肿瘤生化分子含量低，深色部分表示肿瘤生化分子含量高。总体生化分子的含量指示了患肿瘤的风险。生化分子组学检测结果通过人工智能分析算法对总体检出的生化分子组分及含量进行综合健康评分，检测得分在0-100之间，分值越大，表示您肺结节恶变的风险越大。',
  high: {
    suggest: '表示检测到恶性代谢异常早期信号，高度可疑，建议进一步诊疗或密切随访。'
  },
  mid: {
    suggest: '表示受检者肺部器官代谢异常，可能已进入早期病变阶段，但也不排除少数的肺癌发生，建议随访观察。'
  }
}
/*人工智能阅片分析结果： 小结*/
export const dicomResult = {
  interpretation: '建议由临床医生综合临床表型，考虑是否进一步诊疗或严密跟踪。',
  low: '考虑现有检测技术的局限性，建议视受检者状况综合评估复查或进行定期随访。'
}
export const preHeight = 1.32 // 结节小结每行高度
export const tipHeight = 1.46 // 小结tips高度
export const preHeightImage = 8.255  // 影像每幅图高度




