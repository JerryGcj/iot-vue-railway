<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="运营商类型">
              <j-dict-select-tag placeholder="请选择运营商类型" v-model="queryParam.operatorType" dict-code="operator_type"></j-dict-select-tag>
              <!--<a-select v-model="queryParam.operatorType" placeholder="请选择">-->
                <!--<a-select-option value="0">移动</a-select-option>-->
                <!--<a-select-option value="1">联通</a-select-option>-->
                <!--<a-select-option value="2">电信</a-select-option>-->
              <!--</a-select>-->
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="套餐名称">
              <a-input placeholder="请输入套餐名称" v-model="queryParam.packageName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="标准资费">
              <a-input placeholder="请输入标准资费" v-model="queryParam.standardRates"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="套餐类型">
              <a-select v-model="queryParam.packageType" placeholder="请选择">
                <a-select-option value="0">流量</a-select-option>
                <a-select-option value="1">语音</a-select-option>
                <a-select-option value="2">短信</a-select-option>
                <a-select-option value="3">混合</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.statue" placeholder="请选择">
                <a-select-option value="0">上架</a-select-option>
                <a-select-option value="1">下架</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="包体类型">
              <a-select v-model="queryParam.statue" placeholder="请选择">
                <a-select-option value="0">按自然月计费</a-select-option>
                <a-select-option value="1">按使用时间计费</a-select-option>
              </a-select>
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
      <a-button v-has="'standardCostList:add'" @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button v-has="'standardCostList:export'" type="primary" icon="download" @click="handleExportXls('标准资费列表')">导出</a-button>
      <a-button v-has="'standardCostList:import'" @click="handleImportXls" type="primary" icon="upload">导入</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="2" @click="handleOn('0')"><a-icon type="unlock"/>上架</a-menu-item>
          <a-menu-item key="3" @click="handleOn('1')"><a-icon type="lock"/>下架</a-menu-item>
          <!--<a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>-->
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
          <a v-has="'standardCostList:edit'" @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a v-has="'standardCostList:delete'">删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

        <template slot="state" slot-scope="state">
          <a-tag v-if="state==0" color="green">上架</a-tag>
          <a-tag v-if="state==1" color="red">下架</a-tag>
        </template>

      </a-table>
      <j-import-modal ref="importModal" :url="getImportUrl()" @ok="importOk"></j-import-modal>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <standardCost-modal ref="modalForm" @ok="modalFormOk"></standardCost-modal>
  </a-card>
</template>

<script>
  import StandardCostModal from './modules/StandardCostModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {hanleOnBatch} from '@/api/api'
  import JImportModal from './modules/StandardCostImportModal'

  export default {
    name: "StandardCostList",
    mixins:[JeecgListMixin],
    components: {
      StandardCostModal,
      JImportModal
    },
    data () {
      return {
        description: '标准资费列表管理页面',
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
            title: '标准资费（元）',
            align:"center",
            dataIndex: 'standardRates'
          },
		      {
            title: '运营商类型',
            align:"center",
            dataIndex: 'operatorType_dictText',
           },
          {
            title: '包体类型',
            align:"center",
            dataIndex: 'inclusionType',
            customRender:function (text) {
              if(text=='0'){
                return "按自然月计费";
              }else if(text=="1"){
                return "按使用时间计费";
              } else {
                return text;
              }
            }
          },
		      {
            title: '套餐类型',
            align:"center",
            dataIndex: 'packageType',
             customRender:function (text) {
               if(text=='0'){
                 return "流量";
               }else if(text=="1"){
                 return "语音";
               }else if(text=="2"){
                 return "短信";
               }else if(text=="3"){
                 return "混合";
               } else {
                 return text;
               }
             }
           },
		   {
            title: '包含流量(M)',
            align:"center",
            dataIndex: 'containsFlow'
       },
          {
            title: '生效类型',
            align:"center",
            dataIndex: 'effectType',
            customRender:function (text) {
              if(text=='0'){
                return "立即生效";
              }else if(text=="1"){
                return "次月生效";
              }else if(text=="2"){
                return "到期生效";
              } else {
                return text;
              }
            }
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'state',
            scopedSlots: { customRender: 'state' }
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
          list: "/standardcost/standardCost/list",
          delete: "/standardcost/standardCost/delete",
          deleteBatch: "/standardcost/standardCost/deleteBatch",
          exportXlsUrl: "standardcost/standardCost/exportXls",
          importExcelUrl: "standardcost/standardCost/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      handleOn: function (status) {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        } else {
          let ids = "";
          let that = this;
          that.selectedRowKeys.forEach(function (val) {
            ids += val + ",";
          });
          this.$confirm({
            title: "确认操作",
            content: "是否" + (status == 0 ? "上架" : "下架") + "选中套餐?",
            onOk: function () {
              hanleOnBatch({ids: ids, status: status}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.loadData();
                  that.onClearSelected();
                } else {
                  that.$message.warning(res.message);
                }
              });
            }
          });
        }
      },
      importOk(){
        this.loadData(1)
      },
      getImportUrl(){
        return '/standardcost/standardCost/importExcel/'
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>