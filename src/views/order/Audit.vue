<template>
  <a-card :bordered='false'>
    <a-form-model :layout='layout' ref='ruleForm' :model='form' :rules='validatorRules' style='margin: 20px auto 0;'>
      <a-descriptions class='order-content' title='检测项目' style='padding-left: 15px;'>
        <a-descriptions-item label='送检产品类型' class='order-label'>
          {{ descriptionData.choseProduct_dictText }}
        </a-descriptions-item>
        <a-descriptions-item label='订单来源' style='margin-left: 38px'>
          {{ descriptionData.sourceType_dictText }}
        </a-descriptions-item>
      </a-descriptions>

      <a-descriptions class='order-content' title='基本信息' style='padding-left: 15px;'>
        <a-descriptions-item label='证件类型' class='order-label'>
          {{ descriptionData.identityType }}
        </a-descriptions-item>
        <a-descriptions-item label='证件号码' class='order-label'>
          {{ descriptionData.identityNumber }}
        </a-descriptions-item>
        <a-descriptions-item label='姓名' class='order-label'>
          {{ descriptionData.caseName }}
        </a-descriptions-item>
        <a-descriptions-item label='性别' class='order-label'>
          {{ descriptionData.gender_dictText }}
        </a-descriptions-item>
        <a-descriptions-item label='年龄' class='order-label'>
          {{ descriptionData.age }}
        </a-descriptions-item>
        <a-descriptions-item label='手机号' class='order-label'>
          {{ descriptionData.phoneNumber }}
        </a-descriptions-item>
        <a-descriptions-item label='条码编号' class='order-label'>
          {{ descriptionData.medicalCaseCode }}
        </a-descriptions-item>
      </a-descriptions>

      <a-descriptions class='order-content' title='销售信息' style='padding-left: 15px;'>
        <a-descriptions-item label='销售负责人' class='order-label'>
          {{ descriptionData.seller_dictText }}
        </a-descriptions-item>
        <a-descriptions-item label='销售合作渠道' class='order-label'>
          {{ descriptionData.sendAccess_dictText }}
        </a-descriptions-item>
        <a-descriptions-item label='送检医院' class='order-label'>
          {{ descriptionData.sendHospital_dictText }}
        </a-descriptions-item>
        <a-descriptions-item label='送检科室' class='order-label' v-show='form.sendAccess'>
          {{ descriptionData.sendDepartment }}
        </a-descriptions-item>
        <a-descriptions-item label='送检医生' class='order-label' v-show='form.sendAccess'>
          {{ descriptionData.sendDoctor }}
        </a-descriptions-item>
        <a-descriptions-item label='检测日期' class='order-label'>
          {{ descriptionData.samplingTime }}
        </a-descriptions-item>
      </a-descriptions>

      <a-descriptions class='order-content' title='收费信息' style='padding-left: 15px;'>
        <a-descriptions-item label='是否收费' class='order-label'>
          {{ descriptionData.chargeType }}
        </a-descriptions-item>
        <a-descriptions-item label='结算方式' prop='accountType' class='order-label'>
          {{ descriptionData.accountType }}
        </a-descriptions-item>
      </a-descriptions>
      <div class='order-content' style='padding-left: 15px;' v-if='showPayMessage'>
        <div style='margin-bottom:15px;'>
          收费相关凭证文件或图片
        </div>
        <div class='imgBox' :visible='previewVisible' v-for='item of fileList' :footer='null' @cancel='handleCancel'>
          <img alt='example' :src='item.url' />
        </div>
      </div>

      <h3 class='order-title' style='padding-left: 15px;'>审核项目</h3>
      <div class='order-content'>
        <a-form-model-item label='审核' style='margin-left: 38px' prop='auditIssue'>
          <a-radio-group
            :options='auditIssue'
            v-model='form.auditIssue'
          />
        </a-form-model-item>
        <a-form-model-item label='订单来源' style='margin-left: 38px' prop='auditCharge'>
          <a-radio-group
            :options='auditCharge'
            v-model='form.auditCharge'
          />
        </a-form-model-item>
      </div>
      <div class='btn-group'>
        <a-button type='primary' @click='orderSend' style='margin-right:15px;'>提交</a-button>
      </div>
    </a-form-model>
  </a-card>
