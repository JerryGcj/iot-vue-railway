<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-card class="card" :bordered="false">
          <detail-list>
            <detail-list-item term="分润单号">{{model.shareOrderNo}}</detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="订单号">{{model.orderNo}}</detail-list-item>
          </detail-list>
          <detail-list>
          </detail-list>
          <detail-list>
            <detail-list-item term="套餐价格(元)">{{model.packageMoney}}</detail-list-item>
            <detail-list-item term="状态">{{model.status}}</detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="套餐编号">{{model.packageId}}</detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="充值套餐">{{model.packageName}}</detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="购买数量">{{model.purchaseQuantity}}</detail-list-item>
            <detail-list-item term="分润金额(元)">{{model.shareMoney}}</detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="分润时间">{{model.createTime}}</detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="第三方支付单号">{{model.payOrderNo}}</detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="分润摘要">{{model.remark}}</detail-list-item>
          </detail-list>
        </a-card>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JDate from '@/components/jeecg/JDate'  
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import DetailList from '@/components/tools/DetailList'
  const DetailListItem = DetailList.Item

  export default {
    name: "IotShareProfitsModal",
    components: { 
      JDate,
      JDictSelectTag,
      DetailList,
      DetailListItem
    },
    data () {
      return {
        form: this.$form.createForm(this),
        title:"操作",
        width:700,
        visible: false,
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
        validatorRules: {
          shareOrderNo: {rules: [
          ]},
          iccid: {rules: [
          ]},
          higherAgent: {rules: [
          ]},
          lowerAgent: {rules: [
          ]},
          sonOrderNo: {rules: [
          ]},
          packageName: {rules: [
          ]},
          packageMoney: {rules: [
          ]},
          purchaseQuantity: {rules: [
          ]},
          shareMoney: {rules: [
          ]},
          status: {rules: [
          ]},
          createTime: {rules: [
          ]},
        },
        url: {
          add: "/shareprofits/iotShareProfits/add",
          edit: "/shareprofits/iotShareProfits/edit",
        }
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        if(this.model.status=='0'){
          this.model.status="创建";
        }
        if(this.model.status=='1'){
          this.model.status="成功";
        }
        if(this.model.status=='2'){
          this.model.status="失败";
        }
        if(this.model.status=='3'){
          this.model.status="异常";
        }
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'shareOrderNo','iccid','higherAgent','lowerAgent','serialNumber','orderNo','sonOrderNo','packageId','packageName','packageMoney','purchaseQuantity','shareMoney','status','remark','createTime'))
        })
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
            console.log("表单提交数据",formData)
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
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'shareOrderNo','iccid','higherAgent','lowerAgent','serialNumber','orderNo','sonOrderNo','packageId','packageName','packageMoney','purchaseQuantity','shareMoney','status','remark','createTime'))
      },

      
    }
  }
</script>