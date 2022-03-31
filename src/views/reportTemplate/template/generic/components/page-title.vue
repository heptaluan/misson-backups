<template>
  <div>
    <div :class="['page-common__title', isPageImg ? 'fixed' : '']" v-if='!pageConfig.noTitle'>
      <div class='page-common__title__rect' :class="[longTitle ? 'long-title' : '']" v-if='pageConfig.title'>
        <div class='round margin-left-10'></div>
        {{ pageConfig.title }}
      </div>
      <div class='page-common__title__rect__line'></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page-title',
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
  data() {
    return {}
  },
  computed: {
    isPageImg() {
      return this.pageConfig.type === 'page-img'
    },
    longTitle() {
      let title = this.pageConfig.smallTitle || this.pageConfig.title
      return title.length > 6
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {},
  methods: {}
}
</script>

<style scoped>

</style>