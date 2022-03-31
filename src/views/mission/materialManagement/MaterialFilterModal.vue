<template>
  <div>
    <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      switchFullscreen
      :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
      cancelText="关闭"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24" class="search-group">
            <a-col class="group">
              <a-form-item label="耗材包名称" :labelCol="{ span: 8 }">
                <a-input allowClear v-model="queryParam.planName" placeholder="耗材包名称"></a-input>
              </a-form-item>
            </a-col>
            <a-col class="group">
              <a-form-item label="所属产品" :labelCol="{ span: 8 }">
                <a-select v-model="queryParam.productRecognition" placeholder="请选择所属产品" style="width:190px;">
                  <a-select-option v-for="item in productInfoList" :key="item.id" :value="item.productRecognition">
                    {{ item.productName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="group btn">
              <a-button @click="searchQuery" type="primary">查询</a-button>
              <a-button @click="resetQuery">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
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

          <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">编辑</a>

            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
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
    </j-modal>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import { getProductInfoList } from '../../../api/product/index'

export default {
  name: 'StockInModal',
  mixins: [JeecgListMixin, mixinDevice],
  data() {
    return {
      title: '',
      width: 1280,
      visible: false,
      disableSubmit: false,
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      form: {
        code: '',
        type: undefined
      },
      rules: {
        code: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
        type: [{ required: true, message: '请选择入库仓库', trigger: 'change' }]
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
          title: '耗材包名称',
          align: 'center',
          dataIndex: 'planName'
        },
        {
          title: '所属产品',
          align: 'center',
          dataIndex: 'productRecognition_dictText'
        },
        {
          title: '耗材包状态',
          align: 'center',
          dataIndex: 'state'
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
        }
      ],
      superFieldList: [],
      url: {
        list: '/mission/customMaterialPlan/list',
        delete: '/mission/materialManagement/delete',
        deleteBatch: '/mission/materialManagement/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/exportXls',
        importExcelUrl: 'mission/materialManagement/importExcel'
      },
      productInfoList: [],
    }
  },
  created() {
    this.getSuperFieldList()
  },
  methods: {
    resetQuery() {
      this.cleanData()
      this.loadData()
    },
    show() {
      this.visible = true
    },
    handleCancel() {
      console.log(`取消`)
      this.visible = false
      this.resetQuery()
    },
    handleOk() {
      this.$emit('ok', this.selectionRows)
      this.visible = false
      this.resetQuery()
    },
    cleanData() {
      this.queryParam = {}
      this.selectionRows = []
      this.selectedRowKeys = []
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'materialCode', text: '耗材编码', dictCode: '' })
      fieldList.push({ type: 'string', value: 'materialName', text: '耗材名称', dictCode: '' })
      fieldList.push({ type: 'string', value: 'materialModel', text: '耗材型号', dictCode: '' })
      fieldList.push({ type: 'int', value: 'materialType', text: '耗材类型', dictCode: '' })
      fieldList.push({ type: 'string', value: 'factoryId', text: '供应商', dictCode: 'factory_manage,name,id' })
      fieldList.push({ type: 'string', value: 'remark', text: '备注', dictCode: '' })
      this.superFieldList = fieldList
    },
    handleAddMaterial() {},
    loadProductInfoList() {
      const that = this
      getProductInfoList().then(res => {
        if (res.success) {
          that.productInfoList = res.result.records
          console.log(that.productInfoList)
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  },
  mounted() {
    this.loadData()
    this.loadProductInfoList()
  }
}
</script>

<style lang="less" scoped>
.add-btn {
  margin-bottom: 20px;
}

.search-group {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 25px;
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
      width: 80px;
      flex: 0 0 85px;
    }

    .search-label {
      color: rgba(0, 0, 0, 0.85);
      margin-right: 10px;
      text-align: right;
      min-width: 45px;
    }
  }

  .ant-btn {
    margin-right: 15px;
  }
}
</style>
