<template>
  <page-common :pageConfig='pageConfig' :isChrome='isChrome' :pageIndex='pageIndex' :noTitle='true'>
    <div class='container'>
      <page-title :page-config='pageConfig'></page-title>
      <div class='content'>
        <div class='subtitle'>
          <span class='ball'></span>产品认证和资质
        </div>
        <div class='detail intend'>
          泰莱生物已拥有数十项自主研发的专利和软著，获得NMPA I类医疗器械备案和II类医疗器械注册证，及自主研发的质谱仪获得检测认证。
        </div>
        <div class='page-img qualification'>
          <img :src='imgPage' alt='' class='bg-img'>
          <div class='inline'>
            <img src='../../../common/image/image7.png' alt='' class='bg-img'>
            <img src='../../../common/image/psd.png' alt='' class='bg-img'>
          </div>
        </div>
      </div>
    </div>
  </page-common>
</template>

<script>
import PageCommon from './page-common'
import PageTitle from './page-title'

export default {
  name: 'page-qualification',
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
      return require(`@/views/reportTemplate/common/image/image10.png`)
      // return 'https://img.ananpan.com/page/page-' + this.pageConfig.code + '.jpg'
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../../common/less/common.less";
</style>