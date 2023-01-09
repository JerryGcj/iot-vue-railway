<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col v-has="'cardInformationList:selectCustomerId'" :md="6" :sm="8">
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

          <a-col v-has="'cardInformationList:selectCustomerIdDls'" :md="6" :sm="8">
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
            <a-form-item label="MSISDN">
              <a-input placeholder="MSISDN" v-model="queryParam.msisdn"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="运营商类型">
              <j-dict-select-tag placeholder="请选择运营商类型" v-model="queryParam.operatorType" dict-code="operator_type"></j-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="运营商">

              <j-dict-select-tag v-model="queryParam.operatorId" placeholder="请选择运营商" dict-code="iot_operator,operator_name,id,state='1'"></j-dict-select-tag>
              <!--<a-select :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"-->
                        <!--v-model="queryParam.operatorId"-->
                        <!--placeholder="请选择运营商">-->
                <!--<a-select-option v-for="d in operatorData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>-->
              <!--</a-select>-->
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="卡状态">
              <a-select v-model="queryParam.cardState" placeholder="请选择">
                <a-select-option value="0">待激活</a-select-option>
                <a-select-option value="1">沉默期</a-select-option>
                <a-select-option value="2">测试期</a-select-option>
                <a-select-option value="3">正常</a-select-option>
                <a-select-option value="4">停机</a-select-option>
                <a-select-option value="5">已销号</a-select-option>
                <a-select-option value="6">机卡分离</a-select-option>
                <a-select-option value="7">高危禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="10" :sm="12">
              <a-form-item label="订购时间" :labelCol="{span: 4}">
                <j-date v-model="queryParam.startTime" :showTime="true" date-format="YYYY-MM-DD HH:mm:ss" style="width:45%" placeholder="请选择开始时间" ></j-date>
                <span class="query-group-split-cust"></span>
                <j-date v-model="queryParam.endTime" :showTime="true" date-format="YYYY-MM-DD HH:mm:ss" style="width:45%" placeholder="请选择截止时间"></j-date>
              </a-form-item>
            </a-col>
            <a-col :md="10" :sm="12">
              <a-form-item label="订购类型" :labelCol="{span: 4}">
                <a-select v-model="queryParam.orderState" placeholder="请选择">
                  <a-select-option value="0">新增</a-select-option>
                  <a-select-option value="1">续费</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="分配状态">-->
                <!--<a-select v-model="queryParam.allocationState" placeholder="请选择">-->
                  <!--<a-select-option value="0">已分配</a-select-option>-->
                  <!--<a-select-option value="1">未分配</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="imsi">-->
                <!--<a-input placeholder="imsi" v-model="queryParam.imsi"></a-input>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="imei">-->
                <!--<a-input placeholder="imsi" v-model="queryParam.imei"></a-input>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="分配批次">-->
                <!--<a-input placeholder="分配批次" v-model="queryParam.distributionBatch"></a-input>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="导入批次">-->
                <!--<a-input placeholder="导入批次" v-model="queryParam.importBatch"></a-input>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="开关机状态">-->
                <!--<a-select v-model="queryParam.deviceOnOffState" placeholder="请选择">-->
                  <!--<a-select-option value="0">关机</a-select-option>-->
                  <!--<a-select-option value="1">开机</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="同步状态">-->
                <!--<a-select v-model="queryParam.cardSynchronization" placeholder="请选择">-->
                  <!--<a-select-option value="0">开启</a-select-option>-->
                  <!--<a-select-option value="1">关闭</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="在线状态">-->
                <!--<a-select v-model="queryParam.cardOnlineStatus" placeholder="请选择">-->
                  <!--<a-select-option value="0">在线</a-select-option>-->
                  <!--<a-select-option value="1">不在线</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="是否欠费">-->
                <!--<a-select v-model="queryParam.isArrearage" placeholder="请选择">-->
                  <!--<a-select-option value="0">是</a-select-option>-->
                  <!--<a-select-option value="1">否</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="代理不可复机">-->
                <!--<a-select v-model="queryParam.agentStopMachine" placeholder="请选择">-->
                  <!--<a-select-option value="0">是</a-select-option>-->
                  <!--<a-select-option value="1">否</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="GPRS服务开通状态">-->
                <!--<a-select v-model="queryParam.gprsState" placeholder="请选择">-->
                  <!--<a-select-option value="0">是</a-select-option>-->
                  <!--<a-select-option value="1">否</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="短信服务开通状态">-->
                <!--<a-select v-model="queryParam.smsState" placeholder="请选择">-->
                  <!--<a-select-option value="0">是</a-select-option>-->
                  <!--<a-select-option value="1">否</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="上游池ID">-->
                <!--<a-input placeholder="上游池ID" v-model="queryParam.upstreamFlowPoolNumber"></a-input>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="是否属于流量池">-->
                <!--<a-select v-model="queryParam.isFlowPool" placeholder="请选择">-->
                  <!--<a-select-option value="0">是</a-select-option>-->
                  <!--<a-select-option value="1">否</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="系统流量池ID">-->
                <!--<a-input placeholder="系统流量池ID" v-model="queryParam.systemFlowPoolId"></a-input>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="实名认证">-->
                <!--<a-select v-model="queryParam.isRealNameAuthentication" placeholder="请选择">-->
                  <!--<a-select-option value="0">是</a-select-option>-->
                  <!--<a-select-option value="1">否</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="自动停复机">-->
                <!--<a-select v-model="queryParam.automaticStopResetMachine" placeholder="请选择">-->
                  <!--<a-select-option value="0">是</a-select-option>-->
                  <!--<a-select-option value="1">否</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="已订购套餐">-->
                <!--<a-select :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"-->
                          <!--v-model="queryParam.packageId"-->
                          <!--placeholder="套餐">-->
                  <!--<a-select-option v-for="d in packageData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="激活后生效套餐">-->
                <!--<a-select :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"-->
                          <!--v-model="queryParam.activationPackageId"-->
                          <!--placeholder="套餐">-->
                  <!--<a-select-option v-for="d in packageData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->


            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="强制生效日期" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">-->
                <!--<j-date v-model="queryParam.mandatoryEffectiveDate" :showTime="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择强制生效日期" ></j-date>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="终端黑名单状态">-->
                <!--<a-select v-model="queryParam.terminalBlacklist" placeholder="请选择">-->
                  <!--<a-select-option value="0">是</a-select-option>-->
                  <!--<a-select-option value="1">否</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="备注">-->
                <!--<a-input placeholder="备注" v-model="queryParam.note"></a-input>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

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

    <!-- 操作按钮区域 -->
    <div class="table-operator">


      <a-button type="primary" v-has="'cardInformationList:importExcelUrl'" :action="importExcelUrl" icon="import" @click="handleCardImport">卡导入</a-button>
      <a-button type="primary" v-has="'cardInformationList:CardDistribution'" icon="" @click="handleCardDistribution"  @hello="onClearSelected"> 分配</a-button>
      <a-button type="primary" v-has="'cardInformationList:CardImportDistribution'" icon="" @click="handleCardImportDistribution">导入分配</a-button>
      <a-button type="primary" v-has="'cardInformationList:CardStateChange'" icon="" @click="handleCardStateChange">状态变更</a-button>
      <a-button type="primary" v-has="'cardInformationList:DataUpdate'" icon="" @click="handleDataUpdate">数据更新</a-button>
      <a-button type="primary" v-has="'cardInformationList:handleCardNote'" icon="" @click="handleCardNote">卡备注</a-button>
      <a-button type="primary" v-has="'cardInformationList:CardSendSms'" icon="" @click="handleCardSendSms">发送短信</a-button>
      <a-button type="primary" v-has="'cardInformationList:CardImportSendSms'" icon="" @click="handleCardImportSendSms">按导入号码发送短信</a-button>
      <!--<a-button type="primary" icon="" @click="handleCardRenewal">续费</a-button>-->
      <a-button type="primary" v-has="'cardInformationList:CardImportSynchronousState'" icon="" @click="handleCardImportSynchronousState">按条件设置同步状态</a-button>
      <a-button type="primary" v-has="'cardInformationList:CardConditionalAgentRecovery'" icon="" @click="handleCardConditionalAgentRecovery">按条件代理不可复机</a-button>
      <a-button type="primary" v-has="'cardInformationList:CardDistributionPackage'" icon="" @click="handleCardDistributionPackage">设置套餐</a-button>
      <a-button type="primary" v-has="'cardInformationList:CardFlowUsageRatio'" icon="" @click="handleCardFlowUsageRatio">按条件设置流量使用比例</a-button>
      <a-button type="primary" v-has="'cardInformationList:CardImportCardDistributionPackage'" icon="" @click="handleCardImportCardDistributionPackage">按导入卡号设置套餐</a-button>
      <a-button type="primary" v-has="'cardInformationList:CardRechargeablePackage'" icon="" @click="handleCardRechargeablePackage">设置可充值套餐</a-button>
      <a-button type="primary" v-has="'cardInformationList:CardAutomaticShutdown'" icon="" @click="handleCardAutomaticShutdown">设置自动停复机</a-button>
      <a-button type="primary" v-has="'cardInformationList:CardEditorInformation'" icon="" @click="handleCardEditorInformation">修改卡信息</a-button>
      <a-button type="primary" v-has="'cardInformationList:CardRealNameAuthentication'" icon="" @click="handleCardRealNameAuthentication">是否实名认证</a-button>
      <a-button type="primary" v-has="'cardInformationList:CardRecycling'" icon="" @click="handleCardInformationRecycling">卡回收</a-button>
      <a-button type="primary" v-has="'cardInformationList:handleCardPriority'" icon="" @click="handleCardPriority">设置优先级</a-button>

      <a-button type="primary" v-has="'cardInformationList:handlePackageTransfer'"icon="" @click="handlePackageTransfer">流量套餐转移</a-button>

      <a-button type="primary" v-has="'cardInformationList:handleExportXls'"icon="download" @click="handleExportXls('物联网卡信息表')">导出</a-button>

      <!--<a-dropdown v-if="selectedRowKeys.length > 0">-->
        <!--<a-menu slot="overlay">-->
          <!--<a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>-->
        <!--</a-menu>-->
        <!--<a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>-->
      <!--</a-dropdown>-->
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
        @change="handleTableChange"
        :scroll="{ x: 1800 }">

        <span slot="action" slot-scope="text, record">
          <a v-has="'cardInformationList:viewPackageList'" @click="handleDetails(record)">套餐列表</a>
          <a-divider v-has="'cardInformationList:viewPackageList'" type="vertical" />
          <a @click="handleCardDailyDose(record)">日用量</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a v-has="'cardInformationList:CardDistributionPackageOne'" @click="handleCardDistributionPackageOne(record)">套餐配置</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a v-has="'cardInformationList:CardDelete'">删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
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
    <card-information-flow-usage-ratio ref="CardInformationFlowUsageRatio" @ok="modalFormOk"></card-information-flow-usage-ratio>
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

    <package-list-modal ref="packageListModal" @ok="modalFormOk"></package-list-modal>
    <card-daily-dose-modal ref="cardDailyDoseModal" @ok="modalFormOk"></card-daily-dose-modal>
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
  import PackageListModal from './modules/PackageListModal'


  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {queryOperator,queryStandardcost,cardDataUpdate,getRefCardCostByCardId,queryLowerAgent} from '@/api/api'
  import JTreeSelect from '@/components/jeecg/JTreeSelect'
  import JDate from '@/components/jeecg/JDate'
  import { deleteAction,getAction,downFile} from '@/api/manage'
  import CardInformationRecycling from "./modules/CardInformationRecycling";
  import CardDailyDoseModal from "./modules/CardDailyDoseModal";


  export default {
    name: "CardInformationList",
    mixins:[JeecgListMixin],
    components: {
      CardDailyDoseModal,
      PackageListModal,
      CardInformationRecycling,
      CardInformationImport,
      queryOperator,
      CardInformationDistribution,
      CardInformationImportDistribution,
      CardInformationStateChange,
      CardInformationSendSms,
      CardInformationImportSendSms,
      CardInformationSynchronousState,
      CardInformationConditionalAgentRecovery,
      CardInformationFlowUsageRatio,
      CardInformationAutomaticShutdown,
      CardInformationRealNameAuthentication,
      CardInformationNote,
      CardInformationPriority,
      CardInformationDistributionPackage,
      CardInformationRechargeablePackage,
      CardInformationImportCardDistributionPackage,
      CardInformationEditorInformation,
      CardInformationRenewal,
      JTreeSelect,
      queryStandardcost,
      JDate,
      CardInformationPackageTransfer,
      cardDataUpdate,
      CardInformationDistributionPackageOne,
      getRefCardCostByCardId,
      queryLowerAgent
    },
    data () {
      return {
        description: '物联网卡信息表管理页面',
        operatorData:[],
        packageData:[],
        userData:[],
        username:'jeecg',
        // fileList:[],
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
            title: 'ICCID',
            align:"center",
            dataIndex: 'iccid',
            fixed:'left',
            width:300,
           },
		      {
            title: 'MSISDN',
            align:"center",
            dataIndex: 'msisdn', width: 250
           },
          {
            title: '运营商类型 ',
            align:"center",
            dataIndex: 'operatorType_dictText', width: 200
          },
          {
            title: '运营商',
            align:"center",
            dataIndex: 'operatorName',
            width: 200
          },

          // {
          //   title: '用户ID',
          //   align:"center",
          //   dataIndex: 'userName', width: 200
          // },
          {
            title: '企业名称',
            align:"center",
            dataIndex: 'customerName', width: 200
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'cardState',
            customRender:function (text) {
              if(text=='0'){
                return "待激活";
              }else if(text=="1"){
                return "沉默期";
              }else if(text=="2"){
                return "测试期";
              }else if(text=="3"){
                return "正常";
              }else if(text=="4"){
                return "停机";
              }else if(text=="5"){
                return "已销号";
              }else if(text=="6"){
                return "机卡分离";
              }else if(text=="7"){
                return "高危禁用";
              } else {
                return text;
              }
            }, width: 100
          },
          {
            title: '主套餐',
            align:"center",
            dataIndex: 'takeEffectPackageName', width: 300
          },
          {
            title: '流量总量(M)',
            align:"center",
            dataIndex: 'originUse', width: 100
          },

          {
            title: '流量用量(M)',
            align:"center",
            dataIndex: 'usaged', width: 100
          },
          // {
          //   title: '本月用量(M) ',
          //   align:"center",
          //   dataIndex: 'trafficUseMonth', width: 100
          // },
          {
            title: '流量余量(M) ',
            align:"center",
            dataIndex: 'trafficAllowance', width: 100
          },
          {
            title: '激活时间',
            align:"center",
            dataIndex: 'activationTime', width: 200
          },
          // {
          //   title: '失效时间',
          //   align:"center",
          //   dataIndex: 'loseEfficacyTime', width: 200
          // },
          {
            title: '备注 ',
            align:"center",
            dataIndex: 'note', width: 100
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
            width: 250
          }
        ],
		    url: {
          list: "/cardinformation/cardInformation/list",
          delete: "/cardinformation/cardInformation/delete",
          deleteBatch: "/cardinformation/cardInformation/deleteBatch",
          exportXlsUrl: "cardinformation/cardInformation/exportXls",
          importExcelUrl: "cardinformation/cardInformation/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){

        var that = this;
      //   queryOperator().then((res)=>{
      //     if(res.success){
      //     that.operatorData = [];
      //     let treeList = res.result
      //     for(let a=0;a<treeList.length;a++){
      //       let temp = treeList[a];
      //       this.operatorData.push({
      //         value:temp.id,
      //         text:temp.operatorName
      //       })
      //     }
      //   }
      // });

     //  queryStandardcost().then((res)=>{
     //    if(res.success){
     //      that.packageData = [];
     //      let treeList = res.result
     //      for(let a=0;a<treeList.length;a++){
     //        let temp = treeList[a];
     //        this.packageData.push({
     //          value:temp.id,
     //          text:temp.packageName
     //        })
     //      }
     //    }
     // });


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
    },


  },
    methods: {
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

      //发送短信弹出页面
      handleCardSendSms: function () {
        var params = this.getQueryParams();//查询条件
        getAction('/cardinformation/cardInformation/listId', params).then((res) => {
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

      //按条件设置同步状态弹出页面
      handleCardImportSynchronousState: function () {

        var params = this.getQueryParams();//查询条件
        getAction('/cardinformation/cardInformation/listId', params).then((res) => {
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
        getAction('/cardinformation/cardInformation/listId', params).then((res) => {
          if (res.success) {
            this.$refs.CardInformationConditionalAgentRecovery.add(this.selectedRowKeys,res.result);
            this.$refs.CardInformationConditionalAgentRecovery.title = "按条件代理不可复机";
            this.$refs.CardInformationConditionalAgentRecovery.disableSubmit = false;
        }
      })
      },

      //按条件设置流量使用比例弹出页面
      handleCardFlowUsageRatio: function () {
        var params = this.getQueryParams();//查询条件
        getAction('/cardinformation/cardInformation/listId', params).then((res) => {
          if (res.success) {
            this.$refs.CardInformationFlowUsageRatio.add(this.selectedRowKeys,res.result);
            this.$refs.CardInformationFlowUsageRatio.title = "流量使用比例";
            this.$refs.CardInformationFlowUsageRatio.disableSubmit = false;
        }
      })
      },

      //设置自动停复机
      handleCardAutomaticShutdown: function () {
        var params = this.getQueryParams();//查询条件
        getAction('/cardinformation/cardInformation/listId', params).then((res) => {
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
        getAction('/cardinformation/cardInformation/listId', params).then((res) => {
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
        getAction('/cardinformation/cardInformation/listId', params).then((res) => {
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
          getAction('/cardinformation/cardInformation/listId', params).then((res) => {
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
          getAction('/cardinformation/cardInformation/listId', params).then((res) => {
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
          this.$refs.CardInformationDistribution.title = "卡状态变更";
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

        getAction('/cardinformation/cardInformation/listId', params).then((res) => {
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

        getAction('/cardinformation/cardInformation/listId', params).then((res) => {
          if (res.success) {
          this.$refs.CardInformationDistributionPackage.add(this.selectedRowKeys,res.result,params.operatorId);
          this.$refs.CardInformationDistributionPackage.title = "分配套餐";
          this.$refs.CardInformationDistributionPackage.disableSubmit = false;
        }
      })
      },

      //批量分配套餐
      handleCardDistributionPackageOne: function (record) {

        getRefCardCostByCardId({iccid:record.iccid}).then((res)=>{
          if (res.success) {
            this.$refs.CardInformationDistributionPackageOne.add(record,res.result);
            this.$refs.CardInformationDistributionPackageOne.title = "分配套餐";
            this.$refs.CardInformationDistributionPackageOne.disableSubmit = false;
          }
        })
      },

      //卡回收
      handleCardInformationRecycling: function (record) {

        var params = this.getQueryParams();//查询条件
        getAction('/cardinformation/cardInformation/listId', params).then((res) => {
          if (res.success) {
          this.$refs.CardInformationRecycling.add(this.selectedRowKeys,res.result);
          this.$refs.CardInformationRecycling.title = "卡回收";
          this.$refs.CardInformationRecycling.disableSubmit = false;
        }
      })
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
      //卡套餐转移
      handlePackageTransfer: function () {
        this.$refs.CardInformationPackageTransfer.add();
        this.$refs.CardInformationPackageTransfer.title = "卡套餐转移";
        this.$refs.CardInformationPackageTransfer.disableSubmit = false;
      },
      //数据更新
      handleDataUpdate: function () {

        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        }else {
          let map = this.selectionRows.map(item=>{return item.iccid});
          let iccids = map.join(",");
          cardDataUpdate({ids: iccids}).then((res)=>{
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






      handleImportXls(){
        this.$refs.importModal.show()
      },

      getImportUrl(){
        return '/cardinformation/cardInformation/importExcel'
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