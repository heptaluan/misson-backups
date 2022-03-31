<template>
  <j-modal :title="title" :width="width" :visible="visible" @ok="handleOk" @cancel="handleCancel" okText="批量导入文件">
    <a-form-model :model="form" ref="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
      <div class="downloadBox">
        <a-icon type="exclamation-circle" class="yellow" />
        <div class="txt">请您下载导入模版，填写订单信息后上传</div>
        <a-button type="primary" icon="download" class="btn" @click="handlDownloadTemplate">下载模板</a-button>
      </div>

      <div class='downloadBox drag'>
        <div class='txt'>填写完毕后上传：</div>
        <!--        <a-upload :file-list="fileList" @change="handleChange" :before-upload="beforeUpload">-->
        <!--          <a-button type="primary" icon="upload">上传文件</a-button>-->
        <!--        </a-upload>-->
        <div class='dragBox'>
          <a-upload-dragger
            @change='handleChange'
            :file-list='fileList'
            :remove='handleRemove'
            :before-upload='beforeUpload'
          >
            <p class='ant-upload-drag-icon'>
              <a-icon type='inbox' />
            </p>
            <p class='ant-upload-text'>
              可以拖动文件到该区域进行上传
            </p>
          </a-upload-dragger>
        </div>
      </div>

      <a-form-model-item label='渠道商' prop='agencyId' class='sm'>
        <a-select v-model='form.agencyId' placeholder='请选择渠道商'
                  show-search
                  allowClear
                  :value='channelValue'
                  :default-active-first-option='false'
                  :filter-option='false'
                  :not-found-content='null'
                  @search='handleChannelSearch'
                  @change='handleChannelChange'>
          <a-select-option v-for='item in distributorList' :key='item.id' :value='item.departNameAbbr'>
            {{ item.departName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </j-modal>
</template>

<script>
import { CommonSingleUpload, startOrderImportTask } from 'src/api/order/index'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { selectorFilterMixin } from '@/mixins/selectorFilterMixin'

export default {
  name: 'OrderBatchImportModal',
  mixins: [selectorFilterMixin],
  data() {
    return {
      title: '查看编号',
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
      currentFile: null,
      rules: {
        agencyId: [{ required: true, message: '请选择客户', trigger: 'change' }]
      },
      channelValue: undefined
    }
  },
  methods: {
    show() {
      this.form = {}
      this.fileList = []
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      this.submitForm()
    },
    handlDownloadTemplate() {
      const token = this.$ls.get(ACCESS_TOKEN)
      const url = `${
        window._CONFIG['domianURL']
      }/tailai-system/mission/fileInfo/downloadImportTemplate?token=${token}&type=${0}`
      window.open(url, '_blank')
    },
    beforeUpload(file) {
      // this.fileList = [...this.fileList, file]
      // this.file = file
      return false
    },
    handleChange(file) {
      let fileList = [...file.fileList]
      fileList = fileList.slice(-1)
      this.fileList = fileList
      if (this.fileList.length > 0) {
        const isExcel =
          file.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.file.type === 'application/vnd.ms-excel'
        const isLt10M = file.file.size / 1024 / 1024 < 5

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
        this.currentFile = file
        console.log('file: ', this.currentFile)
      }
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
      this.fileInfoId = ''
    },
    handleUpload(file) {
      const that = this
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('code', '4000')
      console.log(this.form.agencyId)
      CommonSingleUpload(formData)
        .then(res => {
          if (res.success) {
            // that.$message.success(res.message)
            const id = res.result.id
            startOrderImportTask({
              fileInfo: id,
              accessShortName: this.form.agencyId
            }).then(res => {
              if (res.success) {
                that.$message.success(res.message)
                this.$emit('ok')
                this.visible = false
              } else {
                that.$message.error(res.message)
              }
            })
          } else {
            that.$message.error(res.message)
          }
        })
        .catch(e => {
          console.log(e)
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
          this.handleUpload(that.currentFile)
        }
      })
    }
  },
  mounted() {
    this.loadDistributorList()
  }
}
</script>
<style scoped lang="less">
.downloadBox {
  margin-bottom: 12px;
  display: flex;

  &.drag {
    flex-wrap: wrap;

    .txt {
      margin-bottom: 8px;
    }

    .dragBox {
      width: 100%;
      padding-bottom: 24px;
    }
  }

  .yellow {
    align-self: center;
    margin-right: 12px;
    color: #db9200;

    /deep/ svg {
      font-size: 20px;
    }
  }

  .txt,
  .btn {
    align-self: center;
    margin-right: 24px;
  }
}
.sm {
  width: 50%;
}
</style>
