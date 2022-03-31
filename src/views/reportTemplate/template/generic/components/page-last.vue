/* 页面：封底 */
<template>
  <page-common :pageConfig="pageConfig" :isChrome="isChrome" :pageIndex="pageIndex" :noTitle="true">
    <div class='page-img last'>
      <div class='content'>
        <div class='content-img'>
          <img v-if='false' class='logo-img' :src='logo_url' alt=''>
          <img v-if='qrCodeUrl' class='code-img' :src='qrCodeUrl' alt=''>
        </div>

        <div class='page-qrCode'>
          <img src='../../../common/image/image43.png' alt='' class='logo-img'>
          <img class='code-img' :src='imageSrc'>
        </div>
        <div class='content-address'>
          <p v-html='address' class='text'></p>
          <p v-html='addressCD' class='text'></p>
          <p v-html='website' class='text'></p>
        </div>
      </div>

    </div>
  </page-common>
</template>

<script>
import PageCommon from './page-common'
export default {
  name: 'pageLast',
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
    PageCommon
  },
  data () {
    return {}
  },
  computed: {
    imageSrc () {
      return 'https://img.ananpan.com/lite/page-last-qrcode.jpg?imageMogr2/thumbnail/1200x/format/webp'
    },
    address () {
      const value = '地址：上海市长宁区延安西路 1303 号万众大厦 5 楼'
      return value
    },
    addressCD () {
      return '四川省成都市高新区天府大道北段 1480 号 1 号楼 A 座 5 层'
    },
    website () {
      return '官网：www.tailai.bio'
    },
    logo_url () {
      const show = this.data.show_logo
      const url = this.data.logo_url + '?imageMogr2/thumbnail/900x/format/jpg'
      return show && url ? url : ''
    },
    qrCodeUrl () {
      const show = this.data.show_code
      const url = this.data.qr_code + '?imageMogr2/thumbnail/900x/format/jpg'
      return show && url ? url : ''
    }
  },
  created () {},
  mounted () {},
  watch: {},
  methods: {}
}
</script>

