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

        <a-form-item label="运营商名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'operatorName', validatorRules.operatorName]" placeholder="请输入运营商名称"></a-input>
        </a-form-item>
        <a-form-item label="运营商类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag  placeholder="请选择运营商类型" :triggerChange="true"  v-decorator="[ 'operatorTypeId', validatorRules.operatorTypeId ]"   dict-code="operator_type"></j-dict-select-tag>
          <!--<a-input-number v-decorator="[ 'operatorTypeId', validatorRules.operatorTypeId]" placeholder="请输入运营商类型ID 1:移动 2:联通 3:电信" style="width: 100%"/>-->
          <!--<a-select v-decorator="[ 'operatorTypeId', validatorRules.operatorTypeId ]" placeholder="请选择运营商类型">-->
            <!--<a-select-option :value="1">移动</a-select-option>-->
            <!--<a-select-option :value="2">联通</a-select-option>-->
            <!--<a-select-option :value="3">电信</a-select-option>-->
          <!--</a-select>-->
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!--<a-input-number v-decorator="[ 'state', validatorRules.state]" placeholder="请输入状态 0:注销 1:正常" style="width: 100%"/>-->
          <a-select v-decorator="[ 'state', validatorRules.state ]" placeholder="请选择状态">
            <a-select-option :value="0">注销</a-select-option>
            <a-select-option :value="1">正常</a-select-option>
          </a-select>
        </a-form-item>
        <!--<a-form-item label="创建时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择创建时间" v-decorator="[ 'createTime', validatorRules.createTime]" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
        </a-form-item>-->
        <a-form-item label="线程数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'threadNumber', validatorRules.threadNumber]" placeholder="请输入线程数" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="队列数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'queueNumber', validatorRules.queueNumber]" placeholder="请输入队列数" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="并发数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'concurrencyNumber', validatorRules.concurrencyNumber]" placeholder="请输入并发数" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="每秒请求数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'requestNumber', validatorRules.requestNumber]" placeholder="请输入每秒请求数" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="达到流控阀值等待秒数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'waitingSeconds', validatorRules.waitingSeconds]" placeholder="请输入达到流控阀值等待秒数" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="单卡同步时间间隔(分钟)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'intervalTime', validatorRules.intervalTime]" placeholder="请输入单卡同步时间间隔(分钟)" style="width: 100%"/>
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
    name: "IotOperatorModal",
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
          operatorTypeId: {rules: [{
              required: true, message: '请选择运营商!'
            }]
          },
          state: {rules: [{
              required: true, message: '请选择状态!'
            }]
          },
          createTime: {rules: [
            ]},
          threadNumber: {rules: [
            ]},
          queueNumber: {rules: [
            ]},
          concurrencyNumber: {rules: [
            ]},
          requestNumber: {rules: [
            ]},
          waitingSeconds: {rules: [
            ]},
          intervalTime: {rules: [
            ]},
          apiTemplate: {rules: [
            ]},
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
      add () {
        this.edit({});
      },
      edit (record) {
        console.log("1111");
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'operatorName','operatorTypeId','state','createTime','threadNumber','queueNumber','concurrencyNumber','requestNumber','waitingSeconds','intervalTime','apiTemplate'))
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