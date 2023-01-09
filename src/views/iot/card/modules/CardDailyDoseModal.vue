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
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-spin :spinning="confirmLoading">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="14" :sm="14">
              <a-form-item label="日期">
                <j-date placeholder="请选择开始日期" class="query-group-cust" v-model="queryParam.startTime" dateFormat="YYYY-MM-DD"></j-date>
                <span class="query-group-split-cust"></span>
                <j-date placeholder="请选择结束日期" class="query-group-cust" v-model="queryParam.endTime" dateFormat="YYYY-MM-DD"></j-date>
              </a-form-item>
            </a-col>
            <a-col :span="8">
                    <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
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
    name: "CardDailyDoseModal",
    mixins:[JeecgListMixin],
    components: {
      JDate
    },
    data() {
      return {
        title: "日用量",
        names: [],
        visible: false,
        placement: 'right',
        description: '',
        // 查询条件
        queryParam: {
          iccid:"",
        },
        confirmLoading: false,
        // 表头
        columns: [
          {
            title:'ICCID',
            align:"center",
            dataIndex: 'iccid'
          },
          {
            title:'日期',
            align:"center",
            dataIndex: 'date',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'用量(M)',
            align:"center",
            dataIndex: 'cardUsage'
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
          column: 'date',
          order: 'desc',
        },
        loading: false,
        url: {
          list: "/iotcardusage/iotCardUsage/list"
        }
      }
    },
    methods: {
      edit(record) {
        this.visible = true;
        this.queryParam.iccid = record.iccid;
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