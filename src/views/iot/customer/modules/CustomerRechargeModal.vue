<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-card class="card"  :bordered="false">
          <a-form-item
            label="充值金额"
            :labelCol="{lg: {span: 7}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 10}, sm: {span: 10} }"
            help="选择金额后点击”确定“生成付款二维码，如更改金额请再次点击”确定“刷新二维码">
            <a-radio-group v-model="amount" v-decorator="['amount', validatorRules.amount]">
              <a-radio :value="100">100元</a-radio>
              <a-radio :value="300">300元</a-radio>
              <a-radio :value="500">500元</a-radio>
              <a-radio :value="1000">1000元</a-radio>
              <a-radio :value="4">其它</a-radio>
            </a-radio-group>
            <a-form-item v-if="amount === 4">
              <a-input type="number" placeholder="请输入金额" v-decorator="[ 'money', validatorRules.money]"/>
            </a-form-item>
            <div style="padding: 10px 80px;">
              <div id="qrcode" ref="qrcode"></div>
            </div>
            <div style="padding: 10px 50px;">
              <div style="display: none" id="wxtips" ref="wxtips"><img src="./wxtip.png"></div>
            </div>
          </a-form-item>
        </a-card>
      </a-form>
    </a-spin>
    <q-r-code-modal ref="qrcodeModal" ></q-r-code-modal>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import { queryDetails } from '@/api/api'
  import QRCodeModal from './QRCodeModal'
  import QRCode from 'qrcodejs2'

  export default {
    name: "CustomerRechargeModal",
    components: {
      JDictSelectTag,
      queryDetails
    },
    data () {
      return {
        money:'',
        form: this.$form.createForm(this),
        title:"操作",
        width:950,
        visible: false,
        model: {},
        dataSource: [],
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
          amount: {rules: [
              { required: true, message: '请选择充值金额' }
          ]},
          money: {rules: [
              { required: true, message: '请输入金额' }
          ]}
        },
        url: {
          recharge: "/customermanagement/customerManagement/recharge"
        },
      }
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'amount','money'))
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.$refs.qrcode.style.display="none";
        this.$refs.wxtips.style.display="none";
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            httpAction(this.url.recharge,formData,'post').then((res)=>{
              if(res.success){
                /*this.$refs.qrcodeModal.add(res.message);
                this.$refs.qrcodeModal.title="充值二维码";
                this.$refs.qrcodeModal.disableSubmit = true;*/
                that.closeCode();
                that.$refs.qrcode.style.display="inline";
                that.$refs.wxtips.style.display="inline";
                let qrcode = new QRCode("qrcode",{
                  width: 200, // 设置宽度，单位像素
                  height: 200, // 设置高度，单位像素
                  text: res.message, // 设置二维码内容或跳转地址
                })
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }

        })
      },
      handleCancel () {
        this.close()
      },
      closeCode(){
        this.$refs.qrcode.innerHTML="";
      }
    }
  }
</script>