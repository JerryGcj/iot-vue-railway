<template>
  <a-modal
    :title="title"
    :width="600"
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
          label="状态">
          <a-select v-decorator="[ 'state', validatorRules.state]" placeholder="请选择">
            <a-select-option value="3">正常</a-select-option>
            <a-select-option value="4">停机</a-select-option>
          </a-select>
        </a-form-item>



      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {queryLowerAgent,stateUpdate } from '@/api/api'

  export default {
    name: "CardInformationStateChange",
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

          state:{
            rules: [{
              required: true, message: '请选择状态!'
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
          if(this.selectedRowKeys == ''){
            for (var a = 0; a < this.idsDate.length; a++) {
              ids += this.idsDate[a] + ",";
            }
          }else{
            for (var a = 0; a < this.selectedRowKeys.length; a++) {
              ids += this.selectedRowKeys[a] + ",";
            }
          }
          const formData = new FormData();
          //卡号id
          formData.append('ids',ids);
          //激活后是否生效
          formData.append('state',values.state);

          let httpurl = '/enterprise/iotEnterpriseCardInfo/stateUpdate';
          let method = 'post';

          httpAction(httpurl,formData,method).then((res)=>{
            if(res.success){
              that.$message.success(res.message);
              that.$emit('ok');
              that.$emit('hello');
              this.visible=false;
          }else{
            that.$emit('hello');
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