<template>
  <a-card :bordered="false">
    <a-drawer
      title="群组列表"
      :width="screenWidth"
      @close="onClose"
      :visible="visible"
    >
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="12" :sm="10">
            <a-form-item label="群组id">
              <a-input placeholder="请输入群组id" v-model="queryParam.groupId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!--<a @click="handleToggleSearch" style="margin-left: 8px">-->
                <!--{{ toggleSearchStatus ? '收起' : '展开' }}-->
                <!--<a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
              <!--</a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls('iot_enterprise_operator_group')">导出</a-button>-->
      <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
        <!--<a-button type="primary" icon="import">导入</a-button>-->
      <!--</a-upload>-->
      <!--<a-dropdown v-if="selectedRowKeys.length > 0">-->
        <!--<a-menu slot="overlay">-->
          <!--<a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>-->
        <!--</a-menu>-->
        <!--<a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>-->
      <!--</a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <div style="margin-bottom: 16px;"></div>

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

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
              <a>删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click="handleDetails(record)">卡列表</a>

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

      </a-table>
    </div>
    </a-drawer>
    <iotEnterpriseOperatorGroup-modal ref="modalForm" @ok="modalFormOk"></iotEnterpriseOperatorGroup-modal>
    <card-list-modal ref="CardListModal" @ok="modalFormOk"></card-list-modal>
  </a-card>
</template>

<script>
  import {filterObj} from '@/utils/util';
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import IotEnterpriseOperatorGroupModal from './modules/IotEnterpriseOperatorGroupModal'
  import CardListModal from "../operator/modules/CardListModal"

  export default {
    name: "IotEnterpriseOperatorGroupList",
    mixins:[JeecgListMixin],
    components: {
      IotEnterpriseOperatorGroupModal,
      CardListModal
    },
    data () {
      return {
        form: this.$form.createForm(this),
        screenWidth: 1500,
        visible: false,
        model: {},
        operatorId:'',
        description: 'iot_enterprise_operator_group管理页面',
        // 表头
        columns: [
          // {
          //   title: '#',
          //   dataIndex: '',
          //   key:'rowIndex',
          //   width:60,
          //   align:"center",
          //   customRender:function (t,r,index) {
          //     return parseInt(index)+1;
          //   }
          // },
          // {
          //   title:'运营商',
          //   align:"center",
          //   dataIndex: 'operatorId'
          // },
          {
            title:'群组',
            align:"center",
            dataIndex: 'groupId'
          },
          {
            title:'群组名称',
            align:"center",
            dataIndex: 'groupName'
          },
          {
            title:'阈值',
            align:"center",
            dataIndex: 'criticalValue'
          },
          {
            title:'定时预警',
            align:"center",
            dataIndex: 'warning',
            customRender:(text)=>{
              if(text == 0){
                return '是'
              }else{
                return '否'
              }
            }
          },
          {
            title:'激活卡',
            align:"center",
            dataIndex: 'activeCard',
            customRender:(text)=>{
              if(text == 0){
                return '是'
              }else{
                return '否'
              }
            }
          },
          {
            title:'激活数量',
            align:"center",
            dataIndex: 'activeCardCount'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/enterprise/iotEnterpriseOperatorGroup/list",
          delete: "/enterprise/iotEnterpriseOperatorGroup/delete",
          deleteBatch: "/enterprise/iotEnterpriseOperatorGroup/deleteBatch",
          exportXlsUrl: "/enterprise/iotEnterpriseOperatorGroup/exportXls",
          importExcelUrl: "enterprise/iotEnterpriseOperatorGroup/importExcel",
        },
        dictOptions:{
         warning:[],
         activeCard:[],
        },
      }
    },
    created() {
      // 当页面初始化时,根据屏幕大小来给抽屉设置宽度
      this.resetScreenSize();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      // 添加字典数据
      handleAdd() {
        this.$refs.modalForm.add(this.operatorId);
        this.$refs.modalForm.title = "新增";
      },
      edit(record) {
        if (record.id) {
          this.operatorId = record.id;
        }
        this.queryParam = {}
        this.form.resetFields();
        // this.model = Object.assign({}, record);
        // this.model.operatorId = this.operatorId;
        this.queryParam.operatorId = this.operatorId;
        this.visible = true;
        // this.$nextTick(() => {
        //   this.form.setFieldsValue(pick(this.model, 'itemText', 'itemValue'))
        // });
        // 当其它模块调用该模块时,调用此方法加载字典数据
        this.loadData();
      },
      showDrawer() {
        this.visible = true
      },
      onClose() {
        this.visible = false
        this.form.resetFields();
        this.dataSource = [];
      },
      // 抽屉的宽度随着屏幕大小来改变
      resetScreenSize() {
        let screenWidth = document.body.clientWidth;
        if (screenWidth < 600) {
          this.screenWidth = screenWidth;
        } else {
          this.screenWidth = 600;
        }
      },
      handleDetails(record){
        this.$refs.CardListModal.edit(record);
        this.$refs.CardListModal.disableSubmit = true;
      }
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>