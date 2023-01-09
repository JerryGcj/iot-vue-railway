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

        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="最大用量(M)">
          <a-input placeholder="请输入最大用量" v-decorator="['thresholdUsage', {}]" style="width: 50%" />
        </a-form-item>

        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="监控用量">
          <a-switch checkedChildren="是" unCheckedChildren="否" @change="usageChange" @click="usageSwitch()"></a-switch>
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
        cardNumber:'',
        usageChecked: '',
        monitorUse: '1',
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
          add: "/unicomcardinformation/unicomCardInformation/add",
          edit: "/unicomcardinformation/unicomCardInformation/edit",
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
        this.edit(record2);
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'thresholdUsage','monitorUse'))
          //时间格式化

        });

      },
      usageChange(checked) {
        this.usageChecked = checked;
      },
      usageSwitch(){
        if(this.usageChecked){
          this.monitorUse = 0;
        }else{
          this.monitorUse = 1;
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
            postAction("/unicomcardinformation/unicomCardInformation/handleMonitorUse", {ids: ids,monitorUse:this.monitorUse,thresholdUsage:values.thresholdUsage}).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
                that.$emit('hello');
                that.thresholdUsage='';
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