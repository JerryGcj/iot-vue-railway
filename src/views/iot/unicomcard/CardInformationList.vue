<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col v-has="'enterpriseCardInformationList:selectCustomerId'" :md="6" :sm="8">
            <a-form-item label="客户" >
              <!--<j-tree-select
                v-model="queryParam.userId"
                placeholder="请选择客户"
                dict="sys_user,user_company,id"
                pidField="create_by_id"
                pidValue=""/>-->
              <j-search-select-tag
                placeholder="请选择客户"
                v-model="queryParam.userId"
                dict="sys_user,user_company,id"
                >
              </j-search-select-tag>
            </a-form-item>
          </a-col>

          <a-col v-has="'enterpriseCardInformationList:selectCustomerIdDls'" :md="6" :sm="8">
            <a-form-item label="客户">
              <a-select v-model="queryParam.userId"
                        placeholder="客户">
                <a-select-option v-for="d in userData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="10">
            <a-form-item label="ICCID">
              <a-input placeholder="开始ICCID" class="query-group-cust" v-model="queryParam.iccidStart"></a-input>
              <span class="query-group-split-cust"></span>
              <a-input placeholder="结束ICCID" class="query-group-cust" v-model="queryParam.iccidEnd"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="6">
            <a-form-item label="msisdn">
              <a-input placeholder="msisdn" v-model="queryParam.msisdn"></a-input>
            </a-form-item>
          </a-col>
          <!--<a-col :md="4" :sm="6">
            <a-form-item label="运营商类型">
              <j-dict-select-tag placeholder="请选择运营商类型" v-model="queryParam.operatorType" dict-code="operator_type"></j-dict-select-tag>
            </a-form-item>
          </a-col>-->
          <a-col :md="4" :sm="6">
            <a-form-item label="运营商">
              <j-dict-select-tag v-model="queryParam.operatorId" placeholder="请选择运营商" dict-code="iot_operator,operator_name,id,operator_type_id=2"></j-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="6">
            <a-form-item label="卡状态">
              <j-dict-select-tag v-model="queryParam.simStatus" placeholder="请选择" dictCode="sim_status"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="备注">
              <a-input placeholder="请输入备注（支持模糊查询）" v-model="queryParam.note"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="10" :sm="12">
            <a-form-item label="激活时间" :labelCol="{span: 4}">
              <j-date v-model="queryParam.startTime" date-format="YYYY-MM-DD 00:00:00" style="width:45%" placeholder="请选择开始时间" ></j-date>
              <span class="query-group-split-cust"></span>
              <j-date v-model="queryParam.endTime" date-format="YYYY-MM-DD 23:59:59" style="width:45%" placeholder="请选择截止时间"></j-date>
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">

          </template>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!--<a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">


      <a-button type="primary" v-has="'unicom:importExcel'" :action="importExcelUrl" icon="import" @click="handleCardImport">卡导入</a-button>
      <a-button type="primary" v-has="'unicom:CardDistribution'" icon="" @click="handleCardDistribution"  @hello="onClearSelected">分配</a-button>
      <a-button type="primary" v-has="'unicom:CardStateChange'" icon="" @click="handleCardStateChange">状态变更</a-button>
      <a-button type="primary" v-has="'unicom:handleCorrection'" icon="" @click="handleCorrection">同步状态及用量</a-button>
      <a-button v-has="'unicom:setTime'" type="primary" icon="" @click="setTime">设置激活及到期时间</a-button>
      <!--<a-button type="primary" v-has="'cardInformationList:DataUpdate'" icon="" @click="handleDataUpdate">数据更新</a-button>-->
      <a-button type="primary" v-has="'unicom:CardFlowUsageRatio'" icon="" @click="handleCardFlowUsageRatio">设置用量比例</a-button>
      <a-button v-has="'unicom:stateChange'" type="primary" icon="" @click="syncCardStatus" @hello="onClearSelected">用量同步更改</a-button>
      <a-button v-has="'unicom:monitoring'" type="primary" icon="" @click="handleMonitorUse" @hello="onClearSelected">用量监控更改</a-button>
      <a-button type="primary" icon="" @click="renewal">续费</a-button>
      <a-button v-has="'unicom:setMony'" type="primary" icon="" @click="modifyPrice" @hello="onClearSelected">改价</a-button>
      <a-button type="primary" v-has="'unicom:printQRcode'" icon=""  @click="printQRcode" @hello="onClearSelected">打印二维码</a-button>
      <a-button type="primary" icon="" @click="handleCardNote">卡备注</a-button>
      <a-button type="primary" v-has="'unicom:CardRecycling'" icon="" @click="handleCardInformationRecycling">卡回收</a-button>
      <a-button type="primary" icon="download" @click="handleExport('联通卡信息表')">导出</a-button>

      <!--<a-dropdown v-if="selectedRowKeys.length > 0">-->
        <!--<a-menu slot="overlay">-->
          <!--<a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>-->
        <!--</a-menu>-->
        <!--<a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>-->
      <!--</a-dropdown>-->
    </div>
    <a-modal
      :visible="modal.visible"
      :width="modal.width"
      :style="modal.style"
      @ok="()=>modal.visible=false"
      @cancel="()=>modal.visible=false">

      <template slot="title">
        <div style="width: 100%;height:20px;padding-right:32px;">
          <div style="float: left;">{{ modal.title }}</div>
          <div style="float: right;">
            <a-button
              icon="fullscreen"
              style="width:56px;height:100%;border:0"
              @click="handleClickToggleFullScreen"/>
          </div>
          <div class="no-print" style="text-align: right">
            <a-button v-print="'#printContent'" ghost type="primary">打印</a-button>
          </div>
        </div>
      </template>

      <section ref="print" id="printContent" class="abcdefg">
        <template v-for="(i,k) of qrcodeData" >
          <img :src="i.qrcodeUrl"  >
        </template>
      </section>


    </a-modal>
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
        @change="handleTableChange"
        :scroll="{ x: 1800 }">

        <span slot="action" slot-scope="text, record">
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a v-has="'unicom:CardDelete'">删除</a>
          </a-popconfirm>
          <!--<a v-has="'cardInformationList:viewPackageList'" @click="handleDetails(record)">套餐列表</a>
          <a-divider v-has="'cardInformationList:viewPackageList'" type="vertical" />
          <a v-has="'cardInformationList:CardDistributionPackageOne'" @click="handleCardDistributionPackageOne(record)">套餐配置</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
             <a v-has="'cardInformationList:CardDelete'">删除</a>
          </a-popconfirm>-->

        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <card-information-import ref="CardInformationImport" @ok="modalFormOk"></card-information-import>
    <card-information-distribution ref="CardInformationDistribution" @ok="modalFormOk"  @hello="onClearSelected"></card-information-distribution>
    <card-information-import-distribution ref="CardInformationImportDistribution" @ok="modalFormOk" ></card-information-import-distribution>
    <card-information-state-change ref="CardInformationStateChange" @ok="modalFormOk" @hello="onClearSelected"></card-information-state-change>
    <card-information-send-sms ref="CardInformationSendSms" @ok="modalFormOk"></card-information-send-sms>
    <card-information-import-send-sms ref="CardInformationImportSendSms" @ok="modalFormOk"></card-information-import-send-sms>
    <card-information-synchronous-state ref="CardInformationSynchronousState" @ok="modalFormOk"></card-information-synchronous-state>
    <card-information-conditional-agent-recovery ref="CardInformationConditionalAgentRecovery" @ok="modalFormOk"></card-information-conditional-agent-recovery>
    <card-information-flow-usage-ratio ref="CardInformationFlowUsageRatio" @ok="modalFormOk" @hello="onClearSelected"></card-information-flow-usage-ratio>
    <card-information-automatic-shutdown ref="CardInformationAutomaticShutdown" @ok="modalFormOk"></card-information-automatic-shutdown>
    <card-information-real-name-authentication ref="CardInformationRealNameAuthentication" @ok="modalFormOk"></card-information-real-name-authentication>
    <card-information-note ref="CardInformationNote" @ok="modalFormOk" @hello="onClearSelected"></card-information-note>
    <card-information-priority ref="CardInformationPriority" @ok="modalFormOk"></card-information-priority>
    <j-import-modal ref="importModal" :url="getImportUrl()" @ok="importOk"></j-import-modal>
    <card-information-distribution-package ref="CardInformationDistributionPackage" @ok="modalFormOk"></card-information-distribution-package>
    <card-information-rechargeable-package ref="CardInformationRechargeablePackage" @ok="modalFormOk"></card-information-rechargeable-package>
    <card-information-import-card-distribution-package ref="CardInformationImportCardDistributionPackage" @ok="modalFormOk"></card-information-import-card-distribution-package>
    <card-information-renewal ref="CardInformationRenewal" @ok="modalFormOk"></card-information-renewal>
    <card-information-editor-information ref="CardInformationEditorInformation" @ok="modalFormOk"></card-information-editor-information>
    <card-information-package-transfer ref="CardInformationPackageTransfer" @ok="modalFormOk"></card-information-package-transfer>
    <card-information-distribution-package-one ref="CardInformationDistributionPackageOne" @ok="modalFormOk"></card-information-distribution-package-one>
    <card-information-recycling ref="CardInformationRecycling" @ok="modalFormOk"></card-information-recycling>
    <card-information-set-time ref="CardInformationSetTime" @ok="modalFormOk" @hello="onClearSelected"></card-information-set-time>
    <card-information-modify-price ref="CardInformationModifyPrice" @ok="modalFormOk" @hello="onClearSelected"></card-information-modify-price>
    <card-information-sync-status ref="CardInformationSyncStatus" @ok="modalFormOk" @hello="onClearSelected"></card-information-sync-status>
    <card-information-export ref="CardInformationExport" @ok="modalFormOk"></card-information-export>
    <card-information-monitor-use ref="CardInformationMonitorUse" @ok="modalFormOk" @hello="onClearSelected"></card-information-monitor-use>
  </a-card>
