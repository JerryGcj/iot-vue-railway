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
        <a-form-item label="用户账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户账号" v-model="username" :readOnly="true"/>
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="自动扣费">
          <a-switch checkedChildren="是" unCheckedChildren="否" @change="usageChange" ></a-switch>
        </a-form-item>

        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="每G价格(元)">
          <a-input-number placeholder="请输入金额" v-decorator="['profitShare',{}]" style="width: 100%" />
        </a-form-item>



      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { postAction } from '@/api/manage'
  import pick from 'lodash.pick'

  export default {
    name: "CardInformationMonitorUse",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        username:'',
        userId: '',
        usageChecked: '',
        monitorUse: '',
        idsDate:[],
        selectedRowKeys: [],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{

          profitShare:{
            rules: [{
              required: true, message: '请输入!'
            }]
          },

        },
        url: {
          autoDeduction: "/sys/user/autoDeduction"
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
        this.username = record.username;
        this.userId = record.id;
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'profitShare'))
          //时间格式化

        });

      },
      usageChange(checked) {
        if(checked){
          this.monitorUse = '1';
        }else{
          this.monitorUse = '0';
        }
      },
      usageSwitch(){
        if(this.usageChecked){
          this.monitorUse = '1';
        }else{
          this.monitorUse = '0';
        }
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
            if(this.monitorUse == true&&values.profitShare==undefined){
              that.$message.warning('请输入金额');
              that.confirmLoading = false;
              return;
            }
            let param = {userId: this.userId,monitorUse:this.monitorUse,profitShare:values.profitShare};
            postAction(this.url.autoDeduction, param).then((res)=>{
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
      },

    }
  }
</script>

<style lang="less" scoped>

</style>