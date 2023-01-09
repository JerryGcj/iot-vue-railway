<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="运营商类型">
              <a-select v-model="queryParam.operatorType" placeholder="请选择">
                <a-select-option value="0">移动</a-select-option>
                <a-select-option value="1">联通</a-select-option>
                <a-select-option value="2">电信</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="套餐编号">
              <a-input placeholder="请输入套餐编号" v-model="queryParam.packageId"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="套餐名称">
              <a-input placeholder="请输入套餐名称" v-model="queryParam.packageName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="备注">
              <a-input placeholder="请输入备注" v-model="queryParam.note"></a-input>
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
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--<a-button type="primary" icon="download" @click="handleExportXls('代理商套餐折扣管理')">导出</a-button>-->
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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <agentDiscountPackage-modal ref="modalForm" @ok="modalFormOk"></agentDiscountPackage-modal>
  </a-card>
</template>

<script>
  import AgentDiscountPackageModal from './modules/AgentDiscountPackageModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "AgentDiscountPackageList",
    mixins:[JeecgListMixin],
    components: {
      AgentDiscountPackageModal
    },
    data () {
      return {
        description: '代理商套餐折扣管理管理页面',
        // 表头
        columns: [
          {
            title: '套餐名称',
            align:"center",
            dataIndex: 'packageName'
          },
          {
            title: '上级代理',
            align:"center",
            dataIndex: 'createUser'
          },

          {
            title: '运营商类型',
            align:"center",
            dataIndex: 'operatorType',
            customRender:function (text) {
              if(text=='0'){
                return "移动";
              }else if(text=="1"){
                return "联通";
              }else if(text=="2"){
                return "电信";
              } else {
                return text;
              }
            }
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'state',
            customRender:function (text) {
              if(text=='0'){
                return "上架";
              }else if(text=="1"){
                return "下架";
              } else {
                return text;
              }
            }
          },
          {
            title: '备注',
            align:"center",
            dataIndex: 'note'
          },
          {
            title: '成本（元）',
            align:"center",
            dataIndex: 'salesPrice'
          },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   align:"center",
          //   scopedSlots: { customRender: 'action' },
          // }
        ],
		url: {
          list: "/agentdiscountpackage/agentDiscountPackage/list",
          delete: "/agentdiscountpackage/agentDiscountPackage/delete",
          deleteBatch: "/agentdiscountpackage/agentDiscountPackage/deleteBatch",
          exportXlsUrl: "agentdiscountpackage/agentDiscountPackage/exportXls",
          importExcelUrl: "agentdiscountpackage/agentDiscountPackage/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
     
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>