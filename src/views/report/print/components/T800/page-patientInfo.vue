<template>
  <page-common :pageConfig="pageConfig" pageIndex="1">
    <div class="page-overview">
      <h3 class="report-title text-center text-weight">肺结节良恶性检测报告</h3>
      <patient-info :data="patientInfo" v-if="patientInfo"></patient-info>
      <conclusion :data="report"></conclusion>
      <conclusion-result :data="report"></conclusion-result>
<!--      <signature :data="singature"></signature>-->
    </div>
  </page-common>
</template>

<script>
export default {
  name: 'page-patientInfo',
  props: {
    patientInfo: {
      type: Object,
      require: true
    },
    report: {
      type: Object,
      require: true
    },
    pageIndex: {
      type: [String, Number]
    },
    pageConfig: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
    }
  },
  mounted () {
  }
}
</script>
