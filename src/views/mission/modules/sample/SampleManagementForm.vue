<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container>
      <a-form-model ref="form" :model="form" :rules="rules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              label="批次号"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              ref="batchNo"
              prop="batchNo"
            >
              <a-input
                disabled
                v-model="form.batchNo"
                placeholder="请输入批次号"
                @blur="
                  () => {
                    $refs.batchNo.onFieldBlur()
                  }
                "
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="质控责任人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="qcContactId">
              <a-select v-model="form.qcContactUser" placeholder="请选择质控负责人" @change="handleSelectChange">
                <a-select-option v-for="item in userList" :key="item.id" :value="item.username">
                  {{ item.realname }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <div class="btn-group">
              <a-button type="primary" icon="download" @click="downloadTpl()">下载模板</a-button>
              <!-- <a-upload
                name="file"
                v-has="'sampleTpl'"
                :show-file-list="false"
                :customRequest="handleUploadfile"
                :beforeUpload="beforeTplUpload"
              >
                <a-button><a-icon type="upload" /> 上传模板</a-button>
              </a-upload> -->
            </div>
          </a-col>
          <a-col :span="24">
            <a-upload-dragger
              @change="handleChange"
              :file-list="fileList"
              :remove="handleRemove"
              :before-upload="beforeUpload"
            >
              <a-button class="upload-btn" type="primary" icon="import">导入Excel</a-button>

              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">
                也可以拖动文件到该区域进行上传
              </p>
            </a-upload-dragger>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { putAction } from '@api/manage'
import { addStockApply, getUserList, queryFileList, uploadFile } from 'src/api/mission/project'
import { CommonSingleUpload } from '../../../../api/order/index'

const ruleBaseURL = '/sys/fillRule/executeRuleByCode/'

export default {
  name: 'SampleManagementForm',
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
        xs: { span: 25 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      form: {
        batchNo: '',
        qcContactId: undefined
      },
      rules: {
        batchNo: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
        qcContactId: [{ required: true, message: '质控负责人', trigger: 'change' }]
      },
      url: {
        add: '/mission/materialManagement/add',
        edit: '/mission/materialManagement/edit',
        queryById: '/mission/materialManagement/queryById'
      },
      fileList: [],
      file: undefined,
      userList: [],
      tplUrl: '',
      tplFile: undefined,
      fileInfoId: ''
    }
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    add() {},
    getBatchNo() {
      putAction('/sys/fillRule/executeRuleByCode/' + 'sample_archive_code_rule', { prefix: 'SA' }).then(res => {
        if (res.success) {
          this.form.batchNo = res.result
        }
      })
    },
    handleChange(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.fileList = fileList
      if (this.fileList.length > 0) {
        const that = this
        const formData = new FormData()
        formData.append('file', info.file)
        formData.append('code', '1000')
        CommonSingleUpload(formData)
          .then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.fileInfoId = res.result.id
            } else {
              that.$message.error(res.message)
            }
          })
          .catch(e => {
            console.log(e)
          })
      }
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
      this.fileInfoId = ''
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      this.file = file
      return false
    },
    handleSelectChange(value) {
      this.form.qcContactId = value
    },
    getUserList() {
      const that = this
      getUserList().then(res => {
        if (res.success) {
          that.userList = res.result
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    submitForm() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          if (!that.fileList[0]) {
            that.$message.error('上传文件不能为空')
            that.confirmLoading = false
            return false
          }
          const apply = {
            qcContactUser: that.form.qcContactUser,
            batchNo: that.form.batchNo,
            fileInfoId: this.fileInfoId
          }
          addStockApply(apply)
            .then(res => {
              if (res.success) {
                that.fileList = []
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.error(res.message)
              }
            })
            .catch(e => {
              that.$message.error(res.message)
              that.confirmLoading = false
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    getTpl() {
      const that = this
      const params = {
        ownerId: '0',
        ownershipType: 3,
        page: 1,
        size: 20,
        column: 'createTime',
        order: 'dsc'
      }
      queryFileList(params).then(res => {
        if (res.success) {
          let records = res.result.records
          if (records.length === 0) {
            that.tplUrl = ''
          } else {
            that.tplUrl = records[0].id
          }
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    downloadTpl() {
      const token = this.$ls.get(ACCESS_TOKEN)
      const url = `${
        window._CONFIG['domianURL']
      }/tailai-system/mission/fileInfo/downloadImportTemplate?token=${token}&type=${1}`
      window.open(url, '_blank')
    },
    beforeTplUpload(file) {
      this.tplFile = file
      return true
    }
    // handleUploadfile(file) {
    //   const { tplFile } = this
    //   const formData = new FormData()
    //   formData.append('file', tplFile)
    //   const info = {
    //     semanticType: 1,
    //     ownershipType: 3,
    //     ownerId: '0',
    //     fileName: tplFile.name
    //   }
    //   formData.append('info', JSON.stringify(info))
    //   uploadFile(formData)
    //     .then(res => {
    //       if (res.success) {
    //         this.tplFile = undefined
    //         this.$message.success('文件上传成功！')
    //         file.onSuccess();
    //       } else {
    //         this.$message.error(res.message)
    //         file.onError();
    //       }
    //     })
    //     .catch(e => {
    //       this.uploading = false
    //     })
    // }
  },
  mounted() {
    this.getTpl()
    this.getUserList()
    this.getBatchNo()
  }
}
</script>

<style lang="less" scoped>
.btn-group {
  margin-bottom: 30px;
  padding-left: 120px;

  button {
    margin-right: 5px;
    margin-left: 15px;
  }
}

.upload-btn {
  position: absolute;
  top: -63px;
  left: 0;
}
</style>
