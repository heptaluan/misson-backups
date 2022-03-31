<template>
  <a-modal
    :title="title"
    :width="1200"
    :ok="false"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: { disabled: disableSubmit } }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules" :layout="layout">
        <a-form-model-item :hidden="seen" label="上级部门" hasFeedback>
          <a-tree-select
            style="width:180px"
            :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
            :treeData="departTree"
            v-model="model.parentId"
            placeholder="请选择上级部门"
            :disabled="condition"
          >
          </a-tree-select>
        </a-form-model-item>
        <div class="form-title">基本信息</div>

        <div class="form-content">
          <a-form-model-item label="渠道商名称" prop="departName" :hidden="false" hasFeedback>
            <a-input id="departName" placeholder="请输入渠道商名称" v-model="model.departName" />
          </a-form-model-item>
          <a-form-model-item label="渠道商简称" prop="departNameAbbr">
            <a-input
              class='autoUppercase'
              :disabled='formDisabled'
              placeholder='请输入渠道商简称'
              v-model='model.departNameAbbr'
              @change='checkAbbr(model.departNameAbbr, model)'
            />
          </a-form-model-item>
          <a-form-model-item prop="mobile" label="联系人电话" hasFeedback>
            <a-input placeholder="请输入电话" v-model="model.mobile" />
          </a-form-model-item>
        </div>
        <div class="form-content">
          <a-form-model-item label="统一信用码">
            <a-input :disabled="formDisabled" placeholder="请输入统一信用码" v-model="model.socialCode" />
          </a-form-model-item>
          <a-form-model-item label="网址">
            <a-input :disabled="formDisabled" placeholder="请输入网址" v-model="model.website" />
          </a-form-model-item>
        </div>
        <div class="form-title">地址信息</div>
        <div class="form-content">
          <!--          <a-form-model-item label="LOGO">-->
          <!--            <a-upload-->
          <!--              :disabled="formDisabled"-->
          <!--              list-type="picture-card"-->
          <!--              :file-list="fileList"-->
          <!--              @preview="handlePreview"-->
          <!--              @change="handleChange"-->
          <!--              :customRequest="handleUpload"-->
          <!--            >-->
          <!--              <div v-if="fileList.length < 1">-->
          <!--                <a-icon type="plus" />-->
          <!--                <div class="ant-upload-text">-->
          <!--                  Upload-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </a-upload>-->
          <!--            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">-->
          <!--              <img alt="example" style="width: 100%" :src="previewImage" />-->
          <!--            </a-modal>-->
          <!--          </a-form-model-item>-->
          <a-form-model-item label="地区" prop="zone">
            <region :disabled="formDisabled" v-model="model.zone" :value="model.zone" />
          </a-form-model-item>
          <a-form-model-item label="详细地址" prop="address">
            <a-input :disabled="formDisabled" placeholder="请输入详细地址" v-model="model.address" />
          </a-form-model-item>

          <!--          <a-form-model-item label='电话' prop='telephone'>-->
          <!--            <a-input :disabled='formDisabled' placeholder='请输入电话' v-model='model.telephone' />-->
          <!--          </a-form-model-item>-->
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import { queryIdTree } from '@/api/api'
import pick from 'lodash.pick'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { uploadLogo } from '../../../api/product'
import Region from '../../region/Region'
import { commonFunctionsMixin } from '@/mixins/commonFunctionsMixin'

