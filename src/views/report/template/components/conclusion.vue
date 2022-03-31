<template>
<div class="conclusion">
  <h3 class="conclusion-title">一、检测结论</h3>
  <div class="conclusion-content">
    <p>{{conclusion.description}}<a-checkbox-group :options="riskLevel" :value="risk" @change="onChange" />。{{conclusion.hint}}</p>
    <p v-html="conclusion.content"></p>
  </div>
</div>
</template>

<script>
import { conclusion as conc } from '../resource/constant'
export default {
  name: 'conclusion',
  props: {
    data: {
      type: Object,
      require: true
    },
  },
  data () {
    return {
      riskLevel: ['高风险', '中风险', '低风险']
    }
  },
  computed: {
    conclusion () {
      const { reportValue } = this.data
      const { description } = conc
      const _conclusion = reportValue >= 70 ? conc.high : (reportValue >= 50 ? conc.mid : conc.low)
      return {
        description,
        ..._conclusion
      }
    },
    risk () {
      const { reportValue } = this.data
      const index = reportValue >= 70 ? 0 : (reportValue >= 50 ? 1 : 2)
      return [this.riskLevel[index]]
    }
  },
  methods: {
    onChange () {
      return false
    }
  }
}
</script>
