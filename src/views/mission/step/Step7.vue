<template>
  <div>
    <a-form-model
      style="max-width: 1080px; margin: 40px auto 0;"
      ref="ruleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <!-- 上方表格 -->
      <SuppliesPlan />

      <!-- 下方表格 -->
      <SuppliesPlanEach />

      <!-- 完成按钮 -->
      <a-form-item :wrapperCol="{ span: 24 }">
        <div class="btn-group">
          <a-button class="save-btn" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="finish">完成</a-button>
        </div>
      </a-form-item>
    </a-form-model>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'

import SuppliesPlan from '../modules/project/SuppliesPlan'
import SuppliesPlanEach from '../modules/project/SuppliesPlanEach'

export default {
  name: 'Step7',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    SuppliesPlan,
    SuppliesPlanEach
  },
  data() {
    return {
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
          title: '耗材编号',
          align: 'center',
          dataIndex: 'materialCode'
        },
        {
          title: '耗材名称',
          align: 'center',
          dataIndex: 'materialName'
        },
        {
          title: '耗材总需求量',
          align: 'center',
          dataIndex: 'materialTotalDemand'
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
        list: '/mission/materialManagement/list',
        delete: '/mission/materialManagement/delete',
        deleteBatch: '/mission/materialManagement/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/exportXls',
        importExcelUrl: 'mission/materialManagement/importExcel'
      }
    }
  },
  methods: {
    finish() {
      this.$emit('finish')
    },
    save() {
      console.log(`save`)
    },
    prevStep() {
      this.$emit('prevStep')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-group {
  margin-top: 20px;
  text-align: right;

  .save-btn {
    margin-right: 15px;
  }
}

.table-operator {
  margin-top: 20px;
}
</style>
