<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="项目组名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="groupName">
              <a-input v-model="model.groupName" placeholder="请输入项目组名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目组内部负责人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="groupChargeId">
              <a-select v-model="model.groupChargeId" placeholder="请选择项目组内部负责人">
                <a-select-option v-for="item in chargePeople" :key="item.id" :value="item.id">
                  {{ item.realname }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="说明" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="groupDescribe">
              <a-input v-model="model.groupDescribe" placeholder="请输入说明"  ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div v-if="isEidt">
        <a-upload-dragger name="file" :showUploadList="false" :customRequest="upload" :beforeUpload="beforeUpload">
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">
            单击或拖动文件到该区域进行上传1
          </p>
        </a-upload-dragger>
      </div>
    </j-form-container>
    <div class="table-wrap" style="margin-top: 15px" v-if="isEidt">
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
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDeleteFile(record.id)">
            <a>删除</a>
          </a-popconfirm>
          <a-button type="link" size="small" @click="viewFile(record)">
            预览
          </a-button>
        </span>
      </a-table>
    </div>
    <a-modal
      v-model="typeVisible"
      title="文件上传 -- 文件类型"
      @ok="handleUploadfile">
      <div class="file-upload-type">
        <label class="file-upload-label">文件类型</label>
        <j-dict-select-tag type="list" v-model="semanticType" dictCode="file_semantic_type" placeholder="请选择文件类型" />
      </div>

    </a-modal>
  </a-spin>
</template>

<script>
  import FileInfoModal from './FileInfoModal'
  import { httpAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { mixinDevice } from '@/utils/mixin'
  import { uploadFile, queryFileList, getUserList } from 'src/api/mission/project'
  import { deleteAction } from '@/api/manage'

  export default {
    name: 'ProjectGroupForm',
    components: {
      FileInfoModal,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      }
    },
    mixins: [JeecgListMixin, mixinDevice],
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
         },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
          groupName: [{ required: true, message: '请输入项目组名称', trigger: 'blur' }],
          groupChargeId: [{ required: true, message: '项目组内部负责人', trigger: 'change' }]
        },
        url: {
          list: 'unload',
          add: "/mission/projectGroup/add",
          edit: "/mission/projectGroup/edit",
          queryById: "/mission/projectGroup/queryById",
          delete: '/mission/fileInfo/delete'
        },
        ownershipTypes: [],
        fileType: '2',
        isEidt: false,
        fileList: undefined,
        list: [],
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
        modalType: 1,
        semanticType: undefined,
        typeVisible: false,
        chargePeople: []
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
      this.loadUserList()
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
        this.isEidt = false
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
        this.isEidt = true
        this.loadFileList()
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }

        })
      },
      upload () {
        this.typeVisible = true
      },
      handleUploadfile() {
        if (!this.semanticType) {
          this.$message.warning('请选择文件类型.')
          return false
        }
        const { fileList } = this
        const formData = new FormData()
        formData.append('file', fileList)
        const info = {
          semanticType: this.semanticType,
          ownershipType: this.modalType,
          ownerId: this.model.id,
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
            this.typeVisible = false
          })
      },
      beforeUpload(file) {
        this.fileList = file
        return true
      },
      addData () {
        this.$refs.modalForm.add()
        this.$refs.modalForm.title = '新增'
        this.$refs.modalForm.disableSubmit = false
      },
      loadFileList() {
        if (!this.model.id) return false
        const params = {
          ownerId: this.model.id,
          ownershipType: 1,
          page: 1,
          size: 20
        }
        queryFileList(params).then(res => {
          if (res.success) {
            this.list = res.result.records
          }
        })
      },
      handleDeleteFile (id) {
        const that = this
        deleteAction(that.url.delete, { id: id }).then((res) => {
          if (res.success) {
            that.$message.success(res.message)
            that.loadFileList()
          } else {
            that.$message.warning(res.message)
          }
        })
      },
      viewFile (record) {
        window.open(record.fileUrl, 'blank')
      },
      loadUserList () {
        const that = this
        getUserList().then(res => {
          if (res.success) {
            that.chargePeople = res.result
          } else {
            that.$message.warning(res.message)
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .bt-add-data {
    position: absolute;
    top: 5px;
    right: 15px
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