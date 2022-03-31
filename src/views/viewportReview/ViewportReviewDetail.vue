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
    const that = this
    // this.iframeUrl = `http://192.168.11.164:3000/viewer/1?&token=${this.token}&url=${Vue.prototype.API_BASE_URL}&type=${this.$route.query.type}&id=${this.$route.query.id}&orderId=${this.$route.query.orderId}&user=${this.$store.getters.userInfo.username}&resource=${this.$route.query.resource}&state=${this.$route.query.state}&taskId=${this.$route.query.taskId}&doctorId=${this.$route.query.doctorId}&backId=${this.$route.query.backId}&backType=${this.$route.query.backType}&page=review`
    this.iframeUrl = `https://ct.ananpan.com/viewer/1?&token=${this.token}&url=${Vue.prototype.API_BASE_URL}&type=${this.$route.query.type}&id=${this.$route.query.id}&orderId=${this.$route.query.orderId}&user=${this.$store.getters.userInfo.username}&resource=${this.$route.query.resource}&state=${this.$route.query.state}&taskId=${this.$route.query.taskId}&doctorId=${this.$route.query.doctorId}&backId=${this.$route.query.backId}&backType=${this.$route.query.backType}&page=review`

    window.addEventListener(
      'message',
      e => {
        if (e.data.success) {
          if (e.data.backType === 'detail') {
            that.$router.push({
              path: `/viewportReviewPackageDetail?id=${e.data.backId}`
            })
          } else if (e.data.backType === 'check') {
            that.$router.push({
              path: `/viewportNotCheckList`
            })
          } else {
            that.$router.push({
              path: `/viewportNotCheckList`
            })
          }
        }
      },
      false
    )
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
