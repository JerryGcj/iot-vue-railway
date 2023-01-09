<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col v-has="'userList:importExcelUrl'" :md="5" :sm="8">
            <a-form-item  label="企业" >
              <j-tree-select
                v-model="queryParam.id"
                placeholder="请选择客户"
                dict="sys_user,user_company,id"
                pidField="create_by_id"
                pidValue=""
                />
            </a-form-item>
          </a-col>

          <a-col v-has="'userList:selectCustomerIdDls'" :md="5" :sm="8">
            <a-form-item label="客户">
              <a-select v-model="queryParam.id"
                        placeholder="请选择客户">
                <a-select-option v-for="d in userData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="8">
            <a-form-item label="用户账号">
              <a-input placeholder="用户账号" v-model="queryParam.username"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="6">
            <a-form-item label="企业名称">
              <a-input placeholder="企业名称" v-model="queryParam.userCompany"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="6">
            <a-form-item label="用户状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">冻结</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button v-has="'user:add'" @click="handleAdd" type="primary" icon="plus">添加用户</a-button>
      <a-button v-has="'user:addDls'" @click="handleUserModalDls" type="primary" icon="plus">添加用户</a-button>
      <a-button v-has="'user:export'" type="primary" icon="download" @click="handleExportXls('用户信息')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button v-has="'user:imports'" type="primary" icon="import">导入</a-button>
      </a-upload>
      <!--<a-dropdown v-if="selectedRowKeys.length > 0">-->
        <!--<a-menu slot="overlay" @click="handleMenuClick">-->
          <!--<a-menu-item key="1">-->
            <!--<a-icon type="delete" @click="batchDel"/>-->
            <!--删除-->
          <!--</a-menu-item>-->
          <!--<a-menu-item key="2">-->
            <!--<a-icon type="lock" @click="batchFrozen('2')"/>-->
            <!--冻结-->
          <!--</a-menu-item>-->
          <!--<a-menu-item key="3">-->
            <!--<a-icon type="unlock" @click="batchFrozen('1')"/>-->
            <!--解冻-->
          <!--</a-menu-item>-->
        <!--</a-menu>-->
        <!--<a-button style="margin-left: 8px">-->
          <!--批量操作-->
          <!--<a-icon type="down"/>-->
        <!--</a-button>-->
      <!--</a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">

        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user"/>
          </div>
        </template>
        <template slot="showPrice" slot-scope="text, record, index">
          <a-switch checkedChildren="是" unCheckedChildren="否" v-model="record.showPrice" @change="priceChange" @click="priceSwitch(record.id)" />
        </template>
        <template slot="showUsage" slot-scope="text, record, index">
          <a-switch checkedChildren="是" unCheckedChildren="否" v-model="record.showUsage" @change="usageChange" @click="usageSwitch(record.id)" />
        </template>
        <template slot="autoDeduction" slot-scope="state">
          <a-tag v-if="state==0" color="red">否</a-tag>
          <a-tag v-if="state==1" color="green">是</a-tag>
        </template>
        <span slot="action" slot-scope="text, record">
          <a v-has="'user:edit'" @click="handleEdit(record)">编辑</a>

          <a v-has="'user:editDls'" @click="handleUserModalDlsEdit(record)">编辑</a>
          <a-divider type="vertical"/>

          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <!--<a-menu-item>-->
                <!--<a href="javascript:;" @click="handleDetail(record)">详情</a>-->
              <!--</a-menu-item>-->

              <!--<a-menu-item>-->
                <!--<a href="javascript:;" @click="handleChangePassword(record.username)">密码</a>-->
              <!--</a-menu-item>-->

              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a v-has="'user:delete'">删除</a>
                </a-popconfirm>
              </a-menu-item>

              <!--<a-menu-item v-if="record.status==1">-->
                <!--<a-popconfirm title="确定冻结吗?" @confirm="() => handleFrozen(record.id,2,record.username)">-->
                  <!--<a>冻结</a>-->
                <!--</a-popconfirm>-->
              <!--</a-menu-item>-->

              <!--<a-menu-item v-if="record.status==2">-->
                <!--<a-popconfirm title="确定解冻吗?" @confirm="() => handleFrozen(record.id,1,record.username)">-->
                  <!--<a>解冻</a>-->
                <!--</a-popconfirm>-->
              <!--</a-menu-item>-->

              <!--<a-menu-item>-->
                <!--<a href="javascript:;" @click="handleAgentSettings(record.username)">代理人</a>-->
              <!--</a-menu-item>-->

            </a-menu>
          </a-dropdown>
        </span>


      </a-table>
    </div>
    <!-- table区域-end -->

    <user-modal ref="modalForm" @ok="modalFormOk"></user-modal>

    <password-modal ref="passwordmodal" @ok="passwordModalOk"></password-modal>

    <sys-user-agent-modal ref="sysUserAgentModal"></sys-user-agent-modal>

    <user-modal-dls ref="UserModalDls" @ok="modalFormOk"></user-modal-dls>
    <auto-deduction-modal ref="autoDeductionModal" @ok="modalFormOk"></auto-deduction-modal>
  </a-card>
</template>

<script>
  import UserModal from './modules/UserModal'
  import PasswordModal from './modules/PasswordModal'
  import {putAction,getAction} from '@/api/manage';
  import {frozenBatch,queryLowerAgent} from '@/api/api'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import SysUserAgentModal from "./modules/SysUserAgentModal";
  import JInput from '@/components/jeecg/JInput'
  import UserModalDls from "./modules/UserModalDls";
  import JTreeSelect from '@/components/jeecg/JTreeSelect'
  import AutoDeductionModal from "./modules/AutoDeductionModal";


  export default {
    name: "UserList",
    mixins: [JeecgListMixin],
    components: {
      UserModalDls,
      SysUserAgentModal,
      UserModal,
      PasswordModal,
      JInput,
      JTreeSelect,
      AutoDeductionModal
    },
    data() {
      return {
        description: '这是用户管理页面',
        queryParam: {},
        userData:[],
        userName: '',
        priceChecked: "",
        usageChecked: "",
        columns: [
          {
            title: '用户账号',
            align: "center",
            dataIndex: 'username',
            width: 100
          },
          {
            title: '企业名称',
            align: "center",
            width: 160,
            dataIndex: 'userCompany',
          },
          {
            title: '用户类型',
            align: "center",
            width: 100,
            dataIndex: 'userType',
            customRender:function (text) {
                if(text=='0'){
                  return "内部用户";
                }else if(text=="1"){
                  return "代理商";
                }else if(text=="2"){
                  return "合伙人";
                }else if(text=="3"){
                  return "企业用户";
                } else {
                  return text;
                }
            }
          },
          {
            title: '状态',
            align: "center",
            width: 80,
            dataIndex: 'status_dictText',
          },
          {
            title: '创建人',
            align: "center",
            width: 80,
            dataIndex: 'createBy',
          },
          {
            title: '创建时间',
            align: "center",
            width: 120,
            dataIndex: 'createTime',
            sorter: true
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: "center",
            width: 130
          }
        ],
        url: {
          imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
          syncUser: "/process/extActProcess/doSyncUser",
          list: "/sys/user/list",
          delete: "/sys/user/delete",
          deleteBatch: "/sys/user/deleteBatch",
          exportXlsUrl: "/sys/user/exportXls",
          importExcelUrl: "sys/user/importExcel",
          getUserIdByTokenUrl:"sys/user/getUserId",
          priceSwitch: "/sys/user/priceSwitch",
          usageSwitch: "/sys/user/usageSwitch"
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        this.getUserId();//查询当前登陆的账号
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
            this.userName = res.result.username;
          }
        });
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      getUserId(){
        let params = {}
        //获取当前登陆用户的信息
        getAction(this.url.getUserIdByTokenUrl, params).then((res) => {
          if (res.success) {
            this.pidValue=res.result;
            console.log(this.pidValue)
          }
        });
      },
      handleUserModalDls: function () {
        this.$refs.UserModalDls.add();
        this.$refs.UserModalDls.title = "添加用户";
        this.$refs.UserModalDls.disableSubmit = false;
      },
      handleUserModalDlsEdit: function (record) {
        this.$refs.UserModalDls.edit(record);
        this.$refs.UserModalDls.title = "编辑用户";
        this.$refs.UserModalDls.disableSubmit = false;
      },
      autoDeduction: function (record) {
        this.$refs.autoDeductionModal.edit(record);
        this.$refs.autoDeductionModal.title = "设置自动扣费";
        this.$refs.autoDeductionModal.disableSubmit = false;
      },
      priceChange(checked) {
        this.priceChecked = checked;
      },
      usageChange(checked) {
        this.usageChecked = checked;
      },
      priceSwitch(id){
        const that = this;
        putAction(this.url.priceSwitch,{priceChecked: this.priceChecked,id: id}).then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.$emit('ok');
            this.initData();
          }else{
            that.$message.warning(res.message);
          }
        });
      },
      usageSwitch(id){
        const that = this;
        putAction(this.url.usageSwitch,{usageChecked: this.usageChecked,id: id}).then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.$emit('ok');
            this.initData();
          }else{
            that.$message.warning(res.message);
          }
        });
      },

      getAvatarView: function (avatar) {
        return this.url.imgerver + "/" + avatar;
      },

      batchFrozen: function (status) {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return false;
        } else {
          let ids = "";
          let that = this;
          let isAdmin = false;
          that.selectionRows.forEach(function (row) {
            if (row.username == 'admin') {
              isAdmin = true;
            }
          });
          if (isAdmin) {
            that.$message.warning('管理员账号不允许此操作,请重新选择！');
            return;
          }
          that.selectedRowKeys.forEach(function (val) {
            ids += val + ",";
          });
          that.$confirm({
            title: "确认操作",
            content: "是否" + (status == 1 ? "解冻" : "冻结") + "选中账号?",
            onOk: function () {
              frozenBatch({ids: ids, status: status}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.loadData();
                  that.onClearSelected();
                } else {
                  that.$message.warning(res.message);
                }
              });
            }
          });
        }
      },

      handleMenuClick(e) {
        if (e.key == 1) {
          this.batchDel();
        } else if (e.key == 2) {
          this.batchFrozen(2);
        } else if (e.key == 3) {
          this.batchFrozen(1);
        }
      },
      handleFrozen: function (id, status, username) {
        let that = this;
        //TODO 后台校验管理员角色
        if ('admin' == username) {
          that.$message.warning('管理员账号不允许此操作！');
          return;
        }
        frozenBatch({ids: id, status: status}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      handleChangePassword(username) {
        this.$refs.passwordmodal.show(username);
      },
      handleAgentSettings(username){
        this.$refs.sysUserAgentModal.agentSettings(username);
        this.$refs.sysUserAgentModal.title = "用户代理人设置";
      },
      passwordModalOk() {
        //TODO 密码修改完成 不需要刷新页面，可以把datasource中的数据更新一下
      },
    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
