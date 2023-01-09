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
          label="下级代理">
          <a-select v-decorator="[ 'agentId', validatorRules.agentId]"
                    placeholder="下级代理">
            <a-select-option v-for="d in userData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="运营商">
          <a-select v-decorator="[ 'operatorId', validatorRules.operatorId]"
                    placeholder="请选择运营商">
            <a-select-option v-for="d in importOperatorData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="下载模板">
          <a-button type="primary" @click="exportCardXlsCard('卡导入分配模版')">下载模板</a-button>
        </a-form-item>

        <a-form-item
           :labelCol="labelCol"
           :wrapperCol="wrapperCol"
           label="选择文件">
          <a-upload
            name="file"
            :multiple="true"
            accept=".xls,.xlsx"
            :fileList="fileList"
            :remove="handleRemove"
            :beforeUpload="beforeUpload">

            <a-button>
              <a-icon type="upload" />
              选择导入文件
            </a-button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </a-upload>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-input placeholder="请输入备注" v-decorator="['note', {}]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,downFile } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {queryLowerAgent } from '@/api/api'
  import {queryOperator } from '@/api/api'
  import { postAction } from '@/api/manage'

  export default {
    name: "CardInformationImportDistribution",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        userData:[],
        fileList:[],
        importOperatorData:[],
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


          operatorId:{
            rules: [{
              required: true, message: '请选择运营商!'
            }]
          },

          agentId:{
            rules: [{
              required: true, message: '请选择下级代理!'
            }]
          },

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
      add (record) {
        this.cardNumber = record;
        this.edit({});
      },
      edit (record) {
        this.importOperator();
        this.queryUserAgent();
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'iccid','msisdn','imsi','imei','deviceOnOffState','cardState','cardOnlineStatus','wirelessAccessType','ipAddress','apn','province','city','areaCode','automaticStopResetMachine','cardSynchronization','trafficUse','packageId','packageName','trafficUseMonth','voiceUseMonth','smsUseMonth','balance','operatorType','importBatch','distributionBatch','customPackageUse','operatorId','operatorName','isTrafficCard','upstreamFlowPoolNumber','agentStopMachine','terminalBlacklist','systemFlowPoolId','isRealNameAuthentication','realNameAuditMethod','platformRealNameAuthentication','upstreamRealNameAuthentication','priority','thirtyDayCard','allocationState','customerId','customerName','isArrearage','gprsState','smsState','isFlowPool','note','createUser','createIp','updateUser','updateIp'))

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

          const { fileList } = this;
          const formData = new FormData();
          formData.append('operatorId',values.operatorId);
          formData.append('note',values.note);
          formData.append('agentId',values.agentId);


          fileList.forEach((file) => {
            formData.append('files[]', file);
          });

          postAction('cardinformation/cardInformation/cardImportDistributionExcel', formData).then((res) => {
              // this.uploading = false
              if(res.success){
              this.$message.success(res.message)
              this.visible=false
              this.$emit('ok')
            }else{
              this.$message.warning(res.message)
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
              text:temp.userCompany
            })
          }
        }
      });

      },
      beforeUpload(file) {
        this.fileList = [...this.fileList, file]
        return false;
      },
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList
      },
      importOperator(){
        var that = this;
        queryOperator().then((res)=>{
          if(res.success){
          that.importOperatorData = [];
          let treeList = res.result
          for(let a=0;a<treeList.length;a++){
            let temp = treeList[a];
            this.importOperatorData.push({
              value:temp.id,
              text:temp.operatorName
            })
          }
        }
      });
      },

      exportCardXlsCard(fileName){

        let param = null;

        downFile('/cardinformation/cardInformation/exportCardXlsCard',param).then((data)=>{
          if (!data) {
          this.$message.warning("文件下载失败")
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), fileName+'.xls')
        }else{
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName+'.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        }
      })

      }


    }
  }
</script>

<style lang="less" scoped>

</style>