<template>
  <div class="bg-gray">
    <div class="preview-container">
      <page-common :pageConfig="pageConfig" pageIndex="1">
        <div class="page-overview">
          <h3 class="report-title text-center text-weight">肺结节良恶性检测报告</h3>
          <patient-info :data="patientInfo"></patient-info>
          <conclusion :data="report"></conclusion>
          <conclusion-result :data="report"></conclusion-result>
          <signature :data="singature"></signature>
        </div>
      </page-common>
      <page-common :pageConfig="pageConfig" pageIndex="2">
        <test-result class="page-content" :data="testResult" v-if="report.id"></test-result>
      </page-common>
      <page-common :pageConfig="pageConfig" :pageIndex="index + 3" v-for="(page, index) in imagePage" :key="index + 3" v-if="imagePage.length">
        <dicom-result :data="page.image" :pulmonaryNodules = "page.pulmonaryNodules" v-if="page.image.length" class="page-content"></dicom-result>
      </page-common>
      <page-common :pageConfig="pageConfig" :pageIndex="index + imagePage.length + 3" v-for="(page, index) in riskPage" :key="index + imagePage.length + 3" v-if="riskPage.length">
        <h3 class="text-orange evaluation-title" v-if="index === 0">AI（人工智能）结节恶性概率评估</h3>
        <dicom-evaluation :data="page.image" v-if="page.image.length" class="page-content"></dicom-evaluation>
      </page-common>
      <page-common :pageConfig="pageConfig" :pageIndex="pageLast">
        <explain class="page-content"></explain>
      </page-common>
      <page-common :pageConfig="pageConfig" :pageIndex="pageLast + 1">
        <page-explain class="page-content"></page-explain>
      </page-common>
    </div>
    <a-button @click="handleOnePrint" class="printBtn printBtn3 noprint">下载报告</a-button>
  </div>
</template>

<script>
  import PatientInfo from '../template/components/patientInfo'
  import Conclusion from '../template/components/conclusion'
  import ConclusionResult from '../template/components/conclusion-result'
  import Signature from '../template/components/signature'
  import TestResult from '../template/components/TestResult'
  import DicomResult from '../template/components/dicomResult'
  import DicomEvaluation from '../template/components/dicomEvaluation'
  import Explain from '../template/components/explain'
  import PageExplain from '../template/components/page-explain-t'
  import PageCommon from './components/page-common'
  import { getAction } from '@/api/manage'
  import { preHeight, preHeightImage, tipHeight } from '../template/resource/constant'
  import * as dayjs from 'dayjs'

  export default {
    name: 'print-preview',
    components: { PageCommon, Explain, DicomEvaluation, DicomResult, TestResult, Signature, ConclusionResult, Conclusion, PatientInfo, PageExplain },
    data() {
      return {
        patientInfo: {
          name: '曹湧',
          age: '52',
          sampleCode: 'P02LA336',
          sex: '女',
          patientId: 'PCT0002145',
          sendDoctor: '张伞',
          clinical: '肺结节',
          sendAgency: '山东省胸科医院',
          sendDate: '20210915',
          detectionMethod: '血液蛋白组学/代谢组学，以及医学影像等多组学技术'
        },
        singature: {
          Inspector: '杨清婷',
          Reviewer: '夏文军',
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
          queryById: '/report/sampleReportResult/queryById'
        },
        defaultImage: require('/src/views/report/template/resource/result.jpg'),
        testResult: {
          pulmonaryNodules: undefined
        },
        pulmonaryNodules: undefined
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
            this.report = res.result
            this.dicomResult = JSON.parse(this.report.imageReportAll)
            this.testResult = {
              ...res.result
            }
            this.singature.reportDate = this.report.updateTime
            this.proessData(this.dicomResult)
            const time = this.getDate(this.report.updateTime)
            const riskText = this.report.reportValue >= 70 ? '高风险' : (this.report.reportValue >= 50 ? '中风险' : '低风险')
            document.title = `肺结节良恶性鉴别检测_${this.patientInfo.name}_${time}_${riskText}`
          } else {
            this.$message.error(res.message)
          }
        } catch (e) {
          this.$message.warning(e.message)
        }
      },
      proessData (dicomResult) {
        let pulmonaryNodules = dicomResult.nodulesList.filter(o => {
          let scrynMaligant = o.scrynMaligant.replace('%', '')
          return scrynMaligant * 1 > 59.999
        })
        this.testResult.pulmonaryNodules = []
        this.pulmonaryNodules = pulmonaryNodules.slice(0)
        let beginIndex = 0
        const nodulesCount = this.pulmonaryNodules.length
        if (nodulesCount === 0) {
          beginIndex = 0
        } else {
          const height = nodulesCount * preHeight + tipHeight
          beginIndex = Math.ceil(height / preHeightImage)
        }
        beginIndex = beginIndex >= 3 ? 0 : 3 - beginIndex
        beginIndex = beginIndex - 1
        // 分页
        for (let i = 0; i < dicomResult.total; i++) {
          const Image = dicomResult.nodulesList[i]
          if (!Image.title) Image.title = `窗宽：${dicomResult.windowing}  窗位： ${dicomResult.windowLevel}`
          let imagePageIndex = i > beginIndex ? Math.ceil((i - beginIndex) / 3) + 1 : 1
          let riskPageIndex = Math.floor(i / 4) + 1
          if (imagePageIndex > this.imagePage.length) {
            const imagePage = {
              pageIndex: imagePageIndex,
              image: []
            }
            if (imagePageIndex === 1) imagePage.pulmonaryNodules = this.pulmonaryNodules
            imagePage.image.push(Image)
            this.imagePage.push(imagePage)
          } else {
            this.imagePage[imagePageIndex - 1].image.push(Image)
          }
          if (riskPageIndex > this.riskPage.length) {
            const imagePage = {
              pageIndex: riskPageIndex,
              image: []
            }
            imagePage.image.push(Image)
            this.riskPage.push(imagePage)
          } else {
            this.riskPage[riskPageIndex - 1].image.push(Image)
          }
        }
        this.pageLast = 3 + this.riskPage.length + this.imagePage.length
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
