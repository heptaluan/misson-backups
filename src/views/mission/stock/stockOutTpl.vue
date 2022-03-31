<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group">
          <a-col class="group">
            <a-form-item label="耗材包名称" :labelCol="{ span: 4 }">
              <a-input allowClear v-model="queryParam.planName" placeholder="请输入耗材包名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group tiny">
            <a-form-item label="产品" :labelCol="{ span: 4 }">
              <a-select style="width:200px;" v-model="queryParam.productRecognition" placeholder="请选择产品">
                <a-select-option
                  v-for="item in productInfoList"
                  :key="item.productRecognition"
                  :value="item.productRecognition"
                >
                  {{ item.productName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group">
            <a-form-item label="状态" :labelCol="{ span: 4 }">
              <a-select style="width:200px;" allowClear v-model="queryParam.state" placeholder="请选择产品状态">
                <a-select-option v-for="item in productStatus" :key="item.key" :value="item.key">
                  {{ item.value }}
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
    <!-- 查询区域-END -->

    <!-- 高级查询区域 -->
    <div class="table-operator" style="margin-bottom:20px;">
      <a-button @click="handleTplAdd" type="primary" icon="plus" v-has="'stockTplAdd'">添加耗材包</a-button>
      <!-- <j-super-query
        :fieldList="superFieldList"
        ref="superQueryModal"
        v-if="false"
        @handleSuperQuery="handleSuperQuery"
      ></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0" v-has="'stockTplAdd'">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown> -->
    </div>

    <!-- table区域-begin -->
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
      <template slot="state" slot-scope="text, record">
        <div v-for="item in productStatus" :key="item.key">
          <div v-if="record.state === item.key">
            {{ item.value }}
          </div>
        </div>
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

      <span
        slot="action"
        slot-scope="text, record"
        style="display: flex;align-items: center;justify-content: space-evenly;"
      >
        <a @click="handleTplAdd(record)">编辑</a>
        <a-popconfirm title="确定删除吗?" @confirm="() => handleTplDelete(record.id)">
          <a>删除</a>
        </a-popconfirm>
        <!-- <a-divider type="vertical" />
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
        </a-dropdown> -->
      </span>
    </a-table>
    <StockOutTplModal ref="stockOutTplModal" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import StockOutTplModal from 'src/views/mission/materialManagement/StockOutTplModal'
import { delMaterialPlan } from '../../../api/material/index'
import { getProductInfoList } from '../../../api/product/index'

export default {
  name: 'stock-out-template',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    StockOutTplModal
  },
  data() {
    return {
      title: '',
      labelCol: { span: 3 },
      wrapperCol: { span: 9 },
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
          title: '关联产品',
          align: 'center',
          dataIndex: 'productRecognition_dictText'
        },
        {
          title: '耗材包状态',
          align: 'center',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '耗材包库存',
          align: 'center',
          dataIndex: 'currentAmount'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '修改时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '修改人',
          align: 'center',
          dataIndex: 'updateBy'
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'remark'
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
        list: 'mission/customMaterialPlan/list',
        delete: 'mission/medicalCase/delete'
      },
      dictOptions: {},
      superFieldList: [],
      productInfoList: [],
      productStatus: [
        { key: 0, value: '停用' },
        { key: 1, value: '启用' }
      ]
    }
  },
  methods: {
    resetQuery() {
      this.queryParam = {}
      this.loadData()
    },
    handleTplAdd(record) {
      this.$refs.stockOutTplModal.show(record)
      this.$refs.stockOutTplModal.title = '新增出库耗材包'
    },
    handleTplDelete(id) {
      const data = {
        id: id
      }
      delMaterialPlan(data).then(res => {
        if (res.success) {
          this.$message.success(res.result)
          this.loadData()
        } else {
          this.$message.error(res.message)
        }
      })
    },
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
    this.loadProductInfoList()
  }
}
</script>