export default {
  name: 'RelationModal',
  components: { ATextarea, Region },
  mixins: [commonFunctionsMixin],
  data() {
    return {
      departTree: [],
      orgTypeData: [],
      phoneWarning: '',
      departName: '',
      title: '操作',
      layout: 'inline',
      seen: false,
      visible: false,
      condition: true,
      disableSubmit: false,
      model: {},
      defaultModel: {
        departOrder: 0,
        orgCategory: '1'
      },
      menuhidden: false,
      menuusing: true,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      validatorRules: {
        departName: [
          {
            required: true,
            message: '请输入正确的渠道商名称',
            trigger: 'blur'
          }
        ],
        departNameAbbr: [
          {
            required: true,
            message: '请输入渠道商简称(3-8位大写字母)',
            trigger: 'blur',
            pattern: /^[a-zA-Z]{3,8}$/
          }
        ],
        // orgCode:[{ required: true, message: '请输入机构编码!' }],
        mobile: [
          {
            required: true,
            message: '请输入联系人电话',
            trigger: 'blur',
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/
          }
        ],
        socialCode: [
          {
            required: true,
            message: '请输入统一信用代码',
            trigger: 'blur',
            pattern: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/
          }
        ],
        zone: [{ required: true, message: '请选择地区', trigger: 'change' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
        // detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        // telephone: [{ required: true, message: '请输入电话', trigger: 'blur', pattern: /^[1][3,4,5,7,8][0-9]{9}$/ }]
        // orgCategory:[{required: true, message: '请输入机构类型!'}]
      },
      url: {
        add: '/sys/sysDepart/add',
        edit: '/sys/sysDepart/edit'
      },
      dictDisabled: true,
      previewVisible: false,
      previewImage: '',
      // fileList: [],
      data: [],
      value: undefined,
      formDisabled: false,
      selectType: 3000
    }
  },
  created() {},
  methods: {
    loadTreeData() {
      var that = this
      queryIdTree().then(res => {
        if (res.success) {
          that.departTree = []
          for (let i = 0; i < res.result.length; i++) {
            let temp = res.result[i]
            that.departTree.push(temp)
          }
        }
      })
    },
    add(depart) {
      if (depart) {
        this.seen = false
        this.dictDisabled = false
      } else {
        this.seen = true
        this.dictDisabled = true
      }
      this.edit(depart)
    },
    edit(record) {
      this.visible = true
      this.model = Object.assign({}, this.defaultModel, record)
      this.loadTreeData()
      this.model.parentId = record != null ? record.toString() : null
      // if (this.seen) {
      //   this.model.orgCategory = '1'
      // } else {
      //   this.model.orgCategory = '2'
      // }
      this.formatZone(this.model)
      this.model.orgCategory = '3000'
    },
    close() {
      this.$emit('close')
      this.disableSubmit = false
      this.visible = false
      this.$refs.form.resetFields()
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          that.model.regionLevel = that.model.zone.length
          that.model.regionCode = that.model.zone.at(-1)
          httpAction(this.url.add, this.model, 'post')
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadTreeData()
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.close()
    },
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },
    formatZone(form) {
      const zone = []
      zone.push(form.regionProvince, form.regionCity, form.regionCode)
      form.zone = zone
    }
    // async handlePreview(file) {
    //   if (!file.url && !file.preview) {
    //     file.preview = await getBase64(file.originFileObj)
    //   }
    //   this.previewImage = file.url || file.preview
    //   this.previewVisible = true
    // },
    // handleChange({ fileList }) {
    //   this.fileList = fileList
    // },
    // handleUpload(file) {
    //   const that = this
    //   const formData = new FormData()
    //   formData.append('file', file.file)
    //   formData.append('code', '3000')
    //   uploadLogo(formData)
    //     .then(res => {
    //       if (res.success) {
    //         that.fileList = [
    //           {
    //             uid: '0',
    //             name: 'logo',
    //             status: 'done',
    //             url: res.result.fileUrl
    //           }
    //         ]
    //         that.$message.success(res.message)
    //         that.form.logo = res.result.id
    //       } else {
    //         that.$message.error(res.message)
    //         that.uploading = false
    //         that.fileList = []
    //       }
    //     })
    //     .catch(e => {
    //       that.uploading = false
    //     })
    // },
  }
}
</script>

<style lang="less" scoped>
.form-title {
  font-size: 18px;
}

.form-content {
  padding: 0 30px;
  margin: 15px 0 36px;
}
</style>

<style lang="less">
.form-content {
  .ant-input {
    width: 200px;
  }

  .ant-form-item {
    &:last-child {
      margin-right: 0;
    }
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
.add-distributor-modal {
  .ant-form-item-label {
    min-width: 110px;
  }
}
</style>
