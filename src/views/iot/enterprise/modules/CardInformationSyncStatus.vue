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
                     label="同步用量">
          <a-switch checkedChildren="是" unCheckedChildren="否" :checked="checked" @change="usageChange"></a-switch>
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
        checked: false,
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
          add: "/enterprise/iotEnterpriseCardInfo/add",
          edit: "/enterprise/iotEnterpriseCardInfo/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add (record,record1) {
        this.selectedRowKeys = record;
        this.idsDate = record1;

        if(this.selectedRowKeys == ''){
          this.cardNumber = this.idsDate.length;
        }else{
          this.cardNumber = this.selectedRowKeys.length;
        }
        this.edit(record1);
      },
      edit (record) {
        this.form.resetFields();
        if(record.length==1){
          if(record[0].needSync==0){
            this.checked = true;
          }else{
            this.checked = false;
          }
        }else{
          this.checked = false;
        }
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model))
          //时间格式化

        });

      },
      usageChange(checked) {
        this.checked = checked
        if(this.checked){
          this.monitorUse = 0;
        }else{
          this.monitorUse = 1;
        }
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
                ids += this.idsDate[a].id + ",";
              }
            }else{
              for (var a = 0; a < this.selectedRowKeys.length; a++) {
                ids += this.selectedRowKeys[a] + ",";
              }
            }
            postAction("/enterprise/iotEnterpriseCardInfo/syncCardStatus", {ids: ids,monitorUse:this.monitorUse}).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
                that.$emit('hello');
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

    }
  }
</script>

<style lang="less" scoped>

</style>