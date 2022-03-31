<template>
  <div class="bg-gray">
    <div class="preview-container preview-container-t800">
      <page-common :pageConfig="pageConfig" pageIndex="1">
        <div class="page-overview">
          <h3 class="report-title text-center text-weight">肺结节良恶性检测报告</h3>
          <patient-info :data="patientInfo" v-if="loadData"></patient-info>
          <conclusion :data="report"></conclusion>
          <conclusion-result :data="report"></conclusion-result>
          <test-result class="page-content" :data="testResult" v-if="report.id"></test-result>
        </div>
      </page-common>
      <page-common :pageConfig="pageConfig" pageIndex="2">
        <div class="page-overview">
          <p v-html="interpretation" class="pic-tips"></p>
          <signature :data="singature"></signature>
          <explain class="page-content"></explain>
        </div>
      </page-common>
      <page-common :pageConfig="pageConfig" :pageIndex="3">
        <page-explain class="page-content"></page-explain>
      </page-common>
      <page-common :pageConfig="pageConfig" :pageIndex="4">
        <page-about class="page-content"></page-about>
      </page-common>
    </div>
    <a-button @click="handleOnePrint" class="printBtn printBtn3 noprint">下载报告</a-button>
  </div>
</template>

<script>
import PatientInfo from './components/T800/patientInfo'
import Conclusion from './components/T800/conclusion'
import ConclusionResult from './components/T800/conclusion-result'
import Signature from '../template/components/signature'
import PageCommon from './components/T800/page-common'
import TestResult from './components/T800/TestResult'
import Explain from './components/T800/explain'
import PageExplain from './components/T800/page-explain-t'
import PageAbout from './components/T800/page-about'
import { getAction } from '@/api/manage'
import * as dayjs from 'dayjs'
export default {
  name: 'report-T800',
  components: { PageCommon, Explain, Signature, ConclusionResult, Conclusion, PatientInfo, PageExplain, TestResult, PageAbout },
  data() {
    return {
      patientInfo: {},
      singature: {
        reportDate: '2021年9月22日'
      },
      dicomResult: {
        total: 11,
        imageList: []
      },
      imagePage: [],
      riskPage: [],
      pageConfig: {
        isNoFooter: false
      },
      report: {},
      pageLast: 3,
      url: {
        queryById: '/report/sampleReportResult/queryById',
        getPatient: '/multiomics/productOrder/orderStepInfo'
      },
      defaultImage: require('/src/views/report/template/resource/result.jpg'),
      testResult: {
        pulmonaryNodules: undefined
      },
      pulmonaryNodules: undefined,
      patient: {},
      loadData:  false,
      interpretation: '其中浅色部分表示肿瘤生化分子含量低，深色部分表示肿瘤生化分子含量高。总体生化分子的含量指示了患肿瘤的\n' +
    '风险。生化分子组学检测结果通过人工智能分析算法对总体检出的生化分子组分及含量进行综合健康评分，检测得\n' +
    '分在 0-100 之间，分值越大，表示您肺结节恶变的风险越大。'
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getDatailById()
    },
    async getDatailById () {
      const id = this.$route.params.reportId
      const url = this.url.queryById
      try {
        const postData = {
          id: id
        }
        const res = await getAction(url, postData)
        if (res.code === 200) {
          this.report = res.result.reportInfo
          this.dicomResult = JSON.parse(this.report.imageReportAll)
          this.testResult = {
            ...res.result.reportInfo
          }
          this.report.choseProduct = res.result.choseProduct
          this.singature.reportDate = this.report.resultTime
          this.modelTitle = `窗宽：${this.dicomResult.windowing}  窗位： ${this.dicomResult.windowLevel}`
          this.patientInfo = res.result
          this.patientInfo.sex = res.result.sex ? (res.result.sex === '0' ? '女' : '男') : '-'
          const time = this.getDate(this.report.resultTime)
          const name = this.patientInfo.name
          const riskText = this.report.reportValue >= 70 ? '高风险' : (this.report.reportValue >= 50 ? '中风险' : '低风险')
          document.title = `肺结节良恶性鉴别检测_${name}_${time}_${riskText}`
          this.loadData = true
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        this.$message.warning(e.message)
      }
    },
    handleOnePrint () {
      window.print()
    },
    getDate (time) {
      const pattern = 'YYYYMMDD'
      return dayjs(time).format(pattern)
    }
  }
}
</script>
<style lang="less">
  @import "../less/print.less";
</style>
