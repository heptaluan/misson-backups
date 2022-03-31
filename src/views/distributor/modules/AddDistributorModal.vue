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
    <a-form-model :layout='layout' ref='form' :model='form' :rules='rules' class='add-distributor-modal'>
      <div class='form-title'>基本信息</div>

      <div class='form-content'>
        <a-form-model-item
          label='渠道商名称'
          prop='departName'
          :hidden='false'
          hasFeedback>
          <a-input :disabled='formDisabled' id='departName' placeholder='请输入渠道商名称' v-model='form.departName' />
        </a-form-model-item>
        <a-form-model-item label='渠道商简称' prop='departNameAbbr'>
          <a-input class='autoUppercase' :disabled='formDisabled || specialDisabled' placeholder='请输入渠道商简称'
                   v-model='form.departNameAbbr'
                   @change='checkAbbr(form.departNameAbbr, form)' />
        </a-form-model-item>
        <a-form-model-item
          prop='mobile'
          label='联系人电话' hasFeedback>
          <a-input placeholder='请输入电话' :disabled='formDisabled' v-model='form.mobile' />
        </a-form-model-item>
      </div>
      <div class='form-content'>
        <a-form-model-item label='统一信用码'>
          <a-input :disabled='formDisabled' placeholder='请输入统一信用码' v-model='form.socialCode' />
        </a-form-model-item>
        <a-form-model-item label='网址'>
          <a-input :disabled='formDisabled' placeholder='请输入网址' v-model='form.website' />
        </a-form-model-item>
      </div>
      <div class='form-title'>地址信息</div>
      <div class='form-content'>
        <!--          <a-form-model-item label="LOGO">-->
        <!--            <a-upload-->
        <!--              :disabled="formDisabled"-->
        <!--              list-type="picture-card"-->
        <!--              :file-list="fileList"-->
        <!--              @preview="handlePreview"-->
        <!--              @change="handleChange"-->
        <!--              :customRequest="handleUpload"-->
        <!--            >-->
        <!--              <div v-if="fileList.length < 1">-->
        <!--                <a-icon type="plus" />-->
        <!--                <div class="ant-upload-text">-->
        <!--                  Upload-->
        <!--                </div>-->
        <!--              </div>-->
        <!--            </a-upload>-->
        <!--            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">-->
        <!--              <img alt="example" style="width: 100%" :src="previewImage" />-->
        <!--            </a-modal>-->
        <!--          </a-form-model-item>-->
        <a-form-model-item label='地区' prop='zone'>
          <region :disabled='formDisabled' v-model='form.zone' :value='form.zone' />
        </a-form-model-item>
        <a-form-model-item label='详细地址' prop='address'>
          <a-input :disabled='formDisabled' placeholder='请输入详细地址' v-model='form.address' />
        </a-form-model-item>
        <!--          <a-form-model-item label='电话' prop='telephone'>-->
        <!--            <a-input :disabled='formDisabled' placeholder='请输入电话' v-model='form.telephone' />-->
        <!--          </a-form-model-item>-->
      </div>
      <!--      <div class="form-title">关联信息</div>-->
      <!--      <div class="form-content">-->
      <!--        <a-form-model-item label="销售人员" prop="sellUser">-->
      <!--          <a-select-->
      <!--            :disabled='formDisabled'-->
      <!--            style='width:200px;'-->
      <!--            show-search-->
      <!--            :value='value'-->
      <!--            placeholder='请输入姓名进行检索'-->
      <!--            :default-active-first-option='false'-->
      <!--            :show-arrow='false'-->
      <!--            :filter-option='false'-->
      <!--            :not-found-content='null'-->
      <!--            @search='handleSearch'-->
      <!--            @change='sellerChange'-->
      <!--            v-model='form.sellUser'-->
      <!--          >-->
      <!--            <a-select-option v-for='item in data' :key='item.id' :value='item.username'>-->
      <!--              {{ item.realname }}-->
      <!--            </a-select-option>-->
      <!--          </a-select>-->
      <!--        </a-form-model-item>-->
      <!--      </div>-->

      <div class='form-title' v-if='dataSource && formDisabled'>渠道商用户</div>
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
import { uploadLogo, addBusinessAccess, queryHospitalByMainId } from '../../../api/product/index'
// import { selectorFilterMixin } from '@/utils/selectorFilterMixin'
import { httpAction } from '@/api/manage'
import { mixinDevice } from '@/utils/mixin'
import { queryRoleUsers } from '../../../api/material/index'
import { getAction, postAction, deleteAction } from '@/api/manage'
import Region from '../../region/Region'
import { commonFunctionsMixin } from '@/mixins/commonFunctionsMixin'

// import { checkAbbrUnique } from '../../../api/api'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

function fetch(value, callback) {
  let timeout
  let currentValue

  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value

  function fake() {
    queryRoleUsers({
      role: 'sales_omics',
      name: value
    }).then(res => {
      if (res.success) {
        if (currentValue === value) {
          const result = res.result
          const data = []
          result.forEach(r => {
            data.push({
              key: r.id,
              realname: r.realname,
              username: r.username,
              id: r.id
            })
          })
          callback(data)
        }
      } else {
        console.log(res.message)
      }
    })
  }

  timeout = setTimeout(fake, 300)
}

