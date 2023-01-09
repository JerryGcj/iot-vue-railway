<template>
  <a-modal
    :title="title"
    :width="500"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="卡数量">
          <a-input disabled v-model="cardNumber" />
        </a-form-item>


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="套餐">
          <j-dict-select-tag v-decorator="['packageId', validatorRules.packageId]" :triggerChange="true" placeholder="请选择" dictCode="iot_standard_cost,package_name,id"/>
        </a-form-item>

      </a-form>

    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,deleteAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import JDate from '@/components/jeecg/JDate'
  import { getRefPromise } from '@/utils/JEditableTableUtil'

  import JEditableTable from './JEditableTable'

  export default {
    name: "CardInformationDistributionPackageOne",
    components: {
      ATextarea,
      JDate,
      JEditableTable
    },
    data () {
      return {
        title:"操作",
        visible: false,
        formData: {},
        model: {},
        userData:[],
        loading: false,
        cardNumber:'',
        packageData:[],
        idsDate:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          packageId:{
            rules: [{
              required: true, message: '请选择套餐!'
            }]
          }
        },
        url: {
          add: "/unicomcardinformation/unicomCardInformation/add",
          edit: "/unicomcardinformation/unicomCardInformation/edit",
        },
      }
    },
    methods: {
      add (record,record2) {
        this.selectedRowKeys = record;
        this.idsDate = record2;
        if(this.selectedRowKeys == ''){
          this.cardNumber = this.idsDate.length;
        }else{
          this.cardNumber = this.selectedRowKeys.length;
        }
        this.edit({});
      },
      edit (record) {
        // this.queryStandardcostList();
        //this.queryDiscountPackage();
        //this.queryUserAgent();
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iccid'))
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
            var ids = "";
            if(this.selectedRowKeys == ''){
              for (var a = 0; a < this.idsDate.length; a++) {
                ids += this.idsDate[a] + ",";
              }
            }else{
              for (var a = 0; a < this.selectedRowKeys.length; a++) {
                ids += this.selectedRowKeys[a] + ",";
              }
            }
            const formData = new FormData();
            //卡号id
            formData.append('ids',ids);
            //激活后是否生效
            formData.append('packageId',values.packageId);

            let httpurl = '/enterprise/iotEnterpriseCardInfo/packageConfig';
            let method = 'post';

            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
                that.$emit('hello');
                this.visible=false;
              }else{
                that.$emit('hello');
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