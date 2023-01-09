<template>
  <div>
    <a-modal
      centered
      :title="title"
      :width="1200"
      :visible="visible"
      :okButtonProps="{ props: {disabled: disableSubmit} }"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-spin :spinning="confirmLoading">
        <a-form layout="inline">
          <a-row :gutter="24">

            <a-col :md="6" :sm="8">
              <a-form-item label="ICCID">
                <a-input placeholder="请输入ICCID" v-model="queryParam.iccid"></a-input>
                <!--<a-input placeholder="开始ICCID" class="query-group-cust" v-model="queryParam.iccid_begin"></a-input>
                <span class="query-group-split-cust"></span>
                <a-input placeholder="结束ICCID" class="query-group-cust" v-model="queryParam.iccid_end"></a-input>-->
              </a-form-item>
            </a-col>
            <!--<a-col :md="10" :sm="10">
              <a-form-item label="时间">
                <j-date placeholder="请选择开始日期" class="query-group-cust" v-model="queryParam.createTime_begin" dateFormat="YYYY-MM-DD 00:00:00"></j-date>
                <span class="query-group-split-cust"></span>
                <j-date placeholder="请选择结束日期" class="query-group-cust" v-model="queryParam.createTime_end" dateFormat="YYYY-MM-DD 23:59:59"></j-date>
              </a-form-item>
            </a-col>-->
            <a-col :span="8">
                    <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                      <!--<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>-->
                      <!--<a-button v-has="'shareList:settlement'" type="primary" @click="settlement" icon="money-collect" style="margin-left: 8px">结算</a-button>-->
                      <a-popconfirm :title="money" @confirm="() => settlement()">
                        <a-button v-has="'shareList:settlement'" type="primary" @click="settlement1" icon="money-collect" style="margin-left: 8px">结算</a-button>
                      </a-popconfirm>
                      <a-button type="primary" @click="shareDetails" style="margin-left: 8px">历史分润</a-button>
                    </span>
            </a-col>

          </a-row>
        </a-form>
        </a-spin>
      </div>
      <!-- table区域-begin -->
      <div>
        <a-table
          bordered
          size="middle"
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange">
          <span slot="action" slot-scope="text, record">
          <a @click="handleRefund(record)">退费</a>
          </span>
          <template slot="status" slot-scope="jieStatus">
            <a-tag v-if="jieStatus==0" color="red">未结算</a-tag>
            <a-tag v-if="jieStatus==1" color="green">已结算</a-tag>
          </template>
        </a-table>
      </div>
      <!-- table区域-end -->
      <share-profits-his-modal ref="shareProfitsHisModal" @ok="modalFormOk"></share-profits-his-modal>

    </a-modal>
  </div>
</template>

