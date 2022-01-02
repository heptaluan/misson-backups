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
      <a-button type="primary" icon="download" @click="handleExportXls('项目合作单位')">导出</a-button>
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

    <cooperation-agency-modal ref="modalForm" @ok="modalFormOk"></cooperation-agency-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import CooperationAgencyModal from './modules/CooperationAgencyModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'CooperationAgencyList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      CooperationAgencyModal
    },
    data () {
      return {
        description: '项目合作单位管理页面',
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
            title:'合作单位类型',
            align:"center",
            dataIndex: 'caType_dictText'
          },
          {
            title:'合作单位名称',
            align:"center",
            dataIndex: 'caName'
          },
          {
            title:'合作单位编码',
            align:"center",
            dataIndex: 'caCode'
          },
          {
            title:'地址',
            align:"center",
            dataIndex: 'caAddress'
          },
          {
            title:'统一信用代码',
            align:"center",
            dataIndex: 'caSocialCode'
          },
          {
            title:'网站',
            align:"center",
            dataIndex: 'caWebsite'
          },
          {
            title:'对接人',
            align:"center",
            dataIndex: 'caDockingId_dictText'
          },
          // {
          //   title:'负责人',
          //   align:"center",
          //   dataIndex: 'caHeadId_dictText'
          // },
          // {
          //   title:'科室/部门',
          //   align:"center",
          //   dataIndex: 'caDep'
          // },
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
          list: "/mission/cooperationAgency/list",
          delete: "/mission/cooperationAgency/delete",
          deleteBatch: "/mission/cooperationAgency/deleteBatch",
          exportXlsUrl: "/mission/cooperationAgency/exportXls",
          importExcelUrl: "mission/cooperationAgency/importExcel",
          
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
        fieldList.push({type:'int',value:'caType',text:'合作单位类型',dictCode:'ca_type'})
        fieldList.push({type:'string',value:'caName',text:'合作单位名称',dictCode:''})
        fieldList.push({type:'string',value:'caCode',text:'合作单位编码',dictCode:''})
        fieldList.push({type:'string',value:'caAddress',text:'地址',dictCode:''})
        fieldList.push({type:'string',value:'caSocialCode',text:'统一信用代码',dictCode:''})
        fieldList.push({type:'string',value:'caWebsite',text:'网站',dictCode:''})
        fieldList.push({type:'string',value:'caDockingId',text:'对接人',dictCode:'contact_manage,full_name,id'})
        fieldList.push({type:'string',value:'caHeadId',text:'负责人',dictCode:'contact_manage,full_name,id'})
        fieldList.push({type:'string',value:'caDep',text:'科室/部门',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>