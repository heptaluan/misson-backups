<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group">
          <a-col class="group">
            <a-form-item label="产品名称" :labelCol="{ span: 4 }">
              <a-input allowClear v-model="queryParam.productName" placeholder="请输入产品名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group">
            <a-form-item label="产品组" :labelCol="{ span: 4 }">
              <j-dict-select-tag
                allowClear
                style="width:150px;"
                type="list"
                dictCode="product_group_type"
                placeholder="请选择产品组"
                v-model="queryParam.productGroup"
              />
            </a-form-item>
          </a-col>
          <!-- <div class="group">
            <label class="search-label">样本：</label>
            <j-dict-select-tag
              allowClear
              style="width:150px;"
              type="list"
              dictCode="sample_type"
              placeholder="请选择样本"
              v-model="queryParam.includeSample"
            />
          </div> -->
          <a-col class="group btn">
            <a-button @click="searchQuery" type="primary">搜索</a-button>
            <a-button @click="resetQuery" style="margin-left:10px;">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleShowAdd" type="primary" icon="plus">添加产品</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('型号管理')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <!-- 高级查询区域 -->
      <!-- <j-super-query
        :fieldList="superFieldList"
        ref="superQueryModal"
        @handleSuperQuery="handleSuperQuery"
      ></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown> -->
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: true }"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        class="j-table-force-nowrap"
        @change="handleTableChange"
      >
        <span slot="img" slot-scope="img">
          <div v-if="!img"></div>
          <img v-else :src="img" width="30px" height="18px" />
        </span>

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

        <span slot="action" slot-scope="text, record" style="display: flex;justify-content: space-evenly;">
          <a @click="handleShowEdit(record)">编辑</a>
          <a @click="handleShowDetail(record)">详情</a>
          <!-- <a @click="handleEdit(record)" v-has="'editProduct'">编辑</a>

          <a-divider type="vertical" v-has="'editProduct'" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item v-has="'editProduct'">
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>
      </a-table>
    </div>

    <AddNewProductModal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AddNewProductModal from './modules/AddNewProductModal'
import Vue from 'vue'
import { UI_CACHE_DB_DICT_DATA } from '@/store/mutation-types'

export default {
  name: 'ProductList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    AddNewProductModal
  },
  data() {
    return {
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
          title: '产品名称',
          align: 'center',
          dataIndex: 'productName'
        },
        {
          title: '产品组',
          align: 'center',
          dataIndex: 'productGroup_dictText'
        },
        {
          title: '癌种',
          align: 'center',
          dataIndex: 'productCancer_dictText'
        },
        {
          title: '组学',
          align: 'center',
          dataIndex: 'includeOmics',
          customRender: function(t, r, index) {
            const types = Vue.ls.get(UI_CACHE_DB_DICT_DATA)['omics_analysis_type']
            const includeOmics = t.split(',')
            let result = ''
            for (let i = 0; i < includeOmics.length; i++) {
              if (includeOmics[i] !== '') {
                result += types[i].text + '，'
              }
            }
            return result.substring(0, result.length - 1)
          }
        },
        {
          title: '产品LOGO',
          align: 'center',
          dataIndex: 'logoFileId_dictText',
          scopedSlots: { customRender: 'img' }
        },
        {
          title: '产品说明',
          align: 'center',
          dataIndex: 'remark'
        },
        {
          title: '所需样本',
          align: 'center',
          dataIndex: 'includeSample',
          customRender: function(t, r, index) {
            if (t) {
              const types = Vue.ls.get(UI_CACHE_DB_DICT_DATA)['sample_type']
              const includeSample = t.split(',')
              let result = ''
              for (let i = 0; i < includeSample.length; i++) {
                if (includeSample[i] !== '') {
                  result += types[i].text + '，'
                }
              }
              return result.substring(0, result.length - 1)
            } else {
              return ''
            }
          }
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '创建时间',
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
        list: 'mission/productInfo/list',
        edit: 'mission/productInfo/edit',
        delete: 'mission/productInfo/delete'
      },
      dictOptions: {},
      superFieldList: [],
      queryParam: {}
    }
  },
  methods: {
    initDictConfig() {},
    resetQuery() {
      this.queryParam = {}
      this.loadData()
    },
    handleShowAdd() {
      this.$refs.modalForm.edit({}, 'add')
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    handleShowEdit(record) {
      this.$refs.modalForm.edit(record, 'edit')
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
    },
    handleShowDetail(record) {
      this.$refs.modalForm.edit(record, 'detail')
      this.$refs.modalForm.title = '详情'
      this.$refs.modalForm.disableSubmit = true
    }
  }
}
</script>

<style scoped lang="less" scoped>
.search-group {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  margin-left: 0 !important;

  .group {
    display: flex;
    justify-items: center;
    align-items: center;
    margin-right: 15px;

    .title {
      color: rgba(0, 0, 0, 0.85);
      margin-right: 10px;
      text-align: right;
      flex: 0 0 85px;
    }
  }
}
</style>
