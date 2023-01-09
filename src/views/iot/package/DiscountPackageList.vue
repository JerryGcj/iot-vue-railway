<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="上级运营商">
              <a-select v-decorator="[ 'operatorId', {}]"
                        placeholder="上级运营商">
                <a-select-option v-for="d in operatorData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="运营商类型">
              <j-dict-select-tag placeholder="请选择运营商类型" v-model="queryParam.operatorType" dict-code="operator_type"></j-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="上游套餐编码">
              <a-input placeholder="请输入上游套餐编码" v-model="queryParam.upstreamPackageCode"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="运营商名称">
              <a-input placeholder="请输入运营商名称" v-model="queryParam.operatorName"></a-input>
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
      <a-button v-has="'discountPackageList:add'" @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button v-has="'discountPackageList:export'" type="primary" icon="download" @click="handleExportXls('套餐折扣管理')">导出</a-button>
      <a-upload  name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button v-has="'discountPackageList:import'" type="primary" icon="import">导入</a-button>
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
          <a v-has="'discountPackageList:edit'" @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a v-has="'discountPackageList:delete'">删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <discountPackage-modal ref="modalForm" @ok="modalFormOk"></discountPackage-modal>
  </a-card>
</template>

<script>
  import DiscountPackageModal from './modules/DiscountPackageModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {queryOperator } from '@/api/api'

  export default {
    name: "DiscountPackageList",
    mixins:[JeecgListMixin],
    components: {
      DiscountPackageModal,
      queryOperator
    },
    data () {
      return {
        description: '套餐折扣管理管理页面',
        operatorData:[],
        // 表头
        columns: [

          {
            title: '套餐名称',
            align:"center",
            dataIndex: 'packageName'
          },
          {
            title: '运营商名称',
            align:"center",
            dataIndex: 'operatorName'
          },
          {
            title: '上游套餐编码',
            align:"center",
            dataIndex: 'upstreamPackageCode'
          },
          {
            title: '运营商类型',
            align:"center",
            dataIndex: 'operatorType_dictText',

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
            dataIndex: 'cost'
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
          list: "/discountpackage/discountPackage/list",
          delete: "/discountpackage/discountPackage/delete",
          deleteBatch: "/discountpackage/discountPackage/deleteBatch",
          exportXlsUrl: "discountpackage/discountPackage/exportXls",
          importExcelUrl: "discountpackage/discountPackage/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){


      var that = this;
      queryOperator().then((res)=>{
        if(res.success){
        that.operatorData = [];
        let treeList = res.result
        for(let a=0;a<treeList.length;a++){
          let temp = treeList[a];
          this.operatorData.push({
            value:temp.id,
            text:temp.operatorName
          })
        }
      }
    });
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