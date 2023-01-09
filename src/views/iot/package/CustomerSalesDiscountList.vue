<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">


          <a-col :md="6" :sm="8">
            <a-form-item label="下级企业">
              <a-select v-model="queryParam.agentId"
                        placeholder="下级企业">
                <a-select-option v-for="d in userData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="运营商类型">
              <j-dict-select-tag placeholder="请选择运营商类型" v-model="queryParam.operatorType" dict-code="operator_type"></j-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="代理商登录名">
              <a-input placeholder="请输入代理商登录名" v-model="queryParam.agentUsername"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="套餐名称">
              <a-input placeholder="请输入套餐名称" v-model="queryParam.packageName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" v-has="'customerSalesDiscount:add'" type="primary" icon="plus">新增</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls('客户销售折扣管理')">导出</a-button>-->
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <!--<a-button type="primary" icon="import">导入</a-button>-->
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a v-has="'customerSalesDiscount:edit'" @click="customerEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a v-has="'customerSalesDiscount:delete'">删除</a>
          </a-popconfirm>
        </span>
        <template slot="state" slot-scope="state">
          <a-tag v-if="state==0" color="green">上架</a-tag>
          <a-tag v-if="state==1" color="red">下架</a-tag>
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <customerSalesDiscount-modal ref="modalForm" @ok="modalFormOk"></customerSalesDiscount-modal>
    <customer-sales-discount-modal-editor ref="CustomerSalesDiscountModalEditor" @ok="modalFormOk"></customer-sales-discount-modal-editor>
  </a-card>
</template>

<script>
  import CustomerSalesDiscountModal from './modules/CustomerSalesDiscountModal'
  import CustomerSalesDiscountModalEditor from './modules/CustomerSalesDiscountModalEditor'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {queryLowerAgent,queryDiscountPackageByOperator } from '@/api/api'

  export default {
    name: "CustomerSalesDiscountList",
    mixins:[JeecgListMixin],
    components: {
      CustomerSalesDiscountModal,
      CustomerSalesDiscountModalEditor
    },
    data () {
      return {
        description: '客户销售折扣管理管理页面',
        userData:[],
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
            title: '套餐名称',
            align:"center",
            dataIndex: 'packageName'
          },
          {
            title: '下级代理名称',
            align:"center",
            dataIndex: 'agentName'
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'state',
            scopedSlots: { customRender: 'state' }
          },
          {
            title: '销售价格（元）',
            align:"center",
            dataIndex: 'salesPrice',
            width: 150
          },
          {
            title: '备注',
            align:"center",
            dataIndex: 'note'
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
          list: "/customersalesdiscount/customerSalesDiscount/list",
          delete: "/customersalesdiscount/customerSalesDiscount/delete",
          deleteBatch: "/customersalesdiscount/customerSalesDiscount/deleteBatch",
          exportXlsUrl: "customersalesdiscount/customerSalesDiscount/exportXls",
          importExcelUrl: "customersalesdiscount/customerSalesDiscount/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){

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

      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {

      customerEdit: function (record) {
        this.$refs.CustomerSalesDiscountModalEditor.edit(record);
        this.$refs.CustomerSalesDiscountModalEditor.title = "编辑";
        this.$refs.CustomerSalesDiscountModalEditor.disableSubmit = false;

      },

     
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>