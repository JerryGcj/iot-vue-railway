<template>
  <div>
    <a-modal
      centered
      :title="title"
      :width="500"
      :visible="visible"
      :okButtonProps="{ props: {disabled: disableSubmit} }"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭">
      <!-- 查询区域 -->
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

    </a-modal>
  </div>
</template>

<script>
  import { getAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util'
  import { httpAction } from '@/api/manage'
  import JDate from '@/components/jeecg/JDate.vue'

  export default {
    name: "SelectUserModal",
    mixins:[JeecgListMixin],
    components: {
      JDate
    },
    data() {
      return {
        title: "临期卡列表",
        names: [],
        visible: false,
        placement: 'right',
        description: '',
        money: '请输入结算条件',
        // 查询条件
        queryParam: {
          userId:""
        },
        operatorType:'',
        confirmLoading: false,
        // 表头
        columns: [
          {
            title:'ICCID',
            align:"center",
            dataIndex: 'iccid',
            width: '400'
          },
          {
            title:'到期时间',
            align:"center",
            dataIndex: 'overtime'
          }
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
          list: "/telecomcardinformation/telecomCardInformation/expireCardList"
        }
      }
    },
    methods: {
      edit(record) {
        this.visible = true;
        this.queryParam.userId = record;
        // 当其它模块调用该模块时,调用此方法加载字典数据
        this.loadData(1);
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
      }
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