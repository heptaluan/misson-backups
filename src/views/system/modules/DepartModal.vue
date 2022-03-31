<template>
  <a-modal
    :title="title"
    :width="800"
    :ok=false
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form-model ref='form' :model='model' :rules='validatorRules'>
        <a-form-model-item
          :labelCol='labelCol'
          :wrapperCol='wrapperCol'
          label='机构名称'
          prop='departName'
          :hidden='false'
          hasFeedback>
          <a-input id='departName' placeholder='请输入机构名称' v-model='model.departName' />
        </a-form-model-item>
        <a-form-model-item label='机构简称' prop='departNameAbbr' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-input class='autoUppercase' placeholder='请输入机构简称' v-model='model.departNameAbbr'
                   @change='checkAbbr(model.departNameAbbr, model)' />
        </a-form-model-item>
        <a-form-model-item :labelCol='labelCol' :wrapperCol='wrapperCol' :hidden='seen' label='上级机构' hasFeedback>
          <a-tree-select
            style='width:100%'
            :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
            :treeData='departTree'
            v-model='model.parentId'
            placeholder='请选择上级机构'
            :disabled='condition'>
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item
          :labelCol='labelCol'
          :wrapperCol='wrapperCol'
          prop='orgCategory'
          label='机构类型'>
          <a-radio-group v-model='model.orgCategory' @change='orgChange'>
            <a-radio v-for='item in departmentType' :key='item.id' :value='item.value'>
              {{ item.txt }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!--        <a-form-model-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          prop="subDepartType"-->
        <!--          label="部门">-->
        <!--          <a-radio-group v-model="model.subDepartType">-->
        <!--            <a-radio v-for='item in subDepartType' :key='item.id' :value='item.value'>-->
        <!--              {{ item.txt }}-->
        <!--            </a-radio>-->
        <!--          </a-radio-group>-->
        <!--        </a-form-model-item>-->
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="mobile"
          label="电话">
          <a-input placeholder="请输入电话" v-model="model.mobile"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="传真">
          <a-input placeholder="请输入传真" v-model="model.fax"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol='wrapperCol'
          prop='address'
          label='地址'>
          <a-input placeholder="请输入地址" v-model="model.address"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序">
          <a-input-number v-model="model.departOrder"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-textarea placeholder="请输入备注" v-model="model.memo"/>
        </a-form-model-item>

      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import { queryIdTree } from '@/api/api'
import pick from 'lodash.pick'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { commonFunctionsMixin } from '@/mixins/commonFunctionsMixin'

export default {
  name: 'SysDepartModal',
  components: { ATextarea },
  mixins: [commonFunctionsMixin],
  data() {
    return {
      departTree: [],
      orgTypeData: [],
      phoneWarning: '',
      departName: '',
      title: '操作',
      seen: false,
      visible: false,
      condition: true,
        disableSubmit:false,
        model: {},
        defaultModel:{
          departOrder:0,
          // orgCategory:'1'
        },
        menuhidden:false,
        menuusing:true,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        validatorRules: {
          departName: [{ required: true, message: '请输入机构名称!', trigger: 'blur' }],
          departNameAbbr: [
            {
              required: true,
              message: '请输入机构简称(3-8位大写字母)',
              trigger: 'blur',
              pattern: /^[a-zA-Z]{3,8}$/
            }
          ],
          orgCode: [{ required: true, message: '请输入机构编码!' }],
          mobile: [{
            required: true,
            message: '请输入联系人电话',
            trigger: 'blur',
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/
          }],
          address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
          orgCategory: [{ required: true, message: '请输入机构类型!' }]
        },
      url: {
        add: '/sys/sysDepart/add'
      },
      dictDisabled: true,
      formDisabled: false,
      specialDisabled: false,
      departmentType: [
        { value: 1, txt: '公司' },
        { value: 3000, txt: '渠道商' },
        { value: 4000, txt: '医院' }
      ],
      subDepartType: [
        { value: 1, txt: '部门' },
        { value: 2, txt: '岗位' }
      ],
      selectType: 1
    }
    },
    created () {
    },
    methods: {
      loadTreeData(){
        var that = this;
        queryIdTree().then((res)=>{
          if(res.success){
            that.departTree = [];
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i];
              that.departTree.push(temp);
            }
          }

        })
      },
      add (depart) {
        if(depart){
          this.seen = false;
          this.dictDisabled = false;
        }else{
          this.seen = true;
          this.dictDisabled = true;
        }
        this.edit(depart);
      },
      edit (record) {
        this.visible = true
        this.model = Object.assign({}, this.defaultModel, record)
        this.loadTreeData()
        this.model.parentId = record != null ? record.toString() : null
        // if(this.seen){
        //   this.model.orgCategory = '1';
        // }else{
        //   this.model.orgCategory = '2';
        // }
      },
      close () {
        this.$emit('close');
        this.disableSubmit = false;
        this.visible = false;
        this.$refs.form.resetFields();
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            httpAction(this.url.add,this.model,"post").then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.loadTreeData();
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })

          }else{
            return false;
          }
        })
      },
      handleCancel() {
        this.close()
      },
      validateMobile(rule, value, callback) {
        if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
          callback()
        } else {
          callback('您的手机号码格式不正确!')
        }
      },
      orgChange(value) {
        this.selectType = value.target.value
        this.model.departNameAbbr = undefined
      }
    }
  }
</script>

<style scoped>

</style>