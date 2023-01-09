<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="运营商">
          <a-select :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
                    v-decorator="[ 'operatorId', validatorRules.operatorId]"
                    placeholder="运营商">
            <a-select-option v-for="d in operatorDataAdd" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="套餐">
          <a-select :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
                    v-decorator="[ 'packageId', validatorRules.packageId]"
                    placeholder="套餐">
            <a-select-option v-for="d in packageData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态">
          <a-radio-group  buttonStyle="solid"   v-decorator="[ 'state', validatorRules.state]">
            <a-radio-button value="0">上架</a-radio-button>
            <a-radio-button value="1">下架</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="成本（元）">
          <a-input-number v-decorator="[ 'cost', validatorRules.cost]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="上游套餐编码">
          <a-input placeholder="请输入上游套餐编码" v-decorator="['upstreamPackageCode', validatorRules.upstreamPackageCode]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-textarea placeholder="请输入备注" v-decorator="['note', {}]" />
        </a-form-item>

      </a-form>
    </a-spin>
    <a-button type="primary" @click="handleOk">确定</a-button>
    <a-button type="primary" @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {queryOperator,queryStandardcost } from '@/api/api'
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    name: "DiscountPackageModal",
    components: {
      ATextarea,
      queryOperator,
      queryStandardcost
    },
    data () {
      return {
        title:"操作",
        visible: false,
        operatorDataAdd:[],
        packageData:[],
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

          operatorId:{
            rules: [{
              required: true, message: '请选择运营商!'
            }]
          },
          packageId:{
            rules: [{
              required: true, message: '请选择套餐!'
            }]
          },
          state:{
            rules: [{
              required: true, message: '请选择状态!'
            }]
          },
          cost:{
            rules: [{
              required: true, message: '请输入成本!'
            }]
          },
          upstreamPackageCode:{
            rules: [{
              required: true, message: '请输入上游套餐编码!'
            }]
          },
        },
        url: {
          add: "/discountpackage/discountPackage/add",
          edit: "/discountpackage/discountPackage/edit",
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
        this.queryOperatorListAdd();
        this.queryStandardcostList();
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'operatorType','operatorId','operatorName','packageId','packageName','state','cost','upstreamPackageCode','note','createUser','createIp','updateUser','updateIp'))
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

      queryOperatorListAdd(){
        var that = this;
        queryOperator().then((res)=>{
          if(res.success){
          that.operatorDataAdd = [];
          let treeList = res.result
          for(let a=0;a<treeList.length;a++){
            let temp = treeList[a];
            this.operatorDataAdd.push({
              value:temp.id,
              text:temp.operatorName
            })
          }
        }
      });

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