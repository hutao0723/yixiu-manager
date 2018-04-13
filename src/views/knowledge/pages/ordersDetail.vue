<template>
  <section class="dlv-main">
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
<!--                 <table>
                  <thead>
                    <tr class="tr-header">
                      <th>买家信息</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{order.ordersInfo}}</td>
                    </tr>
                  </tbody>
                </table> -->
                <el-table :data="bull" style="width: 100%" border>
                  <el-table-column prop="ordersInfo" label="买家信息">
                    <template slot-scope="scope">
                        <img :src="scope.row.frontCover" alt="" class="goods-list-img fl">
                        <span v-text="scope.row.title" class="two-ellipsis"></span>
                      </template>
                  </el-table-column>
                </el-table>

                <div class="order-detail-title">商品</div>
                <!-- <table>
                  <thead>
                    <tr class="tr-header">
                      <th class="w255">商品信息</th>
                      <th class="w155">单价</th>
                      <th class="w175">数量</th>
                      <th class="w255">总价(元)</th>
                      <th class="w175">讲师抽成比例(%)</th>
                      <th>商品类型</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{goodsList.goodsInfo}}</td>
                      <td>{{goodsList.price}}</td>
                      <td>{{goodsList.number}}</td>
                      <td>{{goodsList.total}}</td>
                      <td>{{goodsList.rate}}</td>
                      <td>{{goodsList.goodsType}}</td>
                    </tr>
                  </tbody>
                </table> -->
                <el-table :data="goodsList" style="width: 100%" border>
                  <el-table-column prop="goodsInfo" label="商品信息"></el-table-column>
                  <el-table-column prop="price" label="单价"></el-table-column>
                  <el-table-column prop="number" label="数量"></el-table-column>
                  <el-table-column prop="total" label="总价(元)" ></el-table-column>
                  <el-table-column prop="rate" label="讲师抽成比例(%)" ></el-table-column>
                  <el-table-column prop="goodsType" label="商品类型" ></el-table-column>
                </el-table>

                <div class="order-detail-title">订单</div>
<!--                 <table>
                  <thead>
                    <tr class="tr-header">
                      <th>订单号</th>
                      <th class="w255">订单创建时间</th>
                      <th class="w155">订单金额</th>
                      <th class="w155">订单状态</th>
                      <th class="w155">订单类型</th>
                      <th>支付完成时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{orderList.bullId}}</td>
                      <td>{{orderList.bullStartTime}}</td>
                      <td>{{orderList.bullPrice}}</td>
                      <td>{{orderList.bullStatus}}</td>
                      <td>{{orderList.bullType}}</td>
                      <td>{{orderList.bullEndTime}}</td>
                    </tr>
                  </tbody>
                </table> -->
                <el-table :data="orderList" style="width: 100%"  border>
                  <el-table-column prop="bullId" label="订单号"></el-table-column>
                  <el-table-column prop="bullStartTime" label="订单创建时间"></el-table-column>
                  <el-table-column prop="bullPrice" label="订单金额" ></el-table-column>
                  <el-table-column prop="bullStatus" label="订单状态" ></el-table-column>
                  <el-table-column prop="bullType" label="订单类型" ></el-table-column>
                  <el-table-column prop="bullEndTime" label="支付完成时间" ></el-table-column>
                </el-table>

                <div class="order-detail-title">资金</div>
<!--                 <table>
                  <thead>
                    <tr class="tr-header">
                      <th>资金单号</th>
                      <th class="w255">订单创建时间</th>
                      <th class="w155">资金类型</th>
                      <th class="">付款方式</th>
                      <th class="w155">付款金额</th>
                      <th class="w255">付款完成时间</th>
                      <th>交易单号</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                      <td>{{fundList.fundId}}</td>
                      <td>{{fundList.fundStartTime}}</td>
                      <td>{{fundList.fundType}}</td>
                      <td>{{fundList.fundPay}}</td>
                      <td>{{fundList.fundPayPrice}}</td>
                      <td>{{fundList.fundEndTime}}</td>
                      <td>{{fundList.fundTradeId}}</td>
                    </tr>
                  </tbody>
                </table> -->
                <el-table :data="fundList" style="width: 100%" border>
                  <el-table-column prop="fundId" label="资金单号"></el-table-column>
                  <el-table-column prop="fundStartTime" label="订单创建时间"></el-table-column>
                  <el-table-column prop="fundType" label="资金类型" ></el-table-column>
                  <el-table-column prop="fundPay" label="付款方式" ></el-table-column>
                  <el-table-column prop="fundPayPrice" label="付款金额" ></el-table-column>
                  <el-table-column prop="fundEndTime" label="付款完成时间" ></el-table-column>
                  <el-table-column prop="fundTradeId" label="交易单号" ></el-table-column>
                </el-table>

                <div class="order-detail-title">渠道</div>
<!--                 <table>
                  <thead>
                    <tr class="tr-header">
                      <th class="w145">渠道ID</th>
                      <th class="w145">推广位ID</th>
                      <th class="w255">渠道抽成比例(%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{channelList.channelId}}</td>
                      <td>{{channelList.spreadId}}</td>
                      <td>{{channelList.rate}}</td>
                    </tr>
                  </tbody>
                </table> -->
                <el-table :data="channelList" style="width: 100%" border>
                  <el-table-column prop="channelId" label="渠道ID" ></el-table-column>
                  <el-table-column prop="spreadId" label="推广位ID" ></el-table-column>
                  <el-table-column prop="rate" label="渠道抽成比例(%)" ></el-table-column>
                </el-table>

                <div class="order-detail-title">讲师</div>
<!--                 <table>
                  <thead>
                    <tr class="tr-header">
                      <th class="w145">讲师ID</th>
                      <th>讲师昵称</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{lecturerList}}</td>
                      <td>{{lecturerList}}</td>
                    </tr>
                  </tbody>
                </table> -->
                <el-table :data="lecturerList" style="width: 100%" border>
                  <el-table-column prop="lectuerId" label="讲师ID" ></el-table-column>
                  <el-table-column prop="lectuerName" label="讲师昵称(元)" ></el-table-column>
                </el-table>
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
        bull: [], // 买家
        goodsList: [], // 商品
        orderList: [], // 订单
        fundList: [], // 资金
        channelList: [], // 渠道
        lecturerList: [], // 讲师
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
            this.bull = data.bull || {};
            this.goodsList = data.goodsList || {};
            this.orderList = data.orderList || {};
            this.erpOrderList = data.erpOrderList || {};
            this.fundList = data.fundList || {};
            this.channelList = data.channelList || {};
            this.lecturerList = data.lecturerList || {};
          }
        }, e => {
          console.log(e)
        });
      },
      getExpressDetail() {
        this.isFold = !this.isFold;
        if (!this.isFold) {
          let params = {
            logisticsCode: this.fundList.logisticsCode,
            postId: this.fundList.postId
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
    /* height: 40px;
      line-height: 40px;
      background-color: #ededed;
      th {
        color: #666;
        padding: 0;
        &:first-child {
          padding-left: 40px;
          width: 260px;
        }
      } */
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
      font-size: 18px;
      text-align: left;
      color: #303133;
      margin: 20px 0  5px 10px;
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
