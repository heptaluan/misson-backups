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
      }
    }
  }
</script>
