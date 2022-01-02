<template>
  <div>
    <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      switchFullscreen
      cancelText="关闭"
      :footer="footer"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="b-flex image-ipload">
        <div class="b-flex-1 padding-left-right-xs">
          <a-upload-dragger
            name="fileDir"
            :multiple="true"
            :file-list="uploadFiles"
            :showUploadList="false"
            directory
            :before-upload="beforeUploadDir"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">
              拖拽或点击选择内含DICOM的文件夹到此处
            </p>
            <p class="ant-upload-hint padding-bottom-25">
<!--              支持整个文件夹批量上传。-->
            </p>
          </a-upload-dragger>
        </div>
        <div class="b-flex-1 padding-left-right-xs">
          <a-upload-dragger
            name="file"
            :multiple="true"
            :file-list="uploadFiles"
            :showUploadList="false"
            :remove="handleRemove"
            :before-upload="beforeUpload"
            >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">
              拖拽或点击选择内含DICOM的ZIP压缩包到此处
            </p>
            <p class="ant-upload-hint padding-bottom-25">
              <!--              支持整个文件夹批量上传。-->
            </p>
          </a-upload-dragger>
        </div>
      </div>
      <div class="title text-weight margin-top-xs margin-bottom-xs">任务列表</div>
      <div class="upload-table">
        <a-table :columns="columns" :data-source="fileList" class="components-table-demo-nested">
        <span slot="stautsText" slot-scope="text, record">
          <div v-if="record.progress">
            <a-progress :percent="record.progress" :status="getProgress(record)"/>
          </div>
          <div v-else>
            <a-badge :status="getStatusFile(text)"/>{{ getStatusDesc(text) }}
          </div>
        </span>
          <span slot="operation" slot-scope="text, record, index">
          <a-button class="opt-btn" @click="handleUploadSingle(text, index)">上传</a-button>
          <a-button class="opt-btn" @click="removeFile(text)">删除</a-button>
        </span>
        </a-table>
      </div>
      <div class="padding-bottom-25">
        <p>注：上传过程中请勿刷新此页面</p>
      </div>
      <div class="footer-bar">
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">保存</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </div>
    </j-modal>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'