</template>

<script>
  import CardInformationDistribution from './modules/CardInformationDistribution'
  import CardInformationImport from './modules/CardInformationImport'
  import CardInformationImportDistribution from './modules/CardInformationImportDistribution'
  import CardInformationStateChange from './modules/CardInformationStateChange'
  import CardInformationSendSms from './modules/CardInformationSendSms'
  import CardInformationImportSendSms from './modules/CardInformationImportSendSms'
  import CardInformationSynchronousState from './modules/CardInformationSynchronousState'
  import CardInformationConditionalAgentRecovery from './modules/CardInformationConditionalAgentRecovery'
  import CardInformationFlowUsageRatio from "./modules/CardInformationFlowUsageRatio";
  import CardInformationAutomaticShutdown from "./modules/CardInformationAutomaticShutdown";
  import CardInformationRealNameAuthentication from "./modules/CardInformationRealNameAuthentication";
  import CardInformationNote from "./modules/CardInformationNote";
  import CardInformationPriority from "./modules/CardInformationPriority";
  import CardInformationDistributionPackage from "./modules/CardInformationDistributionPackage";
  import CardInformationRechargeablePackage from "./modules/CardInformationRechargeablePackage";
  import CardInformationImportCardDistributionPackage from "./modules/CardInformationImportCardDistributionPackage";
  import CardInformationEditorInformation from "./modules/CardInformationEditorInformation";
  import CardInformationRenewal from "./modules/CardInformationRenewal";
  import CardInformationPackageTransfer from "./modules/CardInformationPackageTransfer";
  import CardInformationDistributionPackageOne from "./modules/CardInformationDistributionPackageOne";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {queryOperator,queryStandardcost,telecomCardDataUpdate,getTelecomRefCardCostByCardId,queryLowerAgent} from '@/api/api'
  import JTreeSelect from '@/components/jeecg/JTreeSelect'
  import JDate from '@/components/jeecg/JDate'
  import { postAction,getAction,downFile} from '@/api/manage'
  import CardInformationRecycling from "./modules/CardInformationRecycling";
  import CardInformationSetTime from "./modules/CardInformationSetTime"
  import CardInformationModifyPrice from './modules/CardInformationModifyPrice'
  import CardInformationExport from "./modules/CardInformationExport"
  import CardInformationSyncStatus from './modules/CardInformationSyncStatus'
  import CardInformationMonitorUse from './modules/CardInformationMonitorUse'
  import JSearchSelectTag from '@/components/dict/JSearchSelectTag'

  export default {
    name: "CardInformationList",
    mixins:[JeecgListMixin],
    components: {
      CardInformationRecycling,
      CardInformationRenewal,
      CardInformationEditorInformation,
      CardInformationRealNameAuthentication,
      CardInformationFlowUsageRatio,
      CardInformationImport,
      queryOperator,
      CardInformationDistribution,
      CardInformationImportDistribution,
      CardInformationStateChange,
      CardInformationSendSms,
      CardInformationImportSendSms,
      CardInformationSynchronousState,
      CardInformationConditionalAgentRecovery,
      CardInformationAutomaticShutdown,
      CardInformationNote,
      CardInformationPriority,
      CardInformationDistributionPackage,
      CardInformationRechargeablePackage,
      CardInformationImportCardDistributionPackage,
      JTreeSelect,
      queryStandardcost,
      JDate,
      JSearchSelectTag,
      CardInformationPackageTransfer,
      telecomCardDataUpdate,
      CardInformationDistributionPackageOne,
      getTelecomRefCardCostByCardId,
      queryLowerAgent,
      CardInformationSetTime,
      CardInformationModifyPrice,
      CardInformationExport,
      CardInformationSyncStatus,
      CardInformationMonitorUse
    },
    data () {
      return {
        description: '物联网卡信息表管理页面',
        operatorData:[],
        packageData:[],
        userData:[],
        username:'',
        qrcodeData:[],
        showPrice:'',
        showUsage:'',
        modal: {
          title: '二维码打印',
          visible: false,
          width: '70%',
          style: { top: '20px' },
          fullScreen: true
        },
        // fileList:[],
        // 表头
        columns: [],
        defColumns: [
          {
            title: 'ICCID',
            align:"center",
            dataIndex: 'iccid',
            width:200,
          },
          {
            title: 'msisdn',
            align:"center",
            dataIndex: 'msisdn',
            width:150,
          },
          {
            title: '企业名称',
            align:"center",
            dataIndex: 'userCompany', width: 200
          },
          {
            title: '价格(元)',
            align:"center",
            dataIndex: 'cost',
            width: 100
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'simStatus_dictText', width: 100
          },
          {
            title: '流量用量(M)',
            align:"center",
            dataIndex: 'currentUsage',
            width: 100
          },
          {
            title: '备注',
            align:"center",
            dataIndex: 'note', width: 100
          },
          {
            title: '激活时间',
            align:"center",
            dataIndex: 'activationTime', width: 150
          },
          {
            title: '失效时间',
            align:"center",
            dataIndex: 'overtime', width: 150
          }
        ],
        defColumns1: [
          {
            title: 'ICCID',
            align:"center",
            dataIndex: 'iccid',
            width:200,
          },
          {
            title: 'msisdn',
            align:"center",
            dataIndex: 'msisdn',
            width:150,
          },
          {
            title: '运营商',
            align:"center",
            dataIndex: 'operatorName',
            width: 100
          },
          {
            title: '企业名称',
            align:"center",
            dataIndex: 'userCompany', width: 200
          },
          {
            title: '价格(元)',
            align:"center",
            dataIndex: 'cost',
            width: 100
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'simStatus_dictText', width: 100
          },
          {
            title: '周期累计用量(M)',
            align:"center",
            dataIndex: 'currentUsage', width: 130
          },
          {
            title:'同步用量',
            align:"center",
            dataIndex: 'needSync',
            width: 80,
            customRender:function (text) {
              if(text==0){
                return "是";
              }else if(text==1){
                return "否";
              } else {
                return text;
              }
            }
          },{
            title:'用量监控',
            align:"center",
            dataIndex: 'monitorUse',
            width: 80,
            customRender:function (text) {
              if(text==0){
                return "是";
              }else if(text==1){
                return "否";
              } else {
                return text;
              }
            }
          },
          {
            title: '每月最大用量(M)',
            align:"center",
            dataIndex: 'thresholdUsage', width: 150
          },
          {
            title: '备注',
            align:"center",
            dataIndex: 'note', width: 100
          },
          {
            title: '合同编号',
            align:"center",
            dataIndex: 'contractNo', width: 100
          },
          {
            title: '首次激活时间',
            align:"center",
            dataIndex: 'dateActivated', width: 150
          },
          {
            title: '激活时间',
            align:"center",
            dataIndex: 'activationTime', width: 150
          },
          {
            title: '失效时间',
            align:"center",
            dataIndex: 'overtime', width: 150
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
            width: 60
          }
        ],
        defColumns2: [
          {
            title: 'ICCID',
            align:"center",
            dataIndex: 'iccid',
            width:200,
          },
          {
            title: 'msisdn',
            align:"center",
            dataIndex: 'msisdn',
            width:150,
          },
          {
            title: '企业名称',
            align:"center",
            dataIndex: 'userCompany', width: 200
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'simStatus_dictText', width: 100
          },
          {
            title: '周期累计用量(M)',
            align:"center",
            dataIndex: 'currentUsage', width: 130
          },
          {
            title: '备注',
            align:"center",
            dataIndex: 'note', width: 100
          },
          {
            title: '激活时间',
            align:"center",
            dataIndex: 'activationTime', width: 150
          },
          {
            title: '失效时间',
            align:"center",
            dataIndex: 'overtime', width: 150
          }/*,
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
            width: 250
          }*/
        ],
        defColumns3: [
          {
            title: 'ICCID',
            align:"center",
            dataIndex: 'iccid',
            width:200,
          },
          {
            title: 'msisdn',
            align:"center",
            dataIndex: 'msisdn',
            width:150,
          },
          {
            title: '企业名称',
            align:"center",
            dataIndex: 'userCompany', width: 200
          },
          {
            title: '价格(元)',
            align:"center",
            dataIndex: 'cost',
            width: 100
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'simStatus_dictText', width: 100
          },
          {
            title: '备注',
            align:"center",
            dataIndex: 'note', width: 100
          },
          {
            title: '激活时间',
            align:"center",
            dataIndex: 'activationTime', width: 150
          },
          {
            title: '失效时间',
            align:"center",
            dataIndex: 'overtime', width: 150
          }
        ],
        defColumns4: [
          {
            title: 'ICCID',
            align:"center",
            dataIndex: 'iccid',
            width:200,
          },
          {
            title: 'msisdn',
            align:"center",
            dataIndex: 'msisdn',
            width:150,
          },
          /*{
            title: '运营商类型 ',
            align:"center",
            dataIndex: 'operatorType_dictText', width: 100
          },*/
          /*{
            title: '运营商',
            align:"center",
            dataIndex: 'operatorName',
            width: 200
          },*/
          {
            title: '企业名称',
            align:"center",
            dataIndex: 'userCompany', width: 200
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'simStatus_dictText', width: 100
          },
          {
            title: '备注 ',
            align:"center",
            dataIndex: 'note', width: 100
          },
          {
            title: '激活时间',
            align:"center",
            dataIndex: 'activationTime', width: 150
          },
          {
            title: '失效时间',
            align:"center",
            dataIndex: 'overtime', width: 150
          }
        ],
		    url: {
          list: "/unicomcardinformation/unicomCardInformation/list",
          delete: "/unicomcardinformation/unicomCardInformation/delete",
          deleteBatch: "/unicomcardinformation/unicomCardInformation/deleteBatch",
          exportXlsUrl: "/unicomcardinformation/unicomCardInformation/exportXls",
          importExcelUrl: "/unicomcardinformation/unicomCardInformation/importExcel",
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
      getAction('/sys/user/queryUser').then((res) => {
        if (res.success) {
          this.showPrice = res.result.showPrice;
          this.showUsage = res.result.showUsage;
          this.userName = res.result.username;
        }
      });
      this.initColumns(this.showPrice,this.showUsage,this.userName);
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    },

  },
    methods: {
      cardUsage(record){
        this.$refs.CardUsageModal.edit(record.iccid);
        this.$refs.CardUsageModal.disableSubmit = true;
      },
      handleDetails(record){
        this.$refs.packageListModal.edit(record.iccid);
        this.$refs.packageListModal.disableSubmit = true;
      },
      //卡导入弹出页面
      handleCardImport: function () {

        this.$refs.CardInformationImport.add();
        this.$refs.CardInformationImport.title = "卡导入";
        this.$refs.CardInformationImport.disableSubmit = false;
      },

      //卡分导入配弹出页面
      handleCardImportDistribution: function () {

        this.$refs.CardInformationImportDistribution.add(this.selectedRowKeys.length);
        this.$refs.CardInformationImportDistribution.title = "卡导入分配";
        this.$refs.CardInformationImportDistribution.disableSubmit = false;
      },

      //发送短信弹出页面
      handleCardSendSms: function () {
        var params = this.getQueryParams();//查询条件
        getAction('/unicomcardinformation/unicomCardInformation/listId', params).then((res) => {
          if (res.success) {
            this.$refs.CardInformationSendSms.add(this.selectedRowKeys,res.result);
            this.$refs.CardInformationSendSms.title = "发送短信";
            this.$refs.CardInformationSendSms.disableSubmit = false;
          }
        })
      },

      //按导入号码发送短信弹出页面
      handleCardImportSendSms: function () {
        this.$refs.CardInformationImportSendSms.add(this.selectedRowKeys.length);
        this.$refs.CardInformationImportSendSms.title = "按导入号码发送短信";
        this.$refs.CardInformationImportSendSms.disableSubmit = false;
      },
      //设置激活及到期时间
      setTime: function () {
        var params = this.getQueryParams();//查询条件
        if(this.selectedRowKeys.length==0&&params.customerId==undefined){
          this.$message.warning('请输入查询条件或勾选要设置的卡！');
          return false;
        }
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationSetTime.add(this.selectedRowKeys,null);
          this.$refs.CardInformationSetTime.title = "设置激活及到期时间";
          this.$refs.CardInformationSetTime.disableSubmit = false;
        }else{
          this.$refs.CardInformationSetTime.add(this.selectedRowKeys,params.customerId);
          this.$refs.CardInformationSetTime.title = "设置激活及到期时间";
          this.$refs.CardInformationSetTime.disableSubmit = false;
        }
      },
      handleMonitorUse: function () {
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationMonitorUse.add(this.selectedRowKeys,null);
          this.$refs.CardInformationMonitorUse.title = "用量监控更改";
          this.$refs.CardInformationMonitorUse.disableSubmit = false;
        }else{
          var params = this.getQueryParams();//查询条件
          getAction('/unicomcardinformation/unicomCardInformation/listId', params).then((res) => {
            if (res.success) {
              this.$refs.CardInformationMonitorUse.add(this.selectedRowKeys,res.result);
              this.$refs.CardInformationMonitorUse.title = "用量监控更改";
              this.$refs.CardInformationMonitorUse.disableSubmit = false;
            }
          })
        }
      },
      syncCardStatus: function () {
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationSyncStatus.add(this.selectedRowKeys,null);
          this.$refs.CardInformationSyncStatus.title = "用量监控更改";
          this.$refs.CardInformationSyncStatus.disableSubmit = false;
        }else{
          var params = this.getQueryParams();//查询条件
          getAction('/unicomcardinformation/unicomCardInformation/listId', params).then((res) => {
            if (res.success) {
              this.$refs.CardInformationSyncStatus.add(this.selectedRowKeys,res.result);
              this.$refs.CardInformationSyncStatus.title = "用量监控更改";
              this.$refs.CardInformationSyncStatus.disableSubmit = false;
            }
          })
        }
      },
      //按条件设置同步状态弹出页面
      handleCardImportSynchronousState: function () {

        var params = this.getQueryParams();//查询条件
        getAction('/unicomcardinformation/unicomCardInformation/listId', params).then((res) => {
          if (res.success) {

            this.$refs.CardInformationSynchronousState.add(this.selectedRowKeys,res.result);
            this.$refs.CardInformationSynchronousState.title = "按条件设置同步状态";
            this.$refs.CardInformationSynchronousState.disableSubmit = false;
          }
        })
      },

      //按条件代理不可复机弹出页面
      handleCardConditionalAgentRecovery: function () {
        var params = this.getQueryParams();//查询条件
        getAction('/unicomcardinformation/unicomCardInformation/listId', params).then((res) => {
          if (res.success) {
            this.$refs.CardInformationConditionalAgentRecovery.add(this.selectedRowKeys,res.result);
            this.$refs.CardInformationConditionalAgentRecovery.title = "按条件代理不可复机";
            this.$refs.CardInformationConditionalAgentRecovery.disableSubmit = false;
        }
      })
      },

      //按条件设置流量使用比例弹出页面
      handleCardFlowUsageRatio: function () {
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationFlowUsageRatio.add(this.selectedRowKeys,null);
          this.$refs.CardInformationFlowUsageRatio.title = "流量使用比例";
          this.$refs.CardInformationFlowUsageRatio.disableSubmit = false;
        }else{
          var params = this.getQueryParams();//查询条件
          getAction('/unicomcardinformation/unicomCardInformation/listId', params).then((res) => {
            if (res.success) {
              this.$refs.CardInformationFlowUsageRatio.add(this.selectedRowKeys,res.result);
              this.$refs.CardInformationFlowUsageRatio.title = "流量使用比例";
              this.$refs.CardInformationFlowUsageRatio.disableSubmit = false;
            }
          })
        }
      },

      //设置自动停复机
      handleCardAutomaticShutdown: function () {
        var params = this.getQueryParams();//查询条件
        getAction('/unicomcardinformation/unicomCardInformation/listId', params).then((res) => {
          if (res.success) {
            this.$refs.CardInformationAutomaticShutdown.add(this.selectedRowKeys,res.result);
            this.$refs.CardInformationAutomaticShutdown.title = "设置自动停复机";
            this.$refs.CardInformationAutomaticShutdown.disableSubmit = false;
        }
      })
      },

      //是否实名认证
      handleCardRealNameAuthentication: function () {
        var params = this.getQueryParams();//查询条件
        getAction('/unicomcardinformation/unicomCardInformation/listId', params).then((res) => {
          if (res.success) {
            this.$refs.CardInformationRealNameAuthentication.add(this.selectedRowKeys,res.result);
            this.$refs.CardInformationRealNameAuthentication.title = "是否实名认证";
            this.$refs.CardInformationRealNameAuthentication.disableSubmit = false;
        }
      })
      },

      //设置优先级
      handleCardPriority: function () {
        var params = this.getQueryParams();//查询条件
        getAction('/unicomcardinformation/unicomCardInformation/listId', params).then((res) => {
          if (res.success) {
            this.$refs.CardInformationPriority.add(this.selectedRowKeys,res.result);
            this.$refs.CardInformationPriority.title = "设置优先级";
            this.$refs.CardInformationPriority.disableSubmit = false;
        }
      })
      },

      //卡备注
      handleCardNote: function () {
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationNote.add(this.selectedRowKeys,null);
          this.$refs.CardInformationNote.title = "卡备注";
          this.$refs.CardInformationNote.disableSubmit = false;
        }else{
          var params = this.getQueryParams();//查询条件
          getAction('/unicomcardinformation/unicomCardInformation/listId', params).then((res) => {
            if (res.success) {
              this.$refs.CardInformationNote.add(this.selectedRowKeys,res.result);
              this.$refs.CardInformationNote.title = "卡备注";
              this.$refs.CardInformationNote.disableSubmit = false;
            }
          })
        }
      },

      //卡状态变更弹出页面
      handleCardStateChange: function () {
        //有选中的就不在查询后台
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationStateChange.add(this.selectedRowKeys,null);
          this.$refs.CardInformationStateChange.title = "卡状态变更";
          this.$refs.CardInformationStateChange.disableSubmit = false;
        }else{
          var params = this.getQueryParams();//查询条件
          getAction('/unicomcardinformation/unicomCardInformation/listId', params).then((res) => {
            if (res.success) {
              this.$refs.CardInformationStateChange.add(this.selectedRowKeys,res.result);
              this.$refs.CardInformationStateChange.title = "卡状态变更";
              this.$refs.CardInformationStateChange.disableSubmit = false;
            }
          })
        }
      },

      //卡分配弹出页面
      handleCardDistribution: function () {
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationDistribution.add(this.selectedRowKeys,null);
          this.$refs.CardInformationDistribution.title = "卡分配";
          this.$refs.CardInformationDistribution.disableSubmit = false;
          return;
        }
        var params = this.getQueryParams();//查询条件
        if((null==this.queryParam.iccidStart||'undefined'==this.queryParam.iccidStart||""==this.queryParam.iccidStart)&&
          (null==this.queryParam.iccidEnd||'undefined'==this.queryParam.iccidEnd||""==this.queryParam.iccidEnd)&&
          (null==this.queryParam.msisdn||'undefined'==this.queryParam.msisdn||""==this.queryParam.msisdn)&&
          (null==this.queryParam.simStatus||'undefined'==this.queryParam.simStatus||""==this.queryParam.simStatus)){
          this.$message.warning('请选择分配条件！')
          return;
        }

        /*let map = this.selectionRows.map(item=>{ return item.iccid});
                console.log('this.selectionRows>>>'+JSON.stringify(map));
                this.$refs.CardInformationDistribution.add(this.selectedRowKeys);
                this.$refs.CardInformationDistribution.title = "卡分配";
                this.$refs.CardInformationDistribution.disableSubmit = false;*/

        getAction('/unicomcardinformation/unicomCardInformation/listId', params).then((res) => {
          if (res.success) {

            this.$refs.CardInformationDistribution.add(res.result);
            this.$refs.CardInformationDistribution.title = "卡分配";
            this.$refs.CardInformationDistribution.disableSubmit = false;
          }
        })
      },

      //批量分配套餐
      handleCardDistributionPackage: function () {
        //查询条件
        var params = this.getQueryParams();

        if(typeof(params.customerId) == "undefined"){
          this.$message.warning('请选择客户！');
          return;
        }

        if(typeof(params.operatorId) == "undefined"){
          this.$message.warning('请选择运营商！');
          return;
        }

        getAction('/unicomcardinformation/unicomCardInformation/listId', params).then((res) => {
          if (res.success) {
          this.$refs.CardInformationDistributionPackage.add(this.selectedRowKeys,res.result,params.operatorId);
          this.$refs.CardInformationDistributionPackage.title = "分配套餐";
          this.$refs.CardInformationDistributionPackage.disableSubmit = false;
        }
      })
      },
      handleClickToggleFullScreen() {
        let mode = !this.modal.fullScreen
        if (mode) {
          this.modal.width = '100%'
          this.modal.style.top = '20px'
        } else {
          this.modal.width = '1200px'
          this.modal.style.top = '50px'
        }
        this.modal.fullScreen = mode
      },
      //批量分配套餐
      handleCardDistributionPackageOne: function (record) {

        getTelecomRefCardCostByCardId({iccid:record.iccid}).then((res)=>{
          if (res.success) {
            this.$refs.CardInformationDistributionPackageOne.add(record,res.result);
            this.$refs.CardInformationDistributionPackageOne.title = "分配套餐";
            this.$refs.CardInformationDistributionPackageOne.disableSubmit = false;
          }
        })
      },

      //卡回收
      handleCardInformationRecycling: function () {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return false;
        }
        let map = this.selectionRows.map(item=>{return item.iccid});
        let iccids = map.join(",");
        this.$refs.CardInformationRecycling.add(iccids);
        this.$refs.CardInformationRecycling.title = "卡回收";
        this.$refs.CardInformationRecycling.disableSubmit = false;
      },

      //分配可充值套餐
      handleCardRechargeablePackage: function () {
        this.$refs.CardInformationRechargeablePackage.add(this.selectedRowKeys);
        this.$refs.CardInformationRechargeablePackage.title = "设置可充值套餐";
        this.$refs.CardInformationRechargeablePackage.disableSubmit = false;
      },

      //按导入卡号设置套餐
      handleCardImportCardDistributionPackage: function () {
        this.$refs.CardInformationImportCardDistributionPackage.add(this.selectedRowKeys);
        this.$refs.CardInformationImportCardDistributionPackage.title = "按导入卡号设置套餐";
        this.$refs.CardInformationImportCardDistributionPackage.disableSubmit = false;
      },

      //修改卡信息
      handleCardEditorInformation: function () {
        this.$refs.CardInformationEditorInformation.add(this.selectedRowKeys);
        this.$refs.CardInformationEditorInformation.title = "修改卡信息";
        this.$refs.CardInformationEditorInformation.disableSubmit = false;
      },

      //续费
      handleCardRenewal: function () {
        this.$refs.CardInformationRenewal.add(this.selectedRowKeys);
        this.$refs.CardInformationRenewal.title = "续费";
        this.$refs.CardInformationRenewal.disableSubmit = false;
      },
      modifyPrice: function () {
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationModifyPrice.add(this.selectedRowKeys,null);
          this.$refs.CardInformationModifyPrice.title = "改价";
          this.$refs.CardInformationModifyPrice.disableSubmit = false;
          return;
        }
        var params = this.getQueryParams();//查询条件
        getAction('/unicomcardinformation/unicomCardInformation/listId', params).then((res) => {
          console.log(res)
          if (res.success) {
            this.$refs.CardInformationModifyPrice.add(res.result);
            this.$refs.CardInformationModifyPrice.title = "改价";
            this.$refs.CardInformationModifyPrice.disableSubmit = false;
          }
        })
      },
      //打印二维码
      printQRcode: function () {
        if(this.selectedRowKeys.length>0){
          console.log(this.selectedRowKeys)
          var ids = "";
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            ids += this.selectedRowKeys[a] + ",";
          }
          getAction('/unicomcardinformation/unicomCardInformation/getQRcodeById', {ids:ids}).then((res) => {
            console.log(res)
            if (res.success) {
              this.qrcodeData = res.result;
              this.modal.visible=true;
            }
          })
          return;
        }
        var params = this.getQueryParams();//查询条件
        console.log(params)
        getAction('/unicomcardinformation/unicomCardInformation/getQRcode', params).then((res) => {
          console.log(res)
          if (res.success) {
            console.log(res.result)
            this.qrcodeData = res.result;
            this.modal.visible=true;
          }
        })
      },
      //数据更新
      handleDataUpdate: function () {

        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return false;
        }else {
          let map = this.selectionRows.map(item=>{return item.iccid});
          let iccids = map.join(",");

          telecomCardDataUpdate({ids: iccids}).then((res)=>{
            if(res.success){
              this.$message.success(res.message);
              this.onClearSelected();
              this.loadData();
            }else{
              this.$message.warning(res.message);
              this.onClearSelected();
            }
          })

        }
      },
      //用量校正
      handleCorrection: function () {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return false;
        }else {

          let map = this.selectionRows.map(item=>{return item.iccid});
          let join = map.join(",");
          getAction('/unicomcardinformation/unicomCardInformation/handleCorrection', {ids: join}).then((res) => {
            if (res.success) {
              this.$message.success(res.message);
              this.onClearSelected();
              this.loadData();
            } else {
              this.$message.warning(res.message);
              this.onClearSelected();
            }
          })
        }
      },
      //续费
      renewal: function () {
        console.log(JSON.stringify(this.ipagination))
        //有选中的就不在查询后台
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationRenewal.add(this.selectedRowKeys,null);
          this.$refs.CardInformationRenewal.title = "续费";
          this.$refs.CardInformationRenewal.disableSubmit = false;
        }else{
          var params = this.getQueryParams();//查询条件
          console.log(JSON.stringify(params))
          this.$refs.CardInformationRenewal.add(this.selectedRowKeys,this.ipagination.total);
          this.$refs.CardInformationRenewal.title = "续费";
          this.$refs.CardInformationRenewal.disableSubmit = false;
        }

      },
      handleExport(){
        let param = {...this.queryParam};
        this.$refs.CardInformationExport.add(param);
        this.$refs.CardInformationExport.title = "数据导出";
        this.$refs.CardInformationExport.disableSubmit = false;
      },
      handleImportXls(){
        this.$refs.importModal.show()
      },

      getImportUrl(){
        return '/unicomcardinformation/unicomCardInformation/importExcel'
      },
      importOk(){
        this.loadData(1)
      },
      initData() {
        const poolId = this.$route.query.poolId;
        const status = this.$route.query.status;
        console.log('poolId>>'+poolId+'，status>>>'+status)
        this.queryParam.isFlowPool = status;
        this.queryParam.upstreamFlowPoolNumber = poolId;
        this.loadData();
      },
      initColumns(showPrice,showUsage,userName){
        //权限过滤（列权限控制时打开，修改第二个参数为授权码前缀）
        if(userName=='admin'){
          this.columns = this.defColumns1;
        }else{
          if(showPrice==true&&showUsage==true){
            this.columns = this.defColumns;
          }else if(showPrice==false&&showUsage==true){
            this.columns = this.defColumns2;
          }else if(showPrice==true&&showUsage==false){
            this.columns = this.defColumns3;
          }else{
            this.columns = this.defColumns4;
          }
        }
      }

    },
    created() {
      this.initData()
    },




    watch: {
      '$route': 'initData'
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>