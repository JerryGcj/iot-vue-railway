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
          label="账号">
          <a-select v-decorator="[ 'agentId', validatorRules.agentId]"
                    placeholder="账号">
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
          label="卡类型">
          <a-select placeholder="-请选择-" v-decorator="[ 'cardType', validatorRules.cardType]">
            <a-select-option value="0">全网</a-select-option>
            <a-select-option value="1">省网</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="导入方式">
          <a-select placeholder="-请选择-" v-model="importType" v-decorator="[ 'importType', validatorRules.importType]">
            <a-select-option value="0">excel文件</a-select-option>
            <a-select-option value="1">iccid区间</a-select-option>
            <!--<a-select-option value="2">msisdn区间</a-select-option>-->
          </a-select>
        </a-form-item>

        <a-form-item v-if="importType === '0'"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="下载模板">
          <a-button type="primary" @click="exportCardXlsCard('卡导入模版')">下载模板</a-button>
        </a-form-item>

        <a-form-item v-if="importType === '0'"
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
              <a-icon type="upload"/>
              选择导入文件
            </a-button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </a-upload>
        </a-form-item>

        <a-form-item label="开始ICCID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="importType === '1'">
          <a-input placeholder="开始ICCID" v-decorator="[ 'iccidStart', validatorRules.iccidStart]" />
        </a-form-item>

        <a-form-item label="结束ICCID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="importType === '1'">
          <a-input placeholder="结束ICCID" v-decorator="[ 'iccidEnd', validatorRules.iccidEnd]" />
        </a-form-item>

        <a-form-item label="开始MSISDN" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="importType === '2'">
          <a-input placeholder="开始MSISDN" v-decorator="[ 'msisdnStart', validatorRules.msisdnStart]" />
        </a-form-item>

        <a-form-item label="结束MSISDN" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="importType === '2'">
          <a-input placeholder="结束MSISDN" v-decorator="[ 'msisdnEnd', validatorRules.msisdnEnd]" />
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
  import {queryOperator,cardImportExcel,queryLowerAgent } from '@/api/api'
  import { postAction } from '@/api/manage'

  export default {
    name: "CardInformationImport",
    data () {
      return {
        title:"操作",
        visible: false,
        importType:"",
        model: {},
        fileList:[],
        userData:[],
        needSync: 1,
        monitorUse: 1,
        options: 1,
        usageChecked: "",
        importOperatorData:[],

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
          importType:{
            rules: [{
              required: true, message: '请选择导入方式!'
            }]
          },
          cardType:{
            rules: [{
              required: true, message: '请选择卡类型!'
            }]
          },
          iccidStart:{
            rules: [{
              required: true, message: '请输入开始iccid!'
            }]
          },
          iccidEnd:{
            rules: [{
              required: true, message: '请输入结束iccid!'
            }]
          },
          msisdnStart:{
            rules: [{
              required: true, message: '请输入开始msisdn!'
            }]
          },
          msisdnEnd:{
            rules: [{
              required: true, message: '请输入结束msisdn!'
            }]
          }

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
      add () {
        this.edit({});
      },
      edit (record) {
        this.importOperator();
        this.queryUserAgent();
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
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
              // 按excel 导入
              if(values.importType == '0'){

                const { fileList } = this;
                const formData = new FormData();
                formData.append('userId',values.agentId);
                formData.append('operatorId',values.operatorId);
                formData.append('note',values.note);
                formData.append('importType',values.importType);
                formData.append('cardType',values.cardType);
                fileList.forEach((file) => {
                  formData.append('files[]', file);
                });

                postAction('telecomcardinformation/telecomCardInformation/cardImportExcel', formData).then((res) => {
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
              }
              //ICCID 导入
              if(values.importType == '1'){

                const formData = new FormData();
                formData.append('userId',values.agentId);
                formData.append('operatorId',values.operatorId);
                formData.append('iccidStart',values.iccidStart);
                formData.append('iccidEnd',values.iccidEnd);
                formData.append('importType',values.importType);
                formData.append('note',values.note);
                formData.append('cardType',values.cardType);

                postAction('telecomcardinformation/telecomCardInformation/cardImportExcel', formData).then((res) => {
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
              }
              //MSISDN 导入
              if(values.importType =='2'){

                const formData = new FormData();
                formData.append('userId',values.agentId);
                formData.append('operatorId',values.operatorId);
                formData.append('msisdnStart',values.msisdnStart);
                formData.append('msisdnEnd',values.msisdnEnd);
                formData.append('importType',values.importType);
                formData.append('note',values.note);

                postAction('telecomcardinformation/telecomCardInformation/cardImportExcel', formData).then((res) => {
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

              }
            }
         })
      },
      openSwitch(checked){
        if(checked){
          this.needSync = 0;
        }else{
          this.needSync = 1;
        }
      },
      usageChange(checked) {
        this.usageChecked = checked;
      },
      usageSwitch(){
        if(this.usageChecked){
          this.options = 0;
          this.monitorUse = 0;
        }else{
          this.options = 1;
          this.monitorUse = 1;
        }
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
      importOperator(){
        var that = this;
        let params = {operatorTypeId:"3"}
        queryOperator(params).then((res)=>{
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

      exportCardXlsCard(fileName){

        let param = null;

        downFile('/telecomcardinformation/telecomCardInformation/exportCardXlsCard',param).then((data)=>{
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
