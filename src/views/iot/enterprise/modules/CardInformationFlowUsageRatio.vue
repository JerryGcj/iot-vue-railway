<template>
  <a-modal
    :title="title"
    :width="500"
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
          label="卡数量" >
          <a-input disabled v-model="cardNumber" style="width: 50%" />
        </a-form-item>


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="自定义用量（倍）">
          <a-input-number placeholder="请输入" v-decorator="['customPackageUse', validatorRules.customPackageUse]" style="width: 50%" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { postAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {queryLowerAgent,customUnicomPackageUse } from '@/api/api'

  export default {
    name: "CardInformationFlowUsageRatio",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        cardNumber:'',
        idsDate:[],
        selectedRowKeys: [],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{

          customPackageUse:{
            rules: [{
              required: true, message: '请输入!'
            }]
          },

        },
        url: {
          add: "/enterprise/iotEnterpriseCardInfo/add",
          edit: "/enterprise/iotEnterpriseCardInfo/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add (record,record2) {
        this.selectedRowKeys = record;

        this.idsDate = record2;

        if(this.selectedRowKeys == ''){
          this.cardNumber = this.idsDate.length;
        }else{
          this.cardNumber = this.selectedRowKeys.length;
        }
        this.edit({});
      },
      edit (record) {
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
          if(!err){
            that.confirmLoading = true;
            var ids = "";
            if(this.selectedRowKeys == ''){
              for (var a = 0; a < this.idsDate.length; a++) {
                ids += this.idsDate[a] + ",";
              }
            }else{
              for (var a = 0; a < this.selectedRowKeys.length; a++) {
                ids += this.selectedRowKeys[a] + ",";
              }
            }

            postAction("/enterprise/iotEnterpriseCardInfo/customPackageUse", {ids: ids,customPackageUse:values.customPackageUse}).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.$emit('hello');
              that.confirmLoading = false;
              that.close();
            })
          }
      })

      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>