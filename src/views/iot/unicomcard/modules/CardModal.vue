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
          label="接口编号">
          <a-input-number v-decorator="[ 'apiId', validatorRules.apiId ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="运营商编号">
          <a-input-number v-decorator="[ 'ispId', validatorRules.ispId ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="代理商编号">
          <a-input-number v-decorator="[ 'agentId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户编号">
          <a-input-number v-decorator="[ 'uid', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="套餐编号">
          <a-input-number v-decorator="[ 'packageId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="ISP套餐编号">
          <a-input-number v-decorator="[ 'packageIspId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="集成电路卡识别码20位字符">
          <a-input placeholder="请输入集成电路卡识别码20位字符" v-decorator="['iccid', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="物联卡号码最长13位数字">
          <a-input placeholder="请输入物联卡号码最长13位数字" v-decorator="['msisdn', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="国际移动用户识别码不超过15位">
          <a-input placeholder="请输入国际移动用户识别码不超过15位" v-decorator="['imsi', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态">
          <a-input-number v-decorator="[ 'status', validatorRules.status ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="运营商状态">
          <a-input-number v-decorator="[ 'statusIsp', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="批次号">
          <a-input placeholder="请输入批次号" v-decorator="['batchNo', validatorRules.batchNo ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分配时间">
          <a-input-number v-decorator="[ 'dispatchTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="激活时间">
          <a-input-number v-decorator="[ 'activeTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开关机">
          <a-input-number v-decorator="[ 'onOff', validatorRules.onOff ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="IP地址">
          <a-input placeholder="请输入IP地址" v-decorator="['ip', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="data">
          <a-input-number v-decorator="[ 'data', validatorRules.data ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sms">
          <a-input-number v-decorator="[ 'sms', validatorRules.sms ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="voice">
          <a-input-number v-decorator="[ 'voice', validatorRules.voice ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="刷新时间">
          <a-input-number v-decorator="[ 'refreshTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="套餐有效期">
          <a-input-number v-decorator="[ 'termLength', validatorRules.termLength ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="套餐有效期单位">
          <a-input-number v-decorator="[ 'termLengthUnit', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="套餐结束时间">
          <a-input-number v-decorator="[ 'termEndTime', validatorRules.termEndTime ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="属性更新时间">
          <a-input-number v-decorator="[ 'attrUpdateTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-input placeholder="请输入备注" v-decorator="['remark', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否更新0否1是">
          <a-input-number v-decorator="[ 'ifUp', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="全部流量">
          <a-input-number v-decorator="[ 'totalFlow', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="运营商流量">
          <a-input-number v-decorator="[ 'dataIsp', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="Imei">
          <a-input placeholder="请输入Imei" v-decorator="['imei', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否认证：1：已认证 2：未认证 3：待认证">
          <a-input placeholder="请输入是否认证：1：已认证 2：未认证 3：待认证" v-decorator="['isCert', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="订单编号">
          <a-input placeholder="请输入订单编号" v-decorator="['orderSn', validatorRules.orderSn ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="订购次数">
          <a-input-number v-decorator="[ 'dgcs', validatorRules.dgcs ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否激活奖励0：否1：是">
          <a-input placeholder="请输入是否激活奖励0：否1：是" v-decorator="['isReward', validatorRules.isReward ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="年包到期时间">
          <a-input-number v-decorator="[ 'orderTime', validatorRules.orderTime ]" />
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

  export default {
    name: "CardModal",
    data () {
      return {
        title:"操作",
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
        form: this.$form.createForm(this),
        validatorRules:{
          apiId:{rules: [{ required: true, message: '请输入接口编号!' }]},
          ispId:{rules: [{ required: true, message: '请输入运营商编号!' }]},
          status:{rules: [{ required: true, message: '请输入状态!' }]},
          batchNo:{rules: [{ required: true, message: '请输入批次号!' }]},
          onOff:{rules: [{ required: true, message: '请输入开关机!' }]},
          data:{rules: [{ required: true, message: '请输入data!' }]},
          sms:{rules: [{ required: true, message: '请输入sms!' }]},
          voice:{rules: [{ required: true, message: '请输入voice!' }]},
          termLength:{rules: [{ required: true, message: '请输入套餐有效期!' }]},
          termEndTime:{rules: [{ required: true, message: '请输入套餐结束时间!' }]},
          orderSn:{rules: [{ required: true, message: '请输入订单编号!' }]},
          dgcs:{rules: [{ required: true, message: '请输入订购次数!' }]},
          isReward:{rules: [{ required: true, message: '请输入是否激活奖励0：否1：是!' }]},
          orderTime:{rules: [{ required: true, message: '请输入年包到期时间!' }]},
        },
        url: {
          add: "/card/card/add",
          edit: "/card/card/edit",
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
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'apiId','ispId','agentId','uid','packageId','packageIspId','iccid','msisdn','imsi','status','statusIsp','batchNo','dispatchTime','activeTime','onOff','ip','data','sms','voice','refreshTime','termLength','termLengthUnit','termEndTime','attrUpdateTime','remark','ifUp','totalFlow','dataIsp','imei','isCert','orderSn','dgcs','isReward','orderTime'))
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