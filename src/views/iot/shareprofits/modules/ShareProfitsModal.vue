<template>
  <div>
    <a-modal
      centered
      :title="title"
      :width="1000"
      :visible="visible"
      :okButtonProps="{ props: {disabled: disableSubmit} }"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭">
      <div class="table-page-search-wrapper">
        <a-spin :spinning="confirmLoading">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col :span="8">
                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <a-button type="primary" @click="shareDetails">历史分润</a-button>
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
            <a-popconfirm title="确定结算吗？" @confirm="settlement(record)" okText="确定" cancelText="取消">
              <a>结算</a>
            </a-popconfirm>
          </span>
          <!--<template slot="status" slot-scope="jieStatus">
            <a-tag v-if="jieStatus==0" color="red">未结算</a-tag>
            <a-tag v-if="jieStatus==1" color="green">已结算</a-tag>
          </template>-->
        </a-table>
        <share-profits-history-modal ref="shareProfitsHistoryModal" @ok="modalFormOk"></share-profits-history-modal>
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
  import ShareProfitsHistoryModal from './ShareProfitsHistoryModal'

  export default {
    name: "SelectUserModal",
    mixins:[JeecgListMixin],
    components: {
      JDate,
      ShareProfitsHistoryModal
    },
    data() {
      return {
        title: "分润合计",
        names: [],
        visible: false,
        placement: 'right',
        description: '',
        // 查询条件
        queryParam: {
          operatorType:"",
          higherAgentId:"",
          time:""
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
          /*{
            title:'结算状态',
            align:"center",
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },*/
          {
            title:'分润截止日期',
            align:"center",
            dataIndex: 'updateDate'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
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
          list: "/shareprofits/iotShareProfits/queryShare",
          edit: "/shareprofits/iotShareProfits/adminEdit"
        }
      }
    },
    methods: {
      edit(record,record1,record2) {
        this.visible = true;
        this.queryParam.higherAgentId = record;
        this.queryParam.operatorType = record1;
        this.queryParam.time = record2;
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
      },
      shareDetails(){
        this.$refs.shareProfitsHistoryModal.edit(this.queryParam.higherAgentId);
        this.$refs.shareProfitsHistoryModal.disableSubmit = true;
      },
      settlement(record){
        const that = this;
        if(record.noShare==0){
          that.$message.warning('暂无未分润金额');
          return false;
        }
        var operatorType = record.operatorType;
        var time = this.queryParam.time;
        var higherAgentId = this.queryParam.higherAgentId;
        const formData = new FormData();
        formData.append('higherAgentId',higherAgentId);
        formData.append('operatorType',operatorType);
        formData.append('time',time);
        formData.append('shareMoney',record.shareMoney);
        formData.append('hasShare',record.hasShare);
        formData.append('noShare',record.noShare);
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