<template>
  <page-common :pageConfig="pageConfig" :isChrome="isChrome" :pageIndex="pageIndex" :noTitle="true">
    <div class="container">
      <page-title :page-config="pageConfig"></page-title>
      <div class="content">
        <div class="appendix-table">
          <table class="">
            <tbody class="appendix-table-tbody">
              <tr class="appendix-table-row">
                <td width="90">PRRT2</td>
                <td>ENSG00000167371</td>
                <td>
                  癌细胞可能会伪装成神经细胞，形成突触，促进肿 瘤生产，多种癌种中神经元相关的基因存在表达异 常。
                </td>
                <td width="130">32598931</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="page-img" style="margin-top:100px;">
          <img src="../../../common/image/image16.png" alt="" class="bg-img" />
        </div>
        <div class="image-introduce">图2：表观遗传通路示意图</div>
      </div>
    </div>
  </page-common>
</template>

<script>
import PageCommon from './page-common'
import PageTitle from './page-title'

export default {
  name: 'page-appendix-gen3',
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
  }
}
</script>

<style lang="less" scoped>
@import '../../../common/less/common.less';
</style>
