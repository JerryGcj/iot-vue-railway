<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="卡数量">
          <a-input disabled v-model="cardNumber"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="套餐">
          <a-select :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
                    v-decorator="[ 'packageId', validatorRules.packageId]"
                    placeholder="套餐">
            <a-select-option v-for="d in packageData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
          </a-select>
        </a-form-item>


        <a-form-item label="追加套餐" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-radio-group defaultValue="1" buttonStyle="solid"  v-decorator="[ 'activation', validatorRules.activation]">
            <a-radio-button value="0">是</a-radio-button>
            <a-radio-button value="1">否</a-radio-button>
          </a-radio-group>
        </a-form-item>


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="数量" help="不填默认1,半角逗号分割">
          <a-input-number  v-decorator="[ 'number', validatorRules.number]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {queryLowerAgent,queryStandardcost } from '@/api/api'
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import JDate from '@/components/jeecg/JDate'

  export default {
    name: "CardInformationRechargeablePackage",
    components: {ATextarea,JDate,queryStandardcost},
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        userData:[],
        cardNumber:'',
        activation:'',
        packageData:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{


          cardNumber:{
            rules: [{
              required: true, message: '请选择卡!'
            }]
          },

          packageId:{
            rules: [{
              required: true, message: '请选择套餐!'
            }]
          },
          number:{
            rules: [{
              required: true, message: '请选择数量!'
            }]
          },
        },
        url: {
          add: "/cardinformation/cardInformation/add",
          edit: "/cardinformation/cardInformation/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add (record) {
        this.selectedRowKeys = record;

        this.cardNumber = this.selectedRowKeys.length;
        this.edit({});
      },
      edit (record) {
        this.queryStandardcostList();
        this.queryUserAgent();
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model))
        //时间格式化
      });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
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
          let formData = Object.assign(this.model, values);
          //时间格式化

          console.log(formData)
          httpAction(httpurl,formData,method).then((res)=>{
            if(res.success){
            that.$message.success(res.message);
            that.$emit('ok');
          }else{
            that.$message.warning(res.message);
          }
        }).finally(() => {
            that.confirmLoading = false;
          that.close();
        })



        }
      })
      },
      handleCancel () {
        this.close()
      },

      queryUserAgent(){
        var that = this;
        queryLowerAgent().then((res)=>{
          if(res.success){
          that.userData = [];
          let treeList = res.result
          for(let a=0;a<treeList.length;a++){
            let temp = treeList[a];
            this.userData.push({
              value:temp.id,
              text:temp.username
            })
          }
        }
      });

      },



      queryStandardcostList(){
        var that = this;
        queryStandardcost().then((res)=>{
          if(res.success){
          that.packageData = [];
          let treeList = res.result
          for(let a=0;a<treeList.length;a++){
            let temp = treeList[a];
            this.packageData.push({
              value:temp.id,
              text:temp.packageName
            })
          }
        }
      });

      },


    }
  }
</script>

<style lang="less" scoped>

</style>