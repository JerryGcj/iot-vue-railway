<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col v-has="'shareProfitList:selectCustomerId'" :md="6" :sm="8">
            <a-form-item label="客户" >
              <j-tree-select
                v-model="queryParam.higherAgentId"
                placeholder="请选择客户"
                dict="sys_user,user_company,id"
                pidField="create_by_id"
                pidValue=""/>
            </a-form-item>
          </a-col>
          <a-col v-has="'shareProfitList:selectCustomerIdDls'" :md="6" :sm="8">
            <a-form-item label="客户">
              <a-select v-model="queryParam.higherAgentId"
                        placeholder="请选择客户">
                <a-select-option v-for="d in userData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="运营商">
              <a-select v-model="queryParam.operatorType" placeholder="请选择运营商">
                <a-select-option value="1">移动</a-select-option>
                <a-select-option value="2">联通</a-select-option>
                <a-select-option value="3">电信</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--<a-col :md="10" :sm="10">
            <a-form-item label="下单时间">
              <j-date placeholder="请选择开始日期" class="query-group-cust" v-model="queryParam.createTimeBegin" dateFormat="YYYY-MM-DD 00:00:00"></j-date>
              <span class="query-group-split-cust"></span>
              <j-date placeholder="请选择结束日期" class="query-group-cust" v-model="queryParam.createTimeEnd" dateFormat="YYYY-MM-DD 23:59:59"></j-date>
            </a-form-item>
          </a-col>-->
          <a-col :md="4" :sm="6">
            <a-form-item label="月份">
              <a-month-picker placeholder="请选择月份" @change="onChange" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a-button type="primary" icon="download" @click="handleExportXls('分润明细')" style="margin-left: 8px">导出</a-button>
              <a-button type="primary" v-has="'IotShareProfitsList:shareCount'" icon="money-collect" @click="shareTotal" style="margin-left: 8px">分润合计</a-button>
              <a-button type="primary" v-has="'IotShareProfitsList:handleRefund'" icon="reload" @click="handleRefund" style="margin-left: 8px">退款</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    <!-- table区域-begin -->

    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <!--<a @click="handleDetail(record)">详情</a>-->
          <a @click="handleDetails(record)">详情</a>
        </span>
        <!--<template slot="footer" slot-scope="currentPageData">
          合计:{{summoney}}
        </template>-->
      </a-table>
    </div>

    <share-profits-modal ref="shareProfitsModal" @ok="modalFormOk"></share-profits-modal>
    <Select-user-modal ref="selectUserModal" @ok="modalFormOk"></Select-user-modal>
    <refund-modal ref="handleRefund" @ok="modalFormOk"></refund-modal>
  </a-card>
</template>

