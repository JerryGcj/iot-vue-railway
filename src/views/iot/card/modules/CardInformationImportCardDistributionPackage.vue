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
                         label="下载模板">
              <a-button type="primary" @click="exportCardXlsCard('按导入卡号设置套餐模版')">下载模板</a-button>
            </a-form-item>
          </a-col>

          <a-col :lg="8">
            <a-form-item
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol"
                 label="选择文件">
              <a-upload
                name="file"
                :multiple="true"
                accept=".xls,.xlsx"
                :fileList="fileList"
                :remove="handleRemove"
                :beforeUpload="beforeUpload">

                <a-button>
                  <a-icon type="upload" />
                  选择导入文件
                </a-button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </a-upload>
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

          <a-col :lg="8">
            <a-form-item label="激活后生效" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-radio-group  buttonStyle="solid"  v-model="activation" v-decorator="[ 'activation', validatorRules.activation]">
                <a-radio-button value="0">是</a-radio-button>
                <a-radio-button value="1">否</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :lg="8">
            <a-form-item v-if="activation === '1'" label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <j-date v-decorator="[ 'startTime', validatorRules.startTime]" :showTime="true" date-format="YYYY-MM-DD HH:mm:ss"  placeholder="请选择开始时间" ></j-date>
            </a-form-item>

            <a-form-item v-if="activation === '0'"  label="强制生效日期" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <j-date v-decorator="[ 'mandatoryStartTime', validatorRules.mandatoryStartTime]" :showTime="true" date-format="YYYY-MM-DD HH:mm:ss"  placeholder="请选择开始时间" ></j-date>
            </a-form-item>
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
  import { httpAction,downFile } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {queryLowerAgent,queryStandardcost } from '@/api/api'
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import JDate from '@/components/jeecg/JDate'
  import { FormTypes, VALIDATE_NO_PASSED, getRefPromise, validateFormAndTables } from '@/utils/JEditableTableUtil'

  import JEditableTable from './JEditableTable'

  import { randomUUID, randomNumber } from '@/utils/util'

  export default {
    name: "CardInformationImportCardDistributionPackage",
    components: {
      ATextarea,
      JDate,
      queryStandardcost,
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
        activation:'1',
        packageData:[],
        fileList:[],
        activeKey: '1',
        packageNumber: '1',
        packageName:'测试',
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
              validateRules: [{ required: true, message: '请选择${title}' }]
            },
            {
              title: '失效时间',
              key: 'endDatetime',
              width: '25%',
              type: FormTypes.datetime,
              defaultValue: '',
              placeholder: '请选择${title}',
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
      add (record) {

        this.selectedRowKeys = record;

        this.cardNumber = this.selectedRowKeys.length;
        this.edit({});
      },
      edit (record) {
        this.queryStandardcostList();
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
      queryStandardcostList(){
        var that = this;
        queryStandardcost().then((res)=>{
          if(res.success){
          that.packageData = [];
          let treeList = res.result
          for(let a=0;a<treeList.length;a++){
            let temp = treeList[a];
            this.packageData.push({
              value:temp.id,
              text:temp.packageName
            })
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

          var packageId = this.formData.packageId;

        let packageValue = this.table1.dataSource;

        let selectedRowIds = this.table1.selectedRowIds;

        queryStandardcost().then((res)=>{
          if(res.success){
          let treeList = res.result
          for(let a=0;a<treeList.length;a++){
            let temp = treeList[a];

            //包体类型 0:按自然月计费 1:按使用时间计费
            var inclusionType = temp.inclusionType;
            //有效期
            var periodOfValidity = temp.periodOfValidity;

            //今天的时间
            var day = new Date();
            day.setTime(day.getTime());
            var startDay = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate()+" "+"00:00:00";

            var endDay = '';

            if(packageId == temp.id){
              for (let j = 0; j < this.packageNumber; j++) {

                //如果按自然月计费 则设置套餐到本月底
                // if(inclusionType == '0'){
                var nowDate = new Date();
                var cloneNowDate = new Date();
                var fullYear = nowDate.getFullYear();
                var month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
                var endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天

                function getFullDate(targetDate) {
                  var D, y, m, d;
                  if (targetDate) {
                    D = new Date(targetDate);
                    y = D.getFullYear();
                    m = D.getMonth() + 1;
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
                endDay = getFullDate(cloneNowDate.setDate(endOfMonth))+" "+"00:00:00";//当月最后一天
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
                  packageName: temp.packageName,
                  startDatetime : values.startTime,
                  endDatetime: endDay,

                })
                selectedRowIds.push(uuid);
              }
              this.table1.dataSource = packageValue;
              this.table1.selectedRowIds = selectedRowIds;
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
      beforeUpload(file) {
        this.fileList = [...this.fileList, file]
        return false;
      },
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList
      },

      exportCardXlsCard(fileName){

        let param = null;

        downFile('/cardinformation/cardInformation/exportCardXlsDistributionPackages',param).then((data)=>{
          if (!data) {
          this.$message.warning("文件下载失败")
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), fileName+'.xls')
        }else{
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName+'.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        }
      })

      }
    }
  }
</script>

<style lang="less" scoped>

</style>