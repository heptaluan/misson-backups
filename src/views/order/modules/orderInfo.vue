<template>
  <a-spin :spinning="confirmLoading">
    <a-form-model ref="ruleForm" :model="orderForm" :rules="validatorRules" style="margin: 20px auto 0;">
      <h3 class="order-title">检测项目</h3>
      <div class="order-content">
        <a-form-model-item label="肺结节良恶性诊断" style="display:flex;" prop="productRecognition">
          <a-radio-group style="margin-left:15px;" v-model="orderForm.productRecognition">
            <a-radio
              v-for="(item, key) in productInfoList"
              :key="key"
              :value="item.productRecognition"
              @change="e => onRadioGroupOneChange(e, item)"
            >
              {{ item.productName }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </div>

      <h3 class="order-title">样本信息</h3>

      <div class="order-content">
        <a-form-model-item label="病例编号" style="display: flex;padding-left: 10px;" prop="medicalCaseCode">
          <a-select
            style="width:200px;"
            show-search
            :value="value"
            placeholder="请输入病例编号进行检索"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            @search="handleSellSearch"
            @change="handleSellChange"
          >
            <a-select-option v-for="item in data" :key="item.id" :value="item.caseCode">
              {{ item.caseCode }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </div>

      <h3 class="order-title">样本详情</h3>
      <div class="order-content">
        <a-form-model-item>
          <div class="list-content" v-for="(item, key) in sampleTypeList" :key="key">
            <div class="check-box">
              <a-checkbox @change="e => handleListContentCheckChange(e, key)" v-model="item.checked">{{
                item.name
              }}</a-checkbox>
            </div>
            <div class="list-item">
              <a-input-number
                @change="handleListContentChange(key)"
                v-model="item.amount"
                v-if="item.inputOne"
                :min="min"
                placeholder="请输入管数"
              />
              <span v-if="item.inputOne" class="item-text">{{ item.inputOne }}</span>
            </div>
            <!-- <div class="list-item">
              <a-input-number
                @change="handleListContentChange(key)"
                v-model="item.twoText"
                v-if="item.inputTwo"
                :min="0"
                placeholder="请输入容量"
              />
              <span v-if="item.inputTwo" class="item-text">{{ item.inputTwo }}</span>
            </div> -->
            <div class="list-item">
              <span class="item-content">采集时间</span>
              <a-date-picker
                valueFormat="YYYY-MM-DD HH:mm:ss"
                @change="handleListContentChange(key)"
                v-model="item.collectTime"
                placeholder="请输入采集时间"
                show-time
              />
            </div>
            <div class="list-item">
              <span class="item-content">寄送时间</span>
              <a-date-picker
                valueFormat="YYYY-MM-DD HH:mm:ss"
                @change="handleListContentChange(key)"
                v-model="item.createTime"
                placeholder="请输入寄送时间"
                show-time
              />
            </div>
            <div class="list-item">
              <span class="ems">快递公司</span>
              <j-dict-select-tag
                @change="handleListContentChange(key)"
                v-model="item.emsCompany"
                style="width:150px;"
                type="list"
                dictCode="ems_company_type"
                placeholder="请选择物流公司"
              />
            </div>
            <div class="list-item">
              <span class="item-content">快递单号</span>
              <a-input @change="handleListContentChange(key)" v-model="item.emsNumber" placeholder="请输入快递单号" />
            </div>
          </div>
        </a-form-model-item>
      </div>

      <div class="order-content">
        <a-form-model-item label="是否重复采血" style="display:flex;" prop="repeatCollect">
          <a-radio-group v-model="orderForm.repeatCollect" style="margin-left:15px;">
            <a-radio :value="1">
              是
            </a-radio>
            <a-radio :value="2">
              否
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </div>

      <div class="order-content">
        <a-form-model-item label="收件地址" style="display:flex;" prop="receiveAddress">
          <a-select v-model="orderForm.receiveAddress" placeholder="请选择收件地址" style="width:200px;">
            <a-select-option v-for="item in addressList" :key="item.id" :value="item.id">
              {{ item.addressName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </div>

      <div class="btn-group">
        <a-button type="primary" @click="save" class="margin-right-xs">保存</a-button>
        <a-button type="primary" @click="preStep" class="margin-right-xs">上一步</a-button>
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </div>
    </a-form-model>
  </a-spin>
</template>

<script>
import { createOrderDetectInfo, getOrderStepInfo, getProductInfoList } from 'src/api/order/index'
import Vue from 'vue'
import { UI_CACHE_DB_DICT_DATA } from '@/store/mutation-types'
import { getAddressList, queryCaseCode } from '../../../api/material/index'

function fetch(value, callback) {
  let timeout
  let currentValue

  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value

  function fake() {
    queryCaseCode({
      codeStatus: 0,
      caseCode: value + '*'
    }).then(res => {
      if (res.success) {
        if (currentValue === value) {
          const result = res.result.records
          const data = []
          result.forEach(r => {
            data.push({
              key: r.id,
              caseCode: r.caseBarcode,
              id: r.id
            })
          })
          callback(data)
        }
      } else {
        console.log(res.message)
      }
    })
  }

  timeout = setTimeout(fake, 300)
}

export default {
  name: 'order-info',
  data() {
    return {
      orderForm: {
        productRecognition: undefined,
        medicalCaseCode: '',
        receiveAddress: undefined,
        repeatCollect: undefined
      },
      validatorRules: {
        productRecognition: [{ required: true, message: '请选择检测项目', trigger: 'change' }],
        medicalCaseCode: [{ required: true, message: '请输入病例编号', trigger: 'blur' }],
        repeatCollect: [{ required: true, message: '请选择是否重复取血', trigger: 'change' }],
        receiveAddress: [{ required: true, message: '请选择收件地址', trigger: 'change' }],
        caseCode: [{ required: true, message: '请输入病例编号', trigger: 'blur' }],
      },
      productInfoList: [],
      departList: [],
      hospitalList: [],
      doctorList: [],
      sampleTypeList: [],
      confirmLoading: false,
      detectId: '',
      addressList: [],
      data: [],
      value: undefined,
      min: 0
    }
  },
  props: {
    order: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getProductInfoList()
      this.loadAddressList()
    }, 300)
  },
  methods: {
    initForm() {
      const that = this
      if (this.getParams('orderId')) {
        const params = {
          orderId: this.getParams('orderId'),
          step: 1
        }
        getOrderStepInfo(params).then(res => {
          if (res.code === 200 && res.result) {
            that.orderForm.productRecognition = res.result.relateProducts.toString()
            that.orderForm.medicalCaseCode = res.result.medicalCaseCode
            that.value = res.result.medicalCaseCode
            that.orderForm.repeatCollect = res.result.repeatCollect
            that.orderForm.receiveAddress = res.result.receiveAddress
            that.detectId = res.result.id
            const includeSample = that.productInfoList.find(
              item => item.productRecognition === res.result.relateProducts.toString()
            ).includeSample
            const list = that.initIncludeSample(includeSample)
            const relateSamples = res.result.relateSamples
            for (let i = 0; i < relateSamples.length; i++) {
              for (let j = 0; j < list.length; j++) {
                if (relateSamples[i].sampleType.toString() === list[j].sampleType.toString()) {
                  list[j].checked = true
                  list[j].collectTime = relateSamples[i].collectTime
                  list[j].createTime = relateSamples[i].createTime
                  list[j].emsCompany = relateSamples[i].emsCompany
                  list[j].emsNumber = relateSamples[i].emsNumber
                  list[j].amount = relateSamples[i].amount
                }
              }
            }
            that.sampleTypeList = list
          }
        })
      }
    },
    preStep() {
      this.$emit('prevStep', 1)
    },
    nextStep() {
      // this.$emit('nextStep')
      const cb = () => {
        this.$emit('nextStep', 1)
      }
      this.save(cb)
    },
    save(cb) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          for (let i = 0; i < this.sampleTypeList.length; i++) {
            if (!this.sampleTypeList[i].checked) {
              continue
            }
            if (!this.sampleTypeList[i].amount) {
              this.$message.warning(`请输入样本数量`)
              return
            }

            if (!this.sampleTypeList[i].collectTime) {
              this.$message.warning(`请选择样本采集时间`)
              return
            }

            if (!this.sampleTypeList[i].createTime) {
              this.$message.warning(`请选择样本寄送时间`)
              return
            }
            if (this.sampleTypeList[i].collectTime > this.sampleTypeList[i].createTime) {
              this.$message.warning(`样本寄送时间不能早于采集时间`)
              return
            }
            if (!this.sampleTypeList[i].emsCompany) {
              this.$message.warning(`请选择快递公司`)
              return
            }

            if (!this.sampleTypeList[i].emsNumber) {
              this.$message.warning(`请输入快递单号`)
              return
            }
          }

          if (!this.sampleTypeList.some(item => item.checked)) {
            this.$message.warning(`请选择样本详情！`)
            return
          }

          const postData = {
            orderId: this.getParams('orderId'),
            choseProduct: this.orderForm.productRecognition,
            medicalCaseCode: this.orderForm.medicalCaseCode,
            repeatCollect: this.orderForm.repeatCollect,
            receiveAddress: this.orderForm.receiveAddress,
            orderRelateSampleList: [],
            detectId: this.detectId ? this.detectId : null
          }

          console.log(postData)

          const postSampleTypeList = this.sampleTypeList.slice().filter(item => item.checked)
          for (let i = 0; i < postSampleTypeList.length; i++) {
            postData.orderRelateSampleList.push({
              amount: postSampleTypeList[i].amount,
              collectTime: postSampleTypeList[i].collectTime,
              createTime: postSampleTypeList[i].createTime,
              emsCompany: postSampleTypeList[i].emsCompany,
              emsNumber: postSampleTypeList[i].emsNumber,
              sampleType: postSampleTypeList[i].sampleType
            })
          }

          createOrderDetectInfo(postData).then(res => {
            if (res.code === 200) {
              this.$message.success('订单信息已保存！')
              if (typeof cb === 'function') cb()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    getProductInfoList() {
      getProductInfoList().then(res => {
        if (res.code === 200) {
          this.productInfoList = res.result['1']
          this.initForm()
        }
      })
    },
    onRadioGroupOneChange(e, item) {
      this.sampleTypeList = this.initIncludeSample(item.includeSample)
    },
    initIncludeSample(list) {
      const sampleTypes = Vue.ls.get(UI_CACHE_DB_DICT_DATA)['sample_type']
      const formatSampleTypes = []

      if (list) {
        const includeSample = list.split(',')
        for (let i = 0; i < includeSample.length; i++) {
          formatSampleTypes.push(sampleTypes.find(item => item.value === includeSample[i]))
        }
      }
      const newList = formatSampleTypes
        .map(item => {
          switch (item.value) {
            case 'qx':
            case 'xq':
            case 'wzx':
            case 'xqjy':
              return {
                checked: false,
                name: item.text,
                inputOne: '管',
                inputTwo: null,
                amount: '',
                twoText: '',
                collectTime: '',
                createTime: '',
                emsCompany: undefined,
                emsNumber: '',
                sampleType: item.value
              }
            case 'slz':
              return {
                ichecked: false,
                name: item.text,
                inputOne: '卷',
                inputTwo: null,
                amount: '',
                twoText: '',
                collectTime: '',
                createTime: '',
                emsCompany: undefined,
                emsNumber: '',
                sampleType: item.value
              }
            case 'sbl':
              return {
                checked: false,
                name: item.text,
                inputOne: '片',
                inputTwo: null,
                amount: '',
                twoText: '',
                collectTime: '',
                createTime: '',
                emsCompany: undefined,
                emsNumber: '',
                sampleType: item.value
              }
            case 'slb':
            case 'xxzz':
              return {
                checked: false,
                name: item.text,
                inputOne: '块',
                inputTwo: null,
                amount: '',
                twoText: '',
                collectTime: '',
                createTime: '',
                emsCompany: undefined,
                emsNumber: '',
                sampleType: item.value
              }
            default:
              break
          }
        })
        .filter(n => n)

      return newList
    },
    handleListContentCheckChange(e, index) {
      if (!e.target.checked) {
        this.sampleTypeList[index].amount = ''
        this.sampleTypeList[index].collectTime = ''
        this.sampleTypeList[index].createTime = ''
        this.sampleTypeList[index].emsCompany = undefined
        this.sampleTypeList[index].emsNumber = ''
      }
    },
    handleListContentChange(index) {
      this.sampleTypeList[index].checked = true
    },
    getParams(key) {
      const search = window.location.search.substring(1)
      const vars = search.split('&')
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=')
        if (pair[0] === key) {
          return pair[1]
        }
      }
      return false
    },
    loadAddressList() {
      const that = this
      getAddressList().then(res => {
        if (res.success) {
          that.addressList = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleSellSearch(value) {
      fetch(value, data => (this.data = data))
    },
    handleSellChange(value) {
      this.value = value
      fetch(value, data => (this.data = data))
      if (value) {
        this.orderForm.medicalCaseCode = value
      }
    }
  }
}
</script>

<style lang="less" scoped>
.order-title {
  margin-bottom: 30px;
}

.order-content {
  margin-bottom: 25px;

  .ant-checkbox-wrapper {
    margin-left: 0;
    margin-right: 15px;
  }

  .ant-input {
    width: 200px;
  }

  .ant-radio-wrapper {
    margin-bottom: 10px;
  }

  .ant-form-item:last-child {
    margin-right: 0;
  }

  .ant-upload-picture-card-wrapper {
    display: flex;
  }

  .ant-form-item-with-help {
    margin-bottom: 0;
  }

  .list-content {
    margin-bottom: 15px;

    .check-box {
      display: inline-block;
      min-width: 173px;
    }

    .list-item {
      display: inline-block;
      margin-right: 25px;
      min-width: 136px;
    }

    .item-text {
      margin-left: 12px;
    }

    .item-content,
    .ems {
      margin-right: 12px;
    }

    .ant-calendar-picker {
      width: 150px;
    }

    .ant-input-number {
      width: 80px;
    }
  }
}

.btn-group {
  margin-top: 40px;
  text-align: right;
}
</style>
