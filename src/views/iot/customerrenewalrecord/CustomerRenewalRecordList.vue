<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="卡号">
              <a-input placeholder="请输入卡号" v-model="queryParam.iccid"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="10" :sm="12">
            <a-form-item label="续费时间">
              <j-date placeholder="请选择开始日期" class="query-group-cust" date-format="YYYY-MM-DD 00:00:00" v-model="queryParam.createTime_begin"></j-date>
              <span class="query-group-split-cust"></span>
              <j-date placeholder="请选择结束日期" class="query-group-cust" date-format="YYYY-MM-DD 23:59:59" v-model="queryParam.createTime_end"></j-date>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a-button type="primary" icon="download" @click="handleExportXls('续费记录')" style="margin-left: 8px">导出</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    <div style="display: none" class="table-operator">
      <a-button type="primary" v-has="'enterpriseCardInformationList:import'" :action="importExcelUrl" icon="import" @click="handleCardImport">卡导入</a-button>
    </div>
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

        @change="handleTableChange">

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

    <customerRenewalRecord-modal ref="modalForm" @ok="modalFormOk"></customerRenewalRecord-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import CustomerRenewalRecordModal from './modules/CustomerRenewalRecordModal'
  import JDate from '@/components/jeecg/JDate.vue'
  import {getAction} from '@/api/manage'

  export default {
    name: "CustomerRenewalRecordList",
    mixins:[JeecgListMixin],
    components: {
      JDate,
      CustomerRenewalRecordModal
    },
    data () {
      return {
        description: '续费记录管理页面',
        showPrice:'',
        userName:'',
        // 表头
        columns: [],
        defColumns: [
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
            title:'续费单号',
            align:"center",
            dataIndex: 'renewalNo'
          },
          {
            title:'卡号',
            align:"center",
            dataIndex: 'iccid'
          },
          {
            title:'扣费金额(元)',
            align:"center",
            dataIndex: 'cost'
          },
          {
            title:'续费前有效期',
            align:"center",
            dataIndex: 'beforeTime'
          },
          {
            title:'续费后有效期',
            align:"center",
            dataIndex: 'afterTime'
          },
          {
            title:'备注',
            align:"center",
            dataIndex: 'note'
          },
          {
            title:'续费时间',
            align:"center",
            dataIndex: 'createTime'
          }
        ],
        defColumns1: [
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
            title:'续费单号',
            align:"center",
            dataIndex: 'renewalNo'
          },
          {
            title:'卡号',
            align:"center",
            dataIndex: 'iccid'
          },
          {
            title:'续费前到期时间',
            align:"center",
            dataIndex: 'beforeTime'
          },
          {
            title:'续费后到期时间',
            align:"center",
            dataIndex: 'afterTime'
          },
          {
            title:'续费时间',
            align:"center",
            dataIndex: 'createTime'
          }
        ],
        url: {
          list: "/customerrenewalrecord/customerRenewalRecord/list",
          delete: "/customerrenewalrecord/customerRenewalRecord/delete",
          deleteBatch: "/customerrenewalrecord/customerRenewalRecord/deleteBatch",
          exportXlsUrl: "/customerrenewalrecord/customerRenewalRecord/exportXls",
          importExcelUrl: "customerrenewalrecord/customerRenewalRecord/importExcel",
        },
        dictOptions:{
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        getAction('/sys/user/queryUser').then((res) => {
          console.log(res)
          if (res.success) {
            this.showPrice = res.result.showPrice;
            this.userName = res.result.username;
          }
        });
        this.initColumns(this.showPrice,this.userName);
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
      },
      initColumns(showPrice,userName){
        //权限过滤（列权限控制时打开，修改第二个参数为授权码前缀）
        if(userName=='admin'){
          this.columns = this.defColumns;
        }else{
          if(showPrice==true){
            this.columns = this.defColumns;
          }else{
            this.columns = this.defColumns1;
          }
        }
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>