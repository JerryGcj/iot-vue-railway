<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col v-has="'enterpriseCardInformationList:selectCustomerId'" :md="6" :sm="8">
            <a-form-item label="客户" >
              <!--<a-input placeholder="请输入客户" v-model="queryParam.userNameId"></a-input>-->
              <!--异步树加载组件 通过传入表名 显示字段 存储字段 加载一个树控件
              <j-tree-select dict="aa_tree_test,aad,id" pid-field="pid" ></j-tree-select>-->
              <j-tree-select
                v-model="queryParam.customerId"
                placeholder="请选择客户"
                dict="sys_user,user_company,id"
                pidField="create_by_id"
                pidValue=""/>
            </a-form-item>
          </a-col>

          <a-col v-has="'enterpriseCardInformationList:selectCustomerIdDls'" :md="6" :sm="8">
            <a-form-item label="客户">
              <a-select v-model="queryParam.customerId"
                        placeholder="客户">
                <a-select-option v-for="d in userData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="10" :sm="10">
            <a-form-item label="ICCID">
              <a-input placeholder="开始ICCID" class="query-group-cust" v-model="queryParam.iccidStart"></a-input>
              <span class="query-group-split-cust"></span>
              <a-input placeholder="结束ICCID" class="query-group-cust" v-model="queryParam.iccidEnd"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="运营商类型">
              <j-dict-select-tag placeholder="请选择运营商类型" v-model="queryParam.operatorType" dict-code="operator_type"></j-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="6">
            <a-form-item label="运营商">

              <j-dict-select-tag v-model="queryParam.operatorId" placeholder="请选择运营商" dict-code="iot_operator,operator_name,id"></j-dict-select-tag>
              <!--<a-select :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"-->
              <!--v-model="queryParam.operatorId"-->
              <!--placeholder="请选择运营商">-->
              <!--<a-select-option v-for="d in operatorData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>-->
              <!--</a-select>-->
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="6">
            <a-form-item label="卡状态">
              <j-dict-select-tag v-model="queryParam.cardState" placeholder="请选择" dictCode="card_state"/>
              <!--<a-select v-model="queryParam.cardState" placeholder="请选择">
                <a-select-option value="0">待激活</a-select-option>
                <a-select-option value="1">沉默期</a-select-option>
                <a-select-option value="2">测试期</a-select-option>
                <a-select-option value="3">正常</a-select-option>
                <a-select-option value="4">停机</a-select-option>
                <a-select-option value="5">已销号</a-select-option>
                <a-select-option value="6">机卡分离</a-select-option>
                <a-select-option value="7">高危禁用</a-select-option>
              </a-select>-->
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="备注">
              <a-input placeholder="请输入备注（支持模糊查询）" v-model="queryParam.note"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="合同编号">
              <a-input placeholder="请输入合同编号" v-model="queryParam.contractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="10" :sm="12">
            <a-form-item label="开卡时间" :labelCol="{span: 4}">
              <j-date v-model="queryParam.startTime" date-format="YYYY-MM-DD 00:00:00" style="width:45%" placeholder="请选择开始时间" ></j-date>
              <span class="query-group-split-cust"></span>
              <j-date v-model="queryParam.endTime" date-format="YYYY-MM-DD 23:59:59" style="width:45%" placeholder="请选择截止时间"></j-date>
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


      <a-button type="primary" v-has="'enterpriseCardInformationList:import'" :action="importExcelUrl" icon="import" @click="handleCardImport">卡导入</a-button>
      <a-button type="primary" v-has="'enterpriseCardInformationList:handleCardDistribution'" icon="" @click="handleCardDistribution" @hello="onClearSelected">分配</a-button>
      <a-button type="primary" v-has="'cardInformationList:handleCorrection'" icon="" @click="handleCorrection">同步用量</a-button>
      <a-button v-has="'enterpriseCardInformationList:CardStateChange'" type="primary" icon="" @click="handleCardStateChange">状态变更</a-button>
      <a-button v-has="'enterpriseCardInformationList:userStateChange'" type="primary" icon="" @click="handleUserStateChange">状态变更</a-button>
      <a-button v-has="'enterpriseCardInformationList:setTime'" type="primary" icon="" @click="setTime">设置激活及到期时间</a-button>
      <a-button v-has="'enterpriseCardInformationList:setTime'" type="primary" icon="" @click="handleCardFlowUsageRatio" @hello="onClearSelected">设置用量比例</a-button>
      <a-button v-has="'enterpriseCardInformationList:setTime'" type="primary" icon="" @click="syncCardStatus" @hello="onClearSelected">用量同步更改</a-button>
      <a-button v-has="'enterpriseCardInformationList:setTime'" type="primary" icon="" @click="handleMonitorUse" @hello="onClearSelected">用量监控更改</a-button>
      <a-button type="primary" icon="" @click="handleCardNote">卡备注</a-button>
      <a-button type="primary" icon="" @click="renewal">续费</a-button>
      <a-button v-has="'enterpriseCardInformationList:setMony'" type="primary" icon="" @click="modifyPrice" @hello="onClearSelected">改价</a-button>
      <a-button v-has="'enterpriseCardInformationList:printQRcode'" type="primary" icon=""  @click="printQRcode" @hello="onClearSelected">打印二维码</a-button>
      <a-button type="primary" v-has="'cardInformationList:CardRecycling'" icon="" @click="handleCardInformationRecycling">卡回收</a-button>
      <a-button type="primary" v-has="'cardInformationList:deduction'" icon="" @click="deduction">扣款</a-button>
      <a-button v-has="'cardInformationList:distributionPackageOne'" type="primary" @click="handleCardDistributionPackageOne" @hello="onClearSelected">套餐配置</a-button>
      <a-button type="primary" icon="download" @click="handleExport">导出</a-button>

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
        <!--<div v-for="(fileDetail,index) of qrcodeData" :key="index">
          <img :src="fileDetail.qrcodeUrl" >
        </div>-->
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
          <!--<a v-has="'cardInformationList:viewPackageList'" @click="handleDetails(record)">套餐列表</a>
          <a-divider v-has="'cardInformationList:viewPackageList'" type="vertical" />
          <a v-has="'cardInformationList:CardDistributionPackageOne'" @click="handleCardDistributionPackageOne(record)">套餐配置<a-divider type="vertical" /></a>-->
          <a v-has="'cardInformationList:dayViewPackageList'" @click="handleCardDailyDose(record)">日用量</a>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
             <a v-has="'cardInformationList:CardDelete'"><a-divider type="vertical" />删除</a>
          </a-popconfirm>
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
    <card-information-monitor-use ref="CardInformationMonitorUse" @ok="modalFormOk" @hello="onClearSelected"></card-information-monitor-use>
    <card-information-synchronous-state ref="CardInformationSynchronousState" @ok="modalFormOk"></card-information-synchronous-state>
    <card-information-conditional-agent-recovery ref="CardInformationConditionalAgentRecovery" @ok="modalFormOk"></card-information-conditional-agent-recovery>
    <card-information-flow-usage-ratio ref="CardInformationFlowUsageRatio" @ok="modalFormOk"></card-information-flow-usage-ratio>
    <card-information-automatic-shutdown ref="CardInformationAutomaticShutdown" @ok="modalFormOk"></card-information-automatic-shutdown>
    <card-information-user-state-change ref="CardInformationUserStateChange" @ok="modalFormOk" @hello="onClearSelected"></card-information-user-state-change>
    <card-information-real-name-authentication ref="CardInformationRealNameAuthentication" @ok="modalFormOk"></card-information-real-name-authentication>
    <card-information-note ref="CardInformationNote" @ok="modalFormOk" @hello="onClearSelected"></card-information-note>

    <card-information-priority ref="CardInformationPriority" @ok="modalFormOk"></card-information-priority>
    <j-import-modal ref="importModal" :url="getImportUrl()" @ok="importOk"></j-import-modal>
    <card-information-distribution-package ref="CardInformationDistributionPackage" @ok="modalFormOk"></card-information-distribution-package>
    <card-information-rechargeable-package ref="CardInformationRechargeablePackage" @ok="modalFormOk"></card-information-rechargeable-package>
    <card-information-import-card-distribution-package ref="CardInformationImportCardDistributionPackage" @ok="modalFormOk"></card-information-import-card-distribution-package>
    <card-information-renewal ref="CardInformationRenewal" @ok="modalFormOk" @hello="onClearSelected"></card-information-renewal>
    <card-information-editor-information ref="CardInformationEditorInformation" @ok="modalFormOk"></card-information-editor-information>
    <card-information-package-transfer ref="CardInformationPackageTransfer" @ok="modalFormOk"></card-information-package-transfer>
    <card-information-distribution-package-one ref="CardInformationDistributionPackageOne" @ok="modalFormOk" @hello="onClearSelected"></card-information-distribution-package-one>
    <card-information-set-time ref="CardInformationSetTime" @ok="modalFormOk" @hello="onClearSelected"></card-information-set-time>
    <card-information-recycling ref="CardInformationRecycling" @ok="modalFormOk" @hello="onClearSelected"></card-information-recycling>

    <card-information-modify-price ref="CardInformationModifyPrice" @ok="modalFormOk" @hello="onClearSelected"></card-information-modify-price>
    <card-information-sync-status ref="CardInformationSyncStatus" @ok="modalFormOk" @hello="onClearSelected"></card-information-sync-status>
    <card-information-export ref="CardInformationExport" @ok="modalFormOk"></card-information-export>
    <card-information-deduction-modal ref="CardInformationDeduction" @ok="modalFormOk"></card-information-deduction-modal>
    <card-daily-dose-modal ref="cardDailyDoseModal" @ok="modalFormOk"></card-daily-dose-modal>
  </a-card>
