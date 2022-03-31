<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="rules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="结节数量总和" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <span>{{ model.countAll }}</span>
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item label="已选择的病人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <span>{{ model.names }}</span>
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item label="请选择医生" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="doctors">
              <a-select mode="tags" allowClear v-model="model.doctors" placeholder="请选择医生">
                <a-select-option v-for="item in doctorList" :key="item.id" :value="item.username">
                  {{ item.realname }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item label="影像包名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taskName">
              <a-input v-model="model.taskName" placeholder="请输入影像包名称" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="预计完成时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="finishTime">
              <a-date-picker
                style="width: 100%"
                placeholder="请选择预计完成时间"
                v-model="model.finishTime"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                :disabled-date="disabledDate"
                showTime
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import { addDoctorTask } from 'src/api/viewport/index'
import moment from 'moment'
import { getDoctorList } from 'src/api/viewport/index'

export default {
  name: 'ViewportReviewForm',
  components: {},
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      rules: {
        taskName: [{ required: true, message: '请输入影像包名称', trigger: 'blur' }],
        finishTime: [{ required: true, message: '请选择预计完成时间', trigger: 'change' }],
        doctors: [{ required: true, message: '请选择医生', trigger: 'change' }],
      },
      doctorList: [],
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    }
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    add() {
      this.edit(this.modelDefault)
    },
    edit(record) {
      record.taskName = moment().format('YYYY-MM-DD HH:mm:ss') + `(${record.length}人）`
      record.finishTime = moment()
        .add(48, 'hours')
        .format('YYYY-MM-DD HH:mm:ss')
      this.model = Object.assign({}, record)
      this.visible = true
    },
    submitForm() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          this.model.doctors = this.model.doctors.join(',')
          that.confirmLoading = true
          addDoctorTask(this.model)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
                that.model.doctors = undefined
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day')
    },
    getDoctorList() {
      getDoctorList({
        role: 'doctor_test'
      }).then(res => {
        if (res.code === 200) {
          this.doctorList = res.result
        }
      })
    },
  },
  mounted() {
    this.getDoctorList()
  }
}
</script>
