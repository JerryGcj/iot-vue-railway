<template>
  <div>
    <a-modal
      centered
      :title="title"
      :width="700"
      :visible="visible"
      :okButtonProps="{ props: {disabled: disableSubmit} }"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭">

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
          </span>
          <!--<template slot="status" slot-scope="jieStatus">
            <a-tag v-if="jieStatus==0" color="red">未结算</a-tag>
            <a-tag v-if="jieStatus==1" color="green">已结算</a-tag>
          </template>-->
        </a-table>
      </div>
      <!-- table区域-end -->


    </a-modal>
  </div>
</template>

<script>
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
        title: "分润历史",
        names: [],
        visible: false,
        placement: 'right',
        description: '',
        // 查询条件
        queryParam: {
          userId:""
        },
        confirmLoading: false,
        // 表头
        columns: [
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
                return "全部";
              }
            }
          },
          {
            title:'分润金额(元)',
            align:"center",
            dataIndex: 'hasMoney'
          },
          {
            title:'分润区间',
            align:"center",
            dataIndex: 'updateTime'
          },
          {
            title:'操作日期',
            align:"center",
            dataIndex: 'createTime'
          },
          {
            title:'打款方式',
            align:"center",
            dataIndex: 'withdrawMethod',
            customRender:function (text) {
              if(text=='1'){
                return "线下打款";
              }else if(text=="2"){
                return "公众号提现";
              }else {
                return text;
              }
            }
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
        loading: false,
        url: {
          list: "/shareprofitshistory/iotShareProfitsHistory/list",
          edit: "/shareprofits/iotShareProfits/adminEdit"
        }
      }
    },
    methods: {
      edit(record) {
        this.visible = true;
        this.queryParam.userId = record;
        // 当其它模块调用该模块时,调用此方法加载字典数据
        this.loadData();
      },
      searchQuery() {
        this.loadData(1);
      },
      handleCancel() {
        this.visible = false;
      },
      handleOk() {
        this.dataSource2 = this.selectedRowKeys;
        this.$emit("selectFinished", this.dataSource2);
        this.visible = false;
      },
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
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