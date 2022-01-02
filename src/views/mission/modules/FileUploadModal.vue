<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
      <a-spin :spinning="confirmLoading">
        <j-form-container :disabled="formDisabled">
          <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
              <a-row v-if="modalType=== 1">
                <a-col :span="24">
                  <a-form-model-item label="项目组" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="fileUrl">
                    <j-dict-select-tag v-model="model.projectId" dictCode="project_group, group_name, id" placeholder="请选择项目组" @input="handleQuery"></j-dict-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="文件类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ownershipType">
                    <j-dict-select-tag type="list" v-model="model.ownershipType" dictCode="file_semantic_type" placeholder="请选择文件类型" />
                  </a-form-model-item>
                </a-col>
              </a-row>
            <a-row v-else>
              <a-col :span="24">
                <a-form-model-item label="项目" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="fileUrl">
                  <j-dict-select-tag v-model="model.projectId" dictCode="project_info, project_name, id, logical_state=1" placeholder="请选择项目" @input="handleQuery"></j-dict-select-tag>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="文件类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ownershipType">
                  <j-dict-select-tag type="list" v-model="model.ownershipType" dictCode="file_semantic_type" placeholder="请选择文件类型" />
                </a-form-model-item>
              </a-col>
            </a-row>
            </a-form-model>
          <div>
            <a-upload-dragger name="file" :showUploadList="false" :customRequest="handleUploadfile" :beforeUpload="beforeUpload">
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">
                单击或拖动文件到该区域进行上传2
              </p>
            </a-upload-dragger>
          </div>
          <div class="table-wrap" style="margin-top: 15px">
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
              <template slot="fileSlot" slot-scope="text">
                <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
                <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
                  下载
                </a-button>
              </template>
              <!-- 编辑区域 -->
              <span slot="action" slot-scope="text, record">
                <a-popconfirm title="确定删除吗?" @confirm="handleDeleteFile(record.id)">
                  <a>删除</a>
                </a-popconfirm>
                <a-button type="link" size="small" @click="viewFile(record)">
                 预览
               </a-button>
              </span>
            </a-table>
          </div>
        </j-form-container>
      </a-spin>
  </j-modal>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { mixinDevice } from '@/utils/mixin'
  import { uploadFile, queryFileList } from 'src/api/mission/project'
  import { deleteAction } from '@/api/manage'
  export default {
    name: '',
    mixins: [JeecgListMixin, mixinDevice],
    props: {
      fileType: {
        type: String,
        default: '1',
        required: false
      },
      modalType: {
        type: Number,
        default: 1,
        required: false
      }
    },
    data () {
      return {
        url: {
          add: "/mission/fileInfo/add",
          edit: "/mission/fileInfo/edit",
          queryById: "/mission/fileInfo/queryById",
          list: 'unload',
          delete: '/mission/fileInfo/delete'
        },
        disableEdit: true,
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
            dataIndex: 'ownershipType_dictText'
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
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,
        confirmLoading: false,
        formDisabled: false,
        fileList: undefined,
        model:{
          projectId: null,
          ownershipType: null
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        typeVisible: false,
        validatorRules: {},
        list: []
      }
    },
    methods: {
      add () {
        this.visible = true
      },
      handleOk () {
        this.$emit('ok')
        this.visible = false
      },
      handleCancel () {
        this.close()
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleQuery () {
        console.log('query')
        this.loadFileList()
      },
      loadFileList() {
        const params = {
          ownerId: this.model.projectId,
          ownershipType: this.modalType,
          page: 1,
          size: 20
        }
        queryFileList(params).then(res => {
          if (res.success) {
            this.list = res.result.records
          }
        })
      },
      beforeUpload(file) {
        if (!this.model.projectId) {
          let text = this.modalType === 1 ? '请选择项目组.': '请选择项目.'
          this.$message.warning(text)
          return false
        }
        if (!this.model.ownershipType) {
          this.$message.warning('请选择文件类型.')
          return false
        }
        this.fileList = file
        return true
      },
      handleUploadfile() {
        const { fileList } = this
        const formData = new FormData()
        formData.append('file', fileList)
        const info = {
          semanticType: this.model.ownershipType,
          ownershipType: this.modalType,
          ownerId: this.model.projectId,
          fileName: fileList.name
        }
        formData.append('info', JSON.stringify(info))
        uploadFile(formData).then(res => {
            if (res.success) {
              this.fileList = []
              this.$message.success('文件上传成功！')
              this.loadFileList()
            } else {
              this.$message.success(res.message)
              this.uploading = false
            }
          })
          .catch(e => {
            this.uploading = false
          })
      },
      handleDeleteFile (id) {
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
    }
  }
</script>
