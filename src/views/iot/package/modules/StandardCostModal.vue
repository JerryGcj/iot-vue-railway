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

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="套餐名称">
          <a-input placeholder="请输入套餐名称" v-decorator="['packageName', validatorRules.packageName]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="运营商类型">
          <j-dict-select-tag placeholder="请选择运营商类型" :triggerChange="true" v-decorator="[ 'operatorType', validatorRules.operatorType]" dict-code="operator_type"></j-dict-select-tag>
          <!--<a-select placeholder="-请选择-"  v-decorator="[ 'operatorType', validatorRules.operatorType]">-->
            <!--<a-select-option value="0">移动</a-select-option>-->
            <!--<a-select-option value="1">联通</a-select-option>-->
            <!--<a-select-option value="2">电信</a-select-option>-->
          <!--</a-select>-->
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="套餐类型">
          <a-select placeholder="-请选择-" v-model="packageType"  v-decorator="[ 'packageType', validatorRules.packageType]">
            <a-select-option value="0">流量</a-select-option>
            <a-select-option value="1">语音</a-select-option>
            <a-select-option value="2">短信</a-select-option>
            <a-select-option value="3">混合</a-select-option>
          </a-select>

        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="包含流量(M)"  v-if="packageType === '0' || packageType === '3'">
          <a-input-number v-decorator="[ 'containsFlow', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="包含语音(分钟)" v-if="packageType === '1' || packageType === '3'">
          <a-input-number v-decorator="[ 'containsVoice', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="包含短信(条)" v-if="packageType === '2' || packageType === '3'">
          <a-input-number v-decorator="[ 'containsSms', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="包体类型">
          <a-select @change="judgePackage" placeholder="-请选择-" v-decorator="[ 'inclusionType', validatorRules.inclusionType]">
            <a-select-option value="0">按自然月计费</a-select-option>
            <a-select-option value="1">按使用时间计费</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="有效期">
          <a-input-number v-decorator="[ 'periodOfValidity', validatorRules.periodOfValidity]" />
          <a-input v-model="validityDay" style="width: 10%" disabled/>

        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否是基础套餐">
          <a-radio-group  buttonStyle="solid"   v-decorator="[ 'basicPackage', validatorRules.basicPackage]">
            <a-radio-button value="0">是</a-radio-button>
            <a-radio-button value="1">否</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="标准资费（元）">
          <a-input-number v-decorator="[ 'standardRates', validatorRules.standardRates]" />
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
          label="生效类型">
          <a-radio-group  buttonStyle="solid"   v-decorator="[ 'effectType', validatorRules.effectType]">
            <a-radio-button value="0">立即生效</a-radio-button>
            <a-radio-button value="1">次月生效</a-radio-button>
            <a-radio-button value="2">到期生效</a-radio-button>
          </a-radio-group>
        </a-form-item>


      </a-form>
    </a-spin>
    <a-button type="primary" @click="handleOk">提交</a-button>
    <a-button type="primary" @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "StandardCostModal",
    data () {
      return {
        title:"操作",
        validityDay:'',
        visible: false,
        model: {},
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
          packageName:{
            rules: [{
              required: true, message: '请输入套餐名称!'
            }]
          },
          operatorType:{
            rules: [{
              required: true, message: '请选择运营商类型!'
            }]
          },
          packageType:{
            rules: [{
              required: true, message: '请选择套餐类型!'
            }]
          },
          inclusionType:{
            rules: [{
              required: true, message: '请选择包体类型!'
            }]
          },
          basicPackage:{
            rules: [{
              required: true, message: '请选择是否是基础套餐!'
            }]
          },
          standardRates:{
            rules: [{
              required: true, message: '请输入标准资费!'
            }]
          },
          state:{
            rules: [{
              required: true, message: '请选择状态!'
            }]
          },
          effectType:{
            rules: [{
              required: true, message: '请选择生效类型!'
            }]
          },
          periodOfValidity:{
            rules: [{
              required: true, message: '请输入有效期！!'
            }]
          },
        },
        url: {
          add: "/standardcost/standardCost/add",
          edit: "/standardcost/standardCost/edit",
        },
      }
    },
    created () {
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
          this.form.setFieldsValue(pick(this.model,'packageName','operatorType','packageType','containsFlow','containsVoice','containsSms','inclusionType','periodOfValidity','basicPackage','standardRates','state','effectType','createUser','createIp','updateUser','updateIp'))
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

      judgePackage(value){
        if(value == '0'){
          this.validityDay = '月';
        }else{
          this.validityDay = '天';
        }
      }
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