</template>

<script>
import {
  getOrderStepInfo,
  createOrderApplyInfo,
  getOrderSingleInfo,
  getProductInfoList,
  getUserInfo,
  getAccess,
  getSeller,
  addOrder,
  checkBarcode, editSingleOrder, auditOrder
} from 'src/api/order/index'
import { delLogo, uploadLogo, queryHospitalByMainId } from '../../api/product/index'
import { cloneObject } from '@/utils/util'

export default {
  name: 'Audit',
  data() {
    return {
      layout: 'inline',
      orderId: null,
      form: {},
      descriptionData: {},
      validatorRules: {
        identityType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
        businessType: [{ required: true, message: '请选择业务类别', trigger: 'change' }],
        medicalCaseCode: [{ required: true, message: '请输入条码编号', trigger: 'change' }],
        auditCharge: [{ required: true, message: '请选择是否收费', trigger: 'change' }],
        auditIssue: [{ required: true, message: '请选择是否审计核算', trigger: 'change' }]
      },
      distributorList: [],
      hospitalList: [],
      idData: [],
      idValue: undefined,
      sellData: [],
      sellValue: undefined,
      showSendAccess: false,
      disabledState: false,
      isEdit: false,
      medicalCaseId: '',
      user: null,
      auditIssue: [
        { label: '核实无误', value: 0 },
        { label: '核实有误', value: 1 }
      ],
      auditCharge: [
        { label: '收费', value: 1 },
        { label: '免费', value: 0 },
        { label: '待定', value: 2 }
      ],
      genderOption: [
        { label: '男', value: 1 },
        { label: '女', value: 0 }
      ],
      chargeTypeOption: [
        { label: '免费', value: 0 },
        { label: '收费', value: 1 }
      ],
      identityTypeList: [
        {
          value: 0,
          label: '身份证（中国大陆）'
        },
        {
          value: 1,
          label: '香港通行证（中国香港）'
        },
        {
          value: 2,
          label: '台胞证（中国台湾）'
        },
        {
          value: 3,
          label: '护照（其他国家和地区）'
        }
      ],
      accountType: [
        { label: '现结', value: 0 },
        { label: '月结', value: 1 },
        { label: '其他', value: 2 }
      ],
      businessTypeList: [
        { label: '收费凭证', value: 0 },
        { label: '临床信息相关文件', value: 1 }
      ],
      sourceType: [
        { label: '门诊', value: 0 },
        { label: '商检', value: 1 },
        { label: '科研', value: 2 }
      ],
      previewVisible: false,
      previewImage: '',
      fileList: [],
      productInfoList: [],
      originalSell: [],
      originalForm: null,
      showPayMessage: false
    }
  },
  props: {},
  mounted() {
    this.user = this.$store.getters.userRole
    // this.$nextTick(() => {
    this.getProductInfoList()
    // }, 300)
  },
  methods: {
    initForm() {
      const that = this
      if (this.getParams('orderId')) {
        const params = {
          orderId: this.getParams('orderId'),
          step: 0
        }
        this.isEdit = true
        getOrderSingleInfo(params).then(res => {
          if (res.code === 200) {
            if (res.result.chargeType === 1) {
              that.showPayMessage = true
            } else {
              that.showPayMessage = false
            }

            const fileList = res.result.chargeProofs ? res.result.chargeProofs : []
            if (fileList.length > 0) {
              this.previewVisible = true
            }
            fileList.map(item => {
              that.fileList.push({
                uid: item.id,
                type: 'custom',
                name: item.fileName,
                status: 'done',
                url: item.fileUrl,
                fileSuffix: item.fileSuffix
              })
            })
            that.descriptionData = res.result
            // this.loadAllSell(that.descriptionData)
            that.sellValue = res.result.seller_dictText
            // that.form.sendAccess = res.result.sendAccess_dictText
            this.changeValueFormat(that.descriptionData)
            that.disabledState = true
          } else {
            that.disabledState = false
          }
        })
      }
      // set value of role to the selector of '关联泰莱销售' if role includes sales_omics but not sales_super_omics
      if (this.user.includes('sales_omics') && !this.user.includes('sales_super_omics')) {
        this.sellData = [this.user]
      }
    },
    orderSend(e) {
      const that = this
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const orderId = that.getParams('orderId')
          that.form.orderId = orderId ? orderId : null
          // that.originalForm = cloneObject(that.form)
          auditOrder(that.form).then(res => {
            if (res.code === 200) {
              that.$message.success('订单已提交！')
              this.$router.push({ path: '/order/orderList' })
            } else {
              that.$message.warning(res.message)
              // that.setFormControllers(that.originalForm, that.form)
            }
          })
        }
      })
    },
    changeValueFormat(form) {
      form['identityType'] = this.valToLabel(form, 'identityType', this.identityTypeList)
      form['chargeType'] = this.valToLabel(form, 'chargeType', this.chargeTypeOption)
      form['accountType'] = this.valToLabel(form, 'accountType', this.accountType)
    },
    valToLabel(form, label, list) {
      let data = null
      list.forEach(ele => {
        if (form[label] === ele.value) {
          data = ele.label
        }
      })
      return data
    },
    // loadAllSell(seller) {
    //   getSeller({ keyword: seller['seller'], pageSize: 10000 }).then(res => {
    //     console.log(res)
    //     this.originalSell = res.result.records
    //     this.sellData = this.originalSell
    //     this.getSellerID(seller['seller'])
    //   }, err => {
    //     console.log(err)
    //   })
    // },
    // getSellerID(seller) {
    //   let id = null
    //   this.originalSell.forEach(ele => {
    //     if (ele['username'] == seller) {
    //       id = ele['id']
    //     }
    //   })
    //   this.loadDistributorList(id)
    //   this.getHospital(id, true)
    // },
    getProductInfoList() {
      getProductInfoList().then(res => {
        if (res.code === 200) {
          this.productInfoList = res.result['1']
          this.initForm()
        }
      })
    },
    // getHospital(value, withOrder) {
    //   getAccess({
    //     userId: value,
    //     dpCatalog: 4000
    //   }).then(res => {
    //     if (res.success) {
    //       this.hospitalList = res.result.records
    //       if (!withOrder) {
    //         this.setFormControllerEmpty(this.form, ['sendHospital', 'sendDepartment', 'sendDoctor'])
    //       }
    //       console.log(this.hospitalList)
    //     } else {
    //       this.$message.warning(res.message)
    //     }
    //   })
    // },
    // loadDistributorList(value) {
    //   const that = this
    //   getAccess({
    //     userId: value,
    //     dpCatalog: 3000
    //   }).then(res => {
    //     if (res.success) {
    //       that.distributorList = res.result.records
    //     } else {
    //       that.$message.warning(res.message)
    //     }
    //   })
    // },
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
    handleCancel() {
      this.previewVisible = false
      this.visible = false
    }
    // setFormControllerEmpty(form, controller) {
    //   if (Array.isArray(controller)) {
    //     controller.forEach(c => {
    //       this.$set(form, c, undefined)
    //     })
    //   } else {
    //     this.$set(form, controller, undefined)
    //   }
    // },
    // setFormControllers(originalForm, form) {
    //   const that = this
    //   for (let key in originalForm) {
    //     if (originalForm.hasOwnProperty(key)) {
    //       // console.log('key:', key, ', value: ')
    //       that.$set(form, key, originalForm[key])
    //     }
    //   }
    // }
  }
}
</script>

<style lang='less' scoped>
.order-title {
  margin-bottom: 30px;
}

.order-content {
  margin-bottom: 25px;

  &.withStar {
    display: flex;

    .star {
      align-self: center !important;
      color: #f5222d;
      font-size: 14px;
      margin-right: 5px;
      font-family: SimSun, sans-serif;
    }
  }

  .ant-input {
    width: 200px;
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
}

.btn-group {
  margin-top: 40px;
  text-align: center;
}

.imgBox {
  display: flex;
  justify-content: space-between;

  img {
    width: 42%;
  }
}
</style>
<style lang='less'>
.order-label {
  .ant-form-item-label {
    min-width: 95px;
  }
}
</style>
