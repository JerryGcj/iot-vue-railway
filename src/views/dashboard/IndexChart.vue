<template>
  <div class="page-header-index-wide">
    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <!--<div class="extra-item">
              <a>今日</a>
              <a>本周</a>
              <a>本月</a>
              <a>本年</a>
            </div>-->
           <!-- <j-date v-model="jdate" dateFormat="YYYY-MM"/>-->
            <div class="extra-item">
              <a-select allowClear="true" placeholder="账号" style="width: 120px" @change="handleChange">
                <a-select-option v-for="d in userData" :key="d.value" :value="d.value">{{d.text}}</a-select-option>
              </a-select>
            </div>
            <div class="extra-item">
              <a-select allowClear="true" placeholder="卡类型" style="width: 120px" @change="typeChange">
                <a-select-option value="0">全网</a-select-option>
                <a-select-option value="1">省网</a-select-option>
              </a-select>
            </div>
            <a-month-picker placeholder="请选择月份" @change="onChange" />
          </div>
          <a-tab-pane loading="true" tab="电信卡" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar title="流量池用量M(当月)" :dataSource="barData"/>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="卡用量排行榜(当月)" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
         <!-- <a-tab-pane tab="访问量" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar title="销售额趋势" :dataSource="barData"/>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="门店销售排行榜" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>-->
        </a-tabs>
      </div>
      <renewal-modal ref="renewalModal" @ok="modalFormOk"></renewal-modal>
      <mobile-expire-list-modal ref="mobileExpireListModal" @ok="modalFormOk"></mobile-expire-list-modal>
      <telecom-expire-list-modal ref="telecomExpireListModal" @ok="modalFormOk"></telecom-expire-list-modal>
    </a-card>

    <!--<a-row v-has="'iot:admin'">
      <a-col :span="24">
        <a-card :loading="loading" :bordered="false" title="订单量" :style="{ marginTop: '24px' }">
          <a-row>

            <a-col :span="6">
              <head-info title="今日订单量" :content="loginfo.todayCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="team" style="font-size: 24px"  />
              </a-spin>
            </a-col>
            <a-col :span="6">
              <head-info title="近7天总订单量" :content="loginfo.totalCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="rise" style="font-size: 24px"  />
              </a-spin>
            </a-col>
          </a-row>
          <line-chart-multid :fields="visitFields" :dataSource="visitInfo"></line-chart-multid>
        </a-card>
      </a-col>
    </a-row>-->
  </div>
</template>

