<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="运营商名称">
              <a-input placeholder="请输入运营商名称" v-model="queryParam.operatorName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="运营商类型">
             <j-dict-select-tag placeholder="请选择运营商类型" v-model="queryParam.operatorTypeId" dict-code="operator_type"></j-dict-select-tag>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.state" placeholder="请选择状态类型">
                  <a-select-option value="0">注销</a-select-option>
                  <a-select-option value="1">正常</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="16">
              <a-form-item label="创建时间">
                <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间" class="query-group-cust" v-model="queryParam.createTime_begin"></j-date>
                <span class="query-group-split-cust"></span>
                <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间" class="query-group-cust" v-model="queryParam.createTime_end"></j-date>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button v-has="'iotOperatorList:add'" @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button v-has="'iotOperatorList:export'" type="primary" icon="download" @click="handleExportXls('iot_operator')">导出</a-button>
      <!--<a-button type="primary" :action="importExcelUrl" icon="import" @click="handleCardImport">卡导入</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
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
        :rowSelection="{fixed:true,selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"

        @change="handleTableChange">

        <!-- <template slot="htmlSlot" slot-scope="text">
           <div v-html="text"></div>
         </template>
         <template slot="imgSlot" slot-scope="text">
           <span v-if="!text" style="font-size: 12px;font-style: italic;">无此图片</span>
           <img v-else :src="getImgView(text)" height="25px" alt="图片不存在" style="max-width:80px;font-size: 12px;font-style: italic;"/>
         </template>
         <template slot="fileSlot" slot-scope="text">
           <span v-if="!text" style="font-size: 12px;font-style: italic;">无此文件</span>
           <a-button
             v-else
             :ghost="true"
             type="primary"
             icon="download"
             size="small"
             @click="uploadFile(text)">
             下载
           </a-button>
         </template>-->

        <span slot="action" slot-scope="text, record">
          <a v-has="'iotOperatorList:edit'" @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a v-has="'iotOperatorList:edit'" @click="groupManager(record)">群组管理</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
                <a-menu-item>
                  <a v-has="'iotOperatorList:handApiTemplate'" @click="handApiTemplate(record)">关联API模版</a>
                </a-menu-item>
                <!--<a-menu-item>-->
                  <!--<a v-has="'iotOperatorList:handleTest'" @click="handleTest(record.id)">接口流控设置</a>-->
                <!--</a-menu-item>-->
                <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a v-has="'iotOperatorList:delete'">删除</a>
                </a-popconfirm>
                </a-menu-item>
            </a-menu>
          </a-dropdown>

        </span>

      </a-table>

    </div>
    <!-- ceshi -->
    <iotOperatorApiFlowControl-modal ref="iotOperatorApiFlowControlModal" @ok="iotOperatorApiFlowControlModalOK"></iotOperatorApiFlowControl-modal>
    <iotOperator-modal ref="modalForm" @ok="modalFormOk"></iotOperator-modal>
    <iot-operator-api-template ref="IotOperatorApiTemplate" @ok="modalFormOk"></iot-operator-api-template>
    <card-information-import ref="CardInformationImport" @ok="modalFormOk"></card-information-import>
    <iot-enterprise-operator-group-list ref="EnterpriseOperatorGroupList"></iot-enterprise-operator-group-list>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import IotOperatorModal from './modules/IotOperatorModal'
  import JDate from '@/components/jeecg/JDate.vue'
  import iotOperatorApiFlowControlModal from "./modules/iotOperatorApiFlowControlModal"
  import { getAction } from '@/api/manage'
  import IotOperatorApiTemplate from "./modules/IotOperatorApiTemplate"
  import IotEnterpriseOperatorGroupList from "../enterprise/IotEnterpriseOperatorGroupList"
  import CardInformationImport from './modules/CardInformationImport'

  export default {
    name: "IotOperatorList",
    mixins:[JeecgListMixin],
    components: {
      JDate,
      IotOperatorModal,
      iotOperatorApiFlowControlModal,
      IotOperatorApiTemplate,
      IotEnterpriseOperatorGroupList,
      CardInformationImport,
    },
    data () {
      return {
        description: 'iot_operator管理页面',
        // 表头
        columns: [
          /*{
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },*/
          {
            title:'运营商名称',
            align:"center",
            dataIndex: 'operatorName'
          },
          {
            title:'运营商类型',
            align:"center",
            dataIndex: 'operatorTypeId_dictText',

          },
          {
            title:'状态',
            align:"center",
            dataIndex: 'state',
            customRender:function (text) {
              if(text=='0'){
                return "注销";
              }else if(text=="1"){
                return "正常";
              } else {
                return text;
              }
            }
          },
          {
            title:'创建时间',
            align:"center",
            dataIndex: 'createTime'
          },
          /*{
            title:'线程数',
            align:"center",
            dataIndex: 'threadNumber'
          },
          {
            title:'队列数',
            align:"center",
            dataIndex: 'queueNumber'
          },
          {
            title:'并发数',
            align:"center",
            dataIndex: 'concurrencyNumber'
          },
          {
            title:'每秒请求数',
            align:"center",
            dataIndex: 'requestNumber'
          },
          {
            title:'达到流控阀值等待秒数',
            align:"center",
            dataIndex: 'waitingSeconds'
          },
          {
            title:'单卡同步时间间隔(分钟)',
            align:"center",
            dataIndex: 'intervalTime'
          },*/
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/iotoperator/iotOperator/list",
          delete: "/iotoperator/iotOperator/delete",
          deleteBatch: "/iotoperator/iotOperator/deleteBatch",
          exportXlsUrl: "/iotoperator/iotOperator/exportXls",
          importExcelUrl: "iotoperator/iotOperator/importExcel",
          iotOperatorApiFlowList: "/iotoperatorapiflowcontrol/iotOperatorApiFlowControl/queryIotOperatorApiFlowControl"
        },
        dictOptions:{
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      handleCardImport: function () {
        if (this.selectedRowKeys.length != 1) {
          this.$message.warning('请选择一个运营商！');
          return false;
        }
        let map = this.selectionRows.map(item=>{return item.id});
        this.$refs.CardInformationImport.edit(map[0]);
        this.$refs.CardInformationImport.title = "卡导入";
        this.$refs.CardInformationImport.disableSubmit = false;
      },
      initDictConfig(){
      },
      groupManager(record){
        this.$refs.EnterpriseOperatorGroupList.edit(record);
      },

      handApiTemplate:function (record) {

        let params = {operatorId:record.id}
        getAction('/operatortemplate/operatorTemplate/queryOperatorTemplate',params).then((res)=>{
          if(res.success){
            let treeList= res.result;
            this.$refs.IotOperatorApiTemplate.edit(treeList);
            this.$refs.IotOperatorApiTemplate.title = "API模版";
            this.$refs.IotOperatorApiTemplate.disableSubmit = false;
          }else{
            this.$refs.IotOperatorApiTemplate.add(record);
            this.$refs.IotOperatorApiTemplate.title = "API模版";
            this.$refs.IotOperatorApiTemplate.disableSubmit = false;
          }
        });
      },

      handleTest(id){
        let params = {operatorId:id}
        //初始化客户详情
        //初始化流速
        getAction(this.url.iotOperatorApiFlowList,params).then((res)=>{
          if(res.success){
            let treeList= res.result;
            this.$refs.iotOperatorApiFlowControlModal.edit(treeList);
            this.$refs.iotOperatorApiFlowControlModal.title = "流控设置";
            this.$refs.iotOperatorApiFlowControlModal.disableSubmit = false;
          }
        });
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>