<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="rules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="产品名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productName">
              <a-input :disabled="editState" v-model="model.productName" placeholder="请输入产品名称"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="产品识别码"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="productRecognition"
            >
              <a-input
                :disabled="editState"
                v-model="model.productRecognition"
                placeholder="请输入两位产品识别码"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="产品组" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productGroup">
              <j-dict-select-tag
                :disabled="editState"
                type="list"
                v-model="model.productGroup"
                dictCode="product_group_type"
                placeholder="请选择产品组"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="癌种名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productCancer">
              <j-dict-select-tag
                :disabled="editState"
                type="list"
                v-model="model.productCancer"
                placeholder="请选择癌种名称"
                dictCode="types_cancer"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="所需样本" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="includeSample">
              <a-checkbox-group v-model="model.includeSample">
                <div class="check-box-list">
                  <a-checkbox v-for="(item, key) in sampleTypes" :key="key" :value="item.value">{{
                    item.text
                  }}</a-checkbox>
                </div>
              </a-checkbox-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="组学（多选）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="includeOmics">
              <a-select
                :disabled="editState"
                mode="multiple"
                style="width: 100%"
                placeholder="请选择组学"
                v-model="model.includeOmics"
              >
                <a-select-option v-for="item in omicsAnalysisType" :key="item.value">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="产品描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-textarea
                :disabled="editState"
                v-model="model.remark"
                placeholder="请输入产品描述"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="LOGO" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-upload
                :disabled="editState"
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
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

import { uploadLogo, addProductInfoList, updateProductInfoList, bindSample } from '../../../api/product/index'
import { httpAction } from '@/api/manage'
import Vue from 'vue'
import { UI_CACHE_DB_DICT_DATA } from '@/store/mutation-types'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default {
  name: 'AddNewProductForm',
  components: {},
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      url: {
        add: 'mission/productInfo/add',
        edit: 'mission/productInfo/edit'
      },
      rules: {
        productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        productRecognition: [
          { required: true, message: '请输入两位产品识别码（仅限字母）', trigger: 'blur', pattern: /^[a-zA-Z]{2}$/ }
        ],
        includeSample: [{ required: true, message: '请选择所需样本', trigger: 'change' }],
        includeOmics: [{ required: true, message: '请选择组学', trigger: 'change' }],
        productGroup: [{ required: true, message: '请选择产品组', trigger: 'change' }],
        productCancer: [{ required: true, message: '请选择癌种名称', trigger: 'change' }],
        productOmics: [{ required: true, message: '请选择组学', trigger: 'change' }],
        productRemark: [{ required: true, message: '请输入产品描述', trigger: 'blur' }]
      },
      previewVisible: false,
      previewImage: '',
      fileList: [],
      omicsAnalysisType: [],
      sampleTypes: [],
      editState: false,
      type: ''
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    }
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    add() {
      this.edit(this.modelDefault)
    },
    edit(record, type) {
      this.type = type
      if (type === 'detail') {
        this.model = Object.assign({}, record)
        this.model.includeOmics = this.model.includeOmics ? this.model.includeOmics.split(',') : []
        this.model.includeSample = this.model.includeSample ? this.model.includeSample.split(',') : []
        this.fileList = [
          {
            uid: '0',
            name: 'logo',
            status: 'done',
            url: this.model.logoFileId_dictText
          }
        ]
      } else if (type === 'edit') {
        this.editState = true
        this.model = Object.assign({}, record)
        this.model.includeOmics = this.model.includeOmics ? this.model.includeOmics.split(',') : []
        this.model.includeSample = this.model.includeSample ? this.model.includeSample.split(',') : []
        this.fileList = [
          {
            uid: '0',
            name: 'logo',
            status: 'done',
            url: this.model.logoFileId_dictText
          }
        ]
      } else {
        this.editState = false
        this.model = Object.assign({}, record)
      }
      this.visible = true
      this.omicsAnalysisType = this.getDictItemsFromCache('omics_analysis_type')
      this.sampleTypes = this.getDictItemsFromCache('sample_type')
    },
    submitForm() {
      if (this.type === 'add') {
        const that = this
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            if (that.fileList.length === 0) {
              that.$message.warning(`请上传LOGO`)
              return
            }
            const postData = Object.assign({}, that.model)
            postData.includeOmics = postData.includeOmics.toString()
            postData.includeSample = postData.includeSample.toString()
            console.log(postData)
            addProductInfoList(postData)
              .then(res => {
                console.log(res)
                if (res.success) {
                  that.$message.success(res.message)
                  that.$emit('ok')
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
      } else if (this.type === 'detail') {
        this.$emit('ok')
      } else if (this.type === 'edit') {
        const that = this
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            if (that.fileList.length === 0) {
              that.$message.warning(`请上传LOGO`)
              return
            }
            const postData = {
              productInfoId: that.model.id,
              samples: that.model.includeSample.toString()
            }
            console.log(postData)
            bindSample(postData)
              .then(res => {
                console.log(res)
                if (res.success) {
                  that.$message.success(res.message)
                  that.$emit('ok')
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
          } else {
            that.$message.error(res.message)
            that.uploading = false
          }
          that.$message.success(res.message)
          that.model.logoFileId = res.result.id
        })
        .catch(e => {
          that.uploading = false
        })
    },
    getDictItemsFromCache(dictCode) {
      if (Vue.ls.get(UI_CACHE_DB_DICT_DATA) && Vue.ls.get(UI_CACHE_DB_DICT_DATA)[dictCode]) {
        let dictItems = Vue.ls.get(UI_CACHE_DB_DICT_DATA)[dictCode]
        return dictItems
      }
    }
  }
}
</script>

<style lang="less" scoped>
.check-box-list {
  line-height: 2.5;

  .ant-checkbox-wrapper {
    margin-left: 0;
    margin-right: 8px;
  }
}
</style>
