<template>
  <a-modal
    :title="title"
    :width="1300"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-row class="form-row" :gutter="0">

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="使用说明" help="">
            <span>1.如果要给卡设置从某个时间开始往后生效多少个套餐(例如月包12个),请选择套餐,修改开始时间及数量,点击添加,再点击提交</span>
            <br>
            <span>2.如果要给卡设置从激活后开始生效套餐,例如激活后生效12个月包,请选择套餐,勾选激活后生效,修改数量点击提交</span>
          </a-form-item>

          <a-col :lg="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="卡数量">
              <a-input disabled v-model="cardNumber" />
            </a-form-item>
          </a-col>

          <a-col :lg="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="套餐">
              <a-select :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
                        v-model="formData.packageId"
                        placeholder="套餐">
                <a-select-option v-for="d in packageData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <!--<a-col :lg="8">-->
            <!--<a-form-item label="激活后生效" :labelCol="labelCol" :wrapperCol="wrapperCol" >-->
              <!--<a-radio-group defaultValue="1" buttonStyle="solid"  v-model="activation" v-decorator="[ 'activation', validatorRules.activation]">-->
                <!--<a-radio-button value="0">是</a-radio-button>-->
                <!--<a-radio-button value="1">否</a-radio-button>-->
              <!--</a-radio-group>-->
            <!--</a-form-item>-->
          <!--</a-col>-->

          <a-col :lg="8">
            <a-form-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <j-date v-decorator="[ 'startTime', validatorRules.startTime]" :showTime="true" date-format="YYYY-MM-DD HH:mm:ss"  placeholder="请选择开始时间" ></j-date>
            </a-form-item>

            <!--<a-form-item v-if="activation === '0'"  label="强制生效日期" :labelCol="labelCol" :wrapperCol="wrapperCol" >-->
              <!--<j-date v-decorator="[ 'mandatoryStartTime', validatorRules.mandatoryStartTime]" :showTime="true" date-format="YYYY-MM-DD HH:mm:ss"  placeholder="请选择开始时间" ></j-date>-->
            <!--</a-form-item>-->
          </a-col>

          <a-col :lg="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="数量">
              <a-input-number v-model="packageNumber"/>
              <a-button type="primary" icon="plus" @click="packageAdd">新增1</a-button>
            </a-form-item>
          </a-col>

        </a-row>

      </a-form>

      <a-tabs v-model="activeKey" @change="handleChangeTabs">
        <a-tab-pane tab="套餐信息" key="1" :forceRender="true">

          <j-editable-table
            ref="editableTable1"
            :loading="table1.loading"
            :columns="table1.columns"
            :dataSource="table1.dataSource"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"
            :dragSort="true">

            <template v-slot:action="props">
              <a @click="handleDelete(props)">{{ props.text }}</a>
            </template>

          </j-editable-table>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {queryLowerAgent,queryStandardcost,queryDiscountPackage,queryStandardcostById } from '@/api/api'
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import JDate from '@/components/jeecg/JDate'
  import { FormTypes, VALIDATE_NO_PASSED, getRefPromise, validateFormAndTables } from '@/utils/JEditableTableUtil'

  import JEditableTable from './JEditableTable'

  import { randomUUID, randomNumber } from '@/utils/util'

  export default {
    name: "CardInformationDistributionPackage",
    components: {
      ATextarea,
      JDate,
      queryStandardcost,
      JEditableTable,
      queryDiscountPackage,
      queryStandardcostById
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
        activation:'1',
        operatorId: '',
        packageData:[],
        activeKey: '1',
        packageNumber: '1',
        packageName:'测试',
        idsDate:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 - 6 }
        },
        jdate: {
          value: '2019-5-10 15:33:06'
        },

        confirmLoading: false,
        form: this.$form.createForm(this),

        table1: {
          loading: false,
          dataSource: [],
          selectedRowIds: [],
          columns: [
            {
              title: '套餐id',
              key: 'packageId',
              width: '25%',
              type: FormTypes.hidden,
              defaultValue: '',
              disabled:true,
            },
            {
              title: '套餐名称',
              key: 'packageName',
              width: '25%',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
              disabled:true,
              validateRules: [{ required: true, message: '${title}不能为空' }]
            },
            {
              title: '生效时间',
              key: 'startDatetime',
              width: '25%',
              type: FormTypes.datetime,
              defaultValue: '',
              placeholder: '请选择${title}',
              // disabled:true,
              validateRules: [{ required: true, message: '请选择${title}' }]
            },
            {
              title: '失效时间',
              key: 'endDatetime',
              width: '25%',
              type: FormTypes.datetime,
              defaultValue: '',
              placeholder: '请选择${title}',
              // disabled:true,
              validateRules: [{ required: true, message: '请选择${title}' }]
            },
            {
              title: '操作',
              key: 'action',
              // width: '8%',
              width: '100px',
              type: FormTypes.slot,
              slotName: 'action',
              defaultValue: '删除'
            }
          ]
        },
        validatorRules:{
          state:{
            rules: [{
              required: true, message: '请选择状态!'
            }]
          },
          startTime:{
            rules: [{
              required: true, message: '请选择开始时间!'
            }]
          },
        },
        url: {
          add: "/cardinformation/cardInformation/add",
          edit: "/cardinformation/cardInformation/edit",
        },
      }
    },
    created () {
    },
    mounted() {

    },
    methods: {
      add (record,record2,record3) {

        this.operatorId = record3;

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
        this.queryDiscountPackage();
        this.queryUserAgent();
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iccid','msisdn','imsi','imei','deviceOnOffState','cardState','cardOnlineStatus','wirelessAccessType','ipAddress','apn','province','city','areaCode','automaticStopResetMachine','cardSynchronization','trafficUse','packageId','packageName','trafficUseMonth','voiceUseMonth','smsUseMonth','balance','operatorType','importBatch','distributionBatch','customPackageUse','operatorId','operatorName','isTrafficCard','upstreamFlowPoolNumber','agentStopMachine','terminalBlacklist','systemFlowPoolId','isRealNameAuthentication','realNameAuditMethod','platformRealNameAuthentication','upstreamRealNameAuthentication','priority','thirtyDayCard','allocationState','customerId','customerName','isArrearage','gprsState','smsState','isFlowPool','note','createUser','createIp','updateUser','updateIp'))
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

          // if (this.selectedRowKeys.length <= 0) {
          //   this.$message.warning('请选择一条记录！');
          //   return;
          // } else {
            //获取id集合
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

            // 获取被逻辑删除的字段id
            let deleteIds = this.$refs.editableTable1.getDeleteIds();

            this.$refs.editableTable1.getValues((error, values) => {
              // 错误数 = 0 则代表验证通过
              if (error === 0) {
                this.$message.success('验证通过')
                // 将通过后的数组提交到后台或自行进行其他处理
                console.log(deleteIds, values)

                var s = JSON.stringify(values);
                const formData = new FormData();

                //套餐集合
                formData.append('packageValues',s);
                //卡号id
                formData.append('ids',ids);
                //激活后是否生效
                formData.append('activation',values.activation);

                let httpurl = '/refcardcost/refCardCost/add';
                let method = 'post';

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
              } else {
                this.$message.error('验证未通过')
              }
            })

          // }

          }
        })
      },
      handleCancel () {
        this.close()
      },
      queryUserAgent(){
        var that = this;
        queryLowerAgent().then((res)=>{
          if(res.success){
          that.userData = [];
          let treeList = res.result
          for(let a=0;a<treeList.length;a++){
            let temp = treeList[a];
            this.userData.push({
              value:temp.id,
              text:temp.username
            })
          }
        }
      });
      },

      queryDiscountPackage(){

        var that = this;
        queryDiscountPackage().then((res)=>{
          if(res.success){
          that.packageData = [];
          let treeList = res.result
          for(let a=0;a<treeList.length;a++){
            let temp = treeList[a];
            //获取选中运营商下的套餐
            if(this.operatorId == temp.operatorId){
              this.packageData.push({
                value:temp.packageId,
                text:temp.packageName
              })
            }


          }
        }
      });
      },

      /** ATab 选项卡切换事件 */
      handleChangeTabs(key) {
        getRefPromise(this, `editableTable${key}`).then(editableTable => {
          editableTable.resetScrollTop()
      })
      },
      // 获取所有的editableTable实例
      getAllTable() {
        return Promise.all([
          getRefPromise(this, 'editableTable1'),
          getRefPromise(this, 'editableTable2')
        ])
      },

      packageAdd(){

        this.form.validateFields((err, values) => {

          //选中的套餐id
          var packageId = this.formData.packageId;
          //
          let packageValue = this.table1.dataSource;
          //选中的卡uuid
          let selectedRowIds = this.table1.selectedRowIds;

          //获取标准资费列表
          queryDiscountPackage().then((res)=>{
            if(res.success){
            let treeList = res.result
            for(let a=0;a<treeList.length;a++){
              let temp = treeList[a];

              //包体类型 0:按自然月计费 1:按使用时间计费
              var inclusionType = temp.inclusionType;
              //有效期
              var periodOfValidity = temp.periodOfValidity;

              //如果按自然月计费
              if(inclusionType == '0'){

                var endDay = '';
                var startDay = '';

                //如果选中套餐跟标准资费列表相同
                if(packageId == temp.packageId){

                  queryStandardcostById({id: temp.packageId}).then((res)=>{
                    
                    //输入的添加套餐的数量
                    for (let j = 0; j < this.packageNumber; j++) {

                      if(j == 0){

                        //如果按自然月计费 则设置套餐到本月底
                        var nowDate = new Date(values.startTime);
                        var cloneNowDate = new Date();

                        var month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
                        var fullYear = nowDate.getFullYear();

                        if(month > 11){

                          month = month%11;
                          fullYear = nowDate.getFullYear()+(parseInt(month/11));
                        }
                        var endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天

                        function getFullDate(targetDate) {
                          var D, y, m, d;
                          if (targetDate) {
                            D = new Date(targetDate);
                            y = nowDate.getFullYear();
                            m = nowDate.getMonth() + 1;
                            d = new Date(fullYear, month, 0).getDate();
                          } else {
                            y = fullYear;
                            m = month;
                            d = date;
                          }
                          m = m > 9 ? m : '0' + m;
                          d = d > 9 ? d : '0' + d;
                          return y + '-' + m + '-' + d;
                        };
                        endDay = getFullDate(cloneNowDate.setDate(endOfMonth))+" "+"23:59:59";//当月最后一天
                        // }

                        var s = [];
                        var hexDigits = "0123456789abcdef";
                        for (var i = 0; i < 36; i++) {
                          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                        }
                        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                        s[8] = s[13] = s[18] = s[23] = "-";

                        var uuid = s.join("");

                        packageValue.push({
                          id: uuid,
                          packageId : temp.id,
                          packageName: temp.packageName,
                          startDatetime : values.startTime,
                          endDatetime: endDay,

                        })
                        selectedRowIds.push(uuid);
                      }else{

                        var nowDate = new Date(values.startTime);
                        var cloneNowDate = new Date();
                        var fullYear = nowDate.getFullYear();

                        var month = nowDate.getMonth() + 1+j; // getMonth 方法返回 0-11，代表1-12月

                        if(month > 12){
                          fullYear = nowDate.getFullYear()+(parseInt(month/12));
                          month = month%12;
                          if(month == 0){
                            month = 12;
                          }
                        }

                        var endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天

                        var startOfMonth = new Date(fullYear, month, 1).getDate();// 获取本月第一天

                        function getFullDate(targetDate) {
                          var D, y, m, d;
                          if (targetDate) {
                            D = new Date(targetDate);
                            y = fullYear;
                            m = month;
                            d = D.getDate();
                          } else {
                            y = fullYear;
                            m = month;
                            d = date;
                          }
                          m = m > 9 ? m : '0' + m;
                          d = d > 9 ? d : '0' + d;
                          return y + '-' + m + '-' + d;
                        };
                        endDay = getFullDate(cloneNowDate.setDate(endOfMonth))+" "+"23:59:59";//当月最后一天

                        startDay = getFullDate(cloneNowDate.setDate(startOfMonth))+" "+"00:00:00";

                        var s = [];
                        var hexDigits = "0123456789abcdef";
                        for (var i = 0; i < 36; i++) {
                          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                        }
                        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                        s[8] = s[13] = s[18] = s[23] = "-";

                        var uuid = s.join("");

                        packageValue.push({
                          id: uuid,
                          packageId : temp.id,
                          packageName: temp.packageName,
                          startDatetime : startDay,
                          endDatetime: endDay,

                        })
                        selectedRowIds.push(uuid);

                      }

                    }
                    this.table1.dataSource = packageValue;
                    this.table1.selectedRowIds = selectedRowIds;

                  })
                }
              }

              //如果按使用时间计费
              if(inclusionType == '1'){

                var endDay = '';
                var startDay = '';

                if(packageId == temp.packageId){

                  queryStandardcostById({id: temp.packageId}).then((res)=>{

                    //输入的添加套餐的数量
                    for (let j = 0; j < this.packageNumber; j++) {

                      //如果按时间计费 则添加为选中开始日期 + 套餐配置的时间

                      if(j == 0){

                        var endDay = addDate(values.startTime,res.result.periodOfValidity);

                        function addDate(date,days){
                          var d=new Date(date);
                          d.setDate(d.getDate()+days);
                          var m=d.getMonth()+1;
                          return d.getFullYear()+'-'+m+'-'+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                        }

                        var s = [];
                        var hexDigits = "0123456789abcdef";
                        for (var i = 0; i < 36; i++) {
                          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                        }
                        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                        s[8] = s[13] = s[18] = s[23] = "-";

                        var uuid = s.join("");

                        packageValue.push({
                          id: uuid,
                          packageId : temp.id,
                          packageName: temp.packageName,
                          startDatetime : values.startTime,
                          endDatetime: endDay,

                        })
                        selectedRowIds.push(uuid);

                      }else{

                        var packageValueElement = packageValue[j-1];

                        endDay = addDate(packageValueElement.endDatetime,res.result.periodOfValidity);
                        // startDay =

                        function addDate(date,days){
                          var d=new Date(date);
                          d.setDate(d.getDate()+days);
                          var m=d.getMonth()+1;
                          return d.getFullYear()+'-'+m+'-'+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                        }

                        var s = [];
                        var hexDigits = "0123456789abcdef";
                        for (var i = 0; i < 36; i++) {
                          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                        }
                        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                        s[8] = s[13] = s[18] = s[23] = "-";

                        var uuid = s.join("");

                        packageValue.push({
                          id: uuid,
                          packageId : temp.id,
                          packageName: temp.packageName,
                          startDatetime : packageValueElement.endDatetime,
                          endDatetime: endDay,

                        })
                        selectedRowIds.push(uuid);

                      }
                    }
                    this.table1.dataSource = packageValue;
                    this.table1.selectedRowIds = selectedRowIds;
                  })
                }
              }
            }
          }
        });
        })
        },
        handleDelete(props) {

          let packageValue = this.table1.dataSource;
          let deletePackage = [];
          let { rowId, target } = props
          for (let i = 0; i < packageValue.length; i++) {
              if(rowId == packageValue[i].id){

              }else{
                deletePackage.push(packageValue[i])
              }
          }
          target.removeRows(rowId)
          this.table1.dataSource = deletePackage;
        },
      }
  }
</script>

<style lang="less" scoped>

</style>