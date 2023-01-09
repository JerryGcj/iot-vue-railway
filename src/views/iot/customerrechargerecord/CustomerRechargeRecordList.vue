<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="5" :sm="6">
            <a-form-item label="订单号">
              <a-input placeholder="请输入订单号" v-model="queryParam.outTradeNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="6">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择状态">
                <a-select-option value="0">未支付</a-select-option>
                <a-select-option value="1">支付退出</a-select-option>
                <a-select-option value="2">充值异常</a-select-option>
                <a-select-option value="3">充值失败</a-select-option>
                <a-select-option value="4">充值成功</a-select-option>
                <a-select-option value="5">退款失败</a-select-option>
                <a-select-option value="6">退款成功</a-select-option>
                <a-select-option value="7">扣款成功</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="6">
            <a-form-item label="方式">
              <a-select v-model="queryParam.source" placeholder="请选择方式">
                <a-select-option value="0">二维码充值</a-select-option>
                <a-select-option value="1">人工充值</a-select-option>
                <a-select-option value="2">自动扣款</a-select-option>
                <a-select-option value="3">手动扣款</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="10" :sm="12">
            <a-form-item label="时间">
              <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间" class="query-group-cust" v-model="queryParam.createTime_begin"></j-date>
              <span class="query-group-split-cust"></span>
              <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间" class="query-group-cust" v-model="queryParam.createTime_end"></j-date>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a-button type="primary" icon="download" @click="handleExportXls('充值记录')" style="margin-left: 8px">导出</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div> -->

    <!-- table区域-begin -->
    <div>

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

        <template slot="status" slot-scope="state">
          <a-tag v-if="state==0" color="gray">未支付</a-tag>
          <a-tag v-if="state==1" color="cyan">支付退出</a-tag>
          <a-tag v-if="state==2" color="purple">充值异常</a-tag>
          <a-tag v-if="state==3" color="red">充值失败</a-tag>
          <a-tag v-if="state==4" color="green">充值成功</a-tag>
          <a-tag v-if="state==7" color="green">扣款成功</a-tag>
        </template>
        <template slot="classification" slot-scope="state">
          <a-tag v-if="state==0" color="green">收入</a-tag>
          <a-tag v-if="state==1" color="red">支出</a-tag>
        </template>
        <template slot="htmlSlot" slot-scope="text">
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
        </template>

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

    <customerRechargeRecord-modal ref="modalForm" @ok="modalFormOk"></customerRechargeRecord-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import CustomerRechargeRecordModal from './modules/CustomerRechargeRecordModal'
  import JDate from '@/components/jeecg/JDate.vue'

  export default {
    name: "CustomerRechargeRecordList",
    mixins:[JeecgListMixin],
    components: {
      JDate,
      CustomerRechargeRecordModal
    },
    data () {
      return {
        description: 'customer_recharge_record管理页面',
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
            title:'ICCID',
            align:"center",
            dataIndex: 'iccid'
          },
          {
            title:'订单号',
            align:"center",
            dataIndex: 'outTradeNo'
          },
          {
            title:'支付单号',
            align:"center",
            dataIndex: 'transactionId'
          },
          {
            title:'用户名',
            align:"center",
            dataIndex: 'userId'
          },
          {
            title:'企业名称',
            align:"center",
            dataIndex: 'userCompany'
          },
          {
            title:'金额(元)',
            align:"center",
            dataIndex: 'money'
          },
          {
            title:'状态',
            align:"center",
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title:'方式',
            align:"center",
            dataIndex: 'source',
            customRender:function (text) {
              if(text==0){
                return "二维码充值";
              }else if(text==1){
                return "人工充值";
              }else if(text==2){
                return "自动扣款";
              }else if(text==3){
                return "手动扣款";
              }else {
                return text;
              }
            }
          },
          {
            title:'分类',
            align:"center",
            dataIndex: 'classification',
            scopedSlots: { customRender: 'classification' }
          },
          {
            title:'备注',
            align:"center",
            dataIndex: 'note',
            width: 200
          },
          {
            title:'操作时间',
            align:"center",
            dataIndex: 'createTime'
          },
          /*{
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }*/
        ],
        url: {
          list: "/customerrechargerecord/customerRechargeRecord/list",
          delete: "/customerrechargerecord/customerRechargeRecord/delete",
          deleteBatch: "/customerrechargerecord/customerRechargeRecord/deleteBatch",
          exportXlsUrl: "/customerrechargerecord/customerRechargeRecord/exportXls",
          importExcelUrl: "customerrechargerecord/customerRechargeRecord/importExcel",
        },
        dictOptions:{
         status:[],
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
        initDictOptions('').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'status', res.result)
          }
        })
      }

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>