<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col v-has="'orderList:selectCustomerId'" :md="6" :sm="8">
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

          <a-col v-has="'orderList:selectCustomerIdDls'" :md="6" :sm="8">
            <a-form-item label="客户">
              <a-select v-model="queryParam.customerId"
                        placeholder="请选择客户">
                <a-select-option v-for="d in userData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="ICCID">
              <a-input placeholder="请输入ICCID" v-model="queryParam.iccid"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="10" :sm="12">
            <a-form-item label="提交时间">
              <j-date v-model="queryParam.createTime_begin" date-format="YYYY-MM-DD 00:00:00" class="query-group-cust" placeholder="请选择开始时间" ></j-date>
              <span style="width: 10px;">~</span>
              <j-date v-model="queryParam.createTime_end" date-format="YYYY-MM-DD 23:59:59" class="query-group-cust" placeholder="请选择结束时间"></j-date>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="商户单号">
              <a-input placeholder="请输入商户单号（模糊查询）" v-model="queryParam.payOrderId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="交易单号">
              <a-input placeholder="请输入交易单号（模糊查询）" v-model="queryParam.upstreamPaymentOrderNumber"></a-input>
            </a-form-item>
          </a-col>

          <!--<a-col :md="6" :sm="8">-->
            <!--<a-form-item label="商户订单号">-->
              <!--<a-input placeholder="请输入商户订单号" v-model="queryParam.merchantOrderId"></a-input>-->
            <!--</a-form-item>-->
          <!--</a-col>-->


          <!--<a-col :md="6" :sm="8">-->
            <!--<a-form-item label="套餐编号">-->
              <!--<a-input placeholder="请输入套餐编号" v-model="queryParam.packageId"></a-input>-->
            <!--</a-form-item>-->
          <!--</a-col>-->

          <a-col :md="6" :sm="8">
            <a-form-item label="套餐名称">
              <a-input placeholder="请输入套餐名称" v-model="queryParam.packageName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="订单状态">
              <j-dict-select-tag v-model="queryParam.orderState" placeholder="请选择订单状态" dictCode="order_status"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="支付渠道">
              <j-dict-select-tag v-model="queryParam.paymentChannel" placeholder="请选择支付渠道" dictCode="pay_channel"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="支付状态">
              <j-dict-select-tag v-model="queryParam.payState" placeholder="请选择支付状态" dictCode="pay_state"/>
              <!--<a-select v-model="queryParam.payState" placeholder="请选择支付状态">
                <a-select-option value="0">未支付</a-select-option>
                <a-select-option value="1">支付退出</a-select-option>
                <a-select-option value="2">支付异常</a-select-option>
                <a-select-option value="3">支付失败</a-select-option>
                <a-select-option value="4">支付成功</a-select-option>
                <a-select-option value="5">退款失败</a-select-option>
                <a-select-option value="6">退款成功</a-select-option>
              </a-select>-->
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="运营商">
              <a-select v-model="queryParam.operatorType" placeholder="请选择运营商">
                <a-select-option value="1">移动</a-select-option>
                <a-select-option value="2">联通</a-select-option>
                <a-select-option value="3">电信</a-select-option>
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
      <a-button type="primary" icon="download" @click="handleExportXls('订单列表')" :disabled="isDisable">导出</a-button>
      <a-button type="primary" icon="reload" @click="reloadState">更新支付状态</a-button>
      <a-button v-has="'orderList:orderStateChange'" type="primary" icon="" @click="handleCardStateChange">订单状态变更</a-button>
      <a-popconfirm title="确定退款吗?" @confirm="() => orderRefund()">
        <a-button v-has="'orderList:orderRefund'" type="primary" icon="">退款</a-button>
      </a-popconfirm>
      <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->

      <!--<a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>-->
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
        @change="handleTableChange"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :scroll="{ x: 2300 }">

        <!-- 字符串超长截取省略号显示-->
        <span slot="payOrderId" slot-scope="text">
          <j-ellipsis :value="text" :length="18" />
        </span>
        <span slot="upstreamPaymentOrderNumber" slot-scope="text">
          <j-ellipsis :value="text" :length="18" />
        </span>

        <span slot="action" slot-scope="text, record">
          <a v-if="record.payState==6" @click="refundDetail(record)">退款详情</a>

          <!--<a-divider type="vertical" />-->
          <!--<a-dropdown>-->
            <!--<a class="ant-dropdown-link">更多 <a-icon type="down" /></a>-->
            <!--<a-menu slot="overlay">-->
              <!--<a-menu-item>-->
                <!--<a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
                  <!--<a>删除</a>-->
                <!--</a-popconfirm>-->
              <!--</a-menu-item>-->
            <!--</a-menu>-->
          <!--</a-dropdown>-->
        </span>
        <!-- 状态渲染模板 -->
        <template slot="PayState" slot-scope="state">
          <a-tag v-if="state==0" color="gray">未支付</a-tag>
          <a-tag v-if="state==1" color="cyan">支付退出</a-tag>
          <a-tag v-if="state==2" color="purple">支付异常</a-tag>
          <a-tag v-if="state==3" color="red">支付失败</a-tag>
          <a-tag v-if="state==4" color="green">支付成功</a-tag>
          <a-tag v-if="state==5" color="orange">退款失败</a-tag>
          <a-tag v-if="state==6" color="orange">退款成功</a-tag>
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <order-modal ref="modalForm" @ok="modalFormOk"></order-modal>
    <refund-detail-modal ref="refundDetailModal" @ok="modalFormOk"></refund-detail-modal>
  </a-card>
