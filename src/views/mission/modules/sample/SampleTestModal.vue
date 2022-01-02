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
    <a-form-model ref="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="批次号">
        <div class="list-item">{{record.batchNo}}</div>
      </a-form-model-item>

      <a-form-model-item label="样本编号">
        <div class="list-item">{{record.caseIdentity}}-{{record.sampleIdentity}}</div>
      </a-form-model-item>

      <a-form-model-item label="检测负责人">
        <div class="list-item">{{nickname()}}</div>
      </a-form-model-item>

      <a-form-model-item ref="report" label="检测报告" prop="report">
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
            点击或者拖动文件到该区域进行上传
          </p>
        </a-upload-dragger>
      </a-form-model-item>
    </a-form-model>
  </j-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import { uploadFile, caseSampleDetect } from 'src/api/mission/project'
import { mapGetters } from 'vuex'

export default {
  name: 'StockOutTipsModal',
  mixins: [JeecgListMixin, mixinDevice],
  data() {
    return {
      title: '样本检测',
      width: 800,
      visible: false,
      disableSubmit: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      record: {},
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '耗材序号',
          align: 'center',
          dataIndex: 'materialCode'
        },
        {
          title: '耗材名称',
          align: 'center',
          dataIndex: 'materialName'
        },
        {
          title: '耗材数量',
          align: 'center',
          dataIndex: 'materialTotal'
        }
      ],
      url: {
        list: '/mission/materialManagement/list',
        delete: '/mission/materialManagement/delete',
        deleteBatch: '/mission/materialManagement/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/exportXls',
        importExcelUrl: 'mission/materialManagement/importExcel'
      },
      fileList: [],
      file: undefined
    }
  },
  methods: {
    ...mapGetters(["nickname", "avatar"]),
    show(record) {
      console.log(record)
      this.record = record
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      const that = this
      if (!that.fileList[0]) {
        that.$message.error('上传文件不能为空')
        return false
      }
      const formData = new FormData()
      formData.append('file', that.file)
      formData.append('id', that.record.id)
      caseSampleDetect(formData)
        .then(res => {
          if (res.success) {
            that.fileList = []
            that.$message.success('文件上传成功！')
            that.$emit('ok');
            that.visible = false
          } else {
            that.$message.error(res.message)
          }
        })
        .catch(e => {
          that.$message.error('上传失败，请重新尝试！')
        })
    },
    handleChange(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.fileList = fileList
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      this.file = file
      return false
    },
  }
}
</script>
