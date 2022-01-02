<template>
  <div>
    <a-form-model
      style="max-width: 1080px; margin: 40px auto 0;"
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="文件类型" prop="type" v-if="false">
        <!--        <j-dict-select-tag type="list" v-model="form.type" dictCode="ownership_type" placeholder="请选择文件类型" />-->
      </a-form-model-item>

      <a-upload-dragger name="file" :showUploadList="false" :customRequest="upload" :beforeUpload="beforeUpload">
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">
          单击或拖动文件到该区域进行上传
        </p>
      </a-upload-dragger>

      <!-- table区域-begin -->
      <div class="table-wrap">
        <a-table
          ref="table"
          size="middle"
          :scroll="{ x: true }"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="list"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          class="j-table-force-nowrap"
          @change="handleTableChange"
        >
          <template slot="htmlSlot" slot-scope="text">
            <div v-html="text"></div>
          </template>
          <template slot="imgSlot" slot-scope="text">
            <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
            <img
              v-else
              :src="getImgView(text)"
              height="25px"
              alt=""
              style="max-width:80px;font-size: 12px;font-style: italic;"
            />
          </template>
          <template slot="fileSlot" slot-scope="text">
            <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
            <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
              下载
            </a-button>
          </template>
          <!-- 编辑区域 -->
          <span slot="action" slot-scope="text, record">
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDeleteFile(record.id)">
              <a>删除</a>
            </a-popconfirm>
           <a-button type="link" size="small" @click="viewFile(record)">
            预览
          </a-button>
          </span>
        </a-table>
      </div>

      <a-form-item :wrapperCol="{ span: 24 }">
        <div class="btn-group">
          <a-button type="primary" class="prev-btn" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </div>
      </a-form-item>
    </a-form-model>
    <a-modal
      v-model="typeVisible"
      title="文件上传 -- 文件类型"
      @ok="handleUploadfile">
      <div class="file-upload-type">
        <label class="file-upload-label">文件类型</label>
        <j-dict-select-tag type="list" v-model="fileType" dictCode="file_semantic_type" placeholder="请选择文件类型" />
      </div>

    </a-modal>
    <MaterialDataManagementModal ref="modalForm" @ok="modalFormOk" />
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import MaterialDataManagementModal from '../modules/project/MaterialDataManagementModal'
import { uploadFile, queryFileList } from 'src/api/mission/project'
import { deleteAction } from '@/api/manage'

export default {
  name: 'Step4',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    MaterialDataManagementModal
  },
  data() {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      list: [],
      form: {
        type: undefined
      },
      rules: {
        type: [{ required: true, message: '请选择文件类型', trigger: 'change' }]
      },
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
          title: '文件名称',
          align: 'center',
          dataIndex: 'fileName'
        },
        {
          title: '文件类型',
          align: 'center',
          dataIndex: 'semanticType_dictText'
        },
        {
          title: '上传时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: 'unload',
        delete: '/mission/fileInfo/delete',
        deleteBatch: '/mission/materialManagement/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/exportXls',
        importExcelUrl: 'mission/materialManagement/importExcel'
      },
      projectId: undefined,
      fileList: undefined,
      fileType: undefined,
      typeVisible: false
    }
  },
  methods: {
    // 上传
    handleChange(info) {
      const status = info.file.status
      if (status !== 'uploading') {
        // console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    handleDeleteFile(id) {
      const that = this
      deleteAction(that.url.delete, { id: id }).then(res => {
        if (res.success) {
          //重新计算分页问题
          that.reCalculatePage(1)
          that.$message.success(res.message)
          that.loadFileList()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    beforeUpload(file) {
      this.fileList = file
      return true
    },
    upload () {
      this.typeVisible = true
    },
    handleUploadfile() {
      if (!this.fileType) {
        this.$message.warning('请选择文件类型.')
        return false
      }
      const { fileList } = this
      const formData = new FormData()
      formData.append('file', fileList)

      const info = {
        semanticType: this.fileType,
        ownershipType: '2',
        ownerId: this.projectId,
        fileName: fileList.name
      }
      formData.append('info', JSON.stringify(info))
      uploadFile(formData)
        .then(res => {
          if (res.success) {
            this.fileList = []
            this.$message.success('文件上传成功！')
            this.loadFileList()
            this.typeVisible = false
          } else {
            this.$message.success(res.message)
            this.uploading = false
          }
        })
        .catch(e => {
          this.uploading = false
        })
    },
    loadFileList() {
      const params = {
        ownerId: this.projectId,
        ownershipType: 2,
        page: 1,
        size: 20
      }
      queryFileList(params).then(res => {
        if (res.success) {
          this.list = res.result.records
        }
      })
    },
    prevStep() {
      this.$emit('prevStep')
    },
    nextStep() {
      this.$emit('nextStep')
    },
    handleDeleteFile(id) {
      const that = this
      deleteAction(that.url.delete, { id: id }).then((res) => {
        if (res.success) {
          //重新计算分页问题
          that.$message.success(res.message)
          that.loadFileList()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    viewFile (record) {
      window.open(record.fileUrl, 'blank')
    }
  },
  mounted() {
    this.projectId = this.getParams('id')
    this.queryParam.ownerId = this.projectId
    this.loadFileList()
  }
}
</script>

<style lang="less" scoped>
.btn-group {
  text-align: right;

  .prev-btn {
    margin: 0 15px;
  }
}

.table-wrap {
  margin-top: 40px;
}
.file-upload-type {
  width: 100%;
  display: flex;
  align-items: center;
}
.file-upload-label {
  width: 75px;
}
  .file-upload-type .ant-select {
    flex: 1;
  }
</style>