</template>

<script>
  import OrderModal from './modules/OrderModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JTreeSelect from '@/components/jeecg/JTreeSelect'
  import JDate from '@/components/jeecg/JDate'
  import {queryLowerAgent} from '@/api/api'
  import { httpAction,downFile } from '@/api/manage'
  import JEllipsis from "@/components/jeecg/JEllipsis"
  import RefundDetailModal from "./modules/RefundDetailModal";

  export default {
    name: "OrderList",
    mixins:[JeecgListMixin],
    components: {
      OrderModal,
      JTreeSelect,
      JDate,
      JEllipsis,
      RefundDetailModal
    },
    data () {
      return {
        description: '订单列表管理页面',
        userData:[],
        isDisable: false,
        // 表头
        columns: [
          {
            title: 'ICCID',
            align:"center",
            dataIndex: 'iccid',
            fixed:'left',
            width: 250
          },
          {
            title: '商户单号',
            align:"center",
            dataIndex: 'payOrderId',
            scopedSlots: {customRender: 'payOrderId'}
          },
		      {
            title: '交易单号',
            align:"center",
            dataIndex: 'upstreamPaymentOrderNumber',
            scopedSlots: {customRender: 'upstreamPaymentOrderNumber'}
           },
          {
            title: '公司名称',
            align:"center",
            dataIndex: 'companyName',
            width: 150,
          },
          {
            title: '支付状态',
            align:"center",
            dataIndex: 'payState',
            width: 100,
            scopedSlots: { customRender: 'PayState' }
          },

          {
            title: '运营商',
            align:"center",
            dataIndex: 'operatorType',
            width: 100,
            customRender:function (text) {
              if(text=='1'){
                return "移动";
              }else if(text=="2"){
                return "联通";
              }else if(text=="3"){
                return "电信";
              } else {
                return text;
              }
            }
          },
          {
            title: '套餐名称',
            align:"center",
            dataIndex: 'packageName',
          },
          {
            title: '交易金额（元）',
            align:"center",
            dataIndex: 'tradingMoney',
            width: 120
          },
          {
            title: '支付渠道',
            align:"center",
            dataIndex: 'paymentChannel_dictText',
          },
          {
            title: '备注',
            align:"center",
            dataIndex: 'note',
          },
          {
            title: '订单创建时间',
            align:"center",
            dataIndex: 'createTime',
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
            width: 80
          }
        ],
		  url: {
          list: "/order/order/list",
          delete: "/order/order/delete",
          deleteBatch: "/order/order/deleteBatch",
          exportXlsUrl: "order/order/exportXls",
          importExcelUrl: "order/order/importExcel",
          reload: "order/order/reloadStatus",
          refund: "order/order/refund"
       },
        queryParam: {
          createTime_begin: this.dateFormat(new Date()),
          createTime_end: this.dateFormat(new Date()),
          payState:"4"
        }
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
      refundDetail(record){
        this.$refs.refundDetailModal.edit(record);
        this.$refs.refundDetailModal.title = "退款详情";
        this.$refs.refundDetailModal.disableSubmit = true;
      },
      handleCardStateChange: function () {
        if(this.selectedRowKeys.length != 1){
          this.$message.warning('请选择一条记录！');
          return;
        }
        this.$refs.modalForm.add(this.selectedRowKeys);
        this.$refs.modalForm.title = "订单状态变更";
        this.$refs.modalForm.disableSubmit = false;
      },
      reloadState: function () {
        const that = this;
        if(this.selectedRowKeys.length != 1){
          this.$message.warning('请选择一条记录！');
          return;
        }
        console.log('this.selectedRowKeys='+this.selectedRowKeys)
        const formData = new FormData();
        formData.append('id',this.selectedRowKeys);
        httpAction(this.url.reload,formData,'post').then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.$emit('ok');
            this.loadData();
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      orderRefund: function () {
        const that = this;
        if(this.selectedRowKeys.length != 1){
          this.$message.warning('请选择一条记录！');
          return;
        }
        console.log('this.selectedRowKeys='+this.selectedRowKeys)
        const formData = new FormData();
        formData.append('id',this.selectedRowKeys);
        httpAction(this.url.refund,formData,'post').then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.$emit('ok');
            this.loadData();
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      handleExportXls(fileName){
        this.isDisable = true;
        if(!fileName || typeof fileName != "string"){
          fileName = "导出文件"
        }
        let param = {...this.queryParam};
        if(this.selectedRowKeys && this.selectedRowKeys.length>0){
          param['selections'] = this.selectedRowKeys.join(",")
        }
        console.log("导出参数",param)
        downFile(this.url.exportXlsUrl,param).then((data)=>{
          setTimeout(() => {
            this.isDisable = false;
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
          },1000)

        })
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
  .divcss5{ border-style:solid; border-width:1px; border-color:#000}
</style>