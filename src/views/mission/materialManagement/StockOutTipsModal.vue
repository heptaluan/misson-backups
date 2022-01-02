<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    okText="导出excel"
    cancelText="关闭"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      style="max-width: 1080px; margin: 40px auto 0;"
      ref="ruleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :model="form"
      :rules="rules"
    >

        <div class="title">本次生成编号列表</div>
        <ul>
          <li>xxxx</li>
          <li>xxxx</li>
          <li>xxxx</li>
          <li>xxxx</li>
        </ul>
      
    </a-form-model>
  </j-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'

export default {
  name: 'StockOutTipsModal',
  mixins: [JeecgListMixin, mixinDevice],
  data() {
    return {
      title: '',
      width: 800,
      visible: false,
      disableSubmit: false,
      labelCol: { span: 2 },
      wrapperCol: { span: 10 },
      form: {
        
      },
      rules: {
     
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
          title: '耗材序号',
          align: 'center',
          dataIndex: 'materialCode'
        },
        {
          title: '耗材名称',
          align: 'center',
          dataIndex: 'materialName'
        },
        {
          title: '耗材数量',
          align: 'center',
          dataIndex: 'materialTotal'
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
    show() {
      this.visible = true
    },
    handleCancel() {
      console.log(`关闭`)
      this.visible = false
    },
    handleOk() {
      console.log(`导出excel`)
      this.visible = false
    }
  }
}
</script>
