<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model ref="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <div class="info-content">
        <span>订单号：{{ baseInfo.orderId }}</span>
        <span>送检医院：{{ baseInfo.sendAgency }}</span>
        <span>送检科室：{{ baseInfo.sendDepartment }}</span>
        <span>送检医生：{{ baseInfo.sendDoctor }}</span>
      </div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{ x: true }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
      >
        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleView(record)" class="margin-right-sm">查看物流详情</a>
        </span>
      </a-table>
    </a-form-model>
  </j-modal>
</template>

<script>
import { mixinDevice } from '@/utils/mixin'
import { getOrderSampleInfo } from 'src/api/order/index'

export default {
  name: 'ShowEMSModal',
  mixins: [mixinDevice],
  data() {
    return {
      title: '查看物流信息',
      width: 1000,
      visible: false,
      disableSubmit: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      record: {},
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
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
          title: '样本名称',
          align: 'center',
          dataIndex: 'sampleType_dictText'
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'amount'
        },
        {
          title: '采集时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '寄送时间',
          align: 'center',
          dataIndex: 'collectTime'
        },
        {
          title: '快递公司',
          align: 'center',
          dataIndex: 'emsCompany_dictText'
        },
        {
          title: '物流单号',
          align: 'center',
          dataIndex: 'emsNumber'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'state',
          customRender: (text, record, index) => {
            if (record.state === 1) {
              return '已寄送'
            } else {
              return '未寄送'
            }
          }
        }
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'center',
        //   fixed: 'right',
        //   width: 147,
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      loading: false,
      dataSource: [],
      url: {
        list: '/mission/materialManagement/list',
        delete: '/mission/materialManagement/delete',
        deleteBatch: '/mission/materialManagement/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/exportXls',
        importExcelUrl: 'mission/materialManagement/importExcel'
      },
      fileList: [],
      file: undefined,
      baseInfo: {}
    }
  },
  methods: {
    show(baseInfo, orderInfo) {
      this.visible = true
      this.initForm()
      this.baseInfo = {
        ...orderInfo
      }
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      this.visible = false
    },
    handleView(record) {
      console.log(record)
    },
    initForm() {
      const that = this
      const id = this.$route.params.id
      getOrderSampleInfo(id).then(res => {
        if (res.code === 200) {
          that.dataSource = res.result
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.info-content {
  margin-bottom: 20px;

  span {
    margin-right: 25px;
  }
}
</style>
