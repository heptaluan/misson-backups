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
    <j-form-container :disabled="true">
      <div class="clinical-info">
        <div class="clinical-info-form b-flex-3">
          <a-form-model :model="form" ref="ruleForm">
            <div class="order-content">
              <a-form-model-item label="目前临床诊断结果" style="display:flex;" prop="diagnosisResult">
                <div style="margin-left:10px;">
                  <a-checkbox-group v-model="form.diagnosisResult">
                    <a-checkbox value="1">肺部结节</a-checkbox>
                    <a-checkbox value="2">肺癌</a-checkbox>
                    <a-checkbox value="3">
                      <span class="other">其他</span>
                    </a-checkbox>
                  </a-checkbox-group>
                </div>
              </a-form-model-item>
              <a-form-model-item v-if="showOtherOne" prop="diagnosisOthers">
                <a-input v-model="form.diagnosisOthers" placeholder="请输入其他内容" />
              </a-form-model-item>
            </div>

            <div class="order-content">
              <a-form-model-item label="诊断时间" prop="medicalTime" style="display:flex;">
                <a-date-picker
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                  v-model="form.medicalTime"
                  placeholder="请输入诊断时间"
                  show-time
                />
              </a-form-model-item>
            </div>

            <div class="order-content">
              <a-form-model-item label="既往病史">
                <a-checkbox v-for="(item, key) in checkboxList" :checked="item.checked" :key="key" :value="item.value">
                  {{ item.name }}
                </a-checkbox>
                <a-form-model-item
                  v-if="showOtherTwo"
                  prop="medicalHistoryOther"
                  style="display: inline-block;margin-bottom: 0;margin-top: -8px;"
                >
                  <a-input v-model="form.medicalHistoryOther" placeholder="请输入其他内容" />
                </a-form-model-item>
              </a-form-model-item>
            </div>

            <div class="order-content">
              <a-form-model-item label="吸烟史" style="display:flex;" prop="smokingHistory">
                <div style="margin-left:10px;">
                  <a-radio-group v-model="form.smokingHistory">
                    <a-radio value="1">无</a-radio>
                    <a-radio value="2">30包/年或以上吸烟史；有吸烟史，而戒烟时间短于15年</a-radio>
                    <a-radio value="3">20包/年或以上吸烟史</a-radio>
                    <a-radio value="4">20包/年以下吸烟史</a-radio>
                  </a-radio-group>
                </div>
              </a-form-model-item>
            </div>

            <div class="order-content">
              <a-form-model-item label="家族肿瘤史" prop="famiTumorHistory" style="display:flex;">
                <div style="margin-left:10px;">
                  <a-radio-group v-model="form.famiTumorHistory">
                    <a-radio value="1">无</a-radio>
                    <a-radio value="2">有</a-radio>
                  </a-radio-group>
                  <a-form-model-item v-if="showOtherThree" prop="dText" style="display: inline-block;margin-bottom: 0;">
                    <a-input v-model="form.famiTumorHave" placeholder="请输入家族肿瘤史" />
                  </a-form-model-item>
                </div>
              </a-form-model-item>
            </div>

            <div class="order-content">
              <a-form-model-item label="近一周内药物治疗（如抗生素、疫苗、肿瘤相关药物）" prop="weekCure">
                <a-radio-group v-model="form.weekCure">
                  <a-radio value="1">无</a-radio>
                  <a-radio value="2">有</a-radio>
                </a-radio-group>
                <a-form-model-item
                  v-if="showOtherFour"
                  prop="weekCureContent"
                  style="display: inline-block;margin-right:15px;"
                >
                  <span style="margin-right:10px;">药物名称</span>
                  <a-input v-model="form.weekCureContent" placeholder="请输入药物名称" />
                </a-form-model-item>
                <a-form-model-item v-if="showOtherFour" prop="weekCureTime" style="display: inline-block;">
                  <span style="margin-right:10px;">服用时间（最近一次）</span>
                  <a-date-picker
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    v-model="form.weekCureTime"
                    placeholder="请选择服用时间"
                    show-time
                  />
                </a-form-model-item>
              </a-form-model-item>
            </div>

            <div class="order-content">
              <a-form-model-item label="近一周输血史" prop="weekBlood">
                <a-radio-group v-model="form.weekBlood">
                  <a-radio value="1">无</a-radio>
                  <a-radio value="2">有</a-radio>
                </a-radio-group>
                <a-form-model-item v-if="showOtherFive" prop="weekBloodTime" style="display: inline-block;">
                  <span style="margin-left:15px;">输血时间（最近一次）</span>
                  <a-date-picker
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    v-model="form.weekBloodTime"
                    placeholder="请选择输血时间"
                    show-time
                  />
                </a-form-model-item>
              </a-form-model-item>
            </div>
          </a-form-model>
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
            <a @click="handleView(record)" class="margin-right-sm">查看</a>
          </span>
        </a-table>
      </div>
    </j-form-container>
  </j-modal>
