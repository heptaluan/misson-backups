<template>
  <div class="footer" v-if="showFooter">
    <div class="links">
      <a href="#" target="_blank">泰莱商检系统</a>
      <!--      <a href="https://github.com/zhangdaiscott/jeecg-boot" target="_blank">-->
      <!--        <a-icon type="github"/>-->
      <!--      </a>-->
      <!--      <a href="https://ant.design/">Ant Design</a>-->
      <!--      <a href="https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/">Vue Antd</a>-->
    </div>
    <div class="copyright">
      Copyright
      <a-icon type="copyright" />
      2021 <span>泰莱生物 出品</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutFooter',
  data() {
    return {
      showFooter: true
    }
  },
  methods: {
    setFooterStyle() {
      if (this.$route.name === 'viewport-viewportDetail') {
        this.showFooter = false
      } else {
        this.showFooter = true
      }
    }
  },
  watch: {
    $route: function() {
      this.setFooterStyle()
    }
  },
  mounted() {
    this.setFooterStyle()
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 48px 0 24px;
  text-align: center;

  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
