<template>
  <div class="bg-gray">
    <div class="preview-container">
      <page-common :pageConfig="pageConfig" pageIndex="1">
        <div class="page-overview">
          <h3 class="report-title text-center text-weight">肺结节良恶性检测报告</h3>
          <patient-info :data="patientInfo" v-if="loadData"></patient-info>
          <conclusion :data="report"></conclusion>
          <conclusion-result :data="report"></conclusion-result>
          <signature :data="singature"></signature>
        </div>
      </page-common>
      <page-common :pageConfig="pageConfig" pageIndex="2">
        <test-result class="page-content" :data="testResult" v-if="report.id"></test-result>
      </page-common>
      <page-common :pageConfig="pageConfig" :pageIndex="index + 3" v-for="(page, index) in imagePage" :key="index + 3" v-if="imagePage.length">
        <dicom-result :data="page" :pulmonaryNodules = "page.pulmonaryNodules" v-if="page.image.length || page.pulmonaryNodules.length" :imageReportValue="report.imageReportValue" class="page-content"></dicom-result>
      </page-common>
      <page-common :pageConfig="pageConfig" :pageIndex="index + imagePage.length + 3" v-for="(page, index) in riskPage" :key="index + imagePage.length + 3" v-if="riskPage.length">
        <h3 class="text-orange evaluation-title" v-if="index === 0">AI（人工智能）结节恶性概率评估</h3>
        <dicom-evaluation :data="page.image" v-if="page.image.length" class="page-content"></dicom-evaluation>
      </page-common>
      <page-common :pageConfig="pageConfig" :pageIndex="pageLast" v-if="isHasFK">
        <page-gen class="page-content" :data="report"></page-gen>
      </page-common>
      <page-common :pageConfig="pageConfig" :pageIndex="isHasFK ? pageLast + 1 : pageLast">
        <explain class="page-content"></explain>
      </page-common>
      <page-common :pageConfig="pageConfig" :pageIndex="isHasFK ? pageLast + 2 : pageLast + 1">
        <page-explain class="page-content"></page-explain>
      </page-common>
    </div>
    <a-button @click="reportReview" class="printBtn printBtn2 noprint" v-has="'report:review'">报告确认</a-button>
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
  import PageGen from '../template/components/page-genValue'
  import { getAction, postAction } from '@/api/manage'
  import { preHeight, preHeightImage, tipHeight } from '../template/resource/constant'
  import * as dayjs from 'dayjs'

  export default {
    name: 'print-preview',
    components: { PageCommon, Explain, DicomEvaluation, DicomResult, TestResult, Signature, ConclusionResult, Conclusion, PatientInfo, PageExplain, PageGen },
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
          getPatient: '/multiomics/productOrder/orderStepInfo',
          reportReview: '/report/sampleReportResult/review',
          downloadCount: '/report/sampleReportResult/downloadCount'
        },
        defaultImage: require('/src/views/report/template/resource/result.jpg'),
        testResult: {
          pulmonaryNodules: undefined
        },
        pulmonaryNodules: undefined,
        patient: {},
        loadData:  false
      }
    },
    computed: {
      isHasFK (){
        return this.report.choseProduct === 'FK' && this.report.geneReportValue
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
            this.proessData(this.dicomResult)
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
      proessData (dicomResult) {
        if (!dicomResult || !dicomResult.nodulesList || dicomResult.total === 0) {
          return false
        }
        // 删除 invisable === '1'
        for (let i = dicomResult.nodulesList.length - 1 ; i >= 0; i--) {
          // 兼容 1， '1'
          if(dicomResult.nodulesList[i].invisable == '1') {
            dicomResult.nodulesList.splice(i, 1)
          }
        }
        dicomResult.total = dicomResult.nodulesList.length
        // 重置index
        for (let i = 0 ; i< dicomResult.nodulesList.length; i++) {
          dicomResult.nodulesList[i].index = i + 1
        }
        let pulmonaryNodules = dicomResult.nodulesList.filter(o => {
          let scrynMaligant = o.scrynMaligant.replace('%', '')
          return scrynMaligant * 1 > 59.999
        })
        this.testResult.pulmonaryNodules = pulmonaryNodules
        this.testResult.total = dicomResult.total
        this.pulmonaryNodules = pulmonaryNodules.slice(0)
        let beginIndex = 0
        const nodulesCount = this.pulmonaryNodules.length
        let count = nodulesCount
        const prePageCount = 18
        let pageIndex = 0
        // 影像小结分页
        while (count > 0) {
          // 是否最后一页
          count = count - prePageCount
          const currentPageCount = count < 0 ? (count + prePageCount) : count
          const lastPage = count < 0
          const start = pageIndex * prePageCount
          const end = !lastPage ? (pageIndex + 1) * prePageCount : nodulesCount
          const imagePage = {
            pageIndex: pageIndex,
            image: [],
            pulmonaryNodules: this.pulmonaryNodules.slice(start, end)
          }
          if (lastPage) {
            const height = currentPageCount * preHeight + tipHeight
            // 计算最后一页结节占用高度
            beginIndex = Math.floor(height / preHeightImage) + 1
            // 占满 那么另起一页 ps:一般不会遇到这种情况
            // 起始位置
            if (beginIndex === 3) {
              beginIndex = 0
              pageIndex++
            }
            imagePage.showTips = true
          } else {
            imagePage.showTips = false
          }
          this.imagePage.push(imagePage)
          pageIndex++
        }
        if(pageIndex === 0) pageIndex = 1
        // 图像结果/图表分页
        for (let i = 0; i < dicomResult.total; i++) {
          const Image = dicomResult.nodulesList[i]
          if (!Image.title) Image.title = `结节${Image.index}&nbsp;&nbsp;窗宽：${dicomResult.windowing}  窗位： ${dicomResult.windowLevel}`
          let imagePageIndex =  Math.floor((i + beginIndex) / 3) + pageIndex
          let riskPageIndex = Math.floor(i / 4) + 1
          if (imagePageIndex > this.imagePage.length) {
            const imagePage = {
              pageIndex: imagePageIndex,
              image: [],
              showTips: imagePageIndex === 1 && this.pulmonaryNodules.length === 0
            }
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
        this.handleDownload()
      },
      getDate (time) {
        const pattern = 'YYYYMMDD'
        return dayjs(time).format(pattern)
      },
      async getPatient(id, step) {
        const url = this.url.getPatient
        let { patientInfo, report } = this
        try {
          const postData = {
            orderId: id,
            step: step
          }
          const res = await getAction(url, postData)
          if (res.code === 200) {
            if (step === 0) {
              const { caseName, age, sendHospital, sendDoctor, liveHospitalNumber, gender_dictText } = res.result
              this.patient.name = caseName
              this.patient.age = age
              this.patient.sendAgency = sendHospital
              this.patient.sendDoctor = sendDoctor
              this.patient.sex = gender_dictText
              this.patient.patientId = liveHospitalNumber
              this.patient.sendDate = '20210915'
              this.patient.detectionMethod = '血液蛋白组学/代谢组学，以及医学影像等多组学技术'
              const time = this.getDate(report.updateTime)
              const riskText = report.reportValue >= 70 ? '高风险' : (report.reportValue >= 50 ? '中风险' : '低风险')
              document.title = `肺结节良恶性鉴别检测_${caseName}_${time}_${riskText}`
            } else if (step === 1)  {
              const { medicalCaseCode } = res.result
              this.patient.sampleCode = medicalCaseCode
              this.patientInfo = this.patient
              this.loadData = true
            }
            //   <a-descriptions-item label="临床诊断">{{patientInfo.clinical}}</a-descriptions-item>
            //   <a-descriptions-item label="送检日期">{{patientInfo.sendDate}}</a-descriptions-item>
          } else {
            this.$message.error(res.message)
          }
        } catch (e) {
          this.$message.warning(e.message)
        }
      },
      async reportReview () {
        const id = this.$route.params.reportId
        const url = this.url.reportReview
        try {
          const postData = {
            orderId: id
          }
          const res = await postAction(url, postData)
          if (res.code === 200) {
            this.$message.success('报告确认成功！')
          } else {
            this.$message.error(res.message)
          }
        }
        catch (e) {
          this.$message.warning(e.message)
        }
      },
      async handleDownload () {
        const id = this.$route.params.reportId
        const url = this.url.downloadCount
        try {
          const postData = {
            orderId: id
          }
          const res = await postAction(url, postData)
          if (res.code === 200) {

          } else {
            this.$message.error(res.message)
          }
        }
        catch (e) {
          this.$message.warning(e.message)
        }
      }
    }
  }
</script>
<style lang="less">
  @import "../less/print.less";
</style>
