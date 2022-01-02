<template>
  <div>
    <div class="clinical-info b-flex clinical-info" style="margin-top:35px;">
      <div class="clinical-info-form b-flex-3">
        <a-form-model :model="form" ref="ruleForm" :rules="validatorRules">
          <h3 class="order-title">临床信息</h3>
          <div class="order-content">
            <a-form-model-item label="目前临床诊断结果" style="display:flex;" prop="diagnosisResult">
              <div style="margin-left:10px;">
                <a-checkbox-group v-model="form.diagnosisResult">
                  <a-checkbox value="1">肺部结节</a-checkbox>
                  <a-checkbox value="2">肺癌</a-checkbox>
                  <a-checkbox value="3" @change="e => handleOtherChecked(e, '1')">
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
            <a-form-model-item label="既往病史" style="display:flex;" class="medical-history-other">
              <!-- <a-checkbox-group v-model="form.medicalHistory"> -->
              <a-checkbox
                v-for="(item, key) in checkboxList"
                :checked="item.checked"
                :key="key"
                :value="item.value"
                @change="e => onCheckboxListChange(e)"
              >
                {{ item.name }}
              </a-checkbox>
              <a-form-model-item
                v-if="showOtherTwo"
                prop="medicalHistoryOther"
                style="display: inline-block;margin-bottom: 0;"
              >
                <a-input v-model="form.medicalHistoryOther" placeholder="请输入其他内容" />
              </a-form-model-item>
              <!-- </a-checkbox-group> -->
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
                <a-radio-group @change="e => handleOtherChecked(e, '3')" v-model="form.famiTumorHistory">
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
            <a-form-model-item
              label="近一周内药物治疗（如抗生素、疫苗、肿瘤相关药物）"
              prop="weekCure"
              class="week-cure-content"
            >
              <a-radio-group @change="e => handleOtherChecked(e, '4')" v-model="form.weekCure">
                <a-radio value="1">无</a-radio>
                <a-radio value="2">有</a-radio>
              </a-radio-group>
              <a-form-model-item
                v-if="showOtherFour"
                prop="weekCureContent"
                style="display: inline-block;margin-right:25px;"
              >
                <span style="margin-right:10px;">药物名称</span>
                <a-input v-model="form.weekCureContent" placeholder="请输入药物名称" />
              </a-form-model-item>
              <a-form-model-item v-if="showOtherFour" prop="weekCureTime" style="display: inline-block;">
                <span>服用时间（最近一次）</span>
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
            <a-form-model-item label="近一周输血史" prop="weekBlood" style="display:flex;" class="week-blood-time">
              <a-radio-group @change="e => handleOtherChecked(e, '5')" v-model="form.weekBlood">
                <a-radio value="1">无</a-radio>
                <a-radio value="2">有</a-radio>
              </a-radio-group>
              <a-form-model-item v-if="showOtherFive" prop="weekBloodTime" style="display: inline-block;">
                <span>输血时间（最近一次）</span>
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
      <div class="h-divider"></div>
      <div class="clinical-info-form b-flex-2">
        <div class="upload-body">
          <h3>文件上传</h3>
          <div class="upload-btn">
            <a-upload
              name="file"
              :headers="headers"
              :showUploadList="false"
              :before-upload="beforeUpload"
              :customRequest="uploadFile"
            >
              <a-icon type="cloud-upload" />
            </a-upload>
          </div>
        </div>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          class="j-table-force-nowrap"
          :scroll="{ x: true }"
          :columns="columns"
          :dataSource="fileList"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <template slot="htmlSlot" slot-scope="text">
            <div v-html="text"></div>
          </template>

          <span slot="action" slot-scope="text, record" style="display: flex;justify-content: space-evenly;">
            <a @click="handleView(record)">查看</a>
            <a @click="handleDelete(record)">删除</a>
          </span>
        </a-table>
        <div class="image-view">
          <img :src="viewImgaeSrc" v-if="viewImgaeSrc" class="image-view-pic" />
        </div>
        <div class="orc-body">
          <a-textarea placeholder="识别内容" :auto-size="{ minRows: 6, maxRows: 6 }" allowClear></a-textarea>
        </div>
      </div>
    </div>

    <div class="btn-group">
      <a-button type="primary" @click="prevStep" class="margin-right-xs">上一步</a-button>
      <a-button type="primary" @click="save" class="margin-right-xs">保存</a-button>
      <a-button type="primary" @click="finish">完成</a-button>
    </div>
  </div>
</template>

<script>
import { getOrderStepInfo, createOrderClinicalInfo, filishOrder, createOrderInstance } from 'src/api/order/index'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { uploadLogo } from '../../../api/product/index'

export default {
  name: 'clinical-info',
  components: { ATextarea },
  props: {
    order: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data() {
    return {
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      form: {},
      validatorRules: {
        diagnosisResult: [{ required: true, message: '请选择临床诊断结果', trigger: 'change' }],
        diagnosisOthers: [{ required: true, message: '请输入临床诊断结果内容', trigger: 'blur' }],
        medicalTime: [{ required: true, message: '请输入诊断时间', trigger: 'change' }],
        medicalHistory: [{ required: true, message: '请选择既往病史', trigger: 'change' }],
        medicalHistoryOther: [{ required: true, message: '请输入临床诊断结果内容', trigger: 'blur' }],
        smokingHistory: [{ required: true, message: '请选择吸烟史', trigger: 'change' }],
        famiTumorHistory: [{ required: true, message: '请选择直系亲属罹患肿瘤史', trigger: 'change' }],
        famiTumorHave: [{ required: true, message: '请输入家族肿瘤史', trigger: 'blur' }],
        weekCure: [{ required: true, message: '请选择近一周内药物治疗', trigger: 'change' }],
        weekCureContent: [{ required: true, message: '请输入药物名称', trigger: 'blur' }],
        weekCureTime: [{ required: true, message: '请选择服用时间', trigger: 'change' }],
        weekBlood: [{ required: true, message: '请选择近一周输血史', trigger: 'change' }],
        weekBloodTime: [{ required: true, message: '请选择输血时间', trigger: 'change' }]
      },
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
      viewImgaeSrc: '',
      headers: {},
      fileList: [],
      currentFile: undefined,
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
      medicalHistory: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initForm()
    }, 300)
  },
  methods: {
    initForm() {
      const that = this
      if (this.getParams('orderId')) {
        const params = {
          orderId: this.getParams('orderId'),
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
    },
    save(cb) {
      console.log(cb)
      const that = this
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.checkboxList.some(item => item.checked)) {
            this.$message.warning(`请选择既往病史`)
            return
          }
          for (let i = 0; i < this.checkboxList.length; i++) {
            if (this.checkboxList[i].checked) {
              this.medicalHistory.push(this.checkboxList[i].value)
            }
          }
          const postData = {
            ...this.form
          }
          postData.diagnosisResult = postData.diagnosisResult.toString()
          postData.medicalHistory = this.medicalHistory.toString()
          postData.orderId = this.getParams('orderId')
          createOrderClinicalInfo(postData).then(res => {
            if (res.code === 200) {
              that.$message.success('订单信息已保存！')
              if (typeof cb === 'function') cb()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    finish() {
      const that = this
      that.save(
        createOrderInstance(this.getParams('orderId')).then(res => {
          if (res.code === 200) {
            that.$message.success('订单信息已保存！')
            that.$emit('finish')
          } else {
            that.$message.warning(res.message)
          }
        })
      )
    },
    prevStep() {
      this.$emit('prevStep', 2)
    },
    handleTableChange(val) {},
    handleView(record) {
      const that = this
      const reader = new FileReader()
      this.getImageBlob(record.fileUrl, function(blob) {
        reader.readAsDataURL(blob)
      })
      reader.onload = function(e) {
        that.viewImgaeSrc = e.target.result
      }
    },
    handleDelete(record) {},
    beforeUpload(file) {
      const that = this
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('只能上传图片!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片必须小于 2MB!')
      }
      this.currentFile = file
      return isJpgOrPng && isLt2M
    },
    uploadFile() {
      const that = this
      const formData = new FormData()
      formData.append('file', this.currentFile)
      uploadLogo(formData).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.fileList.push({
            fileName: res.result.ownershipType_dictText,
            fileType: res.result.ossKey,
            fileUrl: res.result.fileUrl
          })
        } else {
          that.$message.error(res.message)
        }
      })
    },
    onCheckboxListChange(e) {
      switch (e.target.value) {
        case 0:
          if (e.target.checked) {
            this.checkboxList.map(item => (item.checked = false))
            this.checkboxList[0].checked = true
          } else {
            this.checkboxList[0].checked = false
          }
          break
        case 9:
          this.checkboxList[0].checked = false
          if (e.target.checked) {
            this.showOtherTwo = true
          } else {
            this.showOtherTwo = false
          }
        default:
          this.checkboxList[0].checked = false
          this.checkboxList[e.target.value].checked = e.target.checked
          break
      }
    },
    handleOtherChecked(e, type) {
      switch (type) {
        case '1':
          if (e.target.checked) {
            this.showOtherOne = true
          } else {
            this.showOtherOne = false
          }
          break
        case '3':
          if (e.target.value === '2') {
            this.showOtherThree = true
          } else {
            this.showOtherThree = false
          }
          break
        case '4':
          if (e.target.value === '2') {
            this.showOtherFour = true
          } else {
            this.showOtherFour = false
          }
          break
        case '5':
          if (e.target.value === '2') {
            this.showOtherFive = true
          } else {
            this.showOtherFive = false
          }
          break

        default:
          break
      }
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
    },
    getImageBlob(url, cb) {
      var xhr = new XMLHttpRequest()
      xhr.open('get', url, true)
      xhr.responseType = 'blob'
      xhr.onload = function() {
        if (this.status == 200) {
          if (cb) cb(this.response)
        }
      }
      xhr.send()
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="less" scoped>
.clinical-info {
  padding-bottom: 30px;

  .h-divider {
    margin: 15px 25px 15px;
    width: 1px;
    background-image: linear-gradient(to bottom, #bfbfbf 0%, #bfbfbf 50%, transparent 0%);
    background-size: 1px 10px;
  }

  .image-view {
    margin: 15px 0;
    border: 1px solid #bfbfbf;
    min-height: 270px;
    display: flex;
    padding: 10px;

    .image-view-pic {
      max-width: 100%;
      width: 100%;
      object-fit: contain;
    }
  }
}

.clinical-info-form {
  .result-list {
    display: flex;
    flex-direction: column;
    position: relative;

    .result-item {
      display: flex;
      align-items: center;
      font-size: 12px;
      margin-bottom: 15px;

      .ant-input {
        width: 120px;
        margin: 0 10px;
        height: 30px;
      }

      .text-label {
        width: 60px;
        text-align: right;
      }
    }
  }

  textarea {
    resize: inherit;
  }

  .upload-body {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding-left: 30px;

    h3 {
      margin-bottom: 0;
    }

    .anticon-cloud-upload {
      font-size: 30px;
      color: #50a7dc;
      margin-left: 10px;
      margin-top: 10px;
    }

    .upload-btn {
      margin-left: 15px;
      border-radius: 50%;
      border: 1px solid #50a7dc;
      width: 50px;
      height: 50px;
    }
  }

  .require-tilte {
    font-size: 12px;

    &::before {
      display: inline-block;
      margin-right: 4px;
      color: #f5222d;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }
}

.order-title {
  margin-bottom: 30px;
}

.order-content {
  margin-bottom: 15px;
  display: flex;

  .ant-checkbox-wrapper {
    margin-left: 0;
    margin-right: 15px;
    margin-bottom: 10px;
  }

  .ant-input {
    width: 150px;
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
<style lang="less">
.clinical-info {
  .order-content {
    .ant-form-item-label {
      min-width: 140px;
    }
  }
}

.medical-history-other {
  .ant-form-item-control {
    margin-left: 10px;
  }
}

.week-cure-content {
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-form-item-label {
    margin-bottom: 15px;
  }
  & > .ant-form-item-control-wrapper {
    padding-left: 150px;
  }
}

.week-blood-time {
  & > .ant-form-item-control-wrapper {
    padding-left: 10px;
  }
}
</style>
