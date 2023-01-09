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
          <a-input disabled v-model="cardNumber" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="注">
          <span>1、默认续费全部卡，如需给单个卡续费，请先选中要续费的卡然后再点击续费</span>
          <br>
          <span>2、默认续费时长为1年</span>
        </a-form-item>
      </a-form>

    </a-spin>

  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import {queryLowerAgent,stateUpdate } from '@/api/api'

  export default {
    name: "CardInformationRenewal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        userData:[],
        idsDate:[],
        selectedRowKeys: [],
        cardNumber:'',
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

        },
        url: {
          add: "/telecomcardinformation/telecomCardInformation/add",
          edit: "/telecomcardinformation/telecomCardInformation/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add (record,record1) {

        this.selectedRowKeys = record;
        if(this.selectedRowKeys == ''){
          this.cardNumber = record1;
        }else{
          this.cardNumber = this.selectedRowKeys.length;
        }
        this.edit({});
      },
      edit (record) {
        // this.queryUserAgent();
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

          var ids = "";
          if(this.selectedRowKeys != ''){
            for (var a = 0; a < this.selectedRowKeys.length; a++) {
              ids += this.selectedRowKeys[a] + ",";
            }
          }
          const formData = new FormData();
          //卡号id
          formData.append('ids',ids);

          let httpurl = '/telecomcardinformation/telecomCardInformation/renewal';
          let method = 'post';

          httpAction(httpurl,formData,method).then((res)=>{
            console.log(res);
            /*that.$refs.cardInformationRenewalConfirm.add(res);
            that.$refs.cardInformationRenewalConfirm.title = "续费确认";
            that.$refs.cardInformationRenewalConfirm.disableSubmit = false;*/
            if(res.success){
              that.$message.success(res.message);
              that.$emit('ok');
              that.$emit('hello');
              this.visible=false;
            }else{
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
            that.close();
          })
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


    }
  }
</script>

<style lang="less" scoped>

</style>