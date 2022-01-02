<template>
 <div class="bg-gray">
  <div class="preview-container">
   <div class="page">
      <h3 class="report-title text-center text-weight">肺结节良恶性检测报告</h3>
      <patient-info :data="patientInfo"></patient-info>
     <conclusion></conclusion>
     <conclusion-result></conclusion-result>
     <signature :data="singature"></signature>
     <test-result></test-result>
     <dicom-result :data="dicomResult.imageList" v-if="dicomResult.imageList.length"></dicom-result>
     <dicom-evaluation :data="dicomResult.imageList" v-if="dicomResult.imageList.length"></dicom-evaluation>
     <explain></explain>
   </div>
  </div>
 </div>
</template>

<script>
  import PatientInfo from './components/patientInfo'
  import Conclusion from './components/conclusion'
  import ConclusionResult from './components/conclusion-result'
  import Signature from './components/signature'
  import TestResult from './components/TestResult'
  import DicomResult from './components/dicomResult'
  import DicomEvaluation from './components/dicomEvaluation'
  import Explain from './components/explain'
  export default {
    name: 'preview',
    components: { Explain, DicomEvaluation, DicomResult, TestResult, Signature, ConclusionResult, Conclusion, PatientInfo },
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
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.dicomResult.imageList = []
        const random = (max) =>{
          return Math.floor(Math.random() * max)
        }
        const randomFix = (max, min) =>{
          const _random = Math.floor(Math.random() * max * 100 + min * 100) / 100

          return _random
        }
        const getShape = ()=> {
          const shapeArr = ['胸膜钙化', '磨玻璃', '肺内实性']
          const index = Math.floor(Math.random() * 3)
          return shapeArr[index]
        }
        for (let i = 0; i < this.dicomResult.total; i++) {
          const _random = random(50) + 20
          const pn = _random % 2 === 0 ? 1 : -1
          const result = {
            index: i + 1,
            iamgeNumber: _random + i,
            risk: _random,
            url: require('./resource/dicom_result.png'),
            diameter: random(1000) / 100,
            minDensity: pn *(randomFix(100, 100)),
            maxDensity: pn *(randomFix(300,700)),
            avgDensity: pn *(randomFix(200, 500)),
            centerDensity: pn *(randomFix(100, 500)),
            shape: getShape(),
            size:  randomFix(10) + '*' + randomFix(10),
            lung: pn > 0 ? '左肺' : '右肺',
            lungLobe: pn > 0 ? '上肺叶' : '下肺叶'
          }
          this.dicomResult.imageList.push(result)
        }
      }
    }
  }
</script>
<style lang="less">
  @import "../less/preview.less";
</style>