export default {
  name: 'ViewportUploadModal',
  mixins: [JeecgListMixin, mixinDevice],
  components: {},
  data() {
    return {
      title: '影像上传',
      width: 1280,
      visible: false,
      footer: null,
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      url: {
        list: ''
      },
      tempCheckpoint: undefined,
      client: undefined,
      meta: {
        year: new Date().getFullYear(),
        people: 'admin'
      },
      timer: null,
      uploadFiles: [],
      fileList: [],
      worker: null,
      columns: [
        { title: '文件名', dataIndex: 'name', key: 'name', width: 200 },
        // { title: '大小', dataIndex: 'size', key: 'size', width: 80 },
        { title: '文件类型', dataIndex: 'type', key: 'type', width: 150 },
        { title: '状态', dataIndex: 'stautsText', key: 'stautsText', width: 120, scopedSlots: { customRender: 'stautsText' } },
        { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: 150 }
      ]
    }
  },
  methods: {
    show(record) {
      if (record && record.id) {
        this.pId = record.id
        this.loadData(record.id)
        this.dis = true
      } else {
        this.form = {}
        this.dataSource = []
        this.dis = false
      }
      this.visible = true
    },
    handleCancel() {
      console.log(`取消`)
      this.visible = false
    },
    handleOk() {
      console.log('ok')
      this.visible = false
      this.$emit('ok')
    },
    loadData(id) {},
    // 文件上传相关
    handleUpload () {
      if (!this.uploadFiles.length) return false
      this.status = Status.uploading
      const filesArr = this.uploadFiles
      const { secondPass, success, error, resume } = fileStatus

      for (let i = 0; i < filesArr.length; i++) {
        if ([secondPass, success, error].includes(filesArr[i].status)) {
          continue
        }
        if (filesArr[i].status === resume) {
          this.resumeChunks(filesArr[i])
          continue
        }
        this.uploadChunks(filesArr[i])
      }
    },
    handleUploadSingle (text, index) {
      try {
        const file = this.uploadFiles[index]
        this.uploadChunks(file, index)
      } catch (e) {
        console.log(e)
      }
    },
    uploadChunks (file, index) {
      if (file.size > chunkSize) {
        this.multipartUpload(file, index)
      } else {
        this.singleUpload(file, index)
      }
    },
    // 定义上传方法。
    async multipartUpload (file, index) {
      const record = this.fileList[index]
      try {
        // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
        // 您可以通过自定义文件名（例如exampleobject.txt）或目录（例如exampledir/exampleobject.txt）的形式，实现将文件上传到当前Bucket或Bucket中的指定目录。
        await this.client.client.multipartUpload(file.name, file, {
          progress: (p, checkpoint) => {
            // 断点记录点。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
            this.tempCheckpoint = checkpoint
            record.checkpoint = checkpoint
            record.stautsText = Status.uploading
            record.progress = p * 100
            this.$set(this.fileList, index, record)
          },
          meta: this.meta
        })
      } catch (e) {
        record.stautsText = Status.error
        console.log(e)
      }
    },
    // 上传单个文件 不需要分片
    async singleUpload (file, index) {
      try {
        const record = this.fileList[index]
        // data对象可以自定义为file对象、Blob数据或者OSS Buffer。
        const result = await this.client.client.put(file.name, file, {
          meta: this.meta
        })
        if (result.res && result.res.status === 200) {
          record.url = result.url
          record.stautsText = Status.success
        }
      } catch (e) {
        console.log(e)
      }
    },
    async resumeUpload (file, index) {
      try {
        const record = this.fileList[index]
        const tempCheckpoint = record.checkpoint || this.tempCheckpoint
        const result = await this.client.client.multipartUpload(file.name, file, {
          progress: (p, checkpoint) => {
            this.tempCheckpoint = checkpoint
            record.checkpoint = checkpoint
            record.stautsText = Status.uploading
            record.progress = p
          },
          checkpoint: tempCheckpoint,
          meta: this.meta
        })
        console.log(result)
      } catch (e) {
        console.log(e)
      }
    },
    handleDirChange () {
      this.isDir = !this.isDir
      this.uploadFiles = []
      this.fileList = []
      this.fileCount = 0
    },
    getProgress (record) {
      let status = 'normal'
      if (record.stautsText === Status.error) {
        status = 'exception'
      }
      if (record.progress > 25) {
        status = 'active'
      }
      if (record.progress === 100) {
        status = 'success'
      }
      return status
    },
    getStatusDesc (item) {
      return fileStatusStr[item]
    },
    getStatusFile (text) {
      const { uploading, success, error, pause } = fileStatus
      let status = 'default'
      switch (text) {
        case uploading:
          status = 'processing'
          break
        case success:
          status = 'success'
          break
        case error:
          status = 'error'
          break
        case pause:
          status = 'warning'
          break
        default:
          status = 'default'
          break
      }
      return status
    },
    handleRemove (file) {
      const index = this.uploadFiles.indexOf(file)
      const newFileList = this.uploadFiles.slice()
      newFileList.splice(index, 1)
      this.uploadFiles = newFileList
      this.fileList.splice(index, 1)
    },
    beforeUpload (file) {
      this.uploadFiles = [...this.uploadFiles, file]
      this.fileList = [...this.fileList, {
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
        status: file.status,
        stautsText: fileStatus.wait,
        type: file.type,
        path: file.webkitRelativePath,
        record: []
      }]
      return false
    },
    beforeUploadDir (file) {
      this.uploadFiles = [...this.uploadFiles, file]
      this.timer && clearTimeout(this.timer)
      // 然后重新建一个延时器触发, 这样就实现了最后一次调用
      this.timer = setTimeout(() => {
        this.handleDirZip()
      }, 1000)
      return false
    },
    handleDirZip () {
      if (this.uploadFiles.length === 0) return false
      const zip = new JSZip()
      for (const f of this.uploadFiles) {
        zip.file(f.webkitRelativePath, f)
      }
      const rootFolder = this.uploadFiles[0].webkitRelativePath.split('/')[0]
      this.uploadFiles = []
      this.fileList = []
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        const dirs = new File([blob], rootFolder + '.zip', { type: 'zip' })
        this.fileList.push({
          name: rootFolder + '.zip',
          size: dirs.size,
          status: dirs.status,
          stautsText: fileStatus.wait,
          type: dirs.type,
          path: rootFolder + '.zip'
        })
        this.uploadFiles.push(dirs)
      })
    },
    removeFile (item) {

    },
  }
}
</script>

<style lang="less" scoped>
.footer-bar {
  display: flex;
  justify-content: flex-end;
}
.ant-upload.ant-upload-drag {
  background-color: #FFFFFF;
}
</style>
