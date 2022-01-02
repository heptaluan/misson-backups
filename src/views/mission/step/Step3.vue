<template>
  <div>
    <a-form-model
      style="max-width: 1080px; margin: 40px auto 0;"
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="开始时间/start time" prop="startTime">
        <a-date-picker
          class="time-select"
          v-model="form.startTime"
          :disabled-date="disabledStartDate"
          show-time
          format="YYYY-MM-DD"
          placeholder="开始时间"
          @openChange="handleStartOpenChange"
          valueFormat
        />
      </a-form-model-item>
      <a-form-model-item label="结束时间/expect end date" prop="endTime">
        <a-date-picker
          class="time-select"
          v-model="form.endTime"
          :disabled-date="disabledEndDate"
          show-time
          format="YYYY-MM-DD"
          placeholder="结束时间"
          :open="endOpen"
          @openChange="handleEndOpenChange"
          valueFormat
        />
      </a-form-model-item>
      <a-form-model-item label="周期">
        <a-input class="time-total" placeholder="项目周期" readOnly :value="time" />
      </a-form-model-item>

      <a-form-item :wrapperCol="{ span: 12, offset: 5 }">
        <div class="btn-group">
          <a-button @click="save">保存</a-button>
          <a-button type="primary" class="prev-btn" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </div>
      </a-form-item>
    </a-form-model>
  </div>
</template>

<script>
import { putProjectStep, queryById } from 'src/api/mission/project'
import moment from 'moment'

export default {
  name: 'Step3',
  data() {
    return {
      labelCol: { span: 9 },
      wrapperCol: { span: 11 },
      time: '',
      form: {
        startTime: '',
        endTime: ''
      },
      rules: {
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
      },
      endOpen: false
    }
  },
  methods: {
    prevStep() {
      this.$emit('prevStep')
    },
    nextStep() {
      const cb = ()=> this.$emit('nextStep')
      this.save(cb)
    },
    save(cb) {
      const that = this
      const step = 'Schedule'
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const postData = {
            preEndDate: this.form.endTime,
            startDate: this.form.startTime,
            cycleTime: this.time,
            id: this.projectId
          }
          putProjectStep(step, postData)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
                if (typeof cb === 'function') cb()
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    disabledStartDate(startValue) {
      const endValue = this.form.endTime
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.form.startTime
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
      if (this.form.endTime) {
        const time = this.form.endTime.diff(this.form.startTime, 'day')
        this.time = (time === 0 ? 1 : time) + '天'
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
      if (this.form.startTime) {
        const time = this.form.endTime.diff(this.form.startTime, 'day')
        this.time = (time === 0 ? 1 : time) + '天'
      }
    },
    loadData() {
      const that = this
      queryById({
        id: this.projectId
      }).then(res => {
        if (res.success) {
          if (res.result.startDate) {
            this.form.startTime = moment(res.result.startDate)
          }
          if (res.result.preEndDate) {
            this.form.endTime = moment(res.result.preEndDate)
          }
          this.time = res.result.cycleTime
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    getParams(key) {
      const search = window.location.search.substring(1)
      const vars = search.split('&')
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=')
        if (pair[0] === key) {
          return pair[1]
        }
      }
      return false
    }
  },
  mounted() {
    this.projectId = this.getParams('id')
    this.loadData()
  }
}
</script>

<style lang="less" scoped>
.time-select,
.time-total {
  width: 280px;
}

.btn-group {
  text-align: right;

  .prev-btn {
    margin: 0 15px;
  }
}
</style>
