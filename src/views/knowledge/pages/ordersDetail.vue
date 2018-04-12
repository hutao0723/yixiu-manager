<template>
  <section class="dlv-main">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/goodsGroup' }">订单</el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="conbtent">
      <div class="tabel-content">
        <template>
          <div class="order-detail-table">
            <div class="page-content">
              <div class="page-table">
                <div class="order-detail-title mt40">订单</div>
                <table>
                  <thead>
                    <tr class="tr-header">
                      <th>订单ID</th>
                      <th class="w330">创建时间</th>
                      <th class="w255">订单金额(元)</th>
                      <th class="w320">订单状态</th>
                      <th>更新时间</th>
                      <th>备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{order.orderId}}</td>
                      <td>{{order.gmtCreate}}</td>
                      <td>{{order.orderAmt !== 0 && order.orderAmt !== undefined ? (order.orderAmt / 100).toFixed(2) : (order.orderAmt === 0 ? '0' : '')}}</td>
                      <td>{{order.orderStatus}}</td>
                      <td>{{order.gmtModified}}</td>
                      <td>{{order.remark}}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="order-detail-title">商品</div>
                <table>
                  <thead>
                    <tr class="tr-header">
                      <th>商品ID</th>
                      <th class="w155">货号</th>
                      <th class="w175">商品标题</th>
                      <th class="w255">商品规格</th>
                      <th class="w175">商品编码</th>
                      <th class="w145">商品价格(元)</th>
                      <th>商品成本(元)</th>
                      <th>件数(件)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{orderItem.itemId}}</td>
                      <td>{{orderItem.itemNo}}</td>
                      <td>{{orderItem.itemShortName}}</td>
                      <td>{{orderItem.skuName}}</td>
                      <td>{{orderItem.skuNo}}</td>
                      <td>{{orderItem.sellingPrice !== 0 && order.orderAmt !== undefined ? (orderItem.sellingPrice / 100).toFixed(2) : (orderItem.sellingPrice === 0 ? '0' : '')}}</td>
                      <td>{{orderItem.costPrice ? (orderItem.costPrice / 100).toFixed(2) : ''}}</td>
                      <td>{{orderItem.quantity}}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="order-detail-title">买家</div>
                <table>
                  <thead>
                    <tr class="tr-header">
                      <th>姓名</th>
                      <th class="w155">手机号</th>
                      <th class="w175">地区</th>
                      <th>地址</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{bullPosition.consumerName}}</td>
                      <td>{{bullPosition.mobile}}</td>
                      <td>{{bullPosition.areaNum}},{{bullPosition.province}}{{bullPosition.city}}{{bullPosition.district}}</td>
                      <td>{{bullPosition.address}}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="order-detail-title">物流</div>
                <table>
                  <thead>
                    <tr class="tr-header">
                      <th>物流订单ID</th>
                      <th class="w155">创建时间</th>
                      <th class="">物流公司</th>
                      <th class="w155">物流单号</th>
                      <th class="w100">物流状态</th>
                      <th class="w175">更新时间</th>
                      <th class="w145">物流子订单状态</th>
                      <th>订单状态更新时间</th>
                      <th>待发货订单ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span v-if="logisticsList && logisticsList.postId"  @click="getExpressDetail()">
                          <i class="bicon icon-fold" v-show="isFold">&#xe608;</i>
                          <i class="bicon icon-fold" v-show="!isFold">&#xe613;</i>
                        </span>
                        {{logisticsList.logisticsId}}</td>
                      <td>{{logisticsList.gmtCreate}}</td>
                      <td>{{logisticsList.logisticsName}}</td>
                      <td>{{logisticsList.postId}}</td>
                      <td>{{logisticsList.logisticsStatus}}</td>
                      <td>{{logisticsList.gmtModified}}</td>
                      <td>{{logisticsList.orderStatus}}</td>
                      <td>{{logisticsList.orderStatusModified}}</td>
                      <td>{{logisticsList.erpId}}</td>
                    </tr>
                    <tr v-if="!isFold" >
                      <td colspan="9">
                        <ul>
                          <li v-for="(item, index) in logisticsInfo" class="logistics-info">
                            <p class="upload-time">{{item.uploadTime}}</p>
                            <p>{{item.processInfo}}</p>
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="order-detail-title">售后</div>
                <table>
                  <thead>
                    <tr class="tr-header">
                      <th>售后子订单ID</th>
                      <th class="w330">创建时间</th>
                      <th class="w255">售后类型</th>
                      <th class="w175">售后原因</th>
                      <th class="w145">退款金额(元)</th>
                      <th>退款账号</th>
                      <th>状态</th>
                      <th>更新时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{afterSaleList.afterSaleId}}</td>
                      <td>{{afterSaleList.gmtCreate}}</td>
                      <td>{{afterSaleList.afterSaleType}}</td>
                      <td>{{afterSaleList.afterSaleReason}}</td>
                      <td>{{afterSaleList.refundAmt !== 0 && afterSaleList.refundAmt !== undefined ? (afterSaleList.refundAmt / 100).toFixed(2) : (afterSaleList.refundAmt === 0 ? '0' : '')}}</td>
                      <td>{{afterSaleList.account}}</td>
                      <td>{{afterSaleList.afterSaleStatus}}</td>
                      <td>{{afterSaleList.gmtModified}}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="order-detail-title">防作弊</div>
                <table>
                  <thead>
                    <tr class="tr-header">
                      <th>命中规则</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{anticheateList}}</td>
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
        params: {
          orderId: ''
        },
        order: {}, // 订单
        orderItem: {}, // 商品
        bullPosition: {}, // 买家
        erpOrderList: {}, // 待发货
        logisticsList: {}, // 物流
        afterSaleList: {}, // 售后
        anticheateList: [], // 防作弊
        isFold: true,
        logisticsInfo: []
      }
    },
    mounted() {
      this.params.orderId = this.$route.query.id
      if (this.params.orderId) {
        this.getDetail()
      }
      console.log(this.$store)
    },
    methods: {
      // 订单详情
      getDetail() {
        this.$http.post('/order/detail', this.params, {emulateJSON: false}).then(res => {
          res = res.body;
          if (res.success) {
            let data = res.data;
            this.order = data.order || {};
            this.orderItem = data.orderItem || {};
            this.bullPosition = data.bullPosition || {};
            this.erpOrderList = data.erpOrderList[0] || {};
            this.logisticsList = data.logisticsList[0] || {};
            this.afterSaleList = data.afterSaleList[0] || {};
            this.anticheateList = data.anticheateList.length && data.anticheateList.join(',') || '';
          }
        }, e => {
          console.log(e)
        });
      },
      getExpressDetail() {
        this.isFold = !this.isFold;
        if (!this.isFold) {
          let params = {
            logisticsCode: this.logisticsList.logisticsCode,
            postId: this.logisticsList.postId
          }
          this.$http.post('/logistics/query/processInfo', params, {emulateJSON: false}).then(res => {
            res = res.body;
            if (res.success) {
              this.logisticsInfo = res.data;
            } else {
              let msg = resp.desc || '请求失败'
              this.$message.error(msg)
            }
          }, e => {
            console.log(e)
            let msg = resp.desc || '网络错误'
            this.$message.error(msg)
          });
        }
      }
    }
  }
</script>
<style lang="less">
  .order-detail-table {
    table {
      min-width: 1450px;
    }

    .icon-fold{
      font-size: 10px; 
      margin-left:-20px; 
      margin-right: 5px;
      &:hover{
        cursor: pointer;
      }
    }
    .tr-header {
      height: 40px;
      line-height: 40px;
      background-color: #ededed;
      th {
        color: #666;
        padding: 0;
        &:first-child {
          padding-left: 40px;
          width: 260px;
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
    .order-detail-title {
      height: 21px;
      line-height: 21px;
      font-size: 14px;
      text-align: left;
      color: #666666;
      margin: 6px  0 5px 0 ;
    }
    .mt40 {
      margin-top: 40px;
    }
    td {
      height: 38px;
      line-height: 38px;
      font-size: 12px;
      color: #666;
      &:first-child {
        padding-left: 40px;
      }
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
