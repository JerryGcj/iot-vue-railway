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

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {queryLowerAgent,cardDistribution } from '@/api/api'

  export default {
    name: "CardInformationRecycling",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        userData:[],
        idsDate:[],
        cardNumber:'',
        selectedRowKeys: [],
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

          agentId:{
            rules: [{
              required: true, message: '请选择下级代理!'
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
      add (record) {

        this.idsDate = record;
        this.cardNumber = this.idsDate.split(",").length;
        this.edit({});
      },
      edit (record) {
        this.queryUserAgent();
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iccid','msisdn','imsi','imei','deviceOnOffState','cardState','cardOnlineStatus','wirelessAccessType','ipAddress','apn','province','city','areaCode','automaticStopResetMachine','cardSynchronization','trafficUse','packageId','packageName','trafficUseMonth','voiceUseMonth','smsUseMonth','balance','operatorType','importBatch','distributionBatch','customPackageUse','operatorId','operatorName','isTrafficCard','upstreamFlowPoolNumber','agentStopMachine','terminalBlacklist','systemFlowPoolId','isRealNameAuthentication','realNameAuditMethod','platformRealNameAuthentication','upstreamRealNameAuthentication','priority','thirtyDayCard','allocationState','customerId','customerName','isArrearage','gprsState','smsState','isFlowPool','note','createUser','createIp','updateUser','updateIp'))
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

            that.confirmLoading = true;

            const formData = new FormData();

            //卡号id
            formData.append('ids',this.idsDate);

            let httpurl = '/telecomcardinformation/telecomCardInformation/cardRecycling';
            let method = 'post';

            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
                this.visible=false
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