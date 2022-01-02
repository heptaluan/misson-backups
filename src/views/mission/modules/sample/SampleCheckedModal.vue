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
    <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="样本类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sampleType">
        <j-dict-select-tag
          type="list"
          v-model="record.sampleType"
          dictCode="sample_type"
          placeholder="请选择样本类型"
        />
      </a-form-model-item>
      <a-form-model-item ref="code" label="性质" prop="researchType">
        <j-dict-select-tag
          type="list"
          v-model="record.researchType"
          dictCode="research_type"
          placeholder="请选择样本性质"
        />
      </a-form-model-item>
      <a-form-model-item ref="code" label="冰箱" prop="refrigeratorId">
        <j-dict-select-tag
          type="list"
          v-model="record.refrigeratorId"
          dictCode="refrigerator_management, rf_name, id"
          placeholder="请选择冰箱"
        />
      </a-form-model-item>
      <a-form-model-item ref="code" label="层数" prop="floor">
        <a-input-number :min="1" :max="10" placeholder="请输入层数" v-model="record.floor" />
      </a-form-model-item>
      <a-form-model-item ref="code" label="格子编号" prop="grid">
        <a-input-number :min="1" :max="6" placeholder="请输入格子编号" v-model="record.grid" />
      </a-form-model-item>
      <a-form-model-item ref="code" label="抽屉编号" prop="drawer">
        <a-input-number :min="1" :max="5" placeholder="请输入抽屉编号" v-model="record.drawer" />
      </a-form-model-item>
      <a-form-model-item ref="code" label="盒子编号" prop="box">
        <a-input-number :min="1" :max="5" placeholder="请输入盒子编号" v-model="record.box" />
      </a-form-model-item>
      <a-form-model-item ref="code" label="行数" prop="row">
        <a-input-number :min="1" :max="10" placeholder="请输入行数" v-model="record.row" />
      </a-form-model-item>
      <a-form-model-item ref="code" label="列数" prop="col">
        <a-input-number :min="1" :max="10" placeholder="请输入列数" v-model="record.col" />
      </a-form-model-item>
    </a-form-model>
  </j-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import { putCaseSampleEdit } from 'src/api/mission/project'

export default {
  name: 'SampleCheckedModal',
  mixins: [JeecgListMixin, mixinDevice],
  data() {
    return {
      title: '样本检查',
      width: 800,
      visible: false,
      disableSubmit: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      record: {},
      form: {
        sampleType: undefined,
        researchType: undefined,
        refrigeratorId: undefined
      },
      rules: {
        sampleType: [{ required: true, message: '请选择样本类型', trigger: 'change' }],
        researchType: [{ required: true, message: '请选择性质', trigger: 'change' }],
        refrigeratorId: [{ required: true, message: '请选择冰箱', trigger: 'change' }]
      },
      // 表头
      columns: [],
      url: {
        list: '/mission/materialManagement/list'
      }
    }
  },
  methods: {
    show(record) {
      console.log(record)
      this.record = record
      this.visible = true
      this.form = record
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      const that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          putCaseSampleEdit(that.form)
            .then(res => {
              console.log(res)
              if (res.success) {
                that.$message.success('更新成功！')
                that.$emit('ok')
                that.visible = false
              } else {
                that.$message.error(res.message)
              }
            })
            .catch(e => {
              that.$message.error('更新失败，请重新尝试！')
            })
        }
      })
    }
  }
}
</script>
