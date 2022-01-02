<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleUpload" type="primary" icon="plus" v-has="'gFileAdd'">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('文件管理')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" v-has="'gFileAdd'">编辑</a>

          <a-divider type="vertical" v-has="'gFileAdd'"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <file-upload-modal ref="uploadModalForm" @ok="modalFormOk" :fileType="queryParam.ownershipType" :modalType = '1'></file-upload-modal>
    <file-info-modal ref="modalForm" @ok="modalFormOk"></file-info-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixinForMount'
  import FileInfoModal from './modules/FileInfoModal'
  import FileUploadModal from './modules/FileUploadModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'FileInfoList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      FileInfoModal,
      FileUploadModal
    },
    data () {
      return {
        description: '项目组文件管理管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'文件存放位置',
            align:"center",
            dataIndex: 'fileUrl'
          },
          {
            title:'文件类型',
            align:"center",
            dataIndex: 'semanticType_dictText'
          },
          // {
          //   title:'归属ID',
          //   align:"center",
          //   dataIndex: 'ownerId'
          // },
          {
            title:'原文件名称',
            align:"center",
            dataIndex: 'fileName'
          },
          {
            title:'文件后缀',
            align:"center",
            dataIndex: 'fileSuffix'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/mission/fileInfo/list",
          delete: "/mission/fileInfo/delete",
          deleteBatch: "/mission/fileInfo/deleteBatch",
          exportXlsUrl: "/mission/fileInfo/exportXls",
          importExcelUrl: "mission/fileInfo/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
      this.queryParam.ownershipType = '1'
      this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'fileUrl',text:'文件存放位置',dictCode:''})
        fieldList.push({type:'int',value:'ownershipType',text:'归属类型',dictCode:'	ownership_type'})
        fieldList.push({type:'string',value:'ownerId',text:'归属ID',dictCode:''})
        fieldList.push({type:'string',value:'fileName',text:'原文件名称',dictCode:''})
        fieldList.push({type:'string',value:'fileSuffix',text:'文件后缀',dictCode:''})
        this.superFieldList = fieldList
      },
      handleUpload () {
        this.$refs.uploadModalForm.add()
        this.$refs.uploadModalForm.title = '新增'
        this.$refs.uploadModalForm.disableSubmit = false
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>