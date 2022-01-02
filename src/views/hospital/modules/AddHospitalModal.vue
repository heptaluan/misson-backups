<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model :layout="layout" ref="form" :model="form" :rules="rules" class="add-hospital-modal">
      <div class="form-title">基本信息</div>
      <div class="form-content">
        <a-form-model-item label="医院名称" prop="hospitalName">
          <a-input :disabled="formDisabled" placeholder="请输入医院名称" v-model="form.hospitalName" />
        </a-form-model-item>
        <a-form-model-item label="医院简称" prop="shortName">
          <a-input :disabled="formDisabled" placeholder="请输入医院简称" v-model="form.shortName" />
        </a-form-model-item>
        <a-form-model-item label="科室" prop="department">
          <a-input :disabled="formDisabled" placeholder="请输入科室" v-model="form.department" />
        </a-form-model-item>
        <a-form-model-item label="联系医生" prop="contactDoctor">
          <a-input :disabled="formDisabled" placeholder="请输入联系医生" v-model="form.contactDoctor" />
        </a-form-model-item>
      </div>
      <div class="form-content">
        <a-form-model-item label="联系人电话" prop="contactPhone">
          <a-input :disabled="formDisabled" placeholder="请输入联系人电话" v-model="form.contactPhone" />
        </a-form-model-item>
        <a-form-model-item label="统一信用代码">
          <a-input :disabled="formDisabled" placeholder="请输入统一信用代码" v-model="form.socialCode" />
        </a-form-model-item>
        <a-form-model-item label="网址">
          <a-input :disabled="formDisabled" placeholder="请输入网址" v-model="form.website" />
        </a-form-model-item>
      </div>
      <div class="form-content">
        <a-form-model-item label="LOGO">
          <a-upload
            :disabled="formDisabled"
            list-type="picture-card"
            :file-list="fileList"
            @preview="handlePreview"
            @change="handleChange"
            :customRequest="handleUpload"
          >
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-model-item>
      </div>
      <div class="form-title">地址信息</div>
      <div class="form-content">
        <a-form-model-item label="地区" prop="address">
          <a-cascader :disabled="formDisabled" :options="options" placeholder="请选择地区" v-model="form.address" />
        </a-form-model-item>
        <a-form-model-item label="详细地址" prop="detailAddress">
          <a-input :disabled="formDisabled" placeholder="请输入详细地址" v-model="form.detailAddress" />
        </a-form-model-item>
        <a-form-model-item label="电话" prop="phoneNumber">
          <a-input :disabled="formDisabled" placeholder="请输入电话" v-model="form.phoneNumber" />
        </a-form-model-item>
      </div>
      <div class="form-title">关联信息</div>
      <div class="form-content">
        <a-form-model-item label="关联渠道商" prop="relateAccess">
          <a-select
            style="width:200px;"
            :disabled="formDisabled"
            v-model="form.relateAccess"
            placeholder="请选择关联渠道商"
          >
            <a-select-option v-for="item in distributorList" :key="item.id" :value="item.shortName">
              {{ item.accessName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </div>
    </a-form-model>
  </j-modal>
</template>

<script>
import { uploadLogo, addBusinessAccess, getDistributorList, addBusinessHospital } from '../../../api/product/index'
import { mixinDevice } from '@/utils/mixin'
import options from '../../../../src/mixins/cities'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default {
  name: 'AddHospitalModal',
  mixins: [mixinDevice],
  data() {
    return {
      title: '创建渠道商',
      width: 1200,
      visible: false,
      disableSubmit: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      record: {},
      options: options,
      layout: 'inline',
      address: [],
      form: {},
      rules: {
        hospitalName: [{ required: true, message: '请输入医院名称', trigger: 'blur' }],
        shortName: [{ required: true, message: '请输入医院简称', trigger: 'blur' }],
        department: [{ required: true, message: '请输入科室', trigger: 'blur' }],
        contactDoctor: [{ required: true, message: '请输入联系医生', trigger: 'blur' }],
        contactPhone: [
          { required: true, message: '请输入联系人电话', trigger: 'blur', pattern: /^[1][3,4,5,7,8][0-9]{9}$/ }
        ],
        socialCode: [
          {
            required: true,
            message: '请输入统一信用代码',
            trigger: 'blur',
            pattern: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/
          }
        ],
        address: [{ required: true, message: '请选择地区', trigger: 'change' }],
        detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        phoneNumber: [{ required: true, message: '请输入电话', trigger: 'blur', pattern: /^[1][3,4,5,7,8][0-9]{9}$/ }],
        relateAccess: [{ required: true, message: '请选择关联渠道商', trigger: 'blur' }]
      },
      // 表头
      columns: [],
      url: {
        list: 'mission/businessAccess/list'
      },
      previewVisible: false,
      previewImage: '',
      fileList: [],
      data: [],
      value: undefined,
      formDisabled: false,
      distributorList: []
    }
  },
  methods: {
    edit(record) {
      if (record.id) {
        this.form = Object.assign({}, record)
        const address = []
        this.formDisabled = true
        address.push(record.provinceCode)
        address.push(record.cityCode)
        address.push(record.districtCode)
        this.form.address = address
        this.form.sellUser = record.sellUser_dictText
        this.fileList = [
          {
            uid: '0',
            name: 'logo',
            status: 'done',
            url: record.logo_dictText
          }
        ]
      } else {
        this.form = Object.assign({}, record)
        this.address = []
        this.fileList = []
        this.formDisabled = false
      }
      console.log(this.form)
      this.visible = true
    },
    handleOk() {
      if (this.formDisabled) {
        this.visible = false
      } else {
        const that = this
        this.$refs.form.validate(valid => {
          if (valid) {
            console.log(this.form)
            // if (that.fileList.length === 0) {
            //   that.$message.warning(`请上传LOGO`)
            //   return
            // }
            const postData = Object.assign({}, that.form)
            postData.provinceCode = postData.address[0]
            postData.cityCode = postData.address[1]
            postData.districtCode = postData.address[2]
            addBusinessHospital(postData)
              .then(res => {
                console.log(res)
                if (res.success) {
                  that.$emit('ok')
                  that.visible = false
                  that.$message.success(res.message)
                } else {
                  that.$message.error(res.message)
                  that.uploading = false
                }
              })
              .catch(e => {
                that.uploading = false
              })
          }
        })
      }
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
      this.fileList = fileList
    },
    handleUpload(file) {
      const that = this
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('code', '3000')
      uploadLogo(formData)
        .then(res => {
          if (res.success) {
            that.fileList = [
              {
                uid: '0',
                name: 'logo',
                status: 'done',
                url: res.result.fileUrl
              }
            ]
            that.$message.success(res.message)
            that.form.logo = res.result.id
          } else {
            that.$message.error(res.message)
            that.uploading = false
            that.fileList = []
          }
        })
        .catch(e => {
          that.uploading = false
        })
    },
    loadDistributorList() {
      const that = this
      getDistributorList().then(res => {
        if (res.success) {
          that.distributorList = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  },
  mounted() {
    this.loadDistributorList()
  }
}
</script>

<style lang="less" scoped>
.form-title {
  font-size: 18px;
}

.form-content {
  padding: 0 30px;
  margin: 15px 0;
}
</style>

<style lang="less">
.form-content {
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
</style>

<style lang="less">
.add-hospital-modal {
  .ant-form-item-label {
    min-width: 110px;
  }
}
</style>
