<template>
  <div class="dicom-image">
    <div class="dicom-image-body">
      <img :src="url" class="dicom-image-pic" :style="style">
    </div>
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
    computed: {
      style () {
        const container = document.querySelector('.ant-layout-content')
        let style = ''
        if (container) {
          const width = container.clientWidth
          const coefficient = 1
          // 计算panel宽度
          const panel = width - 24 * 2 - 15 * (1 / coefficient ) - (coefficient === 1 ? 0 : 24 * 2)

          // 根据宽度反算出高度
          const imagePanel = (panel * coefficient ) / 2
          const imageWidth = imagePanel - 15
          const height = Math.floor(imageWidth * 5 / 8)
          style = `height: ${height}px`
        }
        return style
      }
    },
    data () {
      return {
        // height: '360px'
      }
    }
  }
</script>
<style lang="less">
  .dicom-image-footer {
    font-weight: bold;
    margin-top: 5px;
  }
  /*.dicom-image-body {*/
  /*  height: calc(100% - 30px);*/
  /*}*/
  .dicom-image-pic {
    max-height: 100%;
  }
</style>