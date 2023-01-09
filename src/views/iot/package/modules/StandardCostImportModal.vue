<template>
  <a-modal
    title="套餐信息导入"
    :width="600"
    :visible="visible"
    :confirmLoading="uploading"
    @cancel="handleClose">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol"
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
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="下载模板">
          <a @click="exportTemplate('套餐信息导入模板')"><a-icon type="paper-clip" />套餐信息导入模板</a>
        </a-form-item>
      </a-form>
    </a-spin>



    <template slot="footer">
      <a-button @click="handleClose">关闭</a-button>
      <a-button
        type="primary"
        @click="handleImport"
        :disabled="fileList.length === 0"
        :loading="uploading">
        {{ uploading ? '上传中...' : '开始上传' }}
      </a-button>
    </template>

  </a-modal>
</template>

<script>
  import { postAction,getAction,downFile } from '@/api/manage'

  export default {
    name: 'StandardCostImportModal',
    props:{
      url:{
        type: String,
        default: '',
        required: false
      }
    },
    data(){
      return {
        visible:false,
        uploading:false,
        fileList:[],
        uploadAction:'',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this)
      }
    },
    watch: {
      url (val) {
        if(val){
          this.uploadAction = window._CONFIG['domianURL']+val
        }
      }
    },
    created () {
      this.uploadAction = window._CONFIG['domianURL']+this.url
    },

    methods:{
      handleClose(){
        this.visible=false
      },
      show(){
        this.fileList = [];
        this.uploading = false;
        this.visible = true
      },
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList
      },
      beforeUpload(file) {
        this.fileList = [...this.fileList, file];
        return false;
      },
      handleImport() {
        const { fileList } = this;
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append('files[]', file);
        });
        this.uploading = true;
        postAction(this.uploadAction, formData).then((res) => {
          this.uploading = false;
          if(res.success){
            this.$message.success(res.message);
            this.visible=false;
            this.$emit('ok')
          }else{
            this.$message.warning(res.message)
          }
        })
      },
      exportTemplate(fileName){

        let param = null;

        downFile("/standardcost/standardCost/download", param).then((data)=>{
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

<style scoped>

</style>