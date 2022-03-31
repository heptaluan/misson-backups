/* 包含标题、页尾的容器 */
<template>
  <div class="page">
    <div class="page-common__index" v-if="false">{{calPageIndex}}</div>
    <div class="page-common">
      <div class="page-common__title" v-if="!noTitle">
          <div class="page-common__title__rect">
            <img :src="require('@/views/report/template/resource/logo.png')" alt="">
          </div>
      </div>
      <slot></slot>
    </div>
    <div v-if="!pageConfig.isNoFooter" class="page-common__footer">
      {{calPageIndex}}
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

<style scoped lang="less">
@import "../../less/var.less";
.page-common {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  background: #fff;
  position: relative;

  &__index {
    position: absolute;
    .top(48);
    top: @top;
    .right(40);
    right: @right;
    .font-size(12);
    font-size: @fs;
    color: @colorP;
    font-weight: 500;
    z-index: 10;
    background: #fff;
    min-width: 40px;
    text-align: right;
  }

  &__title {
    .top(16);
    margin-top: @top;
    .left(72);
    margin-left: @left;
    line-height: 1.4;
    display: flex;
    .font-size(20);
    font-size: @fs;
    color: @colorP;
    font-weight: 500;
    align-self: flex-start;

    &.fixed {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 10;
      .text__bg {
        min-width: 300px;
        background: #fff;
      }
    }

    &--small {
      .font-size(8);
      font-size: @fs;
    }
    &--big {
      .height(38);
      height: @h;
      line-height: @h;
    }

    &__rect {
      .width(38);
      width: @w;
      height: 100%;
      .right(8);
      margin-right: @right;
      img {
        width: 100%;
      }
      // background: linear-gradient(to right, @colorP , @colorGreen);
    }
  }

  &__footer {
    position: absolute;
    height: 1.5cm;
    width: 100%;
    .left(81);
    padding: 0.2cm @left;
    .bottom(5);
    bottom: @bottom;
    left: 50%;
    transform: translate(-50%);
    font-size: 14px;
    display: flex;
    justify-content: center;
    color: @colorP;
    background: #ffffff;
    z-index: 0;
  }
  &__footer--isChrome {
    width: 110%;
    font-size: 12px;
    transform: scale(0.9) translate(-50%);
    transform-origin: 0;
  }
}
</style>
