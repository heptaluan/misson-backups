<template>
<div class="patient-info">
  <div class="patient-info-row b-flex">
    <div class="b-flex-1 patient-info-item">
      <label>姓名:</label>
      <span v-html="data.name"></span>
    </div>
    <div class="b-flex-1 patient-info-item">
      <label>年  龄:</label>
      <span v-html="data.age + '岁'"></span>
    </div>
    <div class="b-flex-1 patient-info-item">
      <label>样本编号:</label>
      <span v-html="data.sampleCode"></span>
    </div>
  </div>
  <div class="patient-info-row b-flex">
    <div class="b-flex-1 patient-info-item">
      <label>性别:</label>
      <span v-html="data.sex"></span>
    </div>
    <div class="b-flex-1 patient-info-item">
      <label>住 院 号:</label>
      <span v-html="data.patientId"></span>
    </div>
    <div class="b-flex-1 patient-info-item">
      <label>送检医师:</label>
      <span v-html="data.sendDoctor"></span>
    </div>
  </div>
  <div class="patient-info-row b-flex">
    <div class="b-flex-1 patient-info-item">
      <label>临床诊断:</label>
      <span v-html="data.clinical"></span>
    </div>
    <div class="b-flex-1 patient-info-item">
      <label>送检单位:</label>
      <span v-html="data.sendAgency"></span>
    </div>
    <div class="b-flex-1 patient-info-item">
      <label>送检日期:</label>
      <span v-html="data.sendDate"></span>
    </div>
  </div>
  <div class="patient-info-row b-flex">
    <div class="b-flex-1 patient-info-item">
      <label>检测方法:</label>
    </div>
    <div class="b-flex-2 patient-info-item">
      <span v-html="data.detectionMethod"></span>
    </div>
  </div>
</div>
</template>

<script>
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
      allConfig: {}
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
