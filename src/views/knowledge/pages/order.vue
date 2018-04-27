<template>
  <section class="lecturer-container">
    <!-- <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <div class="content">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="searchForm" class="form" size="small">
            <el-form-item>
              <el-select v-model="searchForm.name" placeholder="商品标题" class="w150 iptl">
                <el-option v-for="(item,index) in goodsOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.inputOne" placeholder="请输入" class="iptr"></el-input>              
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.orderNumber" placeholder="订单号" class="w150 iptl">
                <el-option v-for="(item,index) in ordersOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.inputTwo" placeholder="请输入" class="iptr"></el-input>              
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.ids" placeholder="商品标题" class="w150 iptl">
                <el-option v-for="(item,index) in idsOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.inputThree" placeholder="请输入" class="iptr"></el-input>              
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker  v-model="searchForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="searchForm.orderStatus" placeholder="全部" class="w150">
                <el-option label="全部" value=""></el-option>
                <el-option label="待支付" value="TO_PAY"></el-option>
                <el-option label="交易成功" value="SUCCESS"></el-option>
                <el-option label="交易失败" value="FAILED"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单类型">
              <el-select v-model="searchForm.orderType" placeholder="全部" class="w150">
                <el-option label="全部" value=""></el-option>
                <el-option label="普通" value="ordinary"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button type="primary" @click="exportOrders">订单导出</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>

      <div class="tabel-wrap">
        <template>
          <el-table :data="orderList" >
            <el-table-column prop="itemId" label="商品ID" width="80"></el-table-column>
            <el-table-column label="商品信息" width="300">
              <template slot-scope="scope">
                <div v-if="scope.row.itemImage" class="img-box por" v-bind:style="{backgroundImage:'url('+scope.row.itemImage+')',backgroundSize: 'contain',backgroundPosition: 'center'}"><div class="goods-mask">{{scope.row.type}}</div></div>
                <div  v-else class="img-box por" v-bind:style="{backgroundImage:'url(//yun.dui88.com/yoofans/images/201804/noClassImg.png)',backgroundSize: 'contain',backgroundPosition: 'center'}"><div class="goods-mask">{{scope.row.type}}</div></div>
                 <span v-if="scope.row.itemName.length > 12" v-text="scope.row.itemName" v-bind:style="{'-webkit-box-orient': 'vertical'}" class="twoLines ln37 w150"></span>
                 <span v-else v-text="scope.row.itemName" class="goods-word"></span>
              </template>
            </el-table-column>
            <el-table-column label="单价(元)" >
              <template slot-scope="scope">
                <div>{{scope.row.itemPrice ? (scope.row.itemPrice / 100).toFixed(2) : ''}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="订单金额(元)" >
              <template slot-scope="scope">
                <div>{{scope.row.amount ? (scope.row.amount / 100).toFixed(2) : ''}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="orderStatus" label="订单状态" >
            </el-table-column>
            <el-table-column prop="gmtCreate" label="订单创建时间" width="180"></el-table-column>
            <el-table-column prop="consumerName" label="买家昵称" ></el-table-column>
            <el-table-column  label="操作" >
              <template slot-scope="scope">
                <router-link :to="{ path: '/manager/knowledge/ordersDetail/' + scope.row.orderId }">          
                  <el-button type="text">详情</el-button>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </template>        
      </div>
      <div class="page-control">
        <el-pagination background  :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="total, prev, pager, next" :total="totalSize"></el-pagination>
      </div>
      <el-dialog title="订单导出" :visible.sync="dialogVisible" width="30%" >
        <span v-if="downStatus">正在生成导出文件，请稍后<span class="beat-ellipsis"></span></span>
        <span v-else>订单文件已生成，请点击「下载」按钮！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <a :class="disabled ? 'btn-disabled' : ''" :href="disabled ? 'javascript:;' : downloadUrl" class="el-button el-button--primary">下 载</a>
        </span>
      </el-dialog> 
    </div>
  </section>
</template>

<script>
import knowlwdgerules from '../components/knowledgeValidRules'
import { formatDateNew } from '../components/knowledgeValidRules'
import qs from 'qs'
export default {
  data () {
    return {
      rules: knowlwdgerules,
      formLabelWidth: '100px',
      searchForm: {
        name: 'itemName',
        inputOne: '',
        orderNumber: 'orderId',
        inputTwo: '',
        ids: 'channelId',
        inputThree: '',
        time: [],
        orderStatus: '',
        orderType: ''
      },
      startTime: '',
      endTime: '',
      teacher: '',
      goodsOptions: [
        {
          value: 'itemName',
          label: '商品标题'
        },
        {
          value: 'consumerName',
          label: '买家昵称'
        },
        {
          value: 'courseId',
          label: '课程ID'
        },
        {
          value: 'columnId',
          label: '专栏ID'
        }
      ],
      ordersOptions: [
        {
          value: 'orderId',
          label: '订单号'
        },
        {
          value: 'outSeqNo',
          label: '交易单号'
        }
      ],
      idsOptions: [
        {
          value: 'channelId',
          label: '渠道ID'
        },
        {
          value: 'adzoneId',
          label: '推广位ID'
        },
        {
          value: 'lecturerId',
          label: '讲师ID'
        }
      ],
      pageOption: {
        pageNum: 1,
        pageSize: 20
      },
      currentPage: 1,
      totalSize: 0,
      orderList: [],

      dialogVisible: false, // 弹框
      downStatus: true, // 文字
      disabled: true, // 按钮状态
      downloadUrl: 'http://www.baidu.com',//链接
      filename: ''
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    // 获取讲师列表
    getOrdersList () {
      this.$http.get('/knowledge/order/page', {}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.orderList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    onSearch () {
      let valueArr = Object.values(this.searchForm)
      this.startTime = this.searchForm.time ? formatDateNew(this.searchForm.time[0]): ''
      this.endTime = this.searchForm.time ? formatDateNew(this.searchForm.time[1]): ''
      let params = {
        pageNum: 1,
        pageSize: 20,
        [valueArr[0]]: valueArr[1],
        [valueArr[2]]: valueArr[3],
        [valueArr[4]]: valueArr[5],
        startTime: this.startTime,
        endTime: this.endTime,
        orderStatus: this.searchForm.orderStatus,
        orderType: this.searchForm.orderType
      }
      this.$http.get('/knowledge/order/page', {params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.orderList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
          this.pageOption.pageNum = 1
          this.currentPage = 1
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        } 
      }, () => {
        this.$message.error('网络错误')
      })
    },
    // 导出
    exportOrders () {
      this.dialogVisible = true
      this.disabled = true
      this.downStatus = true
      let valueArr = Object.values(this.searchForm)
      console.log(valueArr)
      this.startTime = this.searchForm.time ? formatDateNew(this.searchForm.time[0]): ''
      this.endTime = this.searchForm.time ? formatDateNew(this.searchForm.time[1]): ''
      let params = {
        [valueArr[0]]: valueArr[1],
        [valueArr[2]]: valueArr[3],
        [valueArr[4]]: valueArr[5],
        startTime: this.startTime,
        endTime: this.endTime,
        orderStatus: this.searchForm.orderStatus,
        orderType: this.searchForm.orderType
      }
      this.$http.get('/knowledge/order/export', {params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.filename = resp.data
          let that = this
          let orders = setInterval(function(){
            let params = {
              filename: that.filename
            }
            that.$http.get('/knowledge/order/checkExport', {params}).then(res => {
              let resp = res.data
              if (resp.success) {
                if(resp.data.succeed){
                  clearInterval(orders)
                  that.disabled = false
                  that.downStatus = false
                  that.downloadUrl = resp.data.fileUrl
                }else{
                  // let msg = resp.data.message || '文件正在上传中'
                  // that.$message.error(msg)
                  console.log(resp.data.message)
                }
              } else {
                let msg = resp.desc || '请求失败'
                that.$message.error(msg)
              } 
            }, () => {
              that.$message.error('网络错误')
            })
          }, 500)
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        } 
      }, () => {
        this.$message.error('网络错误')
      })
    },
    // 分页请求
    pageChange (currentPage) {
      let valueArr = Object.values(this.searchForm)
      this.currentPage = currentPage
      this.startTime = this.searchForm.time ? formatDateNew(this.searchForm.time[0]): ''
      this.endTime = this.searchForm.time ? formatDateNew(this.searchForm.time[1]): ''
      let params = {
        pageNum: this.currentPage,
        pageSize:20,
        [valueArr[0]]: valueArr[1],
        [valueArr[2]]: valueArr[3],
        [valueArr[4]]: valueArr[5],
        startTime: this.startTime,
        endTime: this.endTime,
        orderStatus: this.searchForm.orderStatus,
        orderType: this.searchForm.orderType
      }
      this.$http.get('/knowledge/order/page', {params: params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.orderList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.lecturer-container {
  width: 100%;
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
  .search-bar {
    margin-top: 20px;
  }
  .page-control {
    float: right;
    margin-top: 20px;
    &:after {
      clear: both;
    }
  }
  .goods-mask{
    right: 0;
    bottom: 0;
    width: 30px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background-color: #000;
    opacity: 0.6;
    color: #FFF;
    position:absolute;
  }
  .goods-word{
    margin-left: 10px;
    line-height: 75px;
  }
  .btn-disabled {
    color: #fff;
    background-color: #bdc5ce;
    border-color: #bdc5ce;
  }
  .beat-ellipsis:after {
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    animation: ellipsis 2s infinite;
    content: "\2026"; 
  }
  .twoLines{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    float: left;
    margin-left: 10px;
  }
  .ln75{
    line-height:75px;
  }
  .ln37{
    line-height:37px;
  }
  .w150{
    width:150px;
  }
  .img-box{
    overflow: hidden;
    width: 75px;
    height: 75px;
    display: inline-block;
    float: left;
    background-repeat: no-repeat;
  }
  .por{
    position:relative;
  }
  @keyframes ellipsis {
      from {
          width: 2px;
      }
      to {
          width: 15px;
      }
  }       
}
</style>
