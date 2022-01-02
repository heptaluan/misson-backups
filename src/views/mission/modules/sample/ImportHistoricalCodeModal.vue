<template>
  <j-modal :title="title" :width="width" :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <a-form-model :model="form" ref="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
      <a-form-model-item label="渠道商" prop="agencyShortName">
        <a-select v-model="form.agencyShortName" placeholder="请选择渠道商">
          <a-select-option v-for="item in distributorList" :key="item.id" :value="item.shortName">
            {{ item.accessName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-upload-dragger
        @change="handleChange"
        :file-list="fileList"
        :remove="handleRemove"
        :before-upload="beforeUpload"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">
          可以拖动文件到该区域进行上传
        </p>
      </a-upload-dragger>
    </a-form-model>
  </j-modal>
</template>

<script>
import { CommonSingleUpload, uploadHistoryCaseBarcode } from 'src/api/order/index'
import { getDistributorList } from '../../../../api/product/index'

export default {
  name: 'ImportHistoricalCodeModal',
  data() {
    return {
      title: '历史编号导入',
      width: 800,
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
      record: {},
      visible: false,
      form: {},
      fileList: [],
      file: undefined,
      userList: [],
      tplUrl: '',
      tplFile: undefined,
      fileInfoId: '',
      distributorList: [],
      rules: {
        agencyShortName: [{ required: true, message: '请选择客户', trigger: 'change' }]
      }
    }
  },
  methods: {
    show() {
      this.visible = true
      this.form = {}
      this.fileList = []
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      this.submitForm()
    },
    handleChange(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.fileList = fileList
      if (this.fileList.length > 0) {
        const isExcel =
          info.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          info.file.type === 'application/vnd.ms-excel'
        const isLt10M = info.file.size / 1024 / 1024 < 10

        if (!isExcel) {
          this.$message.error('只能上传 Excel 文件!')
          this.fileList = []
          return false
        }

        if (!isLt10M) {
          this.$message.error('文件大小必须小于 10MB!')
          this.fileList = []
          return false
        }

        const that = this
        const formData = new FormData()
        formData.append('file', info.file)
        formData.append('code', '2100')
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
      // this.fileList = [...this.fileList, file]
      // this.file = file
      return false
    },
    handleSelectChange(value) {
      this.form.qcContactId = value
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
          uploadHistoryCaseBarcode({
            fileInfo: this.fileInfoId,
            agencyShortName: this.form.agencyShortName
          }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              this.$emit('ok')
              this.visible = false
            } else {
              that.$message.error(res.message)
            }
          })
        }
      })
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
    }
  },
  mounted() {
    this.loadDistributorList()
  }
}
</script>
