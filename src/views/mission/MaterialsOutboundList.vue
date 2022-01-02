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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('耗材出库管理')">导出</a-button>
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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
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

    <materials-outbound-modal ref="modalForm" @ok="modalFormOk"></materials-outbound-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MaterialsOutboundModal from './modules/MaterialsOutboundModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'MaterialsOutboundList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      MaterialsOutboundModal
    },
    data () {
      return {
        description: '耗材出库管理管理页面',
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
            title:'耗材ID',
            align:"center",
            dataIndex: 'materialId'
          },
          {
            title:'耗材编号',
            align:"center",
            dataIndex: 'materialCode'
          },
          {
            title:'耗材名称',
            align:"center",
            dataIndex: 'materialName'
          },
          {
            title:'出库数量',
            align:"center",
            dataIndex: 'materialPcs'
          },
          {
            title:'出库时间',
            align:"center",
            dataIndex: 'outTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'出库状态',
            align:"center",
            dataIndex: 'maStatus'
          },
          {
            title:'审核时间',
            align:"center",
            dataIndex: 'auditTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'审核人',
            align:"center",
            dataIndex: 'auditId'
          },
          {
            title:'仓库',
            align:"center",
            dataIndex: 'warehouseId_dictText'
          },
          {
            title:'所属项目',
            align:"center",
            dataIndex: 'projectId_dictText'
          },
          {
            title:'出库类型',
            align:"center",
            dataIndex: 'outboundType_dictText'
          },
          {
            title:'出库对象',
            align:"center",
            dataIndex: 'outboundObject_dictText'
          },
          {
            title:'快递单号',
            align:"center",
            dataIndex: 'emsNo'
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
          list: "/mission/materialsOutbound/list",
          delete: "/mission/materialsOutbound/delete",
          deleteBatch: "/mission/materialsOutbound/deleteBatch",
          exportXlsUrl: "/mission/materialsOutbound/exportXls",
          importExcelUrl: "mission/materialsOutbound/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
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
        fieldList.push({type:'string',value:'materialId',text:'耗材ID',dictCode:''})
        fieldList.push({type:'string',value:'materialCode',text:'耗材编号',dictCode:''})
        fieldList.push({type:'string',value:'materialName',text:'耗材名称',dictCode:''})
        fieldList.push({type:'int',value:'materialPcs',text:'出库数量',dictCode:''})
        fieldList.push({type:'date',value:'outTime',text:'出库时间'})
        fieldList.push({type:'string',value:'maStatus',text:'出库状态',dictCode:''})
        fieldList.push({type:'date',value:'auditTime',text:'审核时间'})
        fieldList.push({type:'string',value:'auditId',text:'审核人',dictCode:''})
        fieldList.push({type:'string',value:'warehouseId',text:'仓库',dictCode:'warehouse_manage,name,id'})
        fieldList.push({type:'string',value:'projectId',text:'所属项目',dictCode:'project_info,project_name,id'})
        fieldList.push({type:'int',value:'outboundType',text:'出库类型',dictCode:'outband_type'})
        fieldList.push({type:'string',value:'outboundObject',text:'出库对象',dictCode:''})
        fieldList.push({type:'string',value:'emsNo',text:'快递单号',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>