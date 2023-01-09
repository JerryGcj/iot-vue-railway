<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-card class="card"  :bordered="false">
          <a-form-item
            label="请打开微信扫一扫完成充值"
            :labelCol="{lg: {span: 18}, sm: {span: 18}}"
            :wrapperCol="{lg: {span: 10}, sm: {span: 10} }">
            <!--<div v-for="(fileDetail,index) in dataSource[0].fileDetails" :key="index">
              <div style="width: 100%;height: 100%;position: relative;padding: 8px;border: 0px solid #d9d9d9;border-radius: 4px;">
                <img style="width: 100%;" :src="fileDetail.imgUrl"  :preview="dataSource[0].key">
              </div>
            </div>-->
            <div style="padding: 10px 105px;" id="qrcode" ref="qrcode"></div>

          </a-form-item>
        </a-card>

        <!--<a-crad>
          <a-row class="form-row" :gutter="16">
            <a-col :lg="8">
              <a-form-item label="身份证正面">
                <div v-for="(fileDetail,index) in dataSource[0].fileDetails" :key="index">
                    <div style="width: 100%;height: 100%;position: relative;padding: 8px;border: 0px solid #d9d9d9;border-radius: 4px;">
                      <img style="width: 100%;" :src="fileDetail.imgUrl"  :preview="dataSource[0].key">
                    </div>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-crad>-->

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import QRCode from 'qrcodejs2'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import { queryDetails } from '@/api/api'

  export default {
    name: "QRCodeModal",
    components: {
      JDictSelectTag,
      queryDetails
    },
    data () {
      return {
        money:'',
        form: this.$form.createForm(this),
        title:"操作",
        width:500,
        visible: false,
        model: {},
        dataSource: [],
        qrcode: '',
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
          recharge: "/customermanagement/customerManagement/recharge"
        },
      }
    },
    created () {
      console.log("created=")
      //this.createQRcode();

    },
    methods: {
      add (record) {
        console.log("record=",record)
        this.qrcode = record
        this.edit({});
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'amount','money'))
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      },
      createQRcode () {
        this.closeCode();
        console.log("this.qrcode=",this.qrcode)
        let qrcode = new QRCode("qrcode",{
          width: 200, // 设置宽度，单位像素
          height: 200, // 设置高度，单位像素
          text: this.qrcode, // 设置二维码内容或跳转地址
        })
      },
      closeCode(){
        this.$refs.qrcode.innerHTML="";
      }
    }
  }
</script>