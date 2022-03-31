<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter='24' class='search-group'>
          <a-col class='group'>
            <a-form-item label='医院名称'>
              <a-input allowClear v-model='queryParam.departName' placeholder='请输入医院名称'></a-input>
            </a-form-item>
          </a-col>
          <a-col class='group'>
            <a-form-item label='联系电话'>
              <a-input allowClear v-model='queryParam.mobile' placeholder='请输入联系电话'></a-input>
            </a-form-item>
          </a-col>
          <!--          <a-col class='group md'>-->
          <!--            <a-form-item label='渠道商' prop='agencyId'>-->
          <!--              <a-select v-model='queryParam.relateAccess' placeholder='请选择渠道商'-->
          <!--                        show-search-->
          <!--                        :value='channelValue'-->
          <!--                        :default-active-first-option='false'-->
          <!--                        :filter-option='false'-->
          <!--                        :not-found-content='null'-->
          <!--                        @search='handleChannelSearch'-->
          <!--                        @change='handleChannelChange'>-->
          <!--                <a-select-option v-for='item in distributorList' :key='item.id' :value='item.departNameAbbr'>-->
          <!--                  {{ item.departName }}-->
          <!--                </a-select-option>-->
          <!--              </a-select>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <a-col class="group oneLine"></a-col>
          <a-col class="group">
            <a-form-item label="地区">
              <a-radio-group v-model="queryParam.regionProvince">
                <a-radio-button :value="item.code" v-for="item in regionOptions" :key="item.code">
                  {{ item.name }}
                </a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col class="group btn">
            <a-button @click="searchQuery" type="primary">搜索</a-button>
            <a-button @click="resetQuery">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleShowDistributorModal" type="primary" icon="plus">创建医院</a-button>
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
          <a @click="handleShowDistributorModal(record, false)">查看详情</a>
          <a @click="handleShowDistributorModal(record, true)">编辑</a>

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

<!--    <AddHospitalModal ref="modalForm" :regionData='originalRegion' @ok="modalFormOk" />-->
    <AddHospitalModal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { selectorFilterMixin } from '@/mixins/selectorFilterMixin'
// import { commonFunctionsMixin } from '@/mixins/commonFunctionsMixin'
import AddHospitalModal from './modules/AddHospitalModal'
import { getRegionWithDepartment } from '@/api/api'

export default {
  name: 'HospitalList',
  mixins: [JeecgListMixin, mixinDevice, selectorFilterMixin],
  components: {
    AddHospitalModal
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
          title: '医院名称',
          align: 'center',
          dataIndex: 'departName'
        },
        {
          title: '医院简称',
          align: 'center',
          dataIndex: 'departNameAbbr'
        },
        // {
        //   title: '渠道商',
        //   align: 'center',
        //   dataIndex: 'relateAccess_dictText'
        // },
        // {
        //   title: '科室',
        //   align: 'center',
        //   dataIndex: 'department'
        // },
        // {
        //   title: '联系医生',
        //   align: 'center',
        //   dataIndex: 'contactDoctor'
        // },
        {
          title: '联系电话',
          align: 'center',
          dataIndex: 'mobile'
        },
        {
          title: '地区',
          align: 'center',
          dataIndex: 'zone',
          customRender: function(t, r, index) {
            return r.regionProvince_dictText + '/' + r.regionCity_dictText + '/' + r.regionCode_dictText
          }
        },
        {
          title: '详细地址',
          align: 'center',
          dataIndex: 'address'
        },
        {
          title: '统一信用代码',
          align: 'center',
          dataIndex: 'socialCode'
        },
        {
          title: '关联渠道商',
          align: 'center',
          dataIndex: 'chargeUsers_dictText'
        },
        // {
        //   title: '地址',
        //   align: 'center',
        //   dataIndex: 'provinceCode',
        //   customRender: function(t, r, index) {
        //     let address = ''
        //     if (t.districtCode) {
        //       address = r.provinceCode + '-' + r.cityCode + '-' + r.districtCode
        //     } else {
        //       address = r.provinceCode + '-' + r.cityCode
        //     }
        //     return address
        //   }
        // },
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
        list: 'mission/businessAccess/hospitalList'
      },
      dictOptions: {},
      superFieldList: [],
      distributorList: [],
      channelValue: undefined,
      queryParam: {
        orgCategory: 4000
      },
      // data: [],
      value: undefined,
      regionOptions: null
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
      this.queryParam = { orgCategory: 4000 }
      this.loadData()
    },
    handleShowDistributorModal(record, isEdit) {
      this.$refs.modalForm.edit(record, isEdit)
      if (!record.id) {
        this.$refs.modalForm.title = '新增'
      }
    },
    loadRelatedRegion() {
      const regionOfHospital = { dpCatalog: 4000, level: 1 }
      getRegionWithDepartment(regionOfHospital).then(res => {
        this.regionOptions = res.result
      })
    },
    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadData()
      //清空列表选中
      this.onClearSelected()
      this.loadRelatedRegion()
    }
  },
  mounted() {
    this.loadDistributorList()
    this.loadRelatedRegion()
    // this.initRegion()
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

    /deep/ .ant-form-item-control {
      height: auto;

      .ant-radio-button-wrapper {
        margin: 0 8px 8px 0;
        border-radius: 4px !important;
        border-left: 1px solid #d9d9d9;

        &::before {
          display: none !important;
        }
      }
    }
  }

  .ant-btn {
    margin-right: 15px;
  }
}
</style>
