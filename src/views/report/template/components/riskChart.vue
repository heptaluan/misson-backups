<template>
<div class="risk-chart">
  <h4 v-html="title"></h4>
  <div class="risk-content">
    <div class="risk-progress text-center">
       <a-progress stroke-linecap="square" :percent="percent" type="dashboard" :strokeColor = "getStatus(data.scrynMaligant)" :width="width"/>
       <p v-html="getStatusText(data.scrynMaligant)" class="text-center text-weight"></p>
       <h-progress :progress="data.meanHu"></h-progress>
       <p class="text-orange">密度：{{data.meanHu}}HU</p>
     </div>
    <div class="risk-diameter">
      <diameter :diameter="data.diameterNorm"></diameter>
    </div>
  </div>
</div>
</template>

<script>
  import HProgress from './hProgress'
  import Diameter from './diameter'
  export default {
    name: 'risk-chart',
    components: { Diameter, HProgress },
    props: {
      data: {
        type: Object,
        require: true
      }
    },
    data () {
      return {
        width: 100
      }
    },
    computed: {
      title () {
        const { data } = this
        return `结节${data.index}:${data.lungLocation}${data.lobeLocation}<span class="text-orange">${data.featureLabel}</span>`
      },
      percent () {
        let percent = this.data.scrynMaligant.replace('%', '')
        percent = percent * 1
        return percent
      }
    },
    methods: {
      getStatusText (risk) {
        let _risk = risk.replace('%', '')
        _risk = _risk * 1
        let status = '低风险'
        if (_risk < 70 ) {
          status = '低风险'
        }
        // if (risk < 70 && risk >=50 ) {
        //   status = '低风险'
        // }
        if (_risk >= 70 ) {
          status = '高风险'
        }
        return status
      },
      getStatus (risk) {
        let _risk = risk.replace('%', '')
        _risk = _risk * 1
        let status = '低风险'
        if (_risk < 70 ) {
          status = '#5fb679'
        }
        if (_risk < 70 && _risk >=50 ) {
          status = '#dc5f0d'
        }
        if (_risk >= 70 ) {
          status = '#fe0100'
        }
        return status
      }
    }
  }
</script>