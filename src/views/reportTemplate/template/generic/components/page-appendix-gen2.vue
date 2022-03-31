<template>
  <page-common :pageConfig="pageConfig" :isChrome="isChrome" :pageIndex="pageIndex" :noTitle="true">
    <div class="container">
      <page-title :page-config="pageConfig"></page-title>
      <div class="content">
        <div class="appendix-table">
          <table class="">
            <tbody class="appendix-table-tbody">
              <tr class="appendix-table-row">
                <td width="90">BMP5</td>
                <td>ENSG00000112175</td>
                <td>
                  该基因编码TGF- β(转化生长因子- β)超家族蛋白 的分泌配体,导致SMAD家族转录因子的招募和激
                  活，从而调节基因表达。这种基因在多种人类癌症 中有不同的调节功能。
                </td>
                <td width="130">30268436</td>
              </tr>
              <tr class="appendix-table-row">
                <td>RASAL3</td>
                <td>ENSG00000105122</td>
                <td>
                  该基因属于Ras GTPase激活蛋白(RasGAP)家族， 该基因在某些细胞中的表达减少导致Ras活性形式 (Ras-
                  GTP)水平升高，提示该基因可能在Ras信号 通路中起负向调节作用。
                </td>
                <td>34777356</td>
              </tr>
              <tr class="appendix-table-row">
                <td>ARHGAP45</td>
                <td>ENSG00000180448</td>
                <td>
                  可 激 活 G T Pa s e 激 活 物 活 性 。R A S 家 族 属 于 小 GTPases，包含三个人类基因HRAS、NRAS和KRAS，
                  其中KRAS被证明参与多种癌症发生发展。
                </td>
                <td>34524873</td>
              </tr>
              <tr class="appendix-table-row">
                <td>DCC</td>
                <td>ENSG00000187323</td>
                <td>
                  该跨膜蛋白是细胞粘附分子免疫球蛋白超家族的 成员，该蛋白部分定位于脂筏，在没有配体的情况
                  下诱导细胞凋亡。该蛋白作为一种肿瘤抑制因子， 在结癌症经常发生突变或下调。
                </td>
                <td>11005564</td>
              </tr>
              <tr class="appendix-table-row">
                <td>CNTN5</td>
                <td>ENSG00000187323</td>
                <td>
                  癌细胞可能会伪装成神经细胞，形成突触，促进肿 瘤生产，多种癌种中神经元相关的基因存在表达异常。
                </td>
                <td>29985475</td>
              </tr>
              <tr class="appendix-table-row">
                <td>MET</td>
                <td>ENSG00000105976</td>
                <td>
                  典型的酪氨酸激酶受体，MET改变是人类癌症的驱 动因素。在一些癌症中，扩增和过表达已被证实。
                </td>
                <td>32615820</td>
              </tr>
              <tr class="appendix-table-row">
                <td>PIK3CA</td>
                <td>ENSG00000121879</td>
                <td>
                  PIK3CA是公认的一个致癌基因，是PI3K通路的重 要组分。PIK3CA及其与AKT和mTOR信号通路的相
                  互作用是科学研究热点,且PI3K抑制在最近的临床 试验中取得了一些成功。
                </td>
                <td>27215089</td>
              </tr>
              <tr class="appendix-table-row">
                <td>CASP9</td>
                <td>ENSG00000132906</td>
                <td>
                  基因编码半胱氨酸-天冬氨酸蛋白酶(Caspase)家 族的一个成员。Caspases的顺序激活在细胞凋亡
                  的执行阶段起着核心作用，是一种肿瘤抑制因子。
                </td>
                <td>17285546</td>
              </tr>
              <tr class="appendix-table-row">
                <td>PDK1</td>
                <td>ENSG00000152256</td>
                <td>
                  丙酮酸脱氢酶(PDH)是一种线粒体多酶复合物，催 化丙酮酸氧化脱羧，是哺乳动物碳水化合物燃料稳
                  态调节的主要酶之一。酶的活性是由磷酸化/去磷 酸化循环调节的。通过特定的丙酮酸脱氢酶激酶
                  (PDK)磷酸化PDH导致失活。
                </td>
                <td>28473254</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </page-common>
</template>

<script>
import PageCommon from './page-common'
import PageTitle from './page-title'

export default {
  name: 'page-appendix-gen2',
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
