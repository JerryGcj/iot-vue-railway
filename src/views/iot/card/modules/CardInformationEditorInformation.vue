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
          label="下载模板">
          <a-button type="primary" @click="exportXlsCardTemplate('修改卡信息模版')">下载模板</a-button>
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
          label="注意事项" style="color: red">
          <span>1.ICCID必填,其他列不更新请删除</span>
          <br>
          <span>2.状态：其他、待激活、沉默期、测试期、正常、停机、已销号</span>
          <br>
          <span>3.是否终端黑名单:是,否</span>
          <br>
          <span>4.是否实名:是,否</span>
          <br>
          <span>5.使用量单位为M,不要加单位</span>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,downFile  } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {queryOperator,cardImportExcel } from '@/api/api'
  import { postAction } from '@/api/manage'

  export default {
    name: "CardInformationEditorInformation",
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
          // importType:{
          //   rules: [{
          //     required: true, message: '请选择导入方式!'
          //   }]
          // },



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

          // 按excel 导入
          const { fileList } = this;
          const formData = new FormData();
          fileList.forEach((file) => {
            formData.append('files[]', file);
          });

          postAction('cardinformation/cardInformation/ImportExcelEditorCard', formData).then((res) => {
            // this.uploading = false
            if(res.success){
            this.$message.success(res.message)
            this.visible=false
            this.$emit('ok')
          }else{
            this.$message.warning(res.message)
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
      exportXlsCardTemplate(fileName){

        let param = null;

        downFile('/cardinformation/cardInformation/exportXlsCardTemplate',param).then((data)=>{
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
