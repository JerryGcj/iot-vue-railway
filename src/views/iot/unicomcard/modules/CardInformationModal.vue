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


		
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "CardInformationModal",
    data () {
      return {
        title:"操作",
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
        },
        url: {
          add: "/cardinformation/cardInformation/add",
          edit: "/cardinformation/cardInformation/edit",
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
          this.form.setFieldsValue(pick(this.model,'iccid','msisdn','imsi','imei','deviceOnOffState','cardState','cardOnlineStatus','wirelessAccessType','ipAddress','apn','province','city','areaCode','automaticStopResetMachine','cardSynchronization','trafficUse','packageId','packageName','trafficUseMonth','voiceUseMonth','smsUseMonth','balance','operatorType','importBatch','distributionBatch','customPackageUse','operatorId','operatorName','isTrafficCard','upstreamFlowPoolNumber','agentStopMachine','terminalBlacklist','systemFlowPoolId','isRealNameAuthentication','realNameAuditMethod','platformRealNameAuthentication','upstreamRealNameAuthentication','priority','thirtyDayCard','allocationState','customerId','customerName','isArrearage','gprsState','smsState','isFlowPool','note','createUser','createIp','updateUser','updateIp'))
		  //时间格式化
          this.form.setFieldsValue({theNetTime:this.model.theNetTime?moment(this.model.theNetTime):null})
          this.form.setFieldsValue({activationTime:this.model.activationTime?moment(this.model.activationTime):null})
          this.form.setFieldsValue({mandatoryEffectiveDate:this.model.mandatoryEffectiveDate?moment(this.model.mandatoryEffectiveDate):null})
          this.form.setFieldsValue({synchronizationTime:this.model.synchronizationTime?moment(this.model.synchronizationTime):null})
          this.form.setFieldsValue({loseEfficacyTime:this.model.loseEfficacyTime?moment(this.model.loseEfficacyTime):null})
          this.form.setFieldsValue({createDate:this.model.createDate?moment(this.model.createDate):null})
          this.form.setFieldsValue({updateDate:this.model.updateDate?moment(this.model.updateDate):null})
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
            formData.theNetTime = formData.theNetTime?formData.theNetTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.activationTime = formData.activationTime?formData.activationTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.mandatoryEffectiveDate = formData.mandatoryEffectiveDate?formData.mandatoryEffectiveDate.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.synchronizationTime = formData.synchronizationTime?formData.synchronizationTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.loseEfficacyTime = formData.loseEfficacyTime?formData.loseEfficacyTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.createDate = formData.createDate?formData.createDate.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.updateDate = formData.updateDate?formData.updateDate.format('YYYY-MM-DD HH:mm:ss'):null;
            
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


    }
  }
</script>

<style lang="less" scoped>

</style>