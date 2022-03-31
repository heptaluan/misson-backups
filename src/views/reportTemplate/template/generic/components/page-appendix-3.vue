<template>
  <page-common :pageConfig="pageConfig" :isChrome="isChrome" :pageIndex="pageIndex" :noTitle="true">
    <div class="container">
      <page-title :page-config="pageConfig"></page-title>
      <div class="content">
        <div class="appendix-table">
          <table class="">
            <tbody class="appendix-table-tbody">
              <tr class="appendix-table-row">
                <td width="80">油酸</td>
                <td>
                  油酸是一种单不饱和Omega-9脂肪酸，存在于动植物体内，也是自然界中最常
                  见的脂肪酸。但是油酸也可以引起各种不同动物的急性肺损伤，其病变类似临
                  床上创伤引起的脂栓及急性胰腺炎引起的肺损伤。
                </td>
                <td width="130">
                  22157537, <br />
                  18953024, <br />25961003
                </td>
              </tr>
              <tr class="appendix-table-row">
                <td>鞘氨醇</td>
                <td>
                  鞘氨醇又称神经鞘氨醇，是一种含有不饱和烃基链的十八碳氨基醇。鞘氨醇属
                  于鞘脂类，为细胞膜组成成分之一。鞘氨醇在体内鞘氨醇激酶1和鞘氨醇激酶2
                  的催化下被磷酸化产生鞘氨醇-1-磷酸。鞘脂的代谢物如神经酰胺、鞘氨醇与鞘
                  氨醇-1-磷酸，均为信号脂类分子，参与多种细胞过程。
                  最近的大量研究证实，它在许多疾病的发生发展中都发挥了作用，包括参与了
                  哮喘、风湿性关节炎、炎症性肠病、溃疡性结肠炎、克罗恩病、结肠癌等疾病的发
                  病过程，并且在其中扮演了关键角色。
                </td>
                <td>
                  22157537, <br />
                  18953024, <br />25961003
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class='page-img' style="margin-top:100px;">
          <img src='../../../common/image/image17.png' alt='' class='bg-img'>
        </div>
        <div class="image-introduce">图1：代谢通路示意图</div>
      </div>
    </div>
  </page-common>
</template>

<script>
import PageCommon from './page-common'
import PageTitle from './page-title'

export default {
  name: 'page-appendix-3',
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
