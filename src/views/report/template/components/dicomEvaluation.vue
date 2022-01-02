<!--AI（人工智能）结节恶性概率评估-->
<template>
<div class="dicom-evaluation">
  <risk-chart v-for="(item, index) in data" :key="index" :data= "item"></risk-chart>
</div>
</template>

<script>
  import RiskChart from './riskChart'
  export default {
    name: 'dicom-evaluation',
    components: { RiskChart },
    props: {
      data: {
        type: Array,
        require: true
      }
    }
  }
</script>
