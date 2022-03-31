<template>
  <div class="viewport-detail-wrap">
    <div class="viewport-detail">
      <iframe style="border:none" :width="iframeWidth" :height="iframeHeight" :src="iframeUrl"></iframe>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'ViewportMetaDetail',
  methods: {
    widthHeight() {
      this.iframeHeight = window.innerHeight
      this.iframeWidth = window.innerWidth - 56 - document.querySelector('.ant-layout-sider').clientWidth
    },
    listenNodeChange() {
      const that = this
      const targetNode = document.querySelector('.ant-layout-sider')
      const config = { attributes: true }
      const callback = function() {
        setTimeout(() => {
          that.widthHeight()
        }, 500)
      }
      const observer = new MutationObserver(callback)
      observer.observe(targetNode, config)
    }
  },
  data() {
    return {
      reportUrl: '',
      iframeHeight: 0,
      iframeWidth: 0,
      token: Vue.ls.get(ACCESS_TOKEN)
    }
  },
  mounted() {
    window.onresize = () => {
      this.widthHeight()
    }
    this.$nextTick(function() {
      this.widthHeight()
    })
    this.listenNodeChange()
  },
  created() {
    // this.iframeUrl = `http://192.168.11.164:3000/viewer/1?resource=${this.$route.query.resource}&token=${this.token}&url=${Vue.prototype.API_BASE_URL}&page=image`
    this.iframeUrl = `https://ct.ananpan.com/viewer/1?resource=${this.$route.query.resource}&token=${this.token}&url=${Vue.prototype.API_BASE_URL}&page=image`
    // this.iframeUrl = `https://yyds.ananpan.com/viewport/viewer/1?resource=${this.$route.query.resource}&token=${this.token}&url=${Vue.prototype.API_BASE_URL}&page=image`
  }
}
</script>
<style lang="less" scoped>
.viewport-detail-wrap {
  background-color: white;

  .viewport-detail {
    padding: 10px 24px 0;
  }
}
</style>
