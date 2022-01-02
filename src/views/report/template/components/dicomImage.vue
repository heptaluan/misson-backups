<template>
  <div class="dicom-image">
    <div class="dicom-image-title"></div>
    <img :src="url" class="dicom-image-pic">
    <div class="dicom-image-footer" v-html="'·' + footer"></div>
  </div>
</template>

<script>
  export default {
    name: 'dicomImage',
    props: {
      url: {
        type: String,
        require: true
      },
      footer: {
        type: String,
        require: true
      }
    },
    data () {
      return {
        // iamgeUrl: url
      }
    }
  }
</script>
<style lang="less">
  .dicom-image-footer {
    font-weight: bold;
    margin-top: 10px;
  }
</style>