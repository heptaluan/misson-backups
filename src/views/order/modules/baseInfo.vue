<template>
  <div>
    <a-form-model :layout="layout" ref="ruleForm" :model="form" :rules="validatorRules" style="margin: 20px auto 0;">
      <h3 class="order-title">基本信息</h3>
      <div class="order-content" style="padding-left: 15px;">
        <a-form-model-item label="证件类型" class="order-label" prop="identityType">
          <a-select
            :disabled="disabledState"
            placeholder="请选择证件类型"
            style="width:200px;"
            v-model="form.identityType"
          >
            <a-select-option v-for="item in identityTypeList" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="证件号码" class="order-label" prop="identityNumber">
          <a-input
            :disabled="disabledState"
            placeholder="请输入证件号码"
            v-model="form.identityNumber"
            @change="handleIdChange"
          />
        </a-form-model-item>

        <a-form-model-item label="姓名" prop="caseName" class="order-label">
          <a-input :disabled="disabledState" placeholder="请输入姓名" v-model="form.caseName" />
        </a-form-model-item>
      </div>

      <div class="order-content" style="padding-left: 15px;">
        <a-form-model-item label="性别" prop="gender" class="order-label">
          <a-radio-group :disabled="disabledState" :options="genderOption" v-model="form.gender" style="width:200px;" />
        </a-form-model-item>

        <a-form-model-item label="年龄" prop="age" class="order-label">
          <a-input :disabled="disabledState" placeholder="请输入年龄" v-model="form.age" />
        </a-form-model-item>
        <a-form-model-item label="联系电话" class="order-label">
          <a-input placeholder="请输入联系电话" v-model="form.phoneNumber" />
        </a-form-model-item>
      </div>

      <div class="order-content" style="padding-left: 15px;">
        <a-form-model-item label="住院号" class="order-label">
          <a-input placeholder="请输入住院号" v-model="form.liveHospitalNumber" />
        </a-form-model-item>
        <a-form-model-item label="病理号" class="order-label">
          <a-input placeholder="请输入病理号" v-model="form.pathologyNumber" />
        </a-form-model-item>
        <a-form-model-item label="影像号" class="order-label">
          <a-input placeholder="请输入影像号" v-model="form.medicalImageNumber" />
        </a-form-model-item>
      </div>

      <h3 class="order-title">销售信息</h3>
      <div class="order-content withStar">
        <span class="star">* </span>
        <a-form-model-item label="关联泰莱销售" class="order-label">
          <a-select
            style="width:200px;"
            show-search
            :value="sellValue"
            placeholder="输入关联销售进行检索"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            @search="handleSellSearch"
            @change="handleSellChange"
          >
            <a-select-option v-for="item in sellData" :key="item.id" :value="item.username">
              {{ item.realname }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="渠道商" prop="sendAccess" v-show="showSendAccess || sellValue" class="order-label">
          <a-select
            style='width:200px;'
            v-model='form.sendAccess'
            placeholder='请选择渠道商'
            @change='handleChannelChange'
          >
            <a-select-option v-for='item in distributorList' :key='item.id' :value='item.departNameAbbr'>
              {{ item.departName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </div>

      <h3 class="order-title">送检单位信息</h3>
      <div class="order-content" style="padding-left: 15px;">
        <a-form-model-item label="送检医院" prop="sendHospital" class="order-label">
          <a-select
            style="width:200px;"
            v-model="form.sendHospital"
            placeholder="请先选择销售和渠道商"
            :disabled="!form.sendAccess"
            @change="handleHospitalChange"
          >
            <a-select-option v-for='item in hospitalList' :key='item.id' :value='item.departNameAbbr'>
              {{ item.hospitalName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="送检科室" prop="sendDepartment" class="order-label" v-show="form.sendAccess">
          <a-input placeholder="请输入送检科室" v-model="form.sendDepartment" />
        </a-form-model-item>
        <a-form-model-item label="送检医生" class="order-label" v-show="form.sendAccess">
          <a-input placeholder="请输入送检医生" v-model="form.sendDoctor" />
        </a-form-model-item>
      </div>

      <h3 class="order-title">收费信息</h3>
      <div class="order-content" style="padding-left: 15px;">
        <a-form-model-item label="用户是否收费" class="order-label">
          <a-radio-group
            :options="chargeTypeOption"
            v-model="form.chargeType"
            style="width:200px;"
            @change="onRadioGroupChange"
          />
        </a-form-model-item>
      </div>

      <div class="order-content" style="padding-left: 15px;" v-if="showPayMessage">
        <div style="margin-bottom:15px;">
          如果收费，可以上传收费凭证文件或图片（限制每个5MB以内，仅支持：jpg、jepg、png、gif、bmp、psd、tif）
        </div>
        <a-upload
          list-type="picture-card"
          :file-list="fileList"
          @preview="handlePreview"
          @change="handleChange"
          :customRequest="handleUpload"
          :beforeUpload="beforeUpload"
        >
          <div v-if="fileList.length < 6">
            <a-icon type="plus" />
            <div class="ant-upload-text">
              上传
            </div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </div>

      <div class="btn-group">
        <a-button type="primary" @click="save" style="margin-right:15px;">保存</a-button>
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import { getOrderStepInfo, lookUpMedicalCase, createOrderApplyInfo } from 'src/api/order/index'
import { queryRoleUsers } from '../../../api/material/index'
import { delLogo, uploadLogo, getDistributorList, queryHospitalByMainId } from '../../../api/product/index'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

function sellFetch(value, callback) {
  let timeout
  let currentValue

  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value

  function fake() {
    queryRoleUsers({
      role: 'sales_omics',
      name: value
    }).then(res => {
      if (res.success) {
        if (currentValue === value) {
          const result = res.result
          const data = []
          result.forEach(r => {
            data.push({
              key: r.id,
              realname: r.realname,
              username: r.username,
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
  name: 'base-info',
  data() {
    return {
      layout: 'inline',
      orderId: null,
      form: {},
      validatorRules: {
        identityType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
        caseName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        age: [{ required: true, message: '请输入正确的年龄', trigger: 'blur', pattern: /^((1[0-1])|[1-9])?\d$/ }],
        identityNumber: [{ required: true, message: '请输入证件号码', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        phoneNumber: [
          {
            required: true,
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        liveHospitalNumber: [{ required: true, message: '请输入住院号', trigger: 'blur' }],
        pathologyNumber: [{ required: true, message: '请输入病理号', trigger: 'blur' }],
        medicalImageNumber: [{ required: true, message: '请输入影像号', trigger: 'blur' }],
        seller: [{ required: true, message: '请选择关联泰莱销售', trigger: 'blur' }],
        sendAccess: [{ required: true, message: '请选择渠道商', trigger: 'blur' }],
        sendHospital: [{ required: true, message: '请输入送检医院', trigger: 'blur' }],
        sendDepartment: [{ required: true, message: '请输入送检科室', trigger: 'blur' }],
        sendDoctor: [{ required: true, message: '请输入送检医生', trigger: 'blur' }],
        chargeType: [{ required: true, message: '请选择是否收费', trigger: 'change' }]
      },
      distributorList: [],
      hospitalList: [],
      idData: [],
      idValue: undefined,
      sellData: [],
      sellValue: undefined,
      showSendAccess: false,
      disabledState: false,
      medicalCaseId: '',
      user: null,
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
          id: 0,
          name: '身份证（中国大陆）'
        },
        {
          id: 1,
          name: '香港通行证（中国香港）'
        },
        {
          id: 2,
          name: '台胞证（中国台湾）'
        },
        {
          id: 3,
          name: '护照（其他国家和地区）'
        }
      ],
      previewVisible: false,
      previewImage: '',
      fileList: [],
      showPayMessage: false
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
    this.user = this.$store.getters.userRole
    this.initForm()
  },
  methods: {
    initForm() {
      const that = this
      if (this.getParams('orderId')) {
        const params = {
          orderId: this.getParams('orderId'),
          step: 0
        }
        getOrderStepInfo(params).then(res => {
          if (res.code === 200) {
            if (res.result.chargeType === 1) {
              that.showPayMessage = true
            } else {
              that.showPayMessage = false
            }

            const fileList = res.result.chargeProofs
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
            that.form = res.result
            that.sellValue = res.result.seller_dictText
            that.loadDistributorList(res.result.seller)
            queryHospitalByMainId({ id: res.result.sendAccess }).then(res => {
              that.hospitalList = res.result
            })
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
    nextStep() {
      // this.$emit('nextStep')
      const cb = () => {
        this.$emit('nextStep', 0)
      }
      this.save(cb)
    },
    save(cb) {
      const that = this
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let reg = ''
          switch (that.form.identityType) {
            case 0:
              reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
              if (!reg.test(that.form.identityNumber)) {
                that.$message.warning(`请输入正确的身份证（中国大陆）号码`)
                return
              }
              break
            case 1:
              reg = /^([A-Z]\d{6,10}(\(\w{1}\))?)$/
              if (!reg.test(that.form.identityNumber)) {
                that.$message.warning(`请输入正确的香港通行证（中国香港）号码`)
                return
              }
              break
            case 2:
              reg = /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/
              if (!reg.test(that.form.identityNumber)) {
                that.$message.warning(`请输入正确的台胞证（中国台湾）号码`)
                return
              }
              break
            case 3:
              reg = /^([a-zA-z]|[0-9]){5,17}$/
              if (!reg.test(that.form.identityNumber)) {
                that.$message.warning(`请输入正确的护照（其他国家和地区）号码`)
                return
              }
              break
            default:
              break
          }

          if (!that.form.seller) {
            that.$message.warning(`请选择关联泰莱销售`)
            return
          }

          // if (that.showPayMessage && that.fileList.length === 0) {
          //   that.$message.warning(`请上传收费信息`)
          //   return
          // }

          const orderId = that.getParams('orderId')
          that.form.orderId = orderId ? orderId : null
          that.form.chargeProofs = []
          that.medicalCaseId = that.medicalCaseId ? that.medicalCaseId : null

          const fileList = [...that.fileList]
          fileList.map(item => {
            that.form.chargeProofs.push({
              fileInfoId: item.uid,
              fileName: item.name,
              fileUrl: item.url,
              fileSuffix: item.fileSuffix
            })
          })

          createOrderApplyInfo(that.form).then(res => {
            that.form.gender = Number(that.form.gender)
            that.form.identityType = Number(that.form.identityType)
            if (res.code === 200) {
              that.form.chargeType = Number(that.form.chargeType)
              that.orderId = res.result.id
              that.medicalCaseId = res.result.medicalCaseId
              that.$message.success('基本信息已保存！')
              history.pushState({}, '', `${this.$route.path}?orderId=${res.result.id}`)
              if (typeof cb === 'function') cb()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    handleSellSearch(value) {
      if (!(this.user.includes('sales_omics') && !this.user.includes('sales_super_omics'))) {
        sellFetch(value, data => (this.sellData = data))
      }
    },
    handleSellChange(value) {
      this.sellValue = value
      if (!(this.user.includes('sales_omics') && !this.user.includes('sales_super_omics'))) {
        sellFetch(value, data => (this.sellData = data))
      }
      // this.$set(this.form, 'sendAccess', '') // clean the previous data if the sellUser or sellUserId changed
      this.setFormControllerEmpty(this.form, 'sendAccess')
      if (value) {
        this.showSendAccess = true
        this.form.seller = value
        this.loadDistributorList(value)
      }
    },
    handleChannelChange(value) {
      queryHospitalByMainId({ id: value }).then(res => {
        if (res.success) {
          this.hospitalList = res.result
          this.setFormControllerEmpty(this.form, ['sendHospital', 'sendDepartment', 'sendDoctor'])
          console.log(this.hospitalList)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleHospitalChange(value) {
      this.hospitalList.forEach(hospital => {
        if (hospital.departNameAbbr === value) {
          this.form.sendDepartment = hospital.department
          this.form.sendDoctor = hospital.contactDoctor
        }
      })
    },
    handleIdChange(e) {
      const that = this
      let reg = ''
      switch (that.form.identityType) {
        case 0:
          reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
          break
        case 1:
          reg = /^([A-Z]\d{6,10}(\(\w{1}\))?)$/
          break
        case 2:
          reg = /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/
          break
        case 3:
          reg = /^([a-zA-z]|[0-9]){5,17}$/
          break
        default:
          reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
          break
      }
      if (reg.test(e.target.value)) {
        lookUpMedicalCase({
          identityNumber: e.target.value,
          identityType: that.form.identityType || 0
        }).then(res => {
          if (res.success) {
            if (res.result) {
              that.form = res.result
              that.form.medicalCaseId = res.result.id
              that.form.id = null
            } else {
              that.form.medicalCaseId = null
            }
          } else {
            // that.$message.warning(res.message)
          }
        })
      }
    },
    loadDistributorList(value) {
      const that = this
      getDistributorList({
        sellUser: value
      }).then(res => {
        if (res.success) {
          that.distributorList = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
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
    beforeUpload(file) {
      const that = this
      const isImage =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif' ||
        file.type === 'image/bmp' ||
        file.type === 'image/tiff'
      if (!isImage) {
        this.$message.error('只能上传图片文件!')
      }
      const isLt10M = file.size / 1024 / 1024 < 5
      if (!isLt10M) {
        this.$message.error('文件大小必须小于 5MB!')
      }
      this.currentFile = file
      return isImage && isLt10M
    },
    handleCancel() {
      this.previewVisible = false
      this.visible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      const removed = this.fileList.find(item => item.status === 'removed')
      if (removed) {
        delLogo({
          id: removed.uid
        }).then(res => {
          console.log(res)
        })
      }
      this.fileList = fileList.filter(item => item.type === 'custom')
    },
    handleUpload(file) {
      const that = this
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('code', '5000')
      uploadLogo(formData)
        .then(res => {
          if (res.success) {
            that.$message.success(res.message)
            that.fileList.push({
              uid: res.result.id,
              type: 'custom',
              name: res.result.fileName,
              status: 'done',
              url: res.result.fileUrl,
              fileSuffix: res.result.fileSuffix
            })
          } else {
            that.$message.error(res.message)
            that.fileList.push({
              uid: res.result.id,
              type: 'custom',
              name: res.result.fileName,
              status: 'error',
              fileSuffix: res.result.fileSuffix
            })
            that.uploading = false
          }
        })
        .catch(e => {
          that.uploading = false
        })
    },
    onRadioGroupChange(e) {
      if (e.target.value === 0) {
        this.showPayMessage = false
        this.fileList = []
      } else {
        this.showPayMessage = true
      }
    },
    setFormControllerEmpty(form, controller) {
      if (Array.isArray(controller)) {
        controller.forEach(c => {
          this.$set(form, c, undefined)
        })
      } else {
        this.$set(form, controller, undefined)
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
  text-align: right;
}
</style>
<style lang="less">
.order-label {
  .ant-form-item-label {
    min-width: 95px;
  }
}
</style>
