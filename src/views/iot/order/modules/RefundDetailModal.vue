<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-card class="card"  :bordered="false">
          <a-row class="form-row" :gutter="30">
            <a-col :lg="12">
              <a-form-item label="ICCID" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input v-decorator="[ 'iccid', validatorRules.iccid ]"/>
              </a-form-item>
            </a-col>
            <a-col :lg="12">
              <a-form-item label="套餐名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input v-decorator="['packageName', validatorRules.packageName ]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="30">
            <a-col :lg="12">
              <a-form-item label="退款金额(元)" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input v-decorator="[ 'tradingMoney', validatorRules.tradingMoney]" />
              </a-form-item>
            </a-col>
            <a-col :lg="12">
              <a-form-item label="退款状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input v-decorator="['note', validatorRules.note ]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="30">
            <a-col :lg="12">
              <a-form-item label="退款入账账户" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input v-decorator="[ 'refundRecvAccout', validatorRules.refundRecvAccout]" />
              </a-form-item>
            </a-col>
            <a-col :lg="12">
              <a-form-item label="退款时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input v-decorator="['refundTime', validatorRules.refundTime ]" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import { queryDetails } from '@/api/api'

  export default {
    name: "RefundDetailModal",
    components: { 
      JDictSelectTag,
      queryDetails
    },
    data () {
      return {
        form: this.$form.createForm(this),
        title:"操作",
        width:1000,
        visible: false,
        model: {},
        dataSource: [],
        operatorType:'',
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
          iccid: {rules: [
          ]},
          msisdn: {rules: [
          ]},
          packageName: {rules: [
          ]},
          tradingMoney: {rules: [
          ]},
          note: {rules: [
          ]},
          refundRecvAccout: {rules: [
          ]},
          refundTime: {rules: []}
        },
        url: {

        }
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
          this.form.setFieldsValue(pick(this.model,'iccid','msisdn','packageName','tradingMoney','note','refundRecvAccout','refundTime'))
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'iccid','msisdn','packageName','tradingMoney','note','refundRecvAccout','refundTime'))
      }
      
    }
  }
</script>