<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="群组id" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'groupId', validatorRules.groupId]" placeholder="请输入群组id"></a-input>
        </a-form-item>
        <a-form-item label="群组名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'groupName', validatorRules.groupName]" placeholder="请输入群组名称"></a-input>
        </a-form-item>
        <a-form-item label="阈值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'criticalValue', validatorRules.criticalValue]" placeholder="请输入临界值(0.8，代表80%)" style="width: 100%"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开启定时预警"
          hasFeedback>
          <a-switch checkedChildren="启用" unCheckedChildren="禁用" @change="onChose" v-model="this.warning" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="激活卡"
          hasFeedback>
          <a-switch checkedChildren="启用" unCheckedChildren="禁用" @change="onChose1" v-model="this.activeCard"/>
        </a-form-item>
        <a-form-item v-if="activeCard==true" label="激活数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'activeCardCount', validatorRules.activeCardCount]" placeholder="请输入激活数量" style="width: 100%"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"

  export default {
    name: "IotEnterpriseOperatorGroupModal",
    components: { 
      JDictSelectTag,
    },
    data () {
      return {
        warning:true,
        activeCard:true,
        operatorId:'',
        status: 0,
        status1: 0,
        form: this.$form.createForm(this),
        title:"操作",
        width:800,
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
        validatorRules: {
          operatorId: {rules: [
          ]},
          groupId: {rules: [
            {required: true, message: '请输入群组id!'},
          ]},
          groupName: {rules: [
            {required: true, message: '请输入群组名称!'},
          ]},
          criticalValue: {rules: [
            {required: true, message: '请输入临界值(0.8，代表80%)!'},
           {pattern:/^-?\d+\.?\d*$/, message: '请输入数字!'},
          ]},
          activeCardCount: {rules: [
            {required: true, message: '请输入激活数量'},
           {pattern:/^[1-9]\d*$/, message: '请输入正整数!'},
          ]},
        },
        url: {
          add: "/enterprise/iotEnterpriseOperatorGroup/add",
          edit: "/enterprise/iotEnterpriseOperatorGroup/edit",
        }
      }
    },
    created () {
    },
    methods: {
      onChose(checked) {
        if (checked) {
          this.status = 0;
          this.warning=true;
        } else {
          this.status = 1;
          this.warning=false;
        }
      },
      onChose1(checked) {
        if (checked) {
          this.status1 = 0;
          this.activeCard=true;
        } else {
          this.status1 = 1;
          this.activeCard=false;
        }
      },
      add (operatorId) {
        this.operatorId = operatorId;
        this.edit({});
      },
      edit (record) {
        if(record.id){
          this.operatorId =record.operatorId;
          record.warning == 0?this.warning=true:false;
          record.activeCard == 0?this.activeCard=true:false;
        }
        this.form.resetFields();
        this.model = Object.assign({}, record);
        // this.model.operatorId =record.operatorId;
        this.model.warning = this.status;
        this.model.activeCard = this.status1;
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'operatorId','groupId','groupName','criticalValue','warning','activeCard','activeCardCount'))
        })
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
            formData.warning = this.status;
            formData.activeCard = this.status1;
            formData.operatorId = this.operatorId;
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
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'operatorId','groupId','groupName','criticalValue','warning','activeCard'))
      },

      
    }
  }
</script>