export default {
  name: 'DistributorModal',
  mixins: [mixinDevice, commonFunctionsMixin
    // selectorFilterMixin
  ],
  components: { Region },
  data() {
    return {
      title: '查看',
      width: 1200,
      visible: false,
      disableSubmit: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      record: {},
      layout: 'inline',
      address: [],
      form: {},
      rules: {
        departName: [
          {
            required: true,
            message: '请输入正确的渠道商名称',
            trigger: 'blur'
          }
        ],
        departNameAbbr: [
          {
            required: true,
            message: '请输入渠道商缩写（仅限三到八位大写字母）',
            trigger: 'blur',
            pattern: /^[a-zA-Z]{3,8}$/
          }
        ],
        // contactName: [{ required: true, message: '请输入联系人名称', trigger: 'blur' }],
        // loginPwd: [
        //   {
        //     required: true,
        //     message: '密码由8位数字、大小写字母和特殊符号组成',
        //     trigger: 'blur',
        //     pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/
        //   }
        // ],
        mobile: [
          {
            required: true,
            message: '请输入联系人电话',
            trigger: 'blur',
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/
          }
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
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
        // telephone: [{ required: true, message: '请输入电话', trigger: 'blur', pattern: /^[1][3,4,5,7,8][0-9]{9}$/ }],
        // sellUser: [{ required: true, message: '请选择泰莱销售', trigger: 'blur' }],
      },
      // 表头
      // columns: [
      //   {
      //     title: '#',
      //     dataIndex: '',
      //     key: 'rowIndex',
      //     width: 60,
      //     align: 'center',
      //     customRender: function(t, r, index) {
      //       return parseInt(index) + 1
      //     }
      //   },
      //   {
      //     title: '医院名称',
      //     align: 'center',
      //     dataIndex: 'hospitalName'
      //   },
      //   {
      //     title: '统一信用代码',
      //     align: 'center',
      //     dataIndex: 'socialCode'
      //   },
      //   {
      //     title: '科室',
      //     align: 'center',
      //     dataIndex: 'department'
      //   },
      //   {
      //     title: '联系医生',
      //     align: 'center',
      //     dataIndex: 'contactDoctor'
      //   },
      //   {
      //     title: '联系电话',
      //     align: 'center',
      //     dataIndex: 'contactPhone'
      //   },
      //   {
      //     title: '关联渠道商',
      //     align: 'center',
      //     dataIndex: 'relateAccess'
      //   },
      //   {
      //     title: '地址',
      //     align: 'center',
      //     dataIndex: 'provinceCode',
      //     customRender: function(t, r, index) {
      //       let address = ''
      //       if (t.districtCode) {
      //         address = r.provinceCode + '-' + r.cityCode + '-' + r.districtCode
      //       } else {
      //         address = r.provinceCode + '-' + r.cityCode
      //       }
      //       return address
      //     }
      //   }
      // ],
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
      departTree: [],
      user: null,
      selectType: 3000
    }
  },
  mounted() {
    this.user = this.$store.getters.userRole
    // this.formDisabled = true
    if (this.user.includes('sales_omics') && !this.user.includes('sales_super_omics')) {
      this.data.push(this.user)
    }
  },
  methods: {
    edit(record, isEdit) {
      if (record.id) {
        this.form = Object.assign({}, record)
        // this.loadHospitalList(record.departNameAbbr)
        // const address = []
        this.formDisabled = !isEdit
        this.specialDisabled = isEdit

        // address.push(record.provinceCode)
        // address.push(record.cityCode)
        // address.push(record.districtCode)
        // this.form.address = address
        this.form.loginPwd = '********'
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
      } else {
        this.form = Object.assign({}, record)
        this.address = []
        this.fileList = []
        this.formDisabled = false
      }
      console.log(this.form)
      this.visible = true
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
            that.form.regionLevel = that.form.zone.length
            that.form.regionCode = that.form.zone.at(-1)
            that.form.orgCategory = 3000
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
                this.specialDisabled = false
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
      this.specialDisabled = false
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
    handleSearch(value) {
      if (!(this.user.includes('sales_omics') && !this.user.includes('sales_super_omics'))) {
        fetch(value, data => (this.data = data))
      }
    },
    sellerChange(value) {
      console.log(value)
      this.value = value
      if (!(this.user.includes('sales_omics') && !this.user.includes('sales_super_omics'))) {
        fetch(value, data => (this.data = data))
      }
    },
    formatZone(form) {
      const zone = []
      zone.push(form.regionProvince, form.regionCity, form.regionCode)
      form.zone = zone
    }
    // loadHospitalList(id) {
    //   if (id) {
    //     const that = this
    //     queryHospitalByMainId({
    //       id: id
    //     }).then(res => {
    //       if (res.success) {
    //         that.dataSource = res.result
    //       } else {
    //         that.$message.warning(res.message)
    //       }
    //     })
    //   }
    // }
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

  .ant-form-item {

    &:last-child {
      margin-right: 0;
    }
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
  .add-distributor-modal {
    .ant-form-item-label {
      min-width: 110px;
    }
  }
</style>