</template>

<script>
  import CardInformationDistribution from './modules/CardInformationDistribution'
  import CardInformationImport from './modules/CardInformationImport'
  import CardInformationImportDistribution from './modules/CardInformationImportDistribution'
  import CardInformationStateChange from './modules/CardInformationStateChange'
  import CardInformationSendSms from './modules/CardInformationSendSms'
  import CardInformationMonitorUse from './modules/CardInformationMonitorUse'
  import CardInformationSyncStatus from './modules/CardInformationSyncStatus'
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
  import CardInformationSetTime from "./modules/CardInformationSetTime"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {queryOperator,queryStandardcost,unicomCardDataUpdate,getUnicomRefCardCostByCardId,queryLowerAgent} from '@/api/api'
  import JTreeSelect from '@/components/jeecg/JTreeSelect'
  import JDate from '@/components/jeecg/JDate'
  import { postAction,getAction,downFile} from '@/api/manage'
  import CardInformationRecycling from "./modules/CardInformationRecycling"
  import CardInformationModifyPrice from './modules/CardInformationModifyPrice'
  import CardInformationExport from "./modules/CardInformationExport"
  import CardInformationDeductionModal from "./modules/CardInformationDeductionModal"
  import CardDailyDoseModal from "./modules/CardDailyDoseModal";
  import '@/static/js/jquery.min.js'
  import CardInformationUserStateChange from './modules/CardInformationUserStateChange'

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
      CardInformationMonitorUse,
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
      CardInformationPackageTransfer,
      unicomCardDataUpdate,
      CardInformationDistributionPackageOne,
      getUnicomRefCardCostByCardId,
      queryLowerAgent,
      CardInformationSetTime,
      CardInformationModifyPrice,
      CardInformationSyncStatus,
      CardInformationExport,
      CardInformationDeductionModal,
      CardDailyDoseModal,
      CardInformationUserStateChange
    },
    data () {
      return {
        description: '物联网卡信息表管理页面',
        operatorData:[],
        packageData:[],
        userData:[],
        qrcodeData:[],
        showPrice:'',
        showUsage:'',
        userName:'',
        // fileList:[],
        // 表头
        columns: [],
        modal: {
          title: '二维码打印',
          visible: false,
          width: '70%',
          style: { top: '20px' },
          fullScreen: true
        },
        defColumns: [
          {
            title: 'ICCID',
            align:"center",
            dataIndex: 'iccid',
            width:200,
          },
          {
            title: 'MSISDN',
            align:"center",
            dataIndex: 'msisdn',
            width:150,
          },
          {
            title: '运营商类型 ',
            align:"center",
            dataIndex: 'operatorType_dictText', width: 100
          },
          /*{
            title: '运营商',
            align:"center",
            dataIndex: 'operatorName',
            width: 200
          },*/
          {
            title: '企业名称',
            align:"center",
            dataIndex: 'customerName', width: 200
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
            dataIndex: 'cardState_dictText', width: 100
          },
          {
            title: '流量用量(M)',
            align:"center",
            dataIndex: 'currentUsage',
            width: 100
          },
          {
            title: '套餐 ',
            align:"center",
            dataIndex: 'packageId_dictText', width: 100
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
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
            width: 60
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
            title: 'MSISDN',
            align:"center",
            dataIndex: 'msisdn',
            width:150,
          },
          {
            title: '运营商类型 ',
            align:"center",
            dataIndex: 'operatorType_dictText', width: 100
          },
          {
            title: '运营商',
            align:"center",
            dataIndex: 'operatorName',
            width: 200
          },
          {
            title: '企业名称',
            align:"center",
            dataIndex: 'customerName', width: 200
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
            dataIndex: 'cardState_dictText', width: 100
          },
          {
            title: '流量用量(M)',
            align:"center",
            dataIndex: 'currentUsage', width: 100
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
            title: '合同编号',
            align:"center",
            dataIndex: 'contractNo', width: 100
          },
          {
            title: '套餐 ',
            align:"center",
            dataIndex: 'packageId_dictText', width: 100
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
            title: 'MSISDN',
            align:"center",
            dataIndex: 'msisdn',
            width:150,
          },
          {
            title: '运营商类型 ',
            align:"center",
            dataIndex: 'operatorType_dictText', width: 100
          },
          /*{
            title: '运营商',
            align:"center",
            dataIndex: 'operatorName',
            width: 200
          },*/
          {
            title: '企业名称',
            align:"center",
            dataIndex: 'customerName', width: 200
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'cardState_dictText', width: 100
          },
          {
            title: '流量用量(M)',
            align:"center",
            dataIndex: 'currentUsage', width: 100
          },
          {
            title: '套餐 ',
            align:"center",
            dataIndex: 'packageId_dictText', width: 100
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
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
            width: 60
          }
        ],
        defColumns3: [
          {
            title: 'ICCID',
            align:"center",
            dataIndex: 'iccid',
            width:200,
          },
          {
            title: 'MSISDN',
            align:"center",
            dataIndex: 'msisdn',
            width:150,
          },
          {
            title: '运营商类型 ',
            align:"center",
            dataIndex: 'operatorType_dictText', width: 100
          },
          /*{
            title: '运营商',
            align:"center",
            dataIndex: 'operatorName',
            width: 200
          },*/
          {
            title: '企业名称',
            align:"center",
            dataIndex: 'customerName', width: 200
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
            dataIndex: 'cardState_dictText', width: 100
          },
          {
            title: '套餐 ',
            align:"center",
            dataIndex: 'packageId_dictText', width: 100
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
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
            width: 60
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
            title: 'MSISDN',
            align:"center",
            dataIndex: 'msisdn',
            width:150,
          },
          {
            title: '运营商类型 ',
            align:"center",
            dataIndex: 'operatorType_dictText', width: 100
          },
          /*{
            title: '运营商',
            align:"center",
            dataIndex: 'operatorName',
            width: 200
          },*/
          {
            title: '企业名称',
            align:"center",
            dataIndex: 'customerName', width: 200
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'cardState_dictText', width: 100
          },
          {
            title: '套餐 ',
            align:"center",
            dataIndex: 'packageId_dictText', width: 100
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
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
            width: 60
          }
        ],
        url: {
          list: "/enterprise/iotEnterpriseCardInfo/list",
          delete: "/enterprise/iotEnterpriseCardInfo/delete",
          deleteBatch: "/enterprise/iotEnterpriseCardInfo/deleteBatch",
          exportXlsUrl: "/enterprise/iotEnterpriseCardInfo/exportXls",
          importExcelUrl: "enterprise/iotEnterpriseCardInfo/importExcel",
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
          console.log(res)
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
      handleCardDistributionPackageOne: function () {
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationDistributionPackageOne.add(this.selectedRowKeys,null);
          this.$refs.CardInformationDistributionPackageOne.title = "套餐配置";
          this.$refs.CardInformationDistributionPackageOne.disableSubmit = false;
        }else{
          var params = this.getQueryParams();//查询条件
          getAction('/enterprise/iotEnterpriseCardInfo/listId', params).then((res) => {
            if (res.success) {
              this.$refs.CardInformationDistributionPackageOne.add(this.selectedRowKeys,res.result);
              this.$refs.CardInformationDistributionPackageOne.title = "套餐配置";
              this.$refs.CardInformationDistributionPackageOne.disableSubmit = false;
            }
          })
        }
      },
      handleCardDailyDose(record){
        this.$refs.cardDailyDoseModal.edit(record);
        this.$refs.cardDailyDoseModal.disableSubmit = true;
      },
      handleDetails(record){
        this.$refs.packageListModal.edit(record.iccid);
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
          getAction('/enterprise/iotEnterpriseCardInfo/listId', params).then((res) => {
            if (res.success) {
              this.$refs.CardInformationSetTime.add(this.selectedRowKeys,res.result);
              this.$refs.CardInformationSetTime.title = "卡备注";
              this.$refs.CardInformationSetTime.disableSubmit = false;
            }
          })
          /*this.$refs.CardInformationSetTime.add(this.selectedRowKeys,params.customerId);
          this.$refs.CardInformationSetTime.title = "设置激活及到期时间";
          this.$refs.CardInformationSetTime.disableSubmit = false;*/
        }
      },
      deduction: function () {
        var params = this.getQueryParams();//查询条件
        if(params.customerId==undefined){
          this.$message.warning('请选择扣款用户！');
          return false;
        }
        getAction('/enterprise/iotEnterpriseCardInfo/getById', params).then((res) => {
          if (res.success) {
            this.$refs.CardInformationDeduction.add(res.result);
            this.$refs.CardInformationDeduction.title = "扣款";
            this.$refs.CardInformationDeduction.disableSubmit = false;
          }
        })
      },
      //卡备注
      handleCardNote: function () {
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationNote.add(this.selectedRowKeys,this.selectionRows);
          this.$refs.CardInformationNote.title = "卡备注";
          this.$refs.CardInformationNote.disableSubmit = false;
        }else{
          var params = this.getQueryParams();//查询条件
          getAction('/enterprise/iotEnterpriseCardInfo/getCards', params).then((res) => {
            if (res.success) {
              this.$refs.CardInformationNote.add(this.selectedRowKeys,res.result);
              this.$refs.CardInformationNote.title = "卡备注";
              this.$refs.CardInformationNote.disableSubmit = false;
            }
          })
        }
      },
      handleCardInformationRecycling: function () {
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationRecycling.add(this.selectedRowKeys,null);
          this.$refs.CardInformationRecycling.title = "卡回收";
          this.$refs.CardInformationRecycling.disableSubmit = false;
        }else{
          var params = this.getQueryParams();//查询条件
          getAction('/enterprise/iotEnterpriseCardInfo/listId', params).then((res) => {
            if (res.success) {
              this.$refs.CardInformationRecycling.add(this.selectedRowKeys,res.result);
              this.$refs.CardInformationRecycling.title = "卡回收";
              this.$refs.CardInformationRecycling.disableSubmit = false;
            }
          })
        }
      },
      //按条件设置流量使用比例弹出页面
      handleCardFlowUsageRatio: function () {
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationFlowUsageRatio.add(this.selectedRowKeys,null);
          this.$refs.CardInformationFlowUsageRatio.title = "流量使用比例";
          this.$refs.CardInformationFlowUsageRatio.disableSubmit = false;
        }else{
          var params = this.getQueryParams();//查询条件
          getAction('/enterprise/iotEnterpriseCardInfo/listId', params).then((res) => {
            if (res.success) {
              this.$refs.CardInformationFlowUsageRatio.add(this.selectedRowKeys,res.result);
              this.$refs.CardInformationFlowUsageRatio.title = "流量使用比例";
              this.$refs.CardInformationFlowUsageRatio.disableSubmit = false;
            }
          })
        }
      },
      handleMonitorUse: function () {
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationMonitorUse.add(this.selectedRowKeys,this.selectionRows);
          this.$refs.CardInformationMonitorUse.title = "用量监控更改";
          this.$refs.CardInformationMonitorUse.disableSubmit = false;
        }else{
          var params = this.getQueryParams();//查询条件
          getAction('/enterprise/iotEnterpriseCardInfo/getCards', params).then((res) => {
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
          this.$refs.CardInformationSyncStatus.add(this.selectedRowKeys,this.selectionRows);
          this.$refs.CardInformationSyncStatus.title = "同步用量";
          this.$refs.CardInformationSyncStatus.disableSubmit = false;
        }else{
          var params = this.getQueryParams();//查询条件
          getAction('/enterprise/iotEnterpriseCardInfo/getCards', params).then((res) => {
            if (res.success) {
              console.log("res.result=="+res.result)
              this.$refs.CardInformationSyncStatus.add(this.selectedRowKeys,res.result);
              this.$refs.CardInformationSyncStatus.title = "同步用量";
              this.$refs.CardInformationSyncStatus.disableSubmit = false;
            }
          })
        }
      },

      //卡状态变更弹出页面
      handleCardStateChange: function () {
        /*if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return false;
        }*/
        //有选中的就不在查询后台
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationStateChange.add(this.selectedRowKeys,null);
          this.$refs.CardInformationStateChange.title = "卡状态变更";
          this.$refs.CardInformationStateChange.disableSubmit = false;
        }else{
          var params = this.getQueryParams();//查询条件
          getAction('/enterprise/iotEnterpriseCardInfo/listId', params).then((res) => {
            if (res.success) {
              this.$refs.CardInformationStateChange.add(this.selectedRowKeys,res.result);
              this.$refs.CardInformationStateChange.title = "卡状态变更";
              this.$refs.CardInformationStateChange.disableSubmit = false;
            }
          })
        }
      },
      handleUserStateChange: function () {
        /*if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return false;
        }*/
        //有选中的就不在查询后台
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationUserStateChange.add(this.selectedRowKeys,null);
          this.$refs.CardInformationUserStateChange.title = "卡状态变更";
          this.$refs.CardInformationUserStateChange.disableSubmit = false;
        }else{
          var params = this.getQueryParams();//查询条件
          getAction('/enterprise/iotEnterpriseCardInfo/listId', params).then((res) => {
            if (res.success) {
              this.$refs.CardInformationUserStateChange.add(this.selectedRowKeys,res.result);
              this.$refs.CardInformationUserStateChange.title = "卡状态变更";
              this.$refs.CardInformationUserStateChange.disableSubmit = false;
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
        /*if(this.selectedRowKeys==''){
          this.$message.warning('请选择要分配的卡')
          return;
        }

let map = this.selectionRows.map(item=>{ return item.iccid});
        console.log('this.selectionRows>>>'+JSON.stringify(map));
        this.$refs.CardInformationDistribution.add(this.selectedRowKeys);
        this.$refs.CardInformationDistribution.title = "卡分配";
        this.$refs.CardInformationDistribution.disableSubmit = false;*/

        getAction('/enterprise/iotEnterpriseCardInfo/listId', params).then((res) => {
          if (res.success) {

            this.$refs.CardInformationDistribution.add(res.result);
            this.$refs.CardInformationDistribution.title = "卡分配";
            this.$refs.CardInformationDistribution.disableSubmit = false;
          }
        })
      },
      modifyPrice: function () {
        if(this.selectedRowKeys.length>0){
          this.$refs.CardInformationModifyPrice.add(this.selectedRowKeys,null);
          this.$refs.CardInformationModifyPrice.title = "改价";
          this.$refs.CardInformationModifyPrice.disableSubmit = false;
          return;
        }
        var params = this.getQueryParams();//查询条件
        getAction('/enterprise/iotEnterpriseCardInfo/listId', params).then((res) => {
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
          getAction('/enterprise/iotEnterpriseCardInfo/getQRcodeById', {ids:ids}).then((res) => {
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
        getAction('/enterprise/iotEnterpriseCardInfo/getQRcode', params).then((res) => {
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

          unicomCardDataUpdate({ids: iccids}).then((res)=>{
            if(res.success){
              this.$message.success(res.message);
              this.onClearSelected();
            }else{
              this.$message.warning(res.message);
              this.onClearSelected();
            }
          })

        }
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
      //用量校正
      handleCorrection: function () {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return false;
        }else {

          let map = this.selectionRows.map(item=>{return item.iccid});
          let join = map.join(",");
          getAction('/enterprise/iotEnterpriseCardInfo/handleCorrection', {ids: join}).then((res) => {
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
          /*getAction('/enterprise/iotEnterpriseCardInfo/listId', params).then((res) => {
            if (res.success) {
              this.$refs.CardInformationRenewal.add(res.result);
              this.$refs.CardInformationRenewal.title = "续费";
              this.$refs.CardInformationRenewal.disableSubmit = false;
            }
          })*/
        }
        /*if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return false;
        }
        let map = this.selectionRows.map(item=>{return item.iccid});
        let join = map.join(",");
        getAction('/enterprise/iotEnterpriseCardInfo/renewal', {ids: join}).then((res) => {
          console.log(res)
          if (res.success) {
            this.$message.success(res.message);
            this.onClearSelected();
            this.loadData();
          } else {
            this.$message.warning(res.message);
            this.onClearSelected();
          }
        })*/
      },
      handleExport(){
        let param = {...this.queryParam};
        this.$refs.CardInformationExport.add(param);
        this.$refs.CardInformationExport.title = "数据导出";
        this.$refs.CardInformationExport.disableSubmit = false;
      },

      handleExportXls(fileName){
        if(!fileName || typeof fileName != "string"){
          fileName = "导出文件"
        }
        let param = {...this.queryParam};
        if(this.selectedRowKeys && this.selectedRowKeys.length>0){
          param['selections'] = this.selectedRowKeys.join(",")
        }
        console.log("导出参数",param)
        downFile(this.url.exportXlsUrl,param).then((data)=>{
          if (!data) {
            this.$message.warning("文件下载失败")
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data]), fileName+'.xls')
          }else{
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName+'.xls')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link); //下载完成移除元素
            window.URL.revokeObjectURL(url); //释放掉blob对象
          }
        })
      },

      getImportUrl(){
        return '/enterprise/iotEnterpriseCardInfo/importExcel'
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


    },

    watch: {
      '$route': 'initData'
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>