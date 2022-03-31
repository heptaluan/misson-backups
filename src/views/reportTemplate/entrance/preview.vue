<template>
 <div class="bg-gray">
  <div class="preview-container">
    <div class="page-body" v-for="item in PageBegin" :key="item.name">
      <!-- 页面：封面 -->
      <page-first  v-if="item.type === 'page-first'" :pageConfig="item" :data="patientInfo"/>
    </div>
    <div class='page-body' v-for='item in PageEnd' :key='item.name'>

      <!-- 页面：附录 -->
      <page-appendix-1 v-if="item.type === 'page-appendix-1'" :pageConfig='item' :data='patientInfo' />
      <page-appendix-2 v-if="item.type === 'page-appendix-2'" :pageConfig='item' :data='patientInfo' />
      <page-appendix-3 v-if="item.type === 'page-appendix-3'" :pageConfig='item' :data='patientInfo' />
      <page-appendix-gen v-if="item.type === 'page-appendix-gen'" :pageConfig='item' :data='patientInfo' />
      <page-appendix-gen2 v-if="item.type === 'page-appendix-gen2'" :pageConfig='item' :data='patientInfo' />
      <page-appendix-gen3 v-if="item.type === 'page-appendix-gen3'" :pageConfig='item' :data='patientInfo' />

      <page-appendix-healthQA v-if="item.type === 'page-appendix-healthQA'" :pageConfig='item' :data='patientInfo' />
      <page-appendix-healthQA2 v-if="item.type === 'page-appendix-healthQA2'" :pageConfig='item' :data='patientInfo' />
      <page-appendix-healthQA3 v-if="item.type === 'page-appendix-healthQA3'" :pageConfig='item' :data='patientInfo' />
      <page-appendix-healthQA4 v-if="item.type === 'page-appendix-healthQA4'" :pageConfig='item' :data='patientInfo' />



      <!-- 页面：封底 -->
      <page-introduction v-if="item.type === 'page-introduction'" :pageConfig='item' :data='patientInfo' />
      <page-qualification v-if="item.type === 'page-qualification'" :pageConfig='item' :data='patientInfo' />
      <page-achievement v-if="item.type === 'page-achievement'" :pageConfig='item' :data='patientInfo' />
      <page-explain v-if="item.type === 'page-explain'" :pageConfig='item' :data='patientInfo' />
      <page-letter v-if="item.type === 'page-letter'" :pageConfig='item' :data='patientInfo' />
      <page-last v-if="item.type === 'page-last'" :pageConfig='item' :data='patientInfo' />
      <page-partner v-if="item.type === 'page-partner'" :pageConfig='item' :data='patientInfo' />
    </div>
  </div>
 </div>
</template>

<script>
// page
import PageFirst from '../template/generic/components/page-first'
import PageLast from '../template/generic/components/page-last'

import { getStaticPageInfo, preHeight, preHeightImage, tipHeight } from '../template/generic/pageCofig'
import { getAction, postAction } from '@/api/manage'
import * as dayjs from 'dayjs'
import PageAppendix1 from '../template/generic/components/page-appendix-1'
import PageAppendix2 from '../template/generic/components/page-appendix-2'
import PageAppendix3 from '../template/generic/components/page-appendix-3'
import pageAppendixGen from '../template/generic/components/page-appendix-gen'
import pageAppendixGen2 from '../template/generic/components/page-appendix-gen2'
import pageAppendixGen3 from '../template/generic/components/page-appendix-gen3'
import pageAppendixHealthQA from '../template/generic/components/page-appendix-healthQA'
import pageAppendixHealthQA2 from '../template/generic/components/page-appendix-healthQA2'
import pageAppendixHealthQA3 from '../template/generic/components/page-appendix-healthQA3'
import pageAppendixHealthQA4 from '../template/generic/components/page-appendix-healthQA4'
import PageLetter from '../template/generic/components/page-letter'
import PageExplain from '../template/generic/components/page-explain'
import PagePartner from '../template/generic/components/page-partner'
import PageAchievement from '../template/generic/components/page-achievement'
import PageQualification from '../template/generic/components/page-qualification'
import PageIntroduction from '../template/generic/components/page-introduction'

export default {
  name: 'preview',
  components: {
    PageFirst,
    PageIntroduction,
    PageQualification,
    PageAchievement,
    PagePartner,
    PageExplain,
    PageLetter,
    PageLast,
    PageAppendix1,
    PageAppendix2,
    PageAppendix3,
    pageAppendixGen,
    pageAppendixGen2,
    pageAppendixGen3,
    pageAppendixHealthQA,
    pageAppendixHealthQA2,
    pageAppendixHealthQA3,
    pageAppendixHealthQA4
  },
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
        loadData:  false,
        PageBegin: [],
        PageEnd: []
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
            const { PageBegin, PageEnd} = getStaticPageInfo(this.report.choseProduct)
            this.PageBegin = PageBegin
            this.PageEnd = PageEnd
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
  @import "../common/less/preview.less";
</style>
