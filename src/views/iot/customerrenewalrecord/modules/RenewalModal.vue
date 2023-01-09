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
      <a-row>
        <a-col>
          <span style="margin-left: 60px;">
            续费卡数量：<strong>{{this.count}}</strong>，
            续费总金额：<strong>{{this.money}}</strong> 元，
            账户余额：<strong>{{this.balance}}</strong> 元，确定续费吗？
          </span><p></p>
          <span style="margin-left: 200px;color: #9e9e9e">
            注：默认续费有效期为一年
          </span>
        </a-col>
      </a-row>

    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import { queryDetails } from '@/api/api'

  export default {
    name: "CustomerRechargeModal",
    components: {
      JDictSelectTag,
      queryDetails
    },
    data () {
      return {
        money:'',
        balance: '',
        count: '',
        form: this.$form.createForm(this),
        title:"操作",
        width:600,
        visible: false,
        model: {},
        dataSource: [],
        cardList: [],
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

        },
        url: {
          recharge: "/enterprise/iotEnterpriseCardInfo/onekeyRenewal",
          renewal: "/customerrenewalrecord/customerRenewalRecord/renewal"
        },
      }
    },
    created() {

    },
    methods: {
      add (res) {
        this.cardList = res;
        console.log('this.cardList>>>>'+JSON.stringify(this.cardList))
        this.count = res.result.count;
        this.money = res.result.money;
        this.balance = res.result.balance;
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
            if(this.money>this.balance){
              that.$message.warning('账户余额不足，请先充值！');
              that.confirmLoading = false;
            }else{
              let formData = this.cardList;
              httpAction(this.url.recharge,formData,'post').then((res)=>{
                if(res.success){
                  that.$message.success(res.message);
                  that.$emit('ok');
                  this.visible=false;
                  this.loading = false;
                }else{
                  that.$message.warning(res.message);
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
      closeCode(){
        this.$refs.qrcode.innerHTML="";
      },
      initData(){
        const that = this;
        let formData = this.cardList;
        httpAction(this.url.renewal,formData,'post').then((res)=>{
          console.log('res==='+JSON.stringify(res))
          if(res.success){
            this.count = res.result.count;
            this.money = res.result.money;
            this.balance = res.result.balance;
          }else{
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.confirmLoading = false;
        })
      }
    }
  }
</script>