<script>
  import RefundModal from './modules/RefundModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
  import JDate from '@/components/jeecg/JDate.vue'
  import JTreeSelect from '@/components/jeecg/JTreeSelect'
  import SelectUserModal from './modules/SelectUserModal'
  import {queryLowerAgent} from '@/api/api'
  import { getAction,httpAction } from '@/api/manage'
  import ShareProfitsModal from './modules/ShareProfitsModal'

  export default {
    name: "IotShareProfitsList",
    mixins:[JeecgListMixin],
    components: {
      RefundModal,
      SelectUserModal,
      JDictSelectTag,
      JDate,
      JTreeSelect,
      queryLowerAgent,
      ShareProfitsModal
    },
    data () {
      return {
        description: '分润明细管理页面',
        formData: {},
        userData: [],
        // 表头
        columns: [
          {
            title: '#',
            width: '180px',
            align: 'center',
            dataIndex: 'rowIndex',
            customRender: function (text, r, index) {
              return (text !== '合计') ? (parseInt(index) + 1) : text
            }
          },
          {
            title:'代理商',
            align:"center",
            dataIndex: 'agentName'
          },
          {
            title:'运营商',
            align:"center",
            dataIndex: 'operatorType',
            customRender:function (text) {
              if(text=='1'){
                return "移动";
              }else if(text=="2"){
                return "联通";
              }else if(text=="3"){
                return "电信";
              } else {
                return text;
              }
            }
          },
          {
            title:'总分润金额(元)',
            align:"center",
            dataIndex: 'shareMoney'
          },
          {
            title:'已分润金额(元)',
            align:"center",
            dataIndex: 'hasShare'
          },
          {
            title:'未分润金额(元)',
            align:"center",
            dataIndex: 'noShare'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/shareprofits/iotShareProfits/list",
          exportXlsUrl: "/shareprofits/iotShareProfits/exportXls"
        },
         dictOptions:{
         higherAgent:[],
         lowerAgent:[],
         status:[],
        },
        queryParam:{
          createTime:''
        }
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    mounted() {
      var that = this;
      queryLowerAgent().then((res)=>{
        if(res.success){
          that.userData = [];
          let treeList = res.result
          for(let a=0;a<treeList.length;a++){
            let temp = treeList[a];
            this.userData.push({
              value:temp.id,
              text:temp.userCompany
            })
          }
        }
      });
      getAction(this.url.list,{}).then(res => {
        if(res.success){
          console.log("chouchou"+JSON.stringify(res.result.records));
          this.tableAddTotalRow(this.columns, res.result.records)
        }
      });
    },
    /*watch: {
      dataSource: function () {
        this.$nextTick(function () {
          console.log("fgjibweifbieuo")
          console.log(this.dataSource)
          this.tableAddTotalRow(this.columns, this.dataSource)
        })
      }
    },*/
    methods: {
      handleDetails(record){
        this.$refs.selectUserModal.edit(record,this.queryParam.operatorType,this.queryParam.createTime);
        this.$refs.selectUserModal.disableSubmit = true;
      },
      initDictConfig(){
        initDictOptions('').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'higherAgent', res.result)
          }
        })
        initDictOptions('').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'lowerAgent', res.result)
          }
        })
        initDictOptions('').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'status', res.result)
          }
        })
      },
      onChange(date, dateString) {
        this.queryParam.createTime=dateString;
      },
      shareTotal(){
        const that = this;
        var higherAgentId = this.queryParam.higherAgentId;
        var operatorType = this.queryParam.operatorType;
        var time = this.queryParam.createTime;
        if(!higherAgentId||!time){
          that.$message.warning('请选择结算客户及月份');
          return false;
        }
        this.$refs.shareProfitsModal.edit(higherAgentId,operatorType,time);
        this.$refs.shareProfitsModal.disableSubmit = true;

      },
      /** 表格增加合计行
      tableAddTotalRow(columns, dataSource) {

        console.log("6511651"+dataSource);
        let numKey = 'rowIndex';
        let totalRow = { [numKey]: '合计' };
        columns.forEach(column => {
          let { key, dataIndex } = column;
          if (![key, dataIndex].includes(numKey)) {

            let total = 0;
            dataSource.forEach(data => {
              total += /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(data[dataIndex]) ? Number.parseFloat(data[dataIndex]) : Number.NaN
              console.log(data[dataIndex], ':', (/^^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(data[dataIndex]) ? Number.parseFloat(data[dataIndex]) : Number.NaN))
            });

            if (Number.isNaN(total)) {
              total = '-'
            }
            totalRow[dataIndex] = total
          }
        })

        this.dataSource.push(totalRow)
      },*/
      handleRefund: function () {
        this.$refs.handleRefund.add();
        this.$refs.handleRefund.title = "退款";
        this.$refs.handleRefund.disableSubmit = false;
      },

      /*tableAddTotalRow(columns, dataSource) {
        console.log(dataSource)
        let sumNoShare=0;
        let sumShareMoney=0;
        let sumHasShare=0;
        dataSource.forEach(data => {
          console.log(data.noShare)
          sumHasShare=sumHasShare+data.noShare;
          sumShareMoney=sumShareMoney+data.shareMoney;
          sumNoShare=sumNoShare+data.noShare;
        })
        console.log(sumHasShare)
        this.summoney="总分润金额(元):"+sumShareMoney+"已分润金额(元)"+sumHasShare+"未分润金额(元)"+sumNoShare
      }*/

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>