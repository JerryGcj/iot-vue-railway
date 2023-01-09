<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="代理商">
              <a-input placeholder="请输入代理商" v-model="queryParam.apiId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="用户名">
              <a-input placeholder="请输入用户名" v-model="queryParam.ispId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
              <a-form-item label="搜索状态">
                <a-select v-model="queryParam.paymentMethod" placeholder="请选择搜索状态">
                  <a-select-option value="0">预付费</a-select-option>
                  <a-select-option value="1">测试期</a-select-option>
                  <a-select-option value="2">库存</a-select-option>
                  <a-select-option value="3">待激活</a-select-option>
                  <a-select-option value="4">已激活</a-select-option>
                  <a-select-option value="5">已停用</a-select-option>
                  <a-select-option value="6">已失效</a-select-option>
                </a-select>
              </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="ICCID">
              <a-input placeholder="请输入ICCID" v-model="queryParam.uid"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="MSISDN">
              <a-input placeholder="请输入MSISDN" v-model="queryParam.packageId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="批次号">
              <a-input placeholder="请输入批次号" v-model="queryParam.packageId"></a-input>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('卡列表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
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
    <card-modal ref="modalForm" @ok="modalFormOk"></card-modal>
  </a-card>
</template>

<script>
  import CardModal from './modules/CardModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "CardList",
    mixins:[JeecgListMixin],
    components: {
      CardModal
    },
    data () {
      return {
        description: '卡列表管理页面',
        // 表头
        columns: [
		      {
            title: '接口编号',
            align:"center",
            dataIndex: 'apiId'
           },
		      {
            title: '运营商编号',
            align:"center",
            dataIndex: 'ispId'
           },
          {
            title: '套餐编号',
            align:"center",
            dataIndex: 'packageId'
          },
          {
            title: '套餐有效期',
            align:"center",
            dataIndex: 'termLength'
          },
          {
            title: '套餐结束时间',
            align:"center",
            dataIndex: 'termEndTime'
          },
          {
            title: '代理商编号',
            align:"center",
            dataIndex: 'agentId'
          },
          {
            title: '用户编号',
            align:"center",
            dataIndex: 'uid'
          },
          {
            title: 'iccid',
            align:"center",
            dataIndex: 'iccid',
          },
          {
            title: 'msisdn',
            align:"center",
            dataIndex: 'msisdn'
          },
          {
            title: 'imsi',
            align:"center",
            dataIndex: 'imsi'
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'status'
          },
          {
            title: '分配时间',
            align:"center",
            dataIndex: 'dispatchTime'
          },
          {
            title: '激活时间',
            align:"center",
            dataIndex: 'activeTime'
          },
          {
            title: '刷新时间',
            align:"center",
            dataIndex: 'refreshTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/card/card/list",
          delete: "/card/card/delete",
          deleteBatch: "/card/card/deleteBatch",
          exportXlsUrl: "card/card/exportXls",
          importExcelUrl: "card/card/importExcel",
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