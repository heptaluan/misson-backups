<template>
  <page-common :pageConfig='pageConfig' :isChrome='isChrome' :pageIndex='pageIndex' :noTitle='true'>
    <div class='container achievement'>
      <page-title :page-config='pageConfig'></page-title>
      <div class='content'>
        <div class='subtitle'>
          <span class='ball'></span>科研成果
        </div>
        <div class='detail'>
          泰莱生物的多项科研成果被全球重要期刊和大会收录刊载：
        </div>
        <ul class='list'>
          <li class='ref achievement' v-for='item in achievements'>
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <div class='page-img achievement'>
      <img :src='imgPage' alt='' class='bg-img'>
    </div>
  </page-common>
</template>

<script>
import PageCommon from './page-common'
import PageTitle from './page-title'

export default {
  name: 'page-achievement',
  mixins: [],
  props: {
    pageIndex: {
      type: Number
    },
    isChrome: {
      type: Boolean
    },
    data: {
      type: Object,
      require: true
    },
    pageConfig: {
      type: Object,
      require: true
    }
  },
  components: {
    PageTitle,
    PageCommon
  },
  data() {
    return {
      achievements: [
        '2017.08      Cell Research (IF=25.6) ‒ 5hmC 肿瘤分期及分型研究成果',
        '2018.10  Cancer Research (IF=12.7) ‒ CT深度学习预测肺癌侵袭性',
        '2018.11  Nature Medicine (IF=53.4) ‒ 表观组学与人类慢病的研究',
        '2019.06  Cancer Research (IF=12.7) ‒ 非小细胞肺癌的染色质研究',
        '2019.09  ESMO ‒ 代谢组学肝癌早筛研究成果',
        '2019.09  CSCO ‒ 代谢组学肠癌早筛研究成果',
        '2019.10  Annals of Oncology (IF=32.9) ‒ 代谢组学肝癌早筛成果',
        '2020.03  SGO ‒ 代谢组学卵巢良恶性肿瘤鉴别研究成果',
        '2020.05  ASCO ‒ 代谢组学技术的胰腺癌早筛研究成果',
        '2020.07  Clinical Epigenetics (IF=6.5) ‒ 表观组学双模型胰腺癌早筛成果',
        '2021.01  ESMO Open ‒ 5hmC 联合蛋白标志物的早期肝癌检测与诊断',
        '2021.10  Radiology (IF=11.1) ‒ 深度学习预测I期NSCLC的N2转移和生存',
        '2021.11  Radiology (IF=11.1) ‒ 影像组学用于IA期NSCLC生存风险分层及评估',
        '2021.12  Transl Lung Cancer Res (IF=6.5) -亚实性结节的诊断',
        '2022.01  Modern Pathology (IF=7.8) -分级系统对I期NSCLC的预测价值',
        '2022.01  Eur J Nucl Med Mol Imaging (IF=7.8) -隐匿性肺癌预后评估',
        '2022.01  Clinical Epigenetics (IF=6.5) ‒ 5hmC用于早期肺癌的诊断',
        '2022.02  Nature Communications (IF=14.9) ‒ 泛癌肿的诊断与溯源研究成果'
      ]
    }
  },
  computed: {
    imgPage() {
      // if (this.pageConfig.codeLocal) {
      //   return require(`@/views/print/images/${this.pageConfig.code}.png`)
      // }
      return require(`@/views/reportTemplate/common/image/achievement.png`)
      // return 'https://img.ananpan.com/page/page-' + this.pageConfig.code + '.jpg'
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../../common/less/common.less";
</style>