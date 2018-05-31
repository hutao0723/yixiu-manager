<template>
  <section class="dlv-main order-deatil-box">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/order' }">订单</el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="conbtent">
      <div class="tabel-content">
        <template>
          <div class="order-detail-table">
            <div class="page-content">
              <div class="page-table">
                <div class="order-detail-title">买家</div>
                <table class="table-list">
                  <thead>
                    <tr class="tr-header">
                      <th class="w255">买家ID</th>
                      <th>买家信息</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {{detailList.consumerId}}
                      </td>
                      <td>
                        <div class="clearfix">
                          <div class="img-container">
                            <img :src="detailList.headimgurl" v-if="detailList.headimgurl"> 
                          </div> 
                          <span class="goods-word">{{detailList.nickname}}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table> 
                <div class="order-detail-title">商品</div>
                <table class="table-list goods">
                  <thead>
                    <tr class="tr-header">
                      <th class="w255">商品信息</th>
                      <th class="w255">单价</th>
                      <th class="w155">数量</th>
                      <th class="w155">总价(元)</th>
                      <th class="w175">讲师抽成比例(%)</th>
                      <th class="w175">分销抽成比例(%)</th>
                      <th>商品类型</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div class="clearfix">
                          <!-- <div class="img-container">
                            <img :src="orderItems.itemImage" v-if="orderItems.itemImage"> 
                          </div>  -->
                          <div v-if="orderItems.itemImage" class="img-box" v-bind:style="{backgroundImage:'url('+orderItems.itemImage+')',backgroundSize: 'contain',backgroundPosition: 'center'}"></div>
                          <div  v-else class="img-box" v-bind:style="{backgroundImage:'url(//yun.dui88.com/yoofans/images/201804/noClassImg.png)',backgroundSize: 'contain',backgroundPosition: 'center'}"></div>
                          <span class="info-ellipis">{{orderItems.itemName}}</span>
                        </div>
                      </td>
                      <td>{{singlePrice ? singlePrice: ''}}</td>
                      <td>{{orderItems.itemNum ? orderItems.itemNum: ''}}</td>
                      <td>{{totalPrice ? totalPrice: ''}}</td>
                      <td>{{orderItems.lecturerRate ? (orderItems.lecturerRate / 100).toFixed(2) : ''}}</td>
                      <td>{{detailList.distributeRate ? (detailList.distributeRate / 100).toFixed(2) : ''}}</td>
                      <td>{{orderItems.type}}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="order-detail-title">订单</div>
                <table class="table-list">
                  <thead>
                    <tr class="tr-header">
                      <th class="w255">订单号</th>
                      <th class="w255">订单创建时间</th>
                      <th class="w155">订单金额</th>
                      <th class="w155">订单状态</th>
                      <th class="w155">订单类型</th>
                      <th>支付完成时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{detailList.orderId}}</td>
                      <td>{{detailList.gmtCreate}}</td>
                      <td>{{detailList.amount? (detailList.amount / 100).toFixed(2) : ''}}</td>
                      <td>{{detailList.orderStatus}}</td>
                      <td>{{detailList.orderType}}</td>
                      <td>{{detailList.finishTime}}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="order-detail-title">资金</div>
                <table class="table-list">
                  <thead>
                    <tr class="tr-header">
                      <th class="w255">资金单号</th>
                      <th class="w175">订单创建时间</th>
                      <th class="w145">资金类型</th>
                      <th class="w145">付款方式</th>
                      <th class="w145">付款金额</th>
                      <th class="w175">付款完成时间</th>
                      <th>交易单号</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{orderFunds.fundId}}</td>
                      <td>{{orderFunds.gmtCreate}}</td>
                      <td>{{orderFunds.bizType}}</td>
                      <td>{{orderFunds.payType}}</td>
                      <td>{{orderFunds.amount ? (orderFunds.amount / 100).toFixed(2) : ''}}</td>
                      <td>{{orderFunds.finishTime}}</td>
                      <td>{{orderFunds.outSeqNo}}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="order-detail-title">渠道</div>
                <table class="table-list">
                  <thead>
                    <tr class="tr-header">
                      <th class="w255">渠道ID</th>
                      <th class="w255">推广位ID</th>
                      <th>渠道抽成比例(%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{detailList.channelId}}</td>
                      <td>{{detailList.adzoneId}}</td>
                      <td>{{detailList.channelRate ? (detailList.channelRate / 100).toFixed(2) : ''}}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="order-detail-title">讲师</div>
                <table class="table-list">
                  <thead>
                    <tr class="tr-header">
                      <th class="w255">讲师ID</th>
                      <th>讲师昵称</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{detailList.lecturerId}}</td>
                      <td>{{detailList.lecturerName}}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="order-detail-title">分销员</div>
                <table class="table-list">
                  <thead>
                    <tr class="tr-header">
                      <th class="w255">分销员ID</th>
                      <th>分销员昵称</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{detailList.distributorId}}</td>
                      <td>{{detailList.distributorName}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        detailList: {},
        orderItems: {},
        orderFunds: {},
        totalPrice: null,
        singlePrice: null
      }
    },
    mounted() {
      this.getDetail()
    },
    methods: {
      // 订单详情
      getDetail() {
        let id = this.$route.params.id
        let params  = {
          id: id
        }
        this.$http.get('/knowledge/order/detail', {params}).then(res => {
          let resp = res.data
          if (resp.success) {
            this.detailList = resp.data
            if(Object.keys(resp.data).length == 0){
              return 
            }
            if(resp.data.orderItems != undefined){
              this.orderItems = resp.data.orderItems[0] || {}
              this.orderItems.itemNum = this.orderItems.itemNum ? this.orderItems.itemNum: 0
              this.singlePrice = this.orderItems.itemPrice ? ((this.orderItems.itemPrice / 100).toFixed(2)) : 0
              this.totalPrice = (this.orderItems.itemNum  * this.singlePrice).toFixed(2)
            }
            if(resp.data.orderItems != undefined){
              this.orderFunds = resp.data.orderFunds[0] || {}
            }
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        }, e => {
          console.log(e)
        });
      }
    }
  }
</script>
<style lang="less">
  .title-wrap {
    width: 100%;
    height: 30px;
    border-bottom: 1px dotted #ccc;
    position: relative;
    .el-breadcrumb {
      position: absolute;
      left: 0;
      bottom: 10px;
      font-size: 16px;
    }
  }
  .order-detail-table {
    table {
      min-width: 900px;
    }

    .icon-fold{
      font-size: 10px; 
      margin-left:-20px; 
      margin-right: 5px;
      &:hover{
        cursor: pointer;
      }
    }
    .table-list{
      border:1px solid #ebeef5;
      .tr-header {
        height: 40px;
        line-height: 40px;
        background-color: #F5F7FA;
        th {
          padding: 0;
          color: #909399;
          font-weight: bold;
          &:first-child {
            padding-left: 10px;
          }
      }
      .w330 {
        width: 330px;
      }
      .w320 {
        width: 320px;
      }
      .w255 {
        width: 255px;
      }
      .w175 {
        width: 175px;
      }
      .w155 {
        width: 155px;
      }
      .w145 {
        width: 145px;
      }
      .w130 {
        width: 130px;
      }
      .w125 {
        width: 125px;
      }
      .w100 {
        width: 100px;
      }
    }
    }
    .goods{
      td{
        line-height: 75px!important;
      }
    }
    .order-detail-title {
      height: 21px;
      line-height: 21px;
      font-size: 18px;
      text-align: left;
      color: #303133;
      margin: 20px 0  10px 10px;
    }
    .mt40 {
      margin-top: 40px;
    }
    td {
      height: 38px;
      line-height: 38px;
      font-size: 14px;
      color: #666;
      &:first-child {
        padding-left: 10px;
      }
    }
    .img-container{
      height: 38px;
      width: 38px;
      position: relative;
      display: inline-block;
      line-height:38px;
      float: left;
      img{
        height: 30px;
        width: 30px;
        vertical-align: middle;
      }
    }
    .goods-word{
      margin-left: 10px;
      line-height: 38px;
    }
    .info-ellipis{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      display:inline-block;
      width: 140px;
      float: left;
      margin-left: 10px;
      line-height: 75px;
    }
    .img-box{
      overflow: hidden;
      width: 75px;
      height: 75px;
      display: inline-block;
      float: left;
      background-repeat: no-repeat;
    }
    .logistics-info{
      display: flex;
      flex-direction: row;
      align-items: center;
      .upload-time{
        width: 190px;
      }
    }
  }

</style>
