<template>
<div class="h-progress">
  <div class="bgBlue h-progress-bg"></div>
  <div class="progress-position" :style="positionStyle" v-if="positionStyle"></div>
  <div class="h-progress-tips">
    <span class="text-left">-1000</span>
    <span class="text-center">0</span>
    <span class="text-ringt">1000</span>
  </div>
</div>
</template>

<script>
export default {
  name: 'h-progress',
  props: {
    progress: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      positionStyle: null
    }
  },
  mounted () {
    this.init()
  },
  methods:{
    init() {
      const left = (this.progress * 1 + 1000) * 100 / 2000
      this.positionStyle = `left: ${left}%`
    }
  }
}
</script>
