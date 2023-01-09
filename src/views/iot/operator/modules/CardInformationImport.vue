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
          label="群组">
          <a-select v-decorator="[ 'groupId', validatorRules.groupId]"
                    placeholder="请选择群组" style="width: 50%">
            <a-select-option v-for="d in groupData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="上游状态码">
          <a-input-number v-decorator="[ 'upstreamStatus', validatorRules.upstreamStatus]" placeholder="2:库存->激活;6:待激活->激活;5:测试->激活" style="width: 50%"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="导入方式">
          <a-select placeholder="-请选择-" v-model="importType" v-decorator="[ 'importType', validatorRules.importType]" style="width: 50%">
            <a-select-option value="0">excel文件</a-select-option>
            <a-select-option value="1">iccid区间</a-select-option>
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


      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { getAction,postAction,downFile } from '@/api/manage'
  import {queryOperator} from '@/api/api'

  export default {
    name: "CardInformationImport",
    data () {
      return {
        title:"操作",
        visible: false,
        importType:"",
        operatorId: "",
        model: {},
        fileList:[],
        groupData: [],

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
          groupId:{
            rules: [{
              required: true, message: '请选择群组!'
            }]
          },
          upstreamStatus:{
            rules: [{
              required: true, message: '请输入上游状态码!'
            }]
          },
          importType:{
            rules: [{
              required: true, message: '请选择导入方式!'
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

        },
        url: {
          add: "/enterprisetodoactived/iotEnterpriseTodoActived/add",
          edit: "/enterprisetodoactived/iotEnterpriseTodoActived/edit",
          queryGroup: "/enterprise/iotEnterpriseOperatorGroup/queryByOperatorId"
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
        console.log('record='+record)
        this.operatorId = record;
        this.queryGroup();
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
		  //时间格式化

        });
      },
      queryGroup(){
        var that = this;
        let param = {operatorId:this.operatorId}
        getAction(this.url.queryGroup,param).then((res)=>{
          console.log(res)
          if(res.success){
            that.groupData = [];
            let treeList = res.result
            for(let a=0;a<treeList.length;a++){
              let temp = treeList[a];
              this.groupData.push({
                value:temp.groupId,
                text:temp.groupName
              })
            }
          }
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

            // 按excel 导入
            if(values.importType == '0'){

              const { fileList } = this;
              const formData = new FormData();
              formData.append('operatorId',this.operatorId);
              formData.append('importType',values.importType);
              formData.append('upstreamStatus',values.upstreamStatus);
              formData.append('groupId',values.groupId);
              fileList.forEach((file) => {
                formData.append('files[]', file);
              });
              console.log(formData)
              postAction('enterprisetodoactived/iotEnterpriseTodoActived/cardImportExcel', formData).then((res) => {
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
              formData.append('operatorId',this.operatorId);
              formData.append('iccidStart',values.iccidStart);
              formData.append('iccidEnd',values.iccidEnd);
              formData.append('importType',values.importType);
              formData.append('upstreamStatus',values.upstreamStatus);
              formData.append('groupId',values.groupId);
              postAction('enterprisetodoactived/iotEnterpriseTodoActived/cardImportExcel', formData).then((res) => {
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
      handleCancel () {
        this.close()
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

        downFile('/enterprisetodoactived/iotEnterpriseTodoActived/exportCardXlsCard',param).then((data)=>{
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
