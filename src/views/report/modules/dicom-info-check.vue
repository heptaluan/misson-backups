<template>
  <div class="dicom-item__content dicom-info-check">
    <div class="item-content-image">
      <div class="title" v-html="dicomTitle"></div>
      <div class="dicom-iamge-link" @click="handleViewDicom(item)"><span v-html="'影像层：#' + item.imageIndex"></span></div>
      <div class="b-flex">
        <dicom-image :url="item.imageUrl1 || ''" footer="横断面1" class="margin-right-sm"></dicom-image>
        <dicom-image :url="item.imageUrl2 || ''" footer="局部细节"></dicom-image>
      </div>
    </div>
    <div class="b-flex b-flex-1 flex-col">
      <div class="b-flex b-flex-1 item-content-info">
        <a-card hoverable class="flex-185 b-flex flex-col" @click="handleChoose()" :class="{'item-choose': choose === 'default'}">
          <div class="adoption" v-if="choose === 'default'"><span class="adoption-label">采纳</span></div>
          <div class="title">AI影像表现</div>
          <div class="info-panel b-flex-1">
            <div class="item-info-row">
              <span v-html="update"></span>
            </div>
            <div class="item-info-row">
              <label>是否结节:</label>
              <a-radio-group v-model="item.invisable" button-style="solid" size="small">
                <a-radio-button value="0">
                  是
                </a-radio-button>
                <a-radio-button value="1">
                  否
                </a-radio-button>
              </a-radio-group>
            </div>
            <div class="item-info-row">
              <label>肺:</label>
              <div>
                <a-radio-group default-value="item.lungLocation" v-model="item.lungLocation" button-style="solid" size="small">
                  <a-radio-button value="右肺">
                    右肺
                  </a-radio-button>
                  <a-radio-button value="左肺">
                    左肺
                  </a-radio-button>
                </a-radio-group>
              </div>
            </div>
            <div class="item-info-row">
              <label>肺叶:</label>
              <div>
                <a-radio-group default-value="item.lobeLocation" v-model="item.lobeLocation" button-style="solid" size="small">
                  <a-radio-button value="上叶">
                    上叶
                  </a-radio-button>
                  <a-radio-button value="中叶" v-if ="item.lungLocation !== '左肺'">
                    中叶
                  </a-radio-button>
                  <a-radio-button value="下叶">
                    下叶
                  </a-radio-button>
                </a-radio-group>
              </div>
            </div>
            <div class="item-info-row">
              <label>形态类型:</label>
              <div>
                <a-select v-model="item.featureLabel" placeholder="请选择形态类型" size="small">
                  <a-select-option v-for="item in featureLabelOption" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="item-info-row">
              <label>恶性风险:</label>
              <div class="edit-input">
                <a-input v-model="item.scrynMaligant" placeholder="请输入风险系数" suffix="%" size="small"></a-input>
              </div>
            </div>
          </div>
        </a-card>
        <a-card hoverable class="b-flex-1 b-flex flex-col border-left" @click="handleChoose(sitem.checkName)" :class="{'item-choose': choose === sitem.checkName}" v-for="(sitem, index) in suggestList" :key="index">
          <div class="adoption" v-if="choose === sitem.checkName"><span class="adoption-label">采纳</span></div>
          <div class="title text-center" v-html="sitem.checkName"></div>
          <div class="info-panel b-flex-1 content-start">
            <div class="item-info-row margin-bottom-sm">
              <span v-html="sitem.edit_time"></span>
            </div>
            <div class="item-info-row margin-bottom-sm">
              <a-tag :color="getInvisibleColor(sitem.invisable, initialNodule.invisable)" v-html="getInvisibleText(sitem)"></a-tag>
            </div>
            <div class="item-info-row margin-bottom-sm">
              <a-tag :color="getColor(sitem.lungLocation, initialNodule.lungLocation)" v-html="sitem.lungLocation || (sitem.checkName === '未检阅' ? '-' : initialNodule.lungLocation)"></a-tag>
            </div>
            <div class="item-info-row margin-bottom-sm">
              <a-tag :color="getColor(sitem.lobeLocation, initialNodule.lobeLocation)" v-html="sitem.lobeLocation || (sitem.checkName === '未检阅' ? '-' : initialNodule.lobeLocation)"></a-tag>
            </div>
            <div class="item-info-row margin-bottom-sm">
              <a-tag :color="getColor(sitem.featureLabel, initialNodule.featureLabel)" v-html="sitem.featureLabel || (sitem.checkName === '未检阅' ? '-' : initialNodule.featureLabel)"></a-tag>
            </div>
            <div class="item-info-row" v-if="sitem.suggest">
              <label>意见:</label>
              <p v-html="sitem.suggest"></p>
            </div>
          </div>
        </a-card>
      </div>
      <div class="padding-left-xs b-flex-1 b-flex">
        <a-card hoverable class="b-flex flex-col full-height b-flex-2">
          <div class="title">AI影像原始结果</div>
          <div class="info-panel b-flex">
            <div class="b-flex-1 b-flex flex-col flex-evenly">
              <div class="item-info-row">
                <label>肺:</label>
                <span v-html="initialNodule.lungLocation" class="margin-right-sm"></span>
              </div>
              <div class="item-info-row">
                <label>肺叶:</label>
                <span v-html="initialNodule.lobeLocation"></span>
              </div>
              <div class="item-info-row">
                <label>形态类型:</label>
                <span v-html="initialNodule.featureLabel"></span>
              </div>
              <div class="item-info-row">
                <label>恶性风险:</label>
                <span v-html="fixMaligant(initialNodule.scrynMaligant)"></span>
              </div>
              <div class="item-info-row">
                <label>大小:</label>
                <span v-html="initialNodule.diameter"></span>
              </div>
              <div class="item-info-row">
                <label>体积:</label>
                <span v-html="initialNodule.noduleSize + 'mm³'"></span>
              </div>
            </div>
            <div class="b-flex-1 b-flex flex-col flex-evenly">
              <div class="item-info-row">
                <label>标准直径:</label>
                <span v-html="initialNodule.diameterNorm + 'mm'"></span>
              </div>
              <div class="item-info-row">
                <label>中心密度:</label>
                <span v-html="initialNodule.centerHu + 'HU'"></span>
              </div>
              <div class="item-info-row">
                <label>平均密度:</label>
                <span v-html="initialNodule.meanHu + 'HU'"></span>
              </div>
              <div class="item-info-row">
                <label>最大密度:</label>
                <span v-html="initialNodule.maxHu + 'HU'"></span>
              </div>
              <div class="item-info-row">
                <label>最小密度:</label>
                <span v-html="initialNodule.minHu + 'HU'"></span>
              </div>
            </div>
          </div>
        </a-card>
        <a-card hoverable class="b-flex-1 b-flex flex-col border-left" @click="handleChoose(lastSuggest.checkName)" :class="{'item-choose': choose === lastSuggest.checkName}" v-if="lastSuggest.checkName">
            <div class="adoption" v-if="choose === lastSuggest.checkName"><span class="adoption-label">采纳</span></div>
            <div class="title text-center" v-html="lastSuggest.checkName"></div>
            <div class="info-panel b-flex-1 content-start">
              <div class="item-info-row margin-bottom-sm">
                <span v-html="lastSuggest.edit_time"></span>
              </div>
              <div class="item-info-row margin-bottom-sm">
                <a-tag :color="getInvisibleColor(lastSuggest.invisable, initialNodule.invisable)" v-html="getInvisibleText(lastSuggest)"></a-tag>
              </div>
              <div class="item-info-row margin-bottom-sm">
                <a-tag :color="getColor(lastSuggest.lungLocation, initialNodule.lungLocation)" v-html="lastSuggest.lungLocation || (lastSuggest.checkName === '未检阅' ? '-' : initialNodule.lungLocation)"></a-tag>
              </div>
              <div class="item-info-row margin-bottom-sm">
                <a-tag :color="getColor(lastSuggest.lobeLocation, initialNodule.lobeLocation)" v-html="lastSuggest.lobeLocation || (lastSuggest.checkName === '未检阅' ? '-' : initialNodule.lobeLocation)"></a-tag>
              </div>
              <div class="item-info-row margin-bottom-sm">
                <a-tag :color="getColor(lastSuggest.featureLabel, initialNodule.featureLabel)" v-html="lastSuggest.featureLabel || (lastSuggest.checkName === '未检阅' ? '-' : initialNodule.featureLabel)"></a-tag>
              </div>
              <div class="item-info-row" v-if="lastSuggest.suggest">
                <label>意见:</label>
                <p v-html="lastSuggest.suggest"></p>
              </div>
            </div>
          </a-card>
      </div>
    </div>
  </div>
</template>

<script>
  import DicomImage from './dicomImageCheck'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  export default {
    name: 'dicom-info',
    props: {
      item: {
        type: Object,
        require: true
      },
      title: {
        type: String,
        require: true
      },
      dicomId: {
        type: String,
        require: true
      },
      update: {
        type: String,
        require: true
      },
      suggest: {
        type: Array,
        require: true
      },
      dnResultId: {
        type: Number,
        require: true
      },
      initialNodule: {
        type: Object,
        require: true
      }
    },
    data() {
      return {
        choose: 'default',
        edit: true,
        featureLabelOption: [
          { label: '肺内实性', value: '肺内实性' },
          { label: '部分实性', value: '部分实性' },
          { label: '磨玻璃', value: '磨玻璃' },
          { label: '肺内钙化', value: '肺内钙化' },
          { label: '胸膜实性', value: '胸膜实性' },
          { label: '胸膜钙化', value: '胸膜钙化' },
          { label: '其他', value: '其他' }
        ],
        lastSuggest: {},
        suggestList: []
      }
    },
    components: { DicomImage },
    mounted() {
      this.choose = this.item.choose
      if (this.item.invisable == '1') {
        this.$set(this.item, 'invisable', '1')
      } else {
        this.$set(this.item, 'invisable', '0')
      }
      if (this.suggest.length > 2) {
        this.suggestList = this.suggest.slice(0, 2)
        const suggest = this.suggest[2]
        this.lastSuggest = {
          ...suggest
        }
      } else {
        this.suggestList = this.suggest.slice()
      }
    },
    computed: {
      dicomTitle() {
        const { item, title } = this
        return `结节 ${item.index}   ${title}`
      }
    },
    methods: {
      fixMaligant (value) {
        let retValue = 0
        try {
          const numberValue = value.replace('%', '')
          retValue = parseFloat(numberValue).toFixed(0)
        } catch (e) {
          console.log(e)
        }
        return retValue + '%'
      },
      handleChoose (value) {
        if (value === '未检阅') {
          this.$message.warning('不能采纳空白建议！')
          return false
        }
        this.item.choose = value ? value : 'default'
        this.choose = this.item.choose
      },
      handleEdit () {
        this.edit = true
        this.item.choose = 'default'
        this.choose = 'default'
      },
      handleEndEdit () {
        this.edit = false
      },
      getColor(value, val) {
        let color = 'green'
        if (value && value !== val) {
          color = 'red'
        }
        return color
      },
      getInvisibleColor(value, val) {
        let invisable = val == 1 ? val.toString() : '0'
        const _value = value == 1 ? value.toString() : '0'
        let color = 'green'
        if (_value.toString() !== invisable.toString()) {
          color = 'red'
        }
        return color
      },
      getInvisibleText (item) {
        const text = item.checkName === '未检阅' ? '-' : (item.invisable == '1' ? '不是结节': '是结节')
        return text
      },
      handleViewDicom (item) {
        if (!this.dicomId || !this.dnResultId) return false
        const token = Vue.ls.get(ACCESS_TOKEN)
        const { imageIndex } = item
        let href = `https://ct.ananpan.com/viewer/1?resource=${this.dicomId}&token=${token}&url=${Vue.prototype.API_BASE_URL}&type=0&page=detail&index=${imageIndex}&id=${this.dnResultId}&user=admin`
        window.open(href, '_blank')
      }
    },
  }
</script>
<style lang="less" scoped>
  .dicom-item__content {
    width: 100%;
    display: flex;

    .item-content-image {
      flex: 1;

      .dicom-image {
        /*height: 400px;*/
      }
    }
    .title {
      color: rgba(0, 0, 0, .85);
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .item-content-info {
      flex: 1;
      display: flex;
      padding: 0 0 0 15px;
      justify-content: space-evenly;

      .status-label {
        width: 60px;
      }
      .info-panel {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        &.content-start {

          justify-content: flex-start ;
        }
      }
      .ant-card-body {
        padding: 0;
      }
    }
    .info-panel {
      position: relative;
      overflow: hidden;
    }
    .border-left {
      border-left: 1px #777777 dashed;
    }
    .item-info-row {
      /*margin-bottom: 10px;*/

      > label {
        font-weight: bold;
        margin-right: 10px;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
