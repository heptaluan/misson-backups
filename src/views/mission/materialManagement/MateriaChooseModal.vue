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
            <a-col class="group" :labelCol="{ span: 6 }">
              <a-form-item label="耗材编码">
                <a-input v-model="queryParam.materialCode" placeholder="请输入耗材编码"></a-input>
              </a-form-item>
            </a-col>
            <a-col class="group" :labelCol="{ span: 6 }">
              <a-form-item label="耗材名称">
                <a-input v-model="queryParam.materialName" placeholder="请输入耗材名称"></a-input>
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
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, onSelect: onSelect }"
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
        </a-table>
      </div>
    </j-modal>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import { fitProduct } from '../../../api/product/index'

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
          title: '耗材编码',
          align: 'center',
          dataIndex: 'materialCode'
        },
        {
          title: '耗材名称',
          align: 'center',
          dataIndex: 'materialName'
        },
        {
          title: '样本类型',
          align: 'center',
          dataIndex: 'sampleType_dictText'
        }
      ],
      superFieldList: [],
      url: {
        list: ''
      },
      type: '',
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    show(type) {
      this.type = type
      this.loadMaterialList(type)
      this.visible = true
      this.selectedRowKeys = []
      this.selectedRows = []
      this.ipagination.current = 1
    },
    handleCancel() {
      console.log(`取消`)
      this.visible = false
      this.ipagination.current = 1
      this.queryParam = {}
    },
    handleOk() {
      this.$emit('ok', this.selectedRows)
      this.visible = false
    },
    handleAddMaterial() {},
    resetQuery() {
      this.queryParam.materialCode = ''
      this.queryParam.materialName = ''
      this.loadMaterialList(this.type || '')
    },
    loadMaterialList(type) {
      const that = this
      const params = this.getQueryParams(true)
      const product = {
        product: [type],
        page: that.ipagination.current,
        size: that.ipagination.pageSize,
        materialCode: params.materialCode || '',
        materialName: params.materialName || ''
      }
      fitProduct(product).then(res => {
        this.ipagination.total = res.result.total
        if (res.success) {
          that.dataSource = res.result.records
        } else {
          that.dataSource = []
          that.$message.warning(res.message)
        }
      })
    },
    handleTableChange(pagination) {
      this.ipagination = pagination
      this.loadMaterialList(this.type)
    },
    loadData() {},
    searchQuery() {
      this.ipagination.current = 1
      this.loadMaterialList(this.type)
    },
    onSelect(record, selected, selectedRows) {
      if (selected) {
        this.selectedRows.push(record)
      }

      if (!selected) {
        let delIndex = this.selectedRows.findIndex(val => {
          return val.id === record.id
        })
        this.selectedRows.splice(delIndex, 1)
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    }
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
