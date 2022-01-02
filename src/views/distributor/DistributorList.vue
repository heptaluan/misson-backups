<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group">
          <a-col class="group">
            <a-form-item label="渠道商名称">
              <a-input allowClear v-model="queryParam.accessName" placeholder="请输入渠道商名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group">
            <a-form-item label="联系人电话">
              <a-input allowClear v-model="queryParam.contactPhone" placeholder="请输入联系人电话"></a-input>
            </a-form-item>
          </a-col>
<!--          <div class="group">-->
<!--            <a-form-model-item label="地区" prop="address">-->
<!--              <a-cascader :options="options" placeholder="请选择地区" v-model="queryParam.provinceCode" />-->
<!--            </a-form-model-item>-->
<!--          </div>-->
          <!-- <div class="group">
            <div class="title">销售：</div>
            <a-select
              style="width:200px;"
              show-search
              :value="value"
              placeholder="请输入姓名进行检索"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="handleSearch"
              @change="handleChange"
              v-model="queryParam.sellUser"
            >
              <a-select-option v-for="item in data" :key="item.id" :value="item.id">
                {{ item.realname }}
              </a-select-option>
            </a-select>
          </div> -->
          <a-col class="group btn">
            <a-button @click="searchQuery" type="primary">搜索</a-button>
            <a-button @click="resetQuery">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleShowDistributorModal" type="primary" icon="plus" v-has="'channelCreate'">创建渠道商</a-button>
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
          <a @click="handleShowDistributorModal(record)">查看详情</a>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)" v-has="'channelCreate'">
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
    </div>

    <AddDistributorModal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AddDistributorModal from './modules/AddDistributorModal'
import { queryRoleUsers } from '../../api/material/index'
import options from '../../../src/mixins/cities'

function fetch(value, callback) {
  let timeout
  let currentValue

  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value

  function fake() {
    queryRoleUsers({
      role: 'sell_user',
      name: value
    }).then(res => {
      if (res.success) {
        if (currentValue === value) {
          const result = res.result
          const data = []
          result.forEach(r => {
            data.push({
              key: r.id,
              realname: r.username,
              id: r.id
            })
          })
          callback(data)
        }
      } else {
        console.log(res.message)
      }
    })
  }

  timeout = setTimeout(fake, 300)
}

export default {
  name: 'DistributorList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    AddDistributorModal
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
          title: '渠道商名称',
          align: 'center',
          dataIndex: 'accessName'
        },
        {
          title: '缩写',
          align: 'center',
          dataIndex: 'shortName'
        },
        {
          title: '渠道商联系人',
          align: 'center',
          dataIndex: 'contactName'
        },
        {
          title: '联系人电话',
          align: 'center',
          dataIndex: 'contactPhone'
        },
        {
          title: '地址',
          align: 'center',
          dataIndex: 'provinceCode',
          customRender: function(t, r, index) {
            let address = ''
            if (t.districtCode) {
              address = r.provinceCode + '-' + r.cityCode + '-' + r.districtCode
            } else {
              address = r.provinceCode + '-' + r.cityCode
            }
            return address
          }
        },
        {
          title: '关联销售',
          align: 'center',
          dataIndex: 'sellUser_dictText'
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
        list: 'mission/businessAccess/list',
        delete: 'mission/businessAccess/delete'
      },
      dictOptions: {},
      superFieldList: [],
      queryParam: {},
      data: [],
      value: undefined,
      options: options
    }
  },
  created() {
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    initDictConfig() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'model', text: '型号', dictCode: '' })
      fieldList.push({ type: 'int', value: 'deviceType', text: '设备类型', dictCode: '' })
      this.superFieldList = fieldList
    },
    resetQuery() {
      this.queryParam = {}
      this.loadData()
    },
    handleShowDistributorModal(record) {
      this.$refs.modalForm.edit(record)
      if (!record.id) {
        this.$refs.modalForm.title = '新增'
      }
    },
    handleSearch(value) {
      fetch(value, data => (this.data = data))
    },
    handleChange(value) {
      console.log(value)
      this.value = value
      fetch(value, data => (this.data = data))
    }
  }
}
</script>
<style lang="less" scoped>
.search-group {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  margin-right: 0 !important;
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
