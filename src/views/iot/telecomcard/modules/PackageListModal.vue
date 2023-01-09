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

          <template slot="active" slot-scope="status">
            <a-tag v-if="status==0" color="gray">待生效</a-tag>
            <a-tag v-if="status==1" color="green">生效中</a-tag>
            <a-tag v-if="status==2" color="red">到期失效</a-tag>
            <a-tag v-if="status==3" color="purple">超量失效</a-tag>
          </template>
        </a-table>
      </div>
      <!-- table区域-end -->


    </a-modal>
  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util'

  export default {
    name: "PackageListModal",
    mixins:[JeecgListMixin],
    data() {
      return {
        title: "套餐列表",
        visible: false,
        placement: 'right',
        description: '',
        // 查询条件
        queryParam: {
          iccid:""
        },
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
            title:'套餐名称',
            align:"center",
            dataIndex: 'takeEffectPackageName'
          },
          {
            title:'生效时间',
            align:"center",
            dataIndex: 'validStart'
          },
          {
            title:'失效时间',
            align:"center",
            dataIndex: 'validEnd'
          },
          {
            title:'流量总量(M)',
            align:"center",
            dataIndex: 'originUse'
          },
          {
            title:'流量用量(M)',
            align:"center",
            dataIndex: 'usaged'
          },
          {
            title:'状态',
            align:"center",
            dataIndex: 'active',
            scopedSlots: { customRender: 'active' }
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
          list: "/telecomcardinformation/telecomCardInformation/listDetails"
        }
      }
    },
    methods: {
      edit(record) {
        console.log(JSON.stringify(record))
        this.visible = true;
        this.queryParam.iccid = record;
        // 当其它模块调用该模块时,调用此方法加载字典数据
        this.loadData();
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