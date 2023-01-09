<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col v-has="'customerManagementList:selectCustomerId'" :md="6" :sm="8">
            <a-form-item label="客户" >
              <!--<a-input placeholder="请输入客户" v-model="queryParam.userNameId"></a-input>-->
              <!--异步树加载组件 通过传入表名 显示字段 存储字段 加载一个树控件
              <j-tree-select dict="aa_tree_test,aad,id" pid-field="pid" ></j-tree-select>-->
              <j-tree-select
                v-model="queryParam.id"
                placeholder="请选择客户"
                dict="sys_user,user_company,id"
                pidField="create_by_id"
                pidValue=""/>
            </a-form-item>
          </a-col>

          <a-col v-has="'customerManagementList:selectCustomerIdDls'" :md="6" :sm="8">
            <a-form-item label="客户">
              <a-select v-model="queryParam.id"
                        placeholder="请选择客户">
                <a-select-option v-for="d in userData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a-button v-has="'customerManagementList:recharge'" type="primary" @click="recharge" icon="money-collect" style="margin-left: 8px">充值</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--<a-button type="primary" icon="download" @click="handleExportXls('客户管理')">导出</a-button>-->
      <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
        <!--<a-button type="primary" icon="import">导入</a-button>-->
      <!--</a-upload>-->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <!--<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>-->

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
          <a v-has="'customerManagementList:edit'" @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a v-has="'customerManagementList:manualRecharge'" @click="manualRecharge(record)">充值<a-divider type="vertical" /></a>


          <a @click="showCustomerDetails(record)">详情</a>

        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <customerManagement-modal ref="modalForm" @ok="modalFormOk"></customerManagement-modal>
    <customerManagement-details ref="customerDetails"></customerManagement-details>
    <customer-recharge-modal ref="rechargeModal" @ok="modalFormOk"></customer-recharge-modal>
    <manual-recharge-modal ref="manualRechargeModal" @ok="modalFormOk"></manual-recharge-modal>
  </a-card>
</template>

<script>
  import CustomerManagementModal from './modules/CustomerManagementModal'
  import CustomerRechargeModal from './modules/CustomerRechargeModal'
  import CustomerManagementDetails from './modules/CustomerManagementDetails'
  import ManualRechargeModal from './modules/ManualRechargeModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JTreeSelect from '@/components/jeecg/JTreeSelect'
  import {queryLowerAgent} from '@/api/api'

  export default {
    name: "CustomerManagementList",
    mixins:[JeecgListMixin],
    components: {
      CustomerManagementModal,
      CustomerManagementDetails,
      JTreeSelect,
      CustomerRechargeModal,
      ManualRechargeModal
    },
    data () {
      return {
        description: '客户管理管理页面',
        userData: [],
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
           },
          {
            title: '企业名称',
            align:"center",
            dataIndex: 'userCompany'
          },
          {
            title: '用户类型',
            align: "center",
            width: 100,
            dataIndex: 'userType',
            customRender:function (text) {
              if(text=='0'){
                return "内部用户";
              }else if(text=="1"){
                return "代理商";
              }else if(text=="2"){
                return "合伙人";
              }else if(text=="3"){
                return "企业用户";
              } else {
                return text;
              }
            }
          },
          {
            title: '状态',
            align: "center",
            width: 80,
            dataIndex: 'status',
            customRender:function (text) {
              if(text=='1'){
                return "正常";
              }else if(text=="2"){
                return "冻结";
              } else {
                return text;
              }
            }
          },
          {
            title: '联系人',
            align:"center",
            dataIndex: 'realname'
          },
          {
            title: '联系电话',
            align:"center",
            dataIndex: 'phone'
          },
          {
            title: '备注',
            align:"center",
            dataIndex: 'note'
          },
          {
            title: '余额',
            align:"center",
            dataIndex: 'balance'
          },
          {
            title: '创建时间',
            align:"center",
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/customermanagement/customerManagement/list",
          listFind: "/customermanagement/customerManagement/listFind",
          delete: "/customermanagement/customerManagement/delete",
          deleteBatch: "/customermanagement/customerManagement/deleteBatch",
          exportXlsUrl: "customermanagement/customerManagement/exportXls",
          importExcelUrl: "customermanagement/customerManagement/importExcel",
       },
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
    },
    methods: {

      showCustomerDetails(record){
        this.$refs.customerDetails.edit(record);
        this.$refs.customerDetails.title="详情";
        this.$refs.customerDetails.disableSubmit = true;
      },
      recharge(){
        this.$refs.rechargeModal.add();
        this.$refs.rechargeModal.title="充值";
        this.$refs.rechargeModal.disableSubmit = true;
      },
      manualRecharge(record) {
        this.$refs.manualRechargeModal.add(record);
        this.$refs.manualRechargeModal.title = "充值";
        this.$refs.manualRechargeModal.disableSubmit = false;
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>