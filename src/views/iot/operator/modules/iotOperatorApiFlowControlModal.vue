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
          <a-row type="flex" style="margin-bottom:10px" :gutter="5">
            <a-col :span="5" style="text-align: center;margin:0;">描述</a-col>
            <a-col :span="5" style="text-align: center;margin:0;">并发数</a-col>
            <a-col :span="5" style="text-align: center;margin:0;">每秒请求数</a-col>
            <a-col :span="5" style="text-align: center;margin:0;">达到流控阀值等待秒数</a-col>
          </a-row>
          <div>
          <a-row type="flex" style="margin-bottom:8px" :gutter="5">
            <!--<a-form-item label="运营商ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="[ 'operatorId', validatorRules.operatorId]" placeholder="请输入运营商ID"></a-input>
            </a-form-item>-->
            <a-col :span="5" style="text-align: center;margin:5px;">卡状态信息查询</a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item>
                <a-input-number v-decorator="[ 'cardStateConNum', validatorRules.cardStateConNum]" placeholder="请输入卡状态信息查询并发数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item>
                <a-input-number v-decorator="[ 'cardStateReqNum', validatorRules.cardStateReqNum]" placeholder="请输入卡状态信息查询每秒请求数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item>
                <a-input-number v-decorator="[ 'cardStateWaitSec', validatorRules.cardStateWaitSec]" placeholder="请输入卡状态信息查询达到流控阀值等待秒数"/>
              </a-form-item>
            </a-col>
          </a-row>
          </div>

          <div>
          <a-row type="flex" style="margin-bottom:8px" :gutter="5">
            <a-col :span="5" style="text-align: center;margin:5px;">卡流量信息查询</a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item>
                <a-input-number v-decorator="[ 'cardFlowConNum', validatorRules.cardFlowConNum]" placeholder="请输入卡流量信息查询并发数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item>
                <a-input-number v-decorator="[ 'cardFlowReqNum', validatorRules.cardFlowReqNum]" placeholder="请输入卡流量信息查询每秒请求数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item>
                <a-input-number v-decorator="[ 'cardFlowWaitSec', validatorRules.cardFlowWaitSec]" placeholder="请输入卡流量信息查询达到流控阀值等待秒数"/>
              </a-form-item>
            </a-col>
          </a-row>
          </div>

          <a-row type="flex" style="margin-bottom:8px" :gutter="5">
            <a-col :span="5" style="text-align: center;margin:5px;">在线信息查询</a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'onlinConNum', validatorRules.onlinConNum]" placeholder="请输入在线信息查询并发数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'onlinReqNum', validatorRules.onlinReqNum]" placeholder="请输入在线信息查询每秒请求数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'onlinWaitSec', validatorRules.onlinWaitSec]" placeholder="请输入在线信息查询达到流控阀值等待秒数"/>
              </a-form-item>
            </a-col>
          </a-row>


          <a-row type="flex" style="margin-bottom:8px" :gutter="5">
            <a-col :span="5" style="text-align: center;margin:5px;">设备开关机信息查询</a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item>
                <a-input-number v-decorator="[ 'eqptSwConNum', validatorRules.eqptSwConNum]" placeholder="请输入设备开关机信息查询并发数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'eqptSwReqNum', validatorRules.eqptSwReqNum]" placeholder="请输入设备开关机信息查询每秒请求数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'eqptSwWaitSec', validatorRules.eqptSwWaitSec]" placeholder="请输入设备开关机信息查询达到流控阀值等待秒数"/>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row type="flex" style="margin-bottom:8px" :gutter="5">
            <a-col :span="5" style="text-align: center;margin:5px;">GPRS服务开通情况查询</a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'gprsSwConNum', validatorRules.gprsSwConNum]" placeholder="请输入GPRS服务开通情况查询并发数" />
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'gprsSwReqNum', validatorRules.gprsSwReqNum]" placeholder="请输入GPRS服务开通情况查询每秒请求数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'gprsSwWaitSec', validatorRules.gprsSwWaitSec]" placeholder="请输入GPRS服务开通情况查询达到流控阀值等待秒数" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row type="flex" style="margin-bottom:8px" :gutter="5">
            <a-col :span="5" style="text-align: center;margin:5px;">本月流量使用量查询</a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'flowMuseConNum', validatorRules.flowMuseConNum]" placeholder="请输入本月流量使用量查询并发数" />
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'flowMuseReqNum', validatorRules.flowMuseReqNum]" placeholder="请输入本月流量使用量查询每秒请求数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'flowMuseWaitSec', validatorRules.flowMuseWaitSec]" placeholder="请输入本月流量使用量查询达到流控阀值等待秒数"/>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row type="flex" style="margin-bottom:8px" :gutter="5">
            <a-col :span="5" style="text-align: center;margin:5px;">卡余额查询</a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'cardBalConNum', validatorRules.cardBalConNum]" placeholder="请输入卡余额查询并发数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'cardBalReqNum', validatorRules.cardBalReqNum]" placeholder="请输入卡余额查询每秒请求数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'cardBalWaitSec', validatorRules.cardBalWaitSec]" placeholder="请输入卡余额查询达到流控阀值等待秒数"/>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row type="flex" style="margin-bottom:8px" :gutter="5">
            <a-col :span="5" style="text-align: center;margin:5px;">每天流量使用量查询</a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'flowDuseConNum', validatorRules.flowDuseConNum]" placeholder="请输入每天流量使用量查询并发数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'flowDuseReqNum', validatorRules.flowDuseReqNum]" placeholder="请输入每天流量使用量查询每秒请求数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'flowDuseWaitSec', validatorRules.flowDuseWaitSec]" placeholder="请输入每天流量使用量查询达到流控阀值等待秒数"/>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row type="flex" style="margin-bottom:8px" :gutter="5">
            <a-col :span="5" style="text-align: center;margin:5px;">GPRS功能关闭</a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'gprsCloConNum', validatorRules.gprsCloConNum]" placeholder="请输入GPRS功能关闭并发数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'gprsCloReqNum', validatorRules.gprsCloReqNum]" placeholder="请输入GPRS功能关闭每秒请求数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'gprsCloWaitSec', validatorRules.gprsCloWaitSec]" placeholder="请输入GPRS功能关闭达到流控阀值等待秒数"/>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row type="flex" style="margin-bottom:8px" :gutter="5">
            <a-col :span="5" style="text-align: center;margin:5px;">GPRS功能开启</a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'gprsOpenConNum', validatorRules.gprsOpenConNum]" placeholder="GPRS功能开启并发数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'gprsOpenReqNum', validatorRules.gprsOpenReqNum]" placeholder="GPRS功能开启每秒请求数"/>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: center;">
              <a-form-item >
                <a-input-number v-decorator="[ 'gprsOpenWaitSec', validatorRules.gprsOpenWaitSec]" placeholder="GPRS功能开启达到流控阀值等待秒数"/>
              </a-form-item>
            </a-col>
          </a-row>
      </a-form>
    </a-spin>
    <a-button type="primary" @click="handleOk">确定</a-button>
    <a-button type="primary" @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>

  import {httpAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import {validateDuplicateValue} from '@/utils/util'
  import JDate from '@/components/jeecg/JDate'
  import TabLayout from '@/components/layouts/TabLayout'

  export default {
    name: "IotOperatorApiFlowControlModal",
    components: {
      JDate,
      TabLayout
    },
    data() {
      return {
        form: this.$form.createForm(this),
        title: "操作",
        width: 800,
        visible: false,
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        validatorRules: {
          operatorId: {
            rules: []
          },
          cardStateConNum: {
            rules: []
          },
          cardStateReqNum: {
            rules: []
          },
          cardStateWaitSec: {
            rules: []
          },
          cardFlowConNum: {
            rules: []
          },
          cardFlowReqNum: {
            rules: []
          },
          cardFlowWaitSec: {
            rules: []
          },
          onlinConNum: {
            rules: []
          },
          onlinReqNum: {
            rules: []
          },
          onlinWaitSec: {
            rules: []
          },
          eqptSwConNum: {
            rules: []
          },
          eqptSwReqNum: {
            rules: []
          },
          eqptSwWaitSec: {
            rules: []
          },
          gprsSwConNum: {
            rules: []
          },
          gprsSwReqNum: {
            rules: []
          },
          gprsSwWaitSec: {
            rules: []
          },
          flowMuseConNum: {
            rules: []
          },
          flowMuseReqNum: {
            rules: []
          },
          flowMuseWaitSec: {
            rules: []
          },
          cardBalConNum: {
            rules: []
          },
          cardBalReqNum: {
            rules: []
          },
          cardBalWaitSec: {
            rules: []
          },
          flowDuseConNum: {
            rules: []
          },
          flowDuseReqNum: {
            rules: []
          },
          flowDuseWaitSec: {
            rules: []
          },
          gprsCloConNum: {
            rules: []
          },
          gprsCloReqNum: {
            rules: []
          },
          gprsCloWaitSec: {
            rules: []
          },
          gprsOpenConNum: {
            rules: []
          },
          gprsOpenReqNum: {
            rules: []
          },
          gprsOpenWaitSec: {
            rules: []
          },
          createTime: {
            rules: []
          },
          createUser: {
            rules: []
          },
          createIp: {
            rules: []
          },
          updateDate: {
            rules: []
          },
          updateUser: {
            rules: []
          },
          updateIp: {
            rules: []
          },
        },
        url: {
          add: "/iotoperatorapiflowcontrol/iotOperatorApiFlowControl/add",
          edit: "/iotoperatorapiflowcontrol/iotOperatorApiFlowControl/edit",
        }
      }
    },
    created() {
    },
    methods: {
      add() {
        this.edit({});
      },
      edit(record) {

        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'operatorId', 'cardStateConNum', 'cardStateReqNum', 'cardStateWaitSec', 'cardFlowConNum', 'cardFlowReqNum', 'cardFlowWaitSec', 'onlinConNum', 'onlinReqNum', 'onlinWaitSec', 'eqptSwConNum', 'eqptSwReqNum', 'eqptSwWaitSec', 'gprsSwConNum', 'gprsSwReqNum', 'gprsSwWaitSec', 'flowMuseConNum', 'flowMuseReqNum', 'flowMuseWaitSec', 'cardBalConNum', 'cardBalReqNum', 'cardBalWaitSec', 'flowDuseConNum', 'flowDuseReqNum', 'flowDuseWaitSec', 'gprsCloConNum', 'gprsCloReqNum', 'gprsCloWaitSec', 'gprsOpenConNum', 'gprsOpenReqNum', 'gprsOpenWaitSec', 'createTime', 'createUser', 'createIp', 'updateDate', 'updateUser', 'updateIp'))
        })
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.model.id) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据", formData)
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }

        })
      },
      handleCancel() {
        this.close()
      },
      popupCallback(row) {
        this.form.setFieldsValue(pick(row, 'operatorId', 'cardStateConNum', 'cardStateReqNum', 'cardStateWaitSec', 'cardFlowConNum', 'cardFlowReqNum', 'cardFlowWaitSec', 'onlinConNum', 'onlinReqNum', 'onlinWaitSec', 'eqptSwConNum', 'eqptSwReqNum', 'eqptSwWaitSec', 'gprsSwConNum', 'gprsSwReqNum', 'gprsSwWaitSec', 'flowMuseConNum', 'flowMuseReqNum', 'flowMuseWaitSec', 'cardBalConNum', 'cardBalReqNum', 'cardBalWaitSec', 'flowDuseConNum', 'flowDuseReqNum', 'flowDuseWaitSec', 'gprsCloConNum', 'gprsCloReqNum', 'gprsCloWaitSec', 'gprsOpenConNum', 'gprsOpenReqNum', 'gprsOpenWaitSec', 'createTime', 'createUser', 'createIp', 'updateDate', 'updateUser', 'updateIp'))
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