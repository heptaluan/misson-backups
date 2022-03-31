<template>
  <page-common :pageConfig='pageConfig' :isChrome='isChrome' :pageIndex='pageIndex' :noTitle='true'>
    <div class='container '>
      <page-title :page-config='pageConfig'></page-title>
      <div class='content'>
        <div class='subtitle'>
          <span class='ball'></span>合作伙伴
        </div>
        <div class='page-img'>
          <img :src='imgPage' alt='' class='bg-img'>
          <img src='../../../common/image/image5.png' alt='' class='bg-img'>
        </div>
      </div>
    </div>
  </page-common>
</template>

<script>
import PageCommon from './page-common'
import PageTitle from './page-title'

export default {
  name: 'page-partner',
  mixins: [],
  props: {
    pageIndex: {
      type: Number
    },
    isChrome: {
      type: Boolean
    },
    data: {
      type: Object,
      require: true
    },
    pageConfig: {
      type: Object,
      require: true
    }
  },
  components: {
    PageTitle,
    PageCommon
  },
  data() {
    return {}
  },
  computed: {
    imgPage() {
      // if (this.pageConfig.codeLocal) {
      //   return require(`@/views/print/images/${this.pageConfig.code}.png`)
      // }
      return require(`@/views/reportTemplate/common/image/logo1psd.png`)
      // return 'https://img.ananpan.com/page/page-' + this.pageConfig.code + '.jpg'
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../../common/less/common.less";
</style>