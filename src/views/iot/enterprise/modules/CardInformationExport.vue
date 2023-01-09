<template>
  <a-modal
    :title="title"
    :width="400"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          label="月份"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          help="不选择月份时，默认导出当前月数据">
          <a-month-picker placeholder="请选择月份" @change="onChange" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { downFile } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {queryLowerAgent } from '@/api/api'
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    name: "CardInformationExport",
    components: {ATextarea},
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        userData:[],
        cardNumber:'',
        idsDate:[],
        customerId:'',
        selectedRowKeys: [],
        param:{},
        date:'',
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

          note:{
            rules: [{
              required: true, message: '请输入备注!'
            }]
          },

        },
        url: {
          add: "/enterprise/iotEnterpriseCardInfo/add",
          edit: "/enterprise/iotEnterpriseCardInfo/edit",
          exportXlsUrl: "/enterprise/iotEnterpriseCardInfo/exportXls"
        },
      }
    },
    created () {
    },
    methods: {
      add (record) {
        this.param = record;

        /*if(this.selectedRowKeys == ''){
          this.cardNumber = this.idsDate.length;
        }else{
          this.cardNumber = this.selectedRowKeys.length;
        }*/
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
      onChange(date,dateString) {
        this.date = dateString;
        console.log(date,dateString);
        console.log(this.date);
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
            var fileName = this.date+"移动卡信息";
            this.param['month'] = this.date;
            downFile(this.url.exportXlsUrl,this.param).then((data)=>{
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