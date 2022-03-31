/* 包含标题、页尾的容器 */
<template>
  <div class="page">
    <div class="page-common__index" v-if="false">{{calPageIndex}}</div>
    <div class="page-common">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'pageCommon',
    mixins: [],
    props: {
      pageIndex: {
        type: [String, Number]
      },
      pageConfig: {
        type: Object,
        require: true
      },
      data: {
        type: Object,
        require: true
      },
      // 不显示标题
      noTitle: {
        type: Boolean,
        default: false
      }
    },
    components: {},
    data () {
      return {
      }
    },
    computed: {
      calPageIndex () {
        let pageIndex = this.pageIndex
        pageIndex -= 0
        if (pageIndex && pageIndex > 0) {
          return pageIndex > 9 ? pageIndex : `0${pageIndex}`
        } else {
          return ''
        }
      }
    },
    created () {},
    mounted () {
    },
    watch: {},
    methods: {}
  }
</script>
