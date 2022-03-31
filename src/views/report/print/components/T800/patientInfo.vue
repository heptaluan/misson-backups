<template>
<div class="patient-info">
  <div class="patient-info-row b-flex">
    <div class="b-flex-1 patient-info-item">
      <label>姓名:</label>
      <span v-html="patient.name"></span>
    </div>
    <div class="b-flex-2 patient-info-item">
      <label>年  龄:</label>
      <span v-html="patient.age"></span>
    </div>
    <div class="b-flex-1 patient-info-item">
      <label>样本编号:</label>
      <span v-html="patient.orderCode"></span>
    </div>
  </div>
  <div class="patient-info-row b-flex">
    <div class="b-flex-1 patient-info-item">
      <label>性别:</label>
      <span v-html="patient.sex"></span>
    </div>
    <div class="b-flex-2 patient-info-item">
      <label>住 院 号:</label>
      <span v-html="patient.patientId"></span>
    </div>
    <div class="b-flex-1 patient-info-item">
      <label>送检医师:</label>
      <span v-html="patient.sendDoctor"></span>
    </div>
  </div>
  <div class="patient-info-row b-flex">
    <div class="b-flex-1 patient-info-item">
      <label>临床诊断:</label>
      <span v-html="clinical"></span>
    </div>
    <div class="b-flex-2 patient-info-item">
      <label>送检单位:</label>
      <span v-html="patient.sendAccess"></span>
    </div>
    <div class="b-flex-1 patient-info-item">
      <label>送检日期:</label>
      <span v-html="patient.createTime"></span>
    </div>
  </div>
  <div class="patient-info-row b-flex">
    <div class="b-flex-1 patient-info-item">
      <label>检测方法:</label>
    </div>
    <div class="b-flex-3 patient-info-item">
      <span v-html="detectionMethod"></span>
    </div>
  </div>
</div>
</template>

<script>
import { Patient } from '../../../template/resource/constant'
export default {
  name: 'patient-info',
  mixins: [],
  props: {
    data: {
      type: Object,
      require: true
    },
    pageConfig: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      // patient: {},
      allConfig: {},
      clinical: Patient.clinical
    }
  },
  computed: {
    patient () {
      const { name, age, orderCode, sex, patientId, sendDoctor, sendAccess, createTime, sendDepartment, sendHospital_dictText} = this.data
      const _age = age ? age + '岁' :  '-'
      return {
        name,
        age: _age,
        orderCode,
        sex,
        patientId,
        sendDoctor,
        sendAccess: sendHospital_dictText,
        createTime,
        sendDepartment
      }
    },
    detectionMethod () {
      const { choseProduct } = this.data
      return choseProduct === 'FA' ? Patient.detectionMethodFA : Patient.detectionMethodFK
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // this.patient = this.data
    }
  }
}
</script>