<script>
  import ChartCard from '@/components/ChartCard'
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import MiniArea from '@/components/chart/MiniArea'
  import MiniBar from '@/components/chart/MiniBar'
  import MiniProgress from '@/components/chart/MiniProgress'
  import RankList from '@/components/chart/RankList'
  import Bar from '@/components/chart/Bar'
  import LineChartMultid from '@/components/chart/LineChartMultid'
  import HeadInfo from '@/components/tools/HeadInfo.vue'
  import Trend from '@/components/Trend'
  import {getLoginfo, getVisitInfo, queryLowerAgent} from '@/api/api'
  import { getAction,deleteAction,putAction,postAction} from '@/api/manage'
  import JDate from '@/components/jeecg/JDate'
  import RenewalModal from "../iot/customerrenewalrecord/modules/RenewalModal";
  import MobileExpireListModal from "./modules/MobileExpireListModal";
  import TelecomExpireListModal from "./modules/TelecomExpireListModal";

  export default {
    name: "IndexChart",
    components: {
      ATooltip,
      ACol,
      ChartCard,
      MiniArea,
      MiniBar,
      MiniProgress,
      RankList,
      Bar,
      Trend,
      LineChartMultid,
      HeadInfo,
      JDate,
      RenewalModal,
      MobileExpireListModal,
      TelecomExpireListModal,
      queryLowerAgent
    },
    data() {
      return {
        userData:[],
        oneRow:{
          //销售额统计
          sumMoney:'',
          cardList:[],
          cardListGroup:[],
          telecomCardGroup:[],
          //支付统计
          sumCount:'',
          allMchsCount:[],
          //移动卡数量统计：
          cardSumCount:'',
          silentCount:'',
          activeCount:'',
          stopCount:'',
          //联通卡数量统计
          unicomCardSumCount:'',
          unicomSilentCount:'',
          unicomActiveCount:'',
          unicomStopCount:'',

        },
        monthDate:'',
        operatorType:'',
        userId:'',
        cardType:'',
        jdate:'',
        loading: true,
        center: null,
        rankList:[],
        barData:[],
        loginfo:{},
        visitFields:['数量'],
        visitInfo:[],
        indicator: <a-icon type="loading" style="font-size: 24px" spin />,
        url: {
          getBarDataUrl: "/telecomcardinformation/telecomCardInformation/barDatalist",
          getRankListUrl:"dashboard/rankList",
          getCardNumUrl:"/order/order/cardNum",
          getCardNumByOperatorUrl:"/order/order/cardNumByOperator",
          renewal: "/customerrenewalrecord/customerRenewalRecord/renewal"
        }
      }
    },
    created() {
      setTimeout(() => {
        this.loading = !this.loading
      }, 1000)
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
      //this.initLogInfo();
      //this.getOneRowData();
      /*let dataString="";
      let operatorType="";*/
      this.initBarData(this.userId,this.cardType,this.monthDate,"3");
      this.initRankList(this.userId,this.cardType,this.monthDate,"3");
    },
    methods: {
      getOneRowData(){
        getAction("dashboard/oneRowData").then((res)=>{
          if(res.success){
            //交易额
            //this.oneRow.cardList = res.result.cardList;
            this.oneRow.cardListGroup = res.result.cardListGroup;
            this.oneRow.telecomCardGroup = res.result.telecomCardGroup;
            //支付笔数
            this.oneRow.allMchsCount = res.result.allMchsCount;
            this.oneRow.sumCount = res.result.sumCount;
            //卡数量
            this.oneRow.cardSumCount = res.result.cardSumCount;
            this.oneRow.silentCount = res.result.silentCount;
            this.oneRow.activeCount = res.result.activeCount;
            this.oneRow.stopCount = res.result.stopCount;
            //联通卡
            this.oneRow.unicomCardSumCount = res.result.unicomCardSumCount;
            this.oneRow.unicomSilentCount = res.result.unicomSilentCount;
            this.oneRow.unicomActiveCount = res.result.unicomActiveCount;
            this.oneRow.unicomStopCount = res.result.unicomStopCount;
          }
        })
      },
      initLogInfo () {
        /*getLoginfo(null).then((res)=>{
          if(res.success){
            Object.keys(res.result).forEach(key=>{
              res.result[key] =res.result[key]+""
            })
            this.loginfo = res.result;
          }
        })*/
       /* getVisitInfo().then(res=>{
          if(res.success){
             console.log("aaaaaa",res.result)
             this.visitInfo = res.result;
           }
         })*/
        let params={};
        getAction(this.url.getCardNumUrl,params).then((res)=>{
          if(res.success){
            Object.keys(res.result).forEach(key=>{
              res.result[key] =res.result[key]+""
            })
            this.loginfo = res.result;
          }
        })
        getAction(this.url.getCardNumByOperatorUrl,params).then((res)=>{
          if(res.success){
            console.log("aaaaaa",res.result)
            this.visitInfo = res.result;
          }
        })
      },
      initBarData(userId,cardType,dataString,operatorType){
        let params={userId:userId,cardType:cardType,dataString:dataString,operatorType:operatorType};
        getAction(this.url.getBarDataUrl,params).then((res)=>{
          if(res.success){
            for (let i = 0; i < res.result.length; i++) {
              this.barData.push({
                x: res.result[i].transfer+'',
                y: res.result[i].value
              })
            }
          }
        })

      },
      initRankList(userId,cardType,dataString,operatorType){
        let params={userId:userId,cardType:cardType,dataString:dataString,operatorType:operatorType};
        getAction(this.url.getRankListUrl,params).then((res)=>{
          if(res.success){
            console.log(res.result)
            for (let i = 0; i < res.result.length; i++) {
              this.rankList.push({
                name: res.result[i].transfer,
                total:res.result[i].value+'M'
              })
            }
          }
        })

      },
      onChange(date, dateString) {
        this.barData=[];
        this.rankList=[];
        this.monthDate=dateString;
        this.initBarData(this.userId,this.cardType,this.monthDate,"3");
        this.initRankList(this.userId,this.cardType,this.monthDate,"3");
      },
      handleChange(value) {
        console.log(`selected ${value}`);
        this.barData=[];
        this.rankList=[];
        this.userId=value;
        this.initBarData(this.userId,this.cardType,this.monthDate,"3");
        this.initRankList(this.userId,this.cardType,this.monthDate,"3");
      },
      typeChange(value) {
        console.log(`selected ${value}`);
        this.barData=[];
        this.rankList=[];
        this.cardType=value;
        this.initBarData(this.userId,this.cardType,this.monthDate,"3");
        this.initRankList(this.userId,this.cardType,this.monthDate,"3");
      },
      expireDetails(record){
        this.$refs.mobileExpireListModal.edit(record);
        this.$refs.mobileExpireListModal.disableSubmit = true;
      },
      expireTeleDetails(record){
        this.$refs.telecomExpireListModal.edit(record);
        this.$refs.telecomExpireListModal.disableSubmit = true;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .circle-cust{
    position: relative;
    top: 28px;
    left: -100%;
  }
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  /* 首页访问量统计 */
  .head-info {
    position: relative;
    text-align: left;
    padding: 0 32px 0 0;
    min-width: 125px;

    &.center {
      text-align: center;
      padding: 0 32px;
    }

    span {
      color: rgba(0, 0, 0, .45);
      display: inline-block;
      font-size: .95rem;
      line-height: 42px;
      margin-bottom: 4px;
    }
    p {
      line-height: 42px;
      margin: 0;
      a {
        font-weight: 600;
        font-size: 1rem;
      }
    }
  }
</style>