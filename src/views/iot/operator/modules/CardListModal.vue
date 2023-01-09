<template>
  <div>
    <a-modal
      centered
      :title="title"
      :width="800"
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

            <a-col :md="10" :sm="10">
              <a-form-item label="ICCID">
                <a-input placeholder="请输入ICCID" v-model="queryParam.iccid"></a-input>
                <!--<a-input placeholder="开始ICCID" class="query-group-cust" v-model="queryParam.iccid_begin"></a-input>
                <span class="query-group-split-cust"></span>
                <a-input placeholder="结束ICCID" class="query-group-cust" v-model="queryParam.iccid_end"></a-input>-->
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.actived" placeholder="请选择状态类型">
                  <a-select-option value="0">未激活</a-select-option>
                  <a-select-option value="1">已激活</a-select-option>
                  <a-select-option value="2">库存</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
                    <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
    name: "SelectUserModal",
    mixins:[JeecgListMixin],
    components: {
      JDate
    },
    data() {
      return {
        title: "卡列表",
        names: [],
        visible: false,
        placement: 'right',
        description: '',
        // 查询条件
        queryParam: {
          groupId:''
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
            title:'激活状态',
            align:"center",
            dataIndex: 'actived',
            customRender:function (text) {
              if(text==0){
                return "未激活";
              }else if(text==1){
                return "已激活";
              } else if(text==2){
                return "库存";
              } else {
                return text;
              }
            }
          },
          {
            title:'上游状态码',
            align:"center",
            dataIndex: 'upstreamStatus'
          },
          {
            title:'添加时间',
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
          list: "/enterprisetodoactived/iotEnterpriseTodoActived/list"
        }
      }
    },
    methods: {
      edit(record) {
        console.log(record.groupId)
        this.visible = true;
        this.queryParam.groupId = record.groupId;
        // 当其它模块调用该模块时,调用此方法加载字典数据
        this.loadData();
      },
      searchQuery() {
        this.loadData(1);
      },
      searchReset() {
        this.queryParam = {groupId:this.queryParam.groupId}
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