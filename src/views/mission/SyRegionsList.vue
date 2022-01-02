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
      <a-button type="primary" icon="download" @click="handleExportXls('sy_regions')">导出</a-button>
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

    <sy-regions-modal ref="modalForm" @ok="modalFormOk"></sy-regions-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SyRegionsModal from './modules/SyRegionsModal'

  export default {
    name: 'SyRegionsList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      SyRegionsModal
    },
    data () {
      return {
        description: 'sy_regions管理页面',
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
            title:'行政区名称',
            align:"center",
            dataIndex: 'name'
          },
          {
            title:'上级行政区划',
            align:"center",
            dataIndex: 'parentId'
          },
          {
            title:'地区名称简称',
            align:"center",
            dataIndex: 'shortName'
          },
          {
            title:'行政级别',
            align:"center",
            dataIndex: 'levelType'
          },
          {
            title:'区号',
            align:"center",
            dataIndex: 'cityCode'
          },
          {
            title:'邮编',
            align:"center",
            dataIndex: 'zipCode'
          },
          {
            title:'合并路径名称',
            align:"center",
            dataIndex: 'mergerName'
          },
          {
            title:'经度',
            align:"center",
            dataIndex: 'lng'
          },
          {
            title:'纬度',
            align:"center",
            dataIndex: 'lat'
          },
          {
            title:'地区拼音',
            align:"center",
            dataIndex: 'pinyin'
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
          list: "/system/syRegions/list",
          delete: "/system/syRegions/delete",
          deleteBatch: "/system/syRegions/deleteBatch",
          exportXlsUrl: "/system/syRegions/exportXls",
          importExcelUrl: "system/syRegions/importExcel",
          
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
        fieldList.push({type:'string',value:'name',text:'行政区名称'})
        fieldList.push({type:'string',value:'parentId',text:'上级行政区划'})
        fieldList.push({type:'string',value:'shortName',text:'地区名称简称'})
        fieldList.push({type:'int',value:'levelType',text:'行政级别'})
        fieldList.push({type:'string',value:'cityCode',text:'区号'})
        fieldList.push({type:'string',value:'zipCode',text:'邮编'})
        fieldList.push({type:'string',value:'mergerName',text:'合并路径名称'})
        fieldList.push({type:'string',value:'lng',text:'经度'})
        fieldList.push({type:'string',value:'lat',text:'纬度'})
        fieldList.push({type:'string',value:'pinyin',text:'地区拼音'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>