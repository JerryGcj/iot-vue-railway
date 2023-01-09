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
          <a-col :md="6" :sm="8">
            <a-form-item label="上游返回单号">
              <a-input placeholder="请输入上游返回单号"  v-model="queryParam.bizOrderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="来源">
              <a-select v-model="queryParam.source" placeholder="请选择来源">
                <a-select-option value="0">移动</a-select-option>
                <a-select-option value="1">联通</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="发生位置">
              <j-dict-select-tag v-model="queryParam.action" placeholder="请选择发生位置" dictCode="upstream_action"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择状态">
                <a-select-option value="0">处理失败</a-select-option>
                <a-select-option value="1">处理成功</a-select-option>
                <a-select-option value="2">失败丢弃</a-select-option>
                <a-select-option value="3">初始化</a-select-option>
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
    <!-- 查询区域-END -->
    

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
        <span slot="esContent" slot-scope="text">
          <j-ellipsis :value="text" :length="10" />
        </span>
        <!--<template slot="state" slot-scope="text, record">-->
          <!--<a-switch checkedChildren="已处理" unCheckedChildren="未处理" v-model="record.status" @change="onChanges" @click="updateSwitch(record.id)" />-->
        <!--</template>-->
        <template slot="status" slot-scope="status">
          <a-tag v-if="status==0" color="red">处理失败</a-tag>
          <a-tag v-if="status==1" color="green">处理成功</a-tag>
          <a-tag v-if="status==2" color="purple">失败丢弃</a-tag>
          <a-tag v-if="status==3" color="purple">初始化</a-tag>
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

    <iotOrderUpstream-modal ref="modalForm" @ok="modalFormOk"></iotOrderUpstream-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { putAction } from '@/api/manage'
  import JEllipsis from "@/components/jeecg/JEllipsis"
  import JTreeSelect from '@/components/jeecg/JTreeSelect'

  export default {
    name: "IotOrderUpstreamList",
    mixins:[JeecgListMixin],
    components: {
      JEllipsis,
      JTreeSelect
    },
    data () {
      return {
        description: 'iot_order_upstream管理页面',
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
            title:'卡号',
            align:"center",
            dataIndex: 'iccid'
          },
          {
            title:'订购情况',
            align:"center",
            dataIndex: 'errorMsg',
            scopedSlots: {customRender: 'esContent'},
          },
          {
            title:'操作目标',
            align:"center",
            dataIndex: 'mirror'
          },
          {
            title:'重试次数',
            align:"center",
            dataIndex: 'retryCount'
          },
          {
            title:'发生位置',
            align:"center",
            dataIndex: 'action_dictText'
          },
          {
            title:'来源',
            align:"center",
            dataIndex: 'source',
            customRender:function (text) {
              if(text=='0'){
                return "移动";
              }else if(text=="1"){
                return "联通";
              }else if(text=="3"){
                return "电信";
              } else {
                return text;
              }
            }
          },
          {
            title:'状态',
            align:"center",
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            title:'创建时间',
            align:"center",
            dataIndex: 'createTime',
            width: 200
          }
        ],
        url: {
          list: "/order/iotOrderUpstream/list",
          delete: "/order/iotOrderUpstream/delete",
          deleteBatch: "/order/iotOrderUpstream/deleteBatch",
          exportXlsUrl: "/order/iotOrderUpstream/exportXls",
          importExcelUrl: "order/iotOrderUpstream/importExcel",
          updateStatus: "/order/iotOrderUpstream/updateStatus"
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
      initDictConfig(){
      },
      onChanges(checked) {
        this.ischecked = checked;
      },
      updateSwitch(id){
        const that = this;
        putAction(this.url.updateStatus,{ischecked: this.ischecked,id: id}).then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.$emit('ok');
            this.initData();
          }else{
            that.$message.warning(res.message);
          }
        });
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>