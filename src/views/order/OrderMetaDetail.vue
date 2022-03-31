<template>
  <a-card :bordered="false">
    <div class='top-button-group'>
      <!--      <a-button size='small' @click='checkHistory'>查看历史</a-button>-->
      <a-button size='small' @click='changeInfo' v-has="'editable'">修改信息</a-button>

      <a-button size='small' @click='reinspection'>重检订单</a-button>
      <a-button size='small' @click='handleShowEMSModal'>查看物流信息</a-button>
      <a-button size='small' @click='handleShowClinicalModal'>查看临床信息</a-button>
    </div>
    <a-descriptions title="基本信息">
      <a-descriptions-item label="姓名"><span v-html="baseInfo.name"></span></a-descriptions-item>
      <a-descriptions-item label="性别"><span v-html="baseInfo.sex"></span></a-descriptions-item>
      <a-descriptions-item label="年龄"><span v-html="baseInfo.age"></span></a-descriptions-item>
      <a-descriptions-item label="身份证"><span v-html="baseInfo.cardId"></span></a-descriptions-item>
      <a-descriptions-item label="手机号"><span v-html="baseInfo.phone"></span></a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="临床信息">
      <a-descriptions-item label="病例编号"><span v-html="orderInfo.caseId"></span></a-descriptions-item>
      <!-- <a-descriptions-item label="快递公司"><span v-html="orderInfo.emsCompanyId"></span></a-descriptions-item>
      <a-descriptions-item label="快递单号"><span v-html="orderInfo.esmNo"></span></a-descriptions-item> -->
      <a-descriptions-item label="送检医院"><span v-html="orderInfo.sendAgency"></span></a-descriptions-item>
      <a-descriptions-item label="送检科室"><span v-html="orderInfo.sendDepartment"></span></a-descriptions-item>
      <a-descriptions-item label="送检医生"><span v-html="orderInfo.sendDoctor"></span></a-descriptions-item>
      <!-- <a-descriptions-item label="签收人"><span v-html="orderInfo.checkBy"></span></a-descriptions-item> -->
      <!-- <a-descriptions-item label="质控人"><span v-html="orderInfo.testBy"></span></a-descriptions-item> -->
      <a-descriptions-item label="销售"><span v-html="orderInfo.saleBy"></span></a-descriptions-item>
    </a-descriptions>
    <div class='order-progress'>
      <div class='orderHistory'>
        <div class='btnBox' v-if='historyList.length > 0'>
          <div class='label'>历史记录:</div>
          <!--          <a-button v-for='item in historyList'  @click='fetchInfoByHistoryBTN(item)'>{{item.instanceType_dictText}}: {{item.createTime}}</a-button>-->
          <a-radio-group :default-value='historyList.filter(ele => ele.activeStatus == 1)[0].id' button-style='solid'>
            <a-radio-button :class="{'activeBtn': item.activeStatus == 1}" :value='item.id' v-for='item in historyList'
                            :key='item.id' @click='fetchInfoByHistoryBTN(item)'>
              {{ item.activeStatus == 1 ? '最新' : null }}{{ item.instanceType_dictText }}: {{ item.createTime }}
            </a-radio-button>
          </a-radio-group>
        </div>
      </div>
      <div class='info' v-if='selectOption'>
        <div class='item'>
          <div class='label'>实例类别:</div>
          <div class='desc'>{{ selectOption['instanceType_dictText'] }}</div>
        </div>
      </div>
      <div class='label-title b-flex'>
        订单进度
        <div class='order-progress-panel'>
          <a-progress :percent='orderProgressValue' :showInfo='false' status='active' />
        </div>
      </div>
      <div class='order-progress-table'>
        <div class='progress-row' v-for='(item, index) in orderProgressList' :key='index'>
          <div class='title'>{{ item.title }}</div>
          <div class='text'>
            <span :class='{ successStatus: item.status === 1 }' v-if='!(item.orderState == 10000 && item.status === 1)'>{{ item.text
              }}</span>
            <a-button v-if='item.status === 1 && item.orderState == 9000' size='small'
                      type='primary' @click='handleCheckReport'>查看报告
            </a-button>
          </div>
          <div class="time">
            <span :class="{ successStatus: item.status === 1 }">{{ item.time }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="order-progress order-progress-child">
      <div class="label-title">子订单进度</div>
      <div class="progress-body">
        <div class='progress-item' v-for='(list, index) in childOrder' :key='index'>
          <div class='progress-item-title'>
            <label class='text-weight'>{{ list.title }}</label>
            <span> 订单号：{{ list.orderId }}</span>
            <!-- <label class="responsible">责任人：</label> -->
            <!-- <span>{{ list.responsible }}</span> -->
          </div>
          781188947
          <div class='progress-item-body'>
            <a-steps :current='list.step' style='width: 100%' size='small'>
              <a-step v-for='(item, index) in list.data' :key='index'>
                <span slot='title'>{{ item.title }}</span>
                <span slot='description'>
                  <div :class="{ successStatus: item.status === '成功', errorStatus: item.status === '失败' }">
                    状态：{{ item.status }}
                  </div>
                  <div
                    v-if='item.time'
                    :class="{ successStatus: item.status === '成功', errorStatus: item.status === '失败' }"
                  >
                    时间：{{ item.time }}
                  </div>
                </span>
                <span v-if="item.showButton" slot="subTitle">
                  <a-button
                    :disabled="item.disState"
                    size="small"
                    @click="e => handleSubOrderClick(item, item.omicsMilestone)"
                  >{{ item.buttonText }}</a-button
                  >
                </span>
              </a-step>
            </a-steps>
          </div>
        </div>
      </div>
    </div>

    <!-- 查看物流信息 -->
    <!--    <orderDetailHistoryModal ref='orderDetailHistoryModal' />-->
    <!-- 查看物流信息 -->
    <ShowEMSModal ref='showEMSModal' />

    <!-- 查看临床信息 -->
    <ShowClinicalModal ref='showClinicalModal' />
    <!--  重检窗口 -->
    <reinspectionModal ref='reinspectionModal' @ok='modalFormOk' />

  </a-card>
</template>

<script>
import {
  getProductOrderInstance,
  getOrderStepInfo,
  getProductOrderInstanceList,
  getTemplate
} from 'src/api/order/index'
import Vue from 'vue'
import { UI_CACHE_DB_DICT_DATA } from '@/store/mutation-types'

// import orderDetailHistoryModal from './modules/orderDetailHistoryModal'
import ShowEMSModal from './modules/ShowEMSModal'
import ShowClinicalModal from './modules/ShowClinicalModal'
import reinspectionModal from './modules/reinspectionModal'

export default {
  name: 'meta-detail',
  components: {
    ShowEMSModal,
    ShowClinicalModal,
    // orderDetailHistoryModal
    reinspectionModal
  },
  data() {
    return {
      baseInfo: {},
      orderInfo: {},
      orderProgressValue: 0,
      orderProgressList: [],
      historyList: [],
      childOrder: [],
      selectOption: undefined
    }
  },
  mounted() {
    this.init()
    const types = Vue.ls.get(UI_CACHE_DB_DICT_DATA)['omics_analysis_type']
    console.log(types)
    this.initDetailList()
  },
  methods: {
    init() {
      this.baseInfo = {
        name: '',
        sex: '',
        age: '',
        cardId: '',
        phone: ''
      }
      this.orderInfo = {
        caseId: '',
        emsCompanyId: '',
        esmNo: '',
        sendAgency: '',
        sendDepartment: '',
        sendDoctor: '',
        checkBy: '',
        testBy: '',
        saleBy: '',
        orderId: ''
      }
      this.fetchInfo()
    },
    fetchInfo() {
      const id = this.$route.params.id
      this.clearData()

      getProductOrderInstance({ orderId: id }).then(res => {
        if (res.code === 200) {
          this.formatInstance(res)
          this.formatSubOrders(res)
        }
      })
      getProductOrderInstanceList(id).then(res => {
        // console.log(res.result)
        this.historyList = res.result
      })
    },
    formatInstance(res) {
      const instanceHistoryStates = res.result.instance.historyStates
      instanceHistoryStates.forEach(ele => {
        const oneStep = 25
        if (ele.stateResult == 1) {
          this.orderProgressValue += oneStep
        }
      })
      for (let i = 0; i < instanceHistoryStates.length; i++) {
        this.orderProgressList.push({
          status: instanceHistoryStates[i].stateResult,
          title: instanceHistoryStates[i].productMilestone_dictText,
          orderState: instanceHistoryStates[i].productMilestone,
          text: instanceHistoryStates[i].stateResult_dictText,
          time:
            instanceHistoryStates[i].stateResult === -1
              ? instanceHistoryStates[i].stateResult_dictText
              : instanceHistoryStates[i].updateTime
        })
      }
      console.log(this.orderProgressList)
    },
    formatSubOrders(res) {
      const subOrders = res.result.subOrders
      for (let i = 0; i < subOrders.length; i++) {
        const historyStates = subOrders[i].historyStates.sort(this.compare('omicsMilestone'))
        const step = historyStates.findIndex(item => item.omicsMilestone === subOrders[i].orderState)
        this.childOrder.push({
          omicsAnalysisType: subOrders[i].omicsAnalysisType,
          title: subOrders[i].omicsAnalysisType_dictText,
          orderId: subOrders[i].id,
          responsible: '王大山',
          step: step ? step : 0,
          data: []
        })
        for (let j = 0; j < historyStates.length; j++) {
          if (this.childOrder[i].data) {
            const codeNum = historyStates[j].omicsMilestone
            switch (codeNum) {
              case 10000:
                this.childOrder[i].data.push({
                  omicsMilestone: historyStates[j].omicsMilestone,
                  title: historyStates[j].omicsMilestone_dictText,
                  time: historyStates[j].updateTime,
                  showButton: false,
                  buttonText: '查看报告',
                  disState: historyStates[j].stateResult === 1 ? false : true,
                  status: historyStates[j].stateResult_dictText
                })
                break
              case 3100:
                this.childOrder[i].data.push({
                  omicsMilestone: historyStates[j].omicsMilestone,
                  title: historyStates[j].omicsMilestone_dictText,
                  time: historyStates[j].updateTime,
                  showButton: true,
                  buttonText: historyStates[j].stateResult === 1 ? '查看影像' : '重新归档',
                  disState: historyStates[j].stateResult === 1 ? false : true,
                  status: historyStates[j].stateResult_dictText,
                  omicsOrderId: subOrders[i].otherInfo,
                  stateResult: historyStates[j].stateResult
                })
                break
              default:
                this.childOrder[i].data.push({
                  omicsMilestone: historyStates[j].omicsMilestone,
                  title: historyStates[j].omicsMilestone_dictText,
                  time: historyStates[j].updateTime,
                  showButton: false,
                  buttonText: '',
                  disState: false,
                  status: historyStates[j].stateResult_dictText
                })
                break
            }
          }
        }
      }
    },
    fetchInfoByHistoryBTN(item) {
      this.selectOption = item
      // console.log(this.selectOption)
      getProductOrderInstance({ instanceId: item.id, orderId: this.orderInfo.orderId }).then(res => {
        if (res.code === 200) {
          this.clearData()
          this.formatInstance(res)
          this.formatSubOrders(res)
        }
      })
    },
    checkHistory() {
      console.log('history record')
      this.$refs.orderDetailHistoryModal.show(this.baseInfo, this.orderInfo)
    },
    handleShowEMSModal() {
      this.$refs.showEMSModal.show(this.baseInfo, this.orderInfo)
    },
    handleShowClinicalModal() {
      this.$refs.showClinicalModal.show()
    },
    initDetailList() {
      const that = this
      const stepOne = getOrderStepInfo({
        orderId: this.$route.params.id,
        step: 0
      })
      const stepTwo = getOrderStepInfo({
        orderId: this.$route.params.id,
        step: 1
      })
      Promise.all([stepOne, stepTwo]).then(values => {
        if (values[0].code === 200 && values[1].code === 200) {
          const baseInfoList = values[0].result
          const orderInfoList = values[1].result
          that.baseInfo = {
            name: baseInfoList.caseName,
            sex: baseInfoList.gender === 0 ? '女' : '男',
            age: baseInfoList.age + '岁',
            cardId: baseInfoList.identityNumber,
            phone: baseInfoList.phoneNumber
          }
          that.orderInfo = {
            caseId: orderInfoList.medicalCaseCode,
            // emsCompanyId: orderInfoList.relateSamples[0].emsCompany,
            // esmNo: orderInfoList.relateSamples[0].emsNumber,
            sendAgency: baseInfoList.sendHospital_dictText,
            sendDepartment: baseInfoList.sendDepartment,
            sendDoctor: baseInfoList.sendDoctor,
            // checkBy: baseInfoList.caseName,
            testBy: '王大山',
            saleBy: baseInfoList.seller_dictText,
            orderId: orderInfoList.orderId
          }
        } else {
          that.$message.warning(`请求失败，请刷新后重新尝试`)
        }
      })
    },
    compare(p) {
      return function(m, n) {
        return m[p] - n[p]
      }
    },
    handleSubOrderClick(item, omicsMilestone) {
      switch (omicsMilestone) {
        case 3100:
          if (item.stateResult === 1) {
            this.$router.push({
              path: `/viewport/viewportDetail?resource=${item.omicsOrderId}&type=0`
            })
          } else {
            console.log(`重新归档`)
          }
          break

        default:
          console.log(item)
          break
      }
    },
    handleCheckReport() {
      const that = this
      const id = this.$route.params.id
      getTemplate({
        orderId: id
      }).then(res => {
        if (res.success) {
          const rooterName = res.result.templateUrl || 'PagePreview'
          const router = that.$router.resolve({
            name: rooterName,
            params: {
              reportId: id
            }
          })
          window.open(router.href, '_blank')
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    clearData() {
      this.orderProgressList = []
      this.orderProgressValue = 0
      this.childOrder = []
    },
    reinspection() {
      this.$refs.reinspectionModal.show({ id: this.orderInfo.orderId })
    },
    changeInfo() {
      this.$router.push({
        path: `/orderList/singleNewOrder?orderId=${this.$route.params.id}&isEdit=1`
      })
    },
    modalFormOk() {
      this.fetchInfo()
    }
  }
}
</script>

<style lang="less" scoped>
.top-button-group {
  position: absolute;
  right: 24px;
  top: 24px;

  .ant-btn {
    margin: 0 0 0 15px;
  }
}

.label-title {
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
  font-size: 16px;
  line-height: 1.5;
}

.btnBox {
  margin-top: 24px;
  margin-bottom: 16px;

  .label {
    margin-bottom: 6px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
    font-size: 16px;
    line-height: 1.5;
  }

  .ant-radio-button-wrapper {
    margin: 8px 6px 8px 0;
    border-radius: 4px !important;
    border-left: 1px solid #d9d9d9;

    &::before {
      display: none !important;
    }

    &.activeBtn {
      border: 2px solid gold;
    }
  }

  .ant-btn {
    margin: 6px 12px 6px 0;
  }
}

.info {
  margin-top: 12px;
  margin-bottom: 20px;

  .item {
    display: flex;

    .label {
      font-size: 14px;
      margin-right: 4px;
    }

    .desc {
      font-size: 14px;
    }
  }
}

.order-progress-panel {
  margin-left: 15px;
  width: 180px;
}

.order-progress-table {
  width: fit-content;
  width: 100%;
  display: flex;

  .progress-row {
    border: 1px solid #222;
    width: 12.5%;
    border-right: none;

    &:last-child {
      border-right: 1px solid #222;
    }

    .title,
    .text,
    .time {
      height: 42px;
      line-height: 42px;
      text-align: center;
    }

    .text.successStatus,
    .time.successStatus {
      color: rgb(16, 191, 125);
    }

    .text {
      border-top: 1px solid #222;
      border-bottom: 1px solid #222;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
  }
}

.order-progress-child {
  margin-top: 15px;
}

.progress-item-body {
  margin: 30px 0 !important;
}

.progress-item {
  margin-bottom: 15px;

  .responsible {
    margin-left: 15px;
  }

  &-body {
    margin-top: 15px;

    .ant-steps-item {
      margin-right: 0 !important;
    }

    .ant-steps-item-content {
      text-align: left;
    }

    .ant-steps-item-finish {
      .ant-steps-item-icon {
        border-color: #10bf7d;
        > .ant-steps-icon {
          color: #10bf7d;
        }
      }

      > .ant-steps-item-container {
        > .ant-steps-item-content > .ant-steps-item-title {
          color: #10bf7d;
        }
      }

      > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after {
        background-color: #10bf7d;
      }
    }
  }

  &-status {
    padding: 10px 15px;
  }
}

.successStatus {
  font-size: 13px;
  color: #10bf7d;
}

.errorStatus {
  font-size: 13px;
  color: #f5222d;
}
</style>
