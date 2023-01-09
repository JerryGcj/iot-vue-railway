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


        <a-form-item label="需要转移的卡ICCID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="需要转移的卡ICCID" v-decorator="[ 'iccidStart', validatorRules.iccidStart]" />
        </a-form-item>

        <a-form-item label="目标卡ICCID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="目标卡ICCID" v-decorator="[ 'iccidEnd', validatorRules.iccidEnd]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,downFile } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {queryOperator,cardImportExcel,duplicateCheck } from '@/api/api'
  import { postAction } from '@/api/manage'

  export default {
    name: "CardInformationPackageTransfer",
    data () {
      return {
        title:"操作",
        visible: false,
        importType:"",
        model: {},
        fileList:[],
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

          iccidStart:{
            rules: [{
              required: true, message: '请输入需要转移的卡ICCID!'
            },{
              validator: this.validateIccid,
            }]
          },
          iccidEnd:{
            rules: [{
              required: true, message: '请输入目标卡ICCID!'
            },{
              validator: this.validateIccid,
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
      add () {
        this.edit({});
      },
      edit (record) {
        this.importOperator();
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

            that.confirmLoading = true;

            // 按excel 导入
            if(values.importType == '0'){

                const { fileList } = this;
                const formData = new FormData();
                formData.append('iccidStart',values.iccidStart);
                formData.append('iccidEnd',values.iccidEnd);

                fileList.forEach((file) => {
                  formData.append('files[]', file);
                });

                postAction('cardinformation/cardInformation/cardPackageTransfer', formData).then((res) => {
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

         })
      },
      handleCancel () {
        this.close()
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
      validateIccid(rule, value, callback){
        var params = {
          tableName: 'iot_card_information',
          fieldName: 'iccid',
          fieldVal: value,
          dataId: this.userId
        };
        duplicateCheck(params).then((res) => {
          if (res.success) {
          callback("无此卡!")
        } else {
          callback()
        }
      })
      },
    }
  }
</script>
