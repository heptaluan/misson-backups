<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="冰箱名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rfName">
              <a-input v-model="model.rfName" placeholder="请输入冰箱名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="冰箱编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rfCode">
              <a-input v-model="model.rfCode" placeholder="请输入冰箱编号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="冰箱层数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="maxFloorAmount">
              <a-input-number v-model="model.maxFloorAmount" max="10" min="1" placeholder="请输入冰箱层数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="冰箱格数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="maxGridAmount">
              <a-input v-model="model.maxGridAmount" placeholder="请输入冰箱每层格数" max="6" min="1"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="冰箱抽屉数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="maxDrawerAmount">
              <a-input-number v-model="model.maxDrawerAmount" max="5" min="1" placeholder="请输入冰箱每格抽屉数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="冰箱盒子数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="maxBoxAmount">
              <a-input-number v-model="model.maxBoxAmount" max="5" min="1" placeholder="请输入冰箱每抽屉盒数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="盒子行数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="maxRow">
              <a-input-number v-model="model.maxRow" max="10" min="1" placeholder="请输入每个盒子行数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="盒子列数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="maxCol">
              <a-input-number v-model="model.maxCol" max="10" min="1" placeholder="请输入每个盒子列数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="冰箱型号ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rfModelId">
              <j-dict-select-tag v-model="model.rfModelId" dict-code="model_management, model, id"></j-dict-select-tag>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="冰箱每层容量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rfCapacity">
              <a-input-number v-model="model.rfCapacity" placeholder="请输入冰箱每层容量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="购买日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rfPurchaseDate">
              <j-date placeholder="请选择购买日期" v-model="model.rfPurchaseDate"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="预计使用年限" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rfDesignLife">
              <a-input-number v-model="model.rfDesignLife" placeholder="请输入预计使用年限" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-input v-model="model.remark" placeholder="请输入备注"  ></a-input>
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

  export default {
    name: 'RefrigeratorManagementForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
         },
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
          // maxBoxAmount	每个抽屉内最大的盒子数量
          // maxCol	最大的列数
          // maxDrawerAmount	每个grid内抽屉数量
          // maxFloorAmount	冰箱层数
          // maxGridAmount	每层的grid数量
          // maxRow
          rfName: [{ required: true, message: '请输入冰箱名称', trigger: 'blur' }],
          maxFloorAmount: [{ required: true, message: '请输入冰箱最大层数', trigger: 'blur' }],
          maxGridAmount: [{ required: true, message: '请输入冰箱最大格子数', trigger: 'blur' }],
          maxDrawerAmount: [{ required: true, message: '请输入每格最抽屉数量', trigger: 'blur' }],
          maxBoxAmount: [{ required: true, message: '请输入每个抽屉内最大的盒子数量', trigger: 'blur' }],
          maxRow: [{ required: true, message: '请输入每个盒子最大行数', trigger: 'blur' }],
          maxCol: [{ required: true, message: '请输入每个盒子最大列数', trigger: 'blur' }]
        },
        url: {
          add: "/mission/refrigeratorManagement/add",
          edit: "/mission/refrigeratorManagement/edit",
          queryById: "/mission/refrigeratorManagement/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }

        })
      },
    }
  }
</script>