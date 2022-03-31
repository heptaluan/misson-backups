<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group">
          <a-col class="group md">
            <a-form-item label="姓名">
              <a-input allowClear v-model="queryParam.caseName" placeholder="请输入姓名"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="身份证号">
              <a-input allowClear v-model="queryParam.caseIdentityNumber" placeholder="请输入身份证号"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="病例编号">
              <a-input allowClear v-model="queryParam.caseBarcode" placeholder="请输入病例编号"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="外部导入编号">
              <a-input allowClear v-model="queryParam.barcodeGenerateId" placeholder="请输入外部导入编号"></a-input>
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
        <div class="btn-group" v-if="record.codeStatus === 0">
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </div>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixinForMount'

export default {
  name: 'CodeControl',
  mixins: [JeecgListMixin, mixinDevice],
  data() {
    return {
      title: '',
      width: 1280,
      disableSubmit: false,
      stockInVisible: false,
      stockOutVisible: false,
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
          title: '姓名',
          align: 'center',
          dataIndex: 'caseName'
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'caseIdentityNumber'
        },
        {
          title: '病例编号',
          align: 'center',
          dataIndex: 'caseBarcode',
          sorter: (a, b) => a.caseBarcode - b.caseBarcode
        },
        {
          title: '编号使用状态',
          align: 'center',
          dataIndex: 'codeStatus',
          customRender: function(t, r, index) {
            if (r.codeStatus === 1) {
              return '已使用'
            } else {
              return '未使用'
            }
          }
        },
        {
          title: '编号类别',
          align: 'center',
          dataIndex: 'barcodeType',
          customRender: function(t, r, index) {
            if (r.barcodeType === 1) {
              return '外部导入'
            } else {
              return '系统生成'
            }
          }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          sorter: (a, b) => a.createTime - b.createTime
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
        list: `mission/codeManagement/caseBarcode/list`,
        delete: 'mission/codeManagement/caseBarcode/delete'
      }
    }
  },
  methods: {
    resetQuery() {
      this.queryParam = {}
      this.sellValue = null
      this.loadData()
    }
  }
}
</script>
