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
      <a-button type="primary" icon="download" @click="handleExportXls('样本信息')">导出</a-button>
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

    <sample-librarian-modal ref="modalForm" @ok="modalFormOk"></sample-librarian-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SampleLibrarianModal from './modules/SampleLibrarianModal'

  export default {
    name: 'SampleLibrarianList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      SampleLibrarianModal
    },
    data () {
      return {
        description: '样本信息管理页面',
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
            title:'样本编号',
            align:"center",
            dataIndex: 'sampleCode'
          },
          {
            title:'医院',
            align:"center",
            dataIndex: 'hoId'
          },
          {
            title:'性质',
            align:"center",
            dataIndex: 'physicalProperty'
          },
          {
            title:'癌种',
            align:"center",
            dataIndex: 'typesCancer'
          },
          {
            title:'被测试者姓名',
            align:"center",
            dataIndex: 'testName'
          },
          {
            title:'被测试者性别',
            align:"center",
            dataIndex: 'testSex'
          },
          {
            title:'年龄',
            align:"center",
            dataIndex: 'testAge'
          },
          {
            title:'身份证号',
            align:"center",
            dataIndex: 'testIdcard'
          },
          {
            title:'收录日期',
            align:"center",
            dataIndex: 'collectionDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'位置编号ID',
            align:"center",
            dataIndex: 'bloodPositionId'
          },
          {
            title:'影像ID',
            align:"center",
            dataIndex: 'imageId'
          },
          {
            title:'报告ID',
            align:"center",
            dataIndex: 'reportId'
          },
          {
            title:'样本扩展JSON',
            align:"center",
            dataIndex: 'sampleExt'
          },
          {
            title:'原始数据',
            align:"center",
            dataIndex: 'rawData'
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
          list: "/mission/sampleLibrarian/list",
          delete: "/mission/sampleLibrarian/delete",
          deleteBatch: "/mission/sampleLibrarian/deleteBatch",
          exportXlsUrl: "/mission/sampleLibrarian/exportXls",
          importExcelUrl: "mission/sampleLibrarian/importExcel",
          
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
        fieldList.push({type:'string',value:'sampleCode',text:'样本编号',dictCode:''})
        fieldList.push({type:'string',value:'hoId',text:'医院',dictCode:''})
        fieldList.push({type:'string',value:'physicalProperty',text:'性质',dictCode:''})
        fieldList.push({type:'string',value:'typesCancer',text:'癌种',dictCode:''})
        fieldList.push({type:'string',value:'testName',text:'被测试者姓名',dictCode:''})
        fieldList.push({type:'int',value:'testSex',text:'被测试者性别',dictCode:''})
        fieldList.push({type:'int',value:'testAge',text:'年龄',dictCode:''})
        fieldList.push({type:'string',value:'testIdcard',text:'身份证号',dictCode:''})
        fieldList.push({type:'date',value:'collectionDate',text:'收录日期'})
        fieldList.push({type:'string',value:'bloodPositionId',text:'位置编号ID',dictCode:''})
        fieldList.push({type:'string',value:'imageId',text:'影像ID',dictCode:''})
        fieldList.push({type:'string',value:'reportId',text:'报告ID',dictCode:''})
        fieldList.push({type:'Text',value:'sampleExt',text:'样本扩展JSON',dictCode:''})
        fieldList.push({type:'Text',value:'rawData',text:'原始数据',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>