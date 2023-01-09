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
          label="卡续费方式">
          <a-select placeholder="-请选择-" v-model="importType" v-decorator="[ 'importType', {}]">
            <a-select-option value="0">excel文件</a-select-option>
            <a-select-option value="1">iccid</a-select-option>
          </a-select>
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
              <a-icon type="upload" />
              选择导入文件
            </a-button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span><a href="">下载模板</a></span>
          </a-upload>
        </a-form-item>

        <a-form-item label="iccid" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="importType === '1'"
          help="多张卡请用逗号分隔">
          <a-textarea placeholder="iccid" v-decorator="[ 'iccid', validatorRules.iccid]" />
        </a-form-item>

        <a-form-item label="套餐类型" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-radio-group defaultValue="0" buttonStyle="solid"  v-model="packageType" v-decorator="[ 'packageType', validatorRules.packageType]">
            <a-radio-button value="0">流量</a-radio-button>
            <a-radio-button value="1">语音</a-radio-button>
            <a-radio-button value="2">短信</a-radio-button>
            <a-radio-button value="3">混合</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="套餐">
          <a-select :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
                    v-decorator="[ 'packageId', validatorRules.packageId]"
                    placeholder="套餐" @change="judgePackage">
            <a-select-option  v-for="d in packageData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="数量">
          <a-input style="width: 120px" placeholder="请输入数量"  v-decorator="['packageNumber', validatorRules.packageNumber]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="总金额">
          <a-input disabled  v-model="packageMoney" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否立即生效">
          <a-radio-group  buttonStyle="solid"  v-model="effect" v-decorator="[ 'effect', validatorRules.effect]">
            <a-radio-button value="0">是</a-radio-button>
            <a-radio-button value="1">否</a-radio-button>
          </a-radio-group>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {queryOperator,cardImportExcel,queryStandardcost } from '@/api/api'
  import { postAction } from '@/api/manage'
  import ATextarea from "ant-design-vue/es/input/TextArea";


  export default {
    name: "CardInformationRenewal",
    components: {
      ATextarea,
      queryStandardcost
    },
    data () {
      return {
        title:"操作",
        visible: false,
        importType:"",
        packageMoney:'',
        packageData:[],
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
          importType:{
            rules: [{
              required: true, message: '请选择导入方式!'
            }]
          },

          packageId:{
            rules: [{
              required: true, message: '请选择套餐!'
            }]
          },

          packageNumber:{
            rules: [{
              required: true, message: '请输入套餐数量!'
            }]
          },

          effect:{
            rules: [{
              required: true, message: '请选择是否立即生效!'
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
        this.queryStandardcostList();
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
            // 按excel 导入
            if(values.importType == '0'){
                const { fileList } = this;
                const formData = new FormData();
                formData.append('operatorId',values.operatorId);
                formData.append('note',values.note);
                formData.append('importType',values.importType);
                fileList.forEach((file) => {
                  formData.append('files[]', file);
                });
                postAction('cardinformation/cardInformation/cardImportExcel', formData).then((res) => {
                  // this.uploading = false
                  if(res.success){
                  this.$message.success(res.message)
                  this.visible=false
                  this.$emit('ok')
                }else{
                  this.$message.warning(res.message)
                }
              })
            }
            //ICCID 导入
            if(values.importType == '1'){
              const formData = new FormData();
              formData.append('operatorId',values.operatorId);
              formData.append('iccidStart',values.iccidStart);
              formData.append('iccidEnd',values.iccidEnd);
              formData.append('importType',values.importType);
              formData.append('note',values.note);
              postAction('cardinformation/cardInformation/cardImportExcel', formData).then((res) => {
                // this.uploading = false
                if(res.success){
                this.$message.success(res.message)
                this.visible=false
                this.$emit('ok')
              }else{
                this.$message.warning(res.message)
              }
            })
            }
            //MSISDN 导入
            if(values.importType =='2'){
              const formData = new FormData();
              formData.append('operatorId',values.operatorId);
              formData.append('msisdnStart',values.msisdnStart);
              formData.append('msisdnEnd',values.msisdnEnd);
              formData.append('importType',values.importType);
              formData.append('note',values.note);
              postAction('cardinformation/cardInformation/cardImportExcel', formData).then((res) => {
                // this.uploading = false
                if(res.success){
                this.$message.success(res.message)
                this.visible=false
                this.$emit('ok')
              }else{
                this.$message.warning(res.message)
              }
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
      queryStandardcostList(){
        var that = this;
        queryStandardcost().then((res)=>{
          if(res.success){
          that.packageData = [];
          let treeList = res.result
          for(let a=0;a<treeList.length;a++){
            let temp = treeList[a];
            this.packageData.push({
              value:temp.id,
              text:temp.packageName
            })
          }
        }
      });
      },
      judgePackage(value){

        queryStandardcost().then((res)=>{
          if(res.success){
          let treeList = res.result
          for(let a=0;a<treeList.length;a++){
            let temp = treeList[a];

            if(value == temp.id){

            }
          }
        }
      });

      }
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
  .ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
  }
</style>