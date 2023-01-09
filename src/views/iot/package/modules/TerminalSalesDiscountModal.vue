<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <!--<a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="下级代理">
          <a-select v-decorator="[ 'userId', validatorRules.userId]"
                    placeholder="请选择下级代理">
            <a-select-option v-for="d in userData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
          </a-select>
        </a-form-item>-->

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="下级代理">
          <j-multi-select-tag
            v-model="userIds"
            :options="dictOptions"
            placeholder="请选择下级代理">
          </j-multi-select-tag>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="运营商类型">
          <!--<j-dict-select-tag placeholder="请选择运营商类型" @change="queryPackage()" v-decorator="['operatorType', validatorRules.operatorType]" :triggerChange="true" dict-code="operator_type"></j-dict-select-tag>-->
          <a-select placeholder="-请选择-"  @change="queryPackage()" v-model="operatorType">
            <a-select-option value="1">移动</a-select-option>
            <a-select-option value="2">联通</a-select-option>
            <a-select-option value="3">电信</a-select-option>
            <a-select-option value="4">第三方</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="套餐名称">
          <a-select v-decorator="[ 'packageId', validatorRules.packageId]"
                    placeholder="套餐名称">
            <a-select-option v-for="d in DiscountPackageData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
          </a-select>
        </a-form-item>


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态">
          <a-radio-group  buttonStyle="solid"   v-decorator="[ 'state', validatorRules.state]">
            <a-radio-button value="0">上架</a-radio-button>
            <a-radio-button value="1">下架</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="销售价格（元）">
          <a-input-number v-decorator="[ 'salesPrice', validatorRules.salesPrice]" />
        </a-form-item>


      </a-form>
    </a-spin>
    <a-button type="primary" @click="handleOk">确定</a-button>
    <a-button type="primary" @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {queryLowerAgent,queryDiscountPackageByOperator } from '@/api/api'
  import JMultiSelectTag from '@/components/dict/JMultiSelectTag'

  export default {
    name: "TerminalSalesDiscountModal",
    components: {JMultiSelectTag},
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        userIds: "",
        dictOptions: [],
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
        DiscountPackageData:[],
        userData:[],
        validatorRules:{
          operatorType:{
            rules: [{
              required: true, message: '请选择运营商类型!'
            }]
          },
          packageId:{
            rules: [{
              required: true, message: '请选择套餐!'
            }]
          },
          state:{
            rules: [{
              required: true, message: '请选择状态!'
            }]
          },
          salesPrice:{
            rules: [{
              required: true, message: '请输入销售价格!'
            }]
          },
        },
        url: {
          add: "/terminalsalesdiscount/terminalSalesDiscount/add",
          edit: "/terminalsalesdiscount/terminalSalesDiscount/edit",
        },
      }
    },
    created () {
      var that = this;
      queryLowerAgent().then((res)=>{
        if(res.success){
          that.dictOptions = [];
          let treeList = res.result
          for(let a=0;a<treeList.length;a++){
            let temp = treeList[a];
            this.dictOptions.push({
              value:temp.id,
              label:temp.userCompany
            })
          }
        }
      });
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'userId','operatorType','packageId','packageName','state','salesPrice','createUser','createIp','updateUser','updateIp'))
        //时间格式化
        this.form.setFieldsValue({updateDate:this.model.updateDate?moment(this.model.updateDate):null})
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
          formData.userId = this.userIds;
          //时间格式化
          formData.updateDate = formData.updateDate?formData.updateDate.format('YYYY-MM-DD HH:mm:ss'):null;

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
            that.dictOptions = [];
            let treeList = res.result
            for(let a=0;a<treeList.length;a++){
              let temp = treeList[a];
              this.dictOptions.push({
                value:temp.id,
                label:temp.userCompany
              })
            }
          }
        });
      },
      queryPackage(){
        var that = this;
        queryDiscountPackageByOperator({operatorType: this.operatorType.toString()}).then((res)=>{
          if(res.success){
          that.DiscountPackageData = [];
          let treeList = res.result

          for(let a=0;a<treeList.length;a++){
            let temp = treeList[a];
            this.DiscountPackageData.push({
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
  /** Button按钮间距 */
  .ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
  }
</style>