</template>

<script>
import { getOrderStepInfo, createOrderClinicalInfo, filishOrder, createOrderInstance } from 'src/api/order/index'

export default {
  name: 'ShowClinicalModal',
  data() {
    return {
      title: '病例临床信息',
      width: 1200,
      visible: false,
      disableSubmit: false,
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      form: {},
      loading: false,
      timer: 0,
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
          title: '文件名称',
          align: 'center',
          dataIndex: 'fileName'
        },
        {
          title: '文件类型',
          align: 'center',
          dataIndex: 'fileType'
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
      showOtherOne: false,
      showOtherTwo: false,
      showOtherThree: false,
      showOtherFour: false,
      showOtherFive: false,
      checkboxList: [
        {
          value: 0,
          name: '无',
          checked: false
        },
        {
          value: 1,
          name: '肺炎',
          checked: false
        },
        {
          value: 2,
          name: '肺部结核',
          checked: false
        },
        {
          value: 3,
          name: '肺部结节',
          checked: false
        },
        {
          value: 4,
          name: '肝炎',
          checked: false
        },
        {
          value: 5,
          name: '肠道炎症/息肉/腺瘤',
          checked: false
        },
        {
          value: 6,
          name: '慢性胃炎',
          checked: false
        },

        {
          value: 7,
          name: '甲状腺结节',
          checked: false
        },
        {
          value: 8,
          name: '乳腺结节',
          checked: false
        },
        {
          value: 9,
          name: '其他',
          checked: false
        }
      ],
      medicalHistory: [],
      dataSource: []
    }
  },
  methods: {
    show() {
      this.visible = true
      this.$nextTick(() => {
        this.initForm()
      }, 300)
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
      const params = {
        orderId: this.$route.params.id,
        step: 2
      }
      getOrderStepInfo(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          if (res.result.length === 0) return

          that.form = res.result

          that.form.diagnosisResult = res.result.diagnosisResult ? res.result.diagnosisResult.split(',') : null
          that.form.smokingHistory = res.result.smokingHistory ? res.result.smokingHistory.toString() : null
          that.form.weekCure = res.result.weekCure ? res.result.weekCure.toString() : null
          that.form.weekBlood = res.result.weekBlood ? res.result.weekBlood.toString() : null

          const medicalHistory = res.result.medicalHistory ? res.result.medicalHistory.split(',') : []
          for (let i = 0; i < medicalHistory.length; i++) {
            that.checkboxList[medicalHistory[i]].checked = true
          }

          if (that.form.diagnosisResult && that.form.diagnosisResult.find(item => item === '3')) {
            that.showOtherOne = true
          }

          if (medicalHistory.find(item => item === '9')) {
            that.showOtherTwo = true
          }

          if (that.form.famiTumorHistory === '2') {
            that.showOtherThree = true
          }

          if (that.form.weekCure === '2') {
            that.showOtherFour = true
          }

          if (that.form.weekBlood === '2') {
            that.showOtherFive = true
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.order-title {
  margin-bottom: 30px;
}

.order-content {
  margin-bottom: 10px;
  display: flex;

  .ant-form-item {
    margin-bottom: 5px;
  }

  .ant-checkbox-wrapper {
    margin-left: 0;
    margin-right: 15px;
    margin-bottom: 10px;
  }

  .ant-input {
    width: 200px;
  }

  .ant-radio-wrapper {
    margin-bottom: 10px;
  }

  .other {
    display: inline-block;
    margin-right: 15px;

    .ant-input {
      margin-left: 15px;
    }
  }

  .ant-calendar-picker {
    margin-left: 10px;
  }
}

.btn-group {
  margin-top: 40px;
  text-align: right;
}
</style>