<script>
  import { getAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util'
  import { httpAction } from '@/api/manage'
  import JDate from '@/components/jeecg/JDate.vue'
  import ShareProfitsHisModal from "../modules/ShareProfitsHisModal";

  export default {
    name: "SelectUserModal",
    mixins:[JeecgListMixin],
    components: {
      JDate,
      ShareProfitsHisModal
    },
    data() {
      return {
        title: "分润明细",
        names: [],
        visible: false,
        placement: 'right',
        description: '',
        money: '请输入结算条件',
        // 查询条件
        queryParam: {
          iccid:"",
          higherAgentId:"",
          operatorType:"",
          createTime:""
        },
        operatorType:'',
        confirmLoading: false,
        // 表头
        columns: [
          {
            title:'续费单号',
            align:"center",
            dataIndex: 'orderNo',
            width: '400'
          },
          {
            title:'ICCID',
            align:"center",
            dataIndex: 'iccid',
            width: '400'
          },
          {
            title:'上级代理',
            align:"center",
            dataIndex: 'higherAgent'
          },
          {
            title:'下级代理',
            align:"center",
            dataIndex: 'lowerAgent'
          },
          /*{
            title:'套餐名称',
            align:"center",
            dataIndex: 'packageName'
          },
          {
            title:'套餐价格(元)',
            align:"center",
            dataIndex: 'packageMoney'
          },*/
          {
            title:'分润金额(元)',
            align:"center",
            dataIndex: 'shareMoney'
          },
          {
            title:'结算状态',
            align:"center",
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title:'分润时间',
            align:"center",
            dataIndex: 'createTime'
          }/*,
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }*/
        ],
        // 分页参数
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isorter: {
          column: 'createTime',
          order: 'desc',
        },
        loading: false,
        url: {
          list: "/shareprofits/iotShareProfits/listDetails",
          edit: "/shareprofits/iotShareProfits/edit",
          getNoSettle: "/shareprofits/iotShareProfits/getNoSettle",
          refund: "/shareprofits/iotShareProfits/refund"
        }
      }
    },
    methods: {
      edit(record,operatorType,time) {
        this.visible = true;
        this.queryParam.higherAgentId = record.agentId;
        this.queryParam.operatorType = operatorType;
        this.operatorType = operatorType;
        this.queryParam.createTime = time;
        // 当其它模块调用该模块时,调用此方法加载字典数据
        this.loadData();
      },
      settlement1(){
        const that = this;
        var iccid = this.queryParam.iccid;
        var timeStart = this.queryParam.createTime_begin;
        var timeEnd = this.queryParam.createTime_end;
        var higherAgentId = this.queryParam.higherAgentId;
        /*if(!iccid&&!timeStart&&!timeEnd){
          that.$message.warning('请输入结算条件');
          return false;
        }*/
        const formData = new FormData();
        formData.append('higherAgentId',higherAgentId);
        formData.append('operatorType',this.operatorType);
        formData.append('iccid',iccid);
        formData.append('timeStart',timeStart);
        formData.append('timeEnd',timeEnd);
        console.log(formData)
        httpAction(that.url.getNoSettle,formData,'post').then((res)=>{
          if(res.success){
            that.money = '总金额：'+res.result.shareMoney+'元，是否结算？';
          }else{
            that.money = '请输入结算条件';
          }
        })
      },
      settlement(){
        const that = this;
        var iccid = this.queryParam.iccid;
        var timeStart = this.queryParam.createTime_begin;
        var timeEnd = this.queryParam.createTime_end;
        var higherAgentId = this.queryParam.higherAgentId;
        if(!iccid&&!timeStart&&!timeEnd){
          that.$message.warning('请输入条件');
          return false;
        }
        that.confirmLoading = true;
        const formData = new FormData();
        formData.append('higherAgentId',higherAgentId);
        formData.append('operatorType',this.operatorType);
        formData.append('iccid',iccid);
        formData.append('timeStart',timeStart);
        formData.append('timeEnd',timeEnd);
        httpAction(that.url.edit,formData,'put').then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.$emit('ok');
            that.loadData(1);
          }else{
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.confirmLoading = false;
          //that.close();
        })
      },
      searchQuery() {
        this.loadData(1);
      },
      handleCancel() {
        this.visible = false;
      },
      handleOk() {
        this.dataSource2 = this.selectedRowKeys;
        console.log("data:" + this.dataSource2);
        this.$emit("selectFinished", this.dataSource2);
        this.visible = false;
      },
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
      },
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        console.log(sorter);
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination = pagination;
        this.loadData();
      },
      handleRefund(record){
        let params = {id:record.id};
        getAction(this.url.refund,params).then((res)=>{
          if(res.success){
            this.$message.success(res.message);
            this.loadData();
          }
        })
      },
      shareDetails(){
        this.$refs.shareProfitsHisModal.edit(this.queryParam.higherAgentId);
        this.$refs.shareProfitsHisModal.disableSubmit = true;
      },
    }
  }
</script>
<style lang="less" scoped>
  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
</style>