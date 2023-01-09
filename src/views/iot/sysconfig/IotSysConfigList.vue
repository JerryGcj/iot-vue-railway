<template>
  <a-card :bordered="false">

      <a-table
        :columns="columns"
        :dataSource="data"
        :pagination="false"
      >
        <template v-for="(col, i) in ['sysValue']" :slot="col" slot-scope="text, record, index">
            <a-input
              :key="col"
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns[i].title"
              @change="e => handleChange(e.target.value, record.id, col)"
            />
          <template v-else>{{ text }}</template>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <span v-if="record.isSwitch=='0'">
            <a-switch checkedChildren="on" unCheckedChildren="off" v-model="record.open" @change="onChange" @click="openSwitch(record.id)" />
          </span>
          <span v-else>
            <span v-if="record.editable">
              <a @click="saveRow(record)">保存</a>
              <a-divider type="vertical" />
              <a @click="cancel(record.id)">取消</a>
            </span>
            <span v-else>
              <a-button type="primary" :size="size" @click="() => editRow(record.id)">修改</a-button>
            </span>
          </span>
        </template>
      </a-table>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import IotSysConfigModal from './modules/IotSysConfigModal'
  import { putAction } from '@/api/manage'

  export default {
    name: "IotSysConfigList",
    mixins:[JeecgListMixin],
    components: {
      IotSysConfigModal
    },
    data () {
      return {
        description: 'iot_sys_config管理页面',
        data: [],
        ischecked: "",
        size: 'small',
        // 表头
        columns: [
          {
            title: '系统参数',
            dataIndex: 'sysDesc',
            width: '40%'
          },
          {
            title: '参数值',
            dataIndex: 'sysValue',
            width: '40%',
            scopedSlots: { customRender: 'sysValue' }
          },
          {
            title: '操作',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        url: {
          list: "/sysconfig/iotSysConfig/list",
          open: "/sysconfig/iotSysConfig/openById",
          deleteBatch: "/sysconfig/iotSysConfig/deleteBatch",
          exportXlsUrl: "/sysconfig/iotSysConfig/exportXls",
          importExcelUrl: "sysconfig/iotSysConfig/importExcel",
          edit: "/sysconfig/iotSysConfig/edit"
        },
        dictOptions:{
        },
      }
    },
    methods: {
      initData(){
         this.$http.get('/sysconfig/iotSysConfig/list', {}).then(res => {
          this.data =  res.result;
        })
      },
      remove (key) {
        const newData = this.data.filter(item => item.id !== key)
        this.data = newData
      },
      saveRow (record) {
        const that = this;
        putAction(this.url.edit,record).then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.$emit('ok');
          }else{
            that.$message.warning(res.message);
          }
        });
        let target = this.data.filter(item => item.id === record.id)[0]
        target.editable = false
      },
      editRow (key) {
        let target = this.data.filter(item => item.id === key)[0]
        target.editable = !target.editable
      },
      cancel (key) {
        let target = this.data.filter(item => item.id === key)[0]
        target.editable = false
      },
      handleChange (value, key, column) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.id)[0]
        if (target) {
          target[column] = value
          this.data = newData
        }
      },
      onChange(checked) {
        this.ischecked = checked;
      },
      openSwitch(id){
        const that = this;
        putAction(this.url.open,{ischecked: this.ischecked,id: id}).then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.$emit('ok');
            this.initData();
          }else{
            that.$message.warning(res.message);
          }
        });
      }
    },
    created() {
      this.initData();
    }
  }
</script>
<style scoped>
  .search {
    margin-bottom: 54px;
  }

  .fold {
    width: calc(100% - 216px);
    display: inline-block
  }

  .operator {
    margin-bottom: 18px;
  }

  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>