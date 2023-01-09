<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="API模版" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'apiTemplate', validatorRules.apiTemplate]" v-model="apiTemplate" placeholder="请选择关联API模版">
            <a-select-option value="oneLinkServiceImpl">移动oneLink</a-select-option>
            <a-select-option value="telecomServiceImpl">电信CTWing</a-select-option>
            <a-select-option value="huThirdServiceImpl">临沂联通</a-select-option>
          </a-select>
        </a-form-item>

        <!--1.-->
        <a-form-item v-if="apiTemplate === 'telecomServiceImpl'" label="商户ID(user_id)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'userId', {}]" placeholder="请输入user_id" style="width: 100%"/>
        </a-form-item>

        <a-form-item v-if="apiTemplate === 'telecomServiceImpl'" label="接口秘钥(appKey)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'appKey', {}]" placeholder="请输入appKey" style="width: 100%"/>
        </a-form-item>

        <a-form-item v-if="apiTemplate === 'telecomServiceImpl'" label="接口密码(password)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'dxpassword', {}]" placeholder="请输入password" style="width: 100%"/>
        </a-form-item>

        <a-form-item v-if="apiTemplate === 'telecomServiceImpl'" label="接口URL" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'buyUrl', {}]" placeholder="请输入URL" style="width: 100%"/>
        </a-form-item>

        <!--2.-->
        <a-form-item v-if="apiTemplate === 'oneLinkServiceImpl'" label="应用编号(APPID)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'appid', {}]" placeholder="应用编号(APPID)" style="width: 100%"/>
        </a-form-item>

        <a-form-item v-if="apiTemplate === 'oneLinkServiceImpl'" label="接入密码(password)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'password', {}]" placeholder="接入密码(password)" style="width: 100%"/>
        </a-form-item>

        <a-form-item v-if="apiTemplate === 'oneLinkServiceImpl'" label="接口地址前缀" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'url', {}]" placeholder="接口地址前缀" style="width: 100%"/>
        </a-form-item>

        <a-form-item v-if="apiTemplate === 'oneLinkServiceImpl'" label="token地址前缀" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'token_url', {}]" placeholder="token地址前缀" style="width: 100%"/>
        </a-form-item>

        <a-form-item v-if="apiTemplate === 'oneLinkServiceImpl'" label="版本号(版本号前加/)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'version', {}]" placeholder="版本号(版本号前加/)" style="width: 100%"/>
        </a-form-item>

        <!--3.-->
        <a-form-item v-if="apiTemplate === 'huThirdServiceImpl'" label="应用编号(APPID)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'appid', {}]" placeholder="应用编号(APPID)" style="width: 100%"/>
        </a-form-item>

        <a-form-item v-if="apiTemplate === 'huThirdServiceImpl'" label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'username', {}]" placeholder="用户名" style="width: 100%"/>
        </a-form-item>

        <a-form-item v-if="apiTemplate === 'huThirdServiceImpl'" label="接入密码(password)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'password', {}]" placeholder="接入密码(password)" style="width: 100%"/>
        </a-form-item>

        <a-form-item v-if="apiTemplate === 'huThirdServiceImpl'" label="接口地址前缀" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'url', {}]" placeholder="接口地址前缀" style="width: 100%"/>
        </a-form-item>

        <a-form-item v-if="apiTemplate === 'huThirdServiceImpl'" label="秘钥" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'appSecret', {}]" placeholder="秘钥" style="width: 100%"/>
        </a-form-item>

        <a-form-item v-if="apiTemplate === 'huThirdServiceImpl'" label="版本号(版本号前加/)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'version', {}]" placeholder="版本号(版本号前加/)" style="width: 100%"/>
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
  import { validateDuplicateValue } from '@/utils/util'
  import JDate from '@/components/jeecg/JDate'

  export default {
    name: "IotOperatorApiTemplate",
    components: {
      JDate,
    },
    data () {
      return {
        form: this.$form.createForm(this),
        title:"操作",
        width:800,
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
          operatorName:{
            rules: [{
              required: true, message: '请输入运营商名称!'
            }]
          },

          apiTemplate:{
            rules: [{
              required: true, message: '请选择API模版!'
            }]
          },


        },
        url: {
          add: "/iotoperator/iotOperator/add",
          edit: "/iotoperator/iotOperator/edit",
        }
      }
    },
    created () {
    },
    methods: {
      add (record) {

        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      edit (record) {

        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'apiTemplate'))
        })

        if(this.model.apiTemplate === 'telecomServiceImpl'){
          this.apiTemplate =  'telecomServiceImpl';
          this.model.id = this.model.operatorId;
          this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model,'apiTemplate','userId','appKey','dxpassword','buyUrl'))
          })
        }

        if(this.model.apiTemplate === 'oneLinkServiceImpl'){
          this.model.id = this.model.operatorId;
          this.apiTemplate =  'oneLinkServiceImpl';
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model,'apiTemplate','appid','password','url','token_url','version'))
          })
        }

        if(this.model.apiTemplate === 'huThirdServiceImpl'){
          this.model.id = this.model.operatorId;
          this.apiTemplate =  'huThirdServiceImpl';
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model,'apiTemplate','appid','password','url','username','version','appSecret'))
          })
        }
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
            const formData = new FormData();
            formData.append('operatorId',this.model.id);
            formData.append('type',values.apiTemplate);
            formData.append('appid',values.appid);
            formData.append('password',values.password);
            formData.append('url',values.url);
            formData.append('token_url',values.token_url);
            formData.append('version',values.version);
            formData.append('username',values.username);
            formData.append('userId',values.userId);
            formData.append('appKey',values.appKey);
            formData.append('dxpassword',values.dxpassword);
            formData.append('buyUrl',values.buyUrl);
            formData.append('appSecret',values.appSecret);
            let httpurl = '/iotoperator/iotOperator/addTemplate';
            let method = 'post';
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

            /*if(values.apiTemplate == 'API-RongHeImpl-0228'){
                const formData = new FormData();

                formData.append('operatorId',this.model.id);
                formData.append('type',values.apiTemplate);
                formData.append('merchantsId',values.merchantsId);
                formData.append('secretKey',values.secretKey);
                formData.append('urlPrefix',values.urlPrefix);
                let httpurl = '/iotoperator/iotOperator/addTemplate';
                let method = 'post';
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


          if(values.apiTemplate == 'huThirdServiceImpl'){
            const formData = new FormData();

            formData.append('operatorId',this.model.id);
            formData.append('type',values.apiTemplate);

            formData.append('app_id',values.app_id);
            formData.append('appSecret',values.appSecret);
            formData.append('version',values.version);
            formData.append('url',values.url);
            formData.append('username',values.username);
            formData.append('password',values.password);

            let httpurl = '/iotoperator/iotOperator/addTemplate';
            let method = 'post';
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


          if(values.apiTemplate == 'oneLinkServiceImpl'){

            const formData = new FormData();

            formData.append('operatorId',this.model.id);
            formData.append('type',values.apiTemplate);

            formData.append('appid',values.appid);
            formData.append('password',values.password);
            formData.append('url',values.url);
            formData.append('token_url',values.token_url);
            formData.append('version',values.version);

            let httpurl = '/iotoperator/iotOperator/addTemplate';
            let method = 'post';
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

          if(values.apiTemplate == 'jhThirdServiceImpl'){

            const formData = new FormData();

            formData.append('operatorId',this.model.id);
            formData.append('type',values.apiTemplate);

            formData.append('url',values.url);
            formData.append('version',values.version);

            let httpurl = '/iotoperator/iotOperator/addTemplate';
            let method = 'post';
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

          }*/
          }
        })
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'operatorName','operatorTypeId','state','createTime','threadNumber','queueNumber','concurrencyNumber','requestNumber','waitingSeconds','intervalTime','apiTemplate'))
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