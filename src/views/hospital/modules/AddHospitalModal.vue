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
    <a-form-model :layout="layout" ref="form" :model="form" :rules="rules" class="add-hospital-modal">
      <div class="form-title">基本信息</div>
      <div class='form-content'>
        <a-form-model-item label='医院名称' prop='departName'>
          <a-input :disabled='formDisabled' placeholder='请输入医院名称' v-model='form.departName' />
        </a-form-model-item>
        <a-form-model-item label='医院简称' prop='departNameAbbr'>
          <a-input class='autoUppercase' :disabled='formDisabled || specialDisabled' placeholder='请输入医院简称'
                   v-model='form.departNameAbbr'
                   @change='checkAbbr(form.departNameAbbr, form)' />
        </a-form-model-item>
        <a-form-model-item label='联系电话' prop='mobile'>
          <a-input :disabled='formDisabled' placeholder='请输入联系电话' v-model='form.mobile' />
        </a-form-model-item>
        <!-- <a-form-model-item label="科室" prop="department">
          <a-input :disabled="formDisabled" placeholder="请输入科室" v-model="form.department" />
        </a-form-model-item>
        <a-form-model-item label="联系医生" prop="contactDoctor" style="margin-top:15px;">
          <a-input :disabled="formDisabled" placeholder="请输入联系医生" v-model="form.contactDoctor" />
        </a-form-model-item> -->
      </div>
      <div class="form-content">
        <a-form-model-item label="统一信用代码">
          <a-input :disabled="formDisabled" placeholder="请输入统一信用代码" v-model="form.socialCode" />
        </a-form-model-item>
        <a-form-model-item label="网址">
          <a-input :disabled="formDisabled" placeholder="请输入网址" v-model="form.website" />
        </a-form-model-item>
      </div>
      <!--      <div class="form-content">-->
      <!--        <a-form-model-item label="LOGO">-->
      <!--          <a-upload-->
      <!--            :disabled="formDisabled"-->
      <!--            list-type="picture-card"-->
      <!--            :file-list="fileList"-->
      <!--            @preview="handlePreview"-->
      <!--            @change="handleChange"-->
      <!--            :customRequest="handleUpload"-->
      <!--          >-->
      <!--            <div v-if="fileList.length < 1">-->
      <!--              <a-icon type="plus" />-->
      <!--              <div class="ant-upload-text">-->
      <!--                Upload-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </a-upload>-->
      <!--          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">-->
      <!--            <img alt="example" style="width: 100%" :src="previewImage" />-->
      <!--          </a-modal>-->
      <!--        </a-form-model-item>-->
      <!--      </div>-->
      <div class="form-title">地址信息</div>
      <div class='form-content'>
        <a-form-model-item label='地区' prop='zone'>
          <!--          <region :disabled='formDisabled' :regionData='regionData' v-model='form.zone' :value='form.zone' />-->
          <region :disabled='formDisabled' v-model='form.zone' :value='form.zone' />
        </a-form-model-item>
        <a-form-model-item label='详细地址' prop='address'>
          <a-input :disabled='formDisabled' placeholder='请输入详细地址' v-model='form.address' />
        </a-form-model-item>
        <!--        <a-form-model-item label="电话" prop="phoneNumber">-->
        <!--          <a-input :disabled="formDisabled" placeholder="请输入电话" v-model="form.phoneNumber" />-->
        <!--        </a-form-model-item>-->
      </div>

      <div class='form-title' v-if='dataSource && formDisabled'>关联渠道商</div>
      <div class='form-content' v-if='dataSource && formDisabled'>
        <a-table
          ref='table'
          size='middle'
          :scroll='{ x: true }'
          bordered
          rowKey='id'
          :columns='columnsNew'
          :dataSource='dataSource'
          class='j-table-force-nowrap'
        >
        </a-table>
      </div>
    </a-form-model>
  </j-modal>
</template>

<script>
import { uploadLogo, addBusinessAccess, addBusinessHospital } from '../../../api/product/index'
import { httpAction } from '@/api/manage'
import { mixinDevice } from '@/utils/mixin'
import { selectorFilterMixin } from '@/mixins/selectorFilterMixin'
import { getAction, postAction, deleteAction } from '@/api/manage'
import options from '../../../../src/mixins/cities'
import Region from '../../region/Region'
import { commonFunctionsMixin } from '@/mixins/commonFunctionsMixin'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default {
  name: 'AddHospitalModal',
  mixins: [mixinDevice, selectorFilterMixin, commonFunctionsMixin],
  // props: ['regionData'],
  components: { Region },
  data() {
    return {
      title: '创建渠道商',
      width: 1200,
      visible: false,
      disableSubmit: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      record: {},
      options: options,
      layout: 'inline',
      address: [],
      form: {},
      rules: {
        departName: [{ required: true, message: '请输入医院名称', trigger: 'blur' }],
        departNameAbbr: [
          {
            required: true,
            message: '请输入渠道商缩写（仅限三到八位大写字母）',
            trigger: 'blur',
            pattern: /^[a-zA-Z]{3,8}$/
          }],
        // department: [{ required: true, message: '请输入科室', trigger: 'blur' }],
        // contactDoctor: [{ required: true, message: '请输入联系医生', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur', pattern: /^[1][3,4,5,7,8][0-9]{9}$/ }
        ],
        socialCode: [
          {
            required: true,
            message: '请输入统一信用代码',
            trigger: 'blur',
            pattern: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/
          }
        ],
        zone: [{ required: true, message: '请选择地区', trigger: 'change' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        // phoneNumber: [{ required: true, message: '请输入电话', trigger: 'blur', pattern: /^[1][3,4,5,7,8][0-9]{9}$/ }],
        relateAccess: [{ required: true, message: '请选择关联渠道商', trigger: 'blur' }]
      },
      // 表头
      columnsNew: [
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
          title: '名字',
          align: 'center',
          dataIndex: 'realname'
        },
        {
          title: '用户名',
          align: 'center',
          dataIndex: 'username'
        },
        {
          title: '联系电话',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '所属渠道商',
          align: 'center',
          dataIndex: 'orgCode'
        },
        {
          title: '负责渠道商',
          align: 'center',
          dataIndex: 'departIds_dictText'
        },
        {
          title: '创建时期',
          align: 'center',
          dataIndex: 'createTime'
        }
      ],

      url: {
        // list: 'mission/businessAccess/list',
        list: '/sys/user/departUserList',
        add: '/sys/sysDepart/add',
        edit: '/sys/sysDepart/edit'
      },
      previewVisible: false,
      previewImage: '',
      fileList: [],
      data: [],
      value: undefined,
      formDisabled: false,
      specialDisabled: false,
      dataSource: [],
      distributorList: [],
      selectType: 4000
    }
  },
  methods: {
    edit(record, isEdit) {
      if (record.id) {
        this.title = '查看'
        this.form = Object.assign({}, record)
        this.formDisabled = !isEdit
        this.specialDisabled = isEdit
        const address = []
        // address.push(record.provinceCode)
        // address.push(record.cityCode)
        // address.push(record.districtCode)
        // this.form.address = address
        this.form.sellUser = record.sellUser_dictText
        this.fileList = [
          {
            uid: '0',
            name: 'logo',
            status: 'done',
            url: record.logo_dictText
          }
        ]
        this.formatZone(this.form)
        this.loadRelatedUser(record.id)
        // console.log(zone)

      } else {
        this.form = Object.assign({}, record)
        this.address = []
        this.fileList = []
        this.formDisabled = false
      }
      console.log(this.form)
      this.visible = true
    },
    handleOk() {
      if (this.formDisabled) {
        this.visible = false
      } else {
        const that = this
        this.$refs.form.validate(valid => {
          if (valid) {
            console.log(this.form)
            // if (that.fileList.length === 0) {
            //   that.$message.warning(`请上传LOGO`)
            //   return
            // }
            // const postData = Object.assign({}, that.form)

            that.form.regionLevel = that.form.zone.length
            that.form.regionCode = that.form.zone.at(-1)
            that.form.orgCategory = 4000
            let obj
            if (!this.form.id) {
              obj = httpAction(this.url.add, this.form, 'post')
            } else {
              obj = httpAction(this.url.edit, this.form, 'put')
            }
            obj.then(res => {
              console.log(res)
              if (res.success) {
                that.$emit('ok')
                that.visible = false
                this.formDisabled = false
                that.$message.success(res.message)
              } else {
                that.$message.error(res.message)
                that.uploading = false
              }
              })
              .catch(e => {
                that.uploading = false
              })
          }
        })
      }
    },
    handleCancel() {
      this.previewVisible = false
      this.formDisabled = false
      this.visible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },
    handleUpload(file) {
      const that = this
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('code', '3000')
      uploadLogo(formData)
        .then(res => {
          if (res.success) {
            that.fileList = [
              {
                uid: '0',
                name: 'logo',
                status: 'done',
                url: res.result.fileUrl
              }
            ]
            that.$message.success(res.message)
            that.form.logo = res.result.id
          } else {
            that.$message.error(res.message)
            that.uploading = false
            that.fileList = []
          }
        })
        .catch(e => {
          that.uploading = false
        })
    },
    loadRelatedUser(id) {
      const params = { depId: id }
      getAction(this.url.list, params).then((res) => {
        if (res.success && res.result) {
          this.dataSource = res.result.records
          // this.ipagination.total = res.result.total
        }
      })
    },
    formatZone(form) {
      const zone = []
      zone.push(form.regionProvince, form.regionCity, form.regionCode)
      form.zone = zone
    }
  },
  mounted() {
    this.loadDistributorList()
  }
}
</script>

<style lang="less" scoped>
.form-title {
  font-size: 18px;
}

.form-content {
  padding: 0 30px;
  margin: 15px 0;
}
</style>

<style lang="less">
.form-content {
  .ant-input {
    width: 200px;
  }

  .ant-form-item:last-child {
    margin-right: 0;
  }

  .ant-upload-picture-card-wrapper {
    display: flex;
  }

  .ant-form-item-with-help {
    margin-bottom: 0;
  }
}
</style>

<style lang="less">
.add-hospital-modal {
  .ant-form-item-label {
    min-width: 110px;
  }
}
</style>
