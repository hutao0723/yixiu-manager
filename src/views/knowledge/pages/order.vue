<template>
  <section class="lecturer-container">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="searchForm" class="form" size="mini">
            <el-form-item>
              <el-select v-model="searchForm.name" placeholder="商品标题">
                <el-option v-for="(item,index) in goodsOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.inputOne" placeholder="请输入"></el-input>              
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.orderNumber" placeholder="订单号">
                <el-option v-for="(item,index) in ordersOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.inputTwo" placeholder="请输入"></el-input>              
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.ids" placeholder="商品标题">
                <el-option v-for="(item,index) in idsOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.inputThree" placeholder="请输入"></el-input>              
            </el-form-item>
            <el-form-item label="订单时间">
              <el-date-picker  v-model="searchForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="searchForm.status" placeholder="全部">
                <el-option label="待支付" value="0"></el-option>
                <el-option label="交易成功" value="1"></el-option>
                <el-option label="交易失败" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单类型">
              <el-select v-model="searchForm.orderType" placeholder="全部">
                <el-option label="普通" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button type="primary" >订单导出</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>

      <div class="tabel-wrap">
        <template>
          <el-table :data="orderList" style="width: 100%" >
            <el-table-column prop="goodsId" label="商品ID" width="80"></el-table-column>
            <el-table-column label="商品信息" width="300">
              <template slot-scope="scope">
                <img :src="scope.row.frontCover" alt="" class="goods-list-img">
                <span v-text="scope.row.title" class="two-ellipsis"></span>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价(元)" ></el-table-column>
            <el-table-column prop="number" label="数量" ></el-table-column>
            <el-table-column prop="orderPrice" label="订单金额(元)" ></el-table-column>
            <el-table-column prop="orderStatus" label="订单状态" >
              <template slot-scope="scope">
                <div v-if="scope.row.orderStatus == '1'">交易成功</div>
                <div v-else-if="scope.row.orderStatus == '2'">交易失败</div>
                <div v-else>待支付</div>
              </template>
            </el-table-column>
            <el-table-column prop="endTime" label="交易完成时间" ></el-table-column>
            <el-table-column prop="nickName" label="买家昵称" ></el-table-column>
            <el-table-column  label="操作" >
              <template slot-scope="scope">
                <router-link :to="{ path: '/manager/knowledge/ordersDetail/' + scope.row.goodsId }">          
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
    </div>
  </section>
</template>

<script>
import { formatDateNew } from '../../../utils/dateUtils'
import knowlwdgerules from '../components/knowledgeValidRules'
import qs from 'qs'
export default {
  data () {
    return {
      rules: knowlwdgerules,
      formLabelWidth: '100px',
      searchForm: {
        name: 'title',
        inputOne: '',
        orderNumber: 'orderId',
        inputTwo: '',
        ids: 'channelId',
        inputThree: '',
        time: [],
        status: '',
        orderType: ''
      },
      teacher: '',
      goodsOptions: [
        {
          value: 'title',
          label: '商品标题'
        },
        {
          value: 'nickName',
          label: '卖家昵称'
        },
        {
          value: 'courseId',
          label: '课程ID'
        },
        {
          value: 'culumnId',
          label: '课程ID'
        }
      ],
      ordersOptions: [
        {
          value: 'orderId',
          label: '订单号'
        },
        {
          value: 'transactionId',
          label: '交易单号'
        }
      ],
      idsOptions: [
        {
          value: 'channelId',
          label: '渠道ID'
        },
        {
          value: 'spreadId',
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
      orderList: []
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    // 获取讲师列表
    getOrdersList () {
      this.$http.get('/order/List', {}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.orderList = resp.data.lists
          // 算出有多少条数据
          this.totalSize = resp.data.totalSize
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    onSearch () {
      let valueArr = Object.values(this.searchForm)
      console.log(valueArr)
      let params = {
        pageNum: 1,
        pageSize: 20,
        [valueArr[0]]: valueArr[1],
        [valueArr[2]]: valueArr[3],
        [valueArr[4]]: valueArr[5],
        time1: formatDateNew(this.searchForm.time[0]),
        time2: formatDateNew(this.searchForm.time[1]),
        status: this.searchForm.status,
        orderType: this.searchForm.orderType
      }
      this.$http.get('/order/List', {params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.orderList = resp.data.lists
          // 算出有多少条数据
          this.totalSize = resp.data.totalSize
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
    // 分页请求
    pageChange (currentPage) {
      let valueArr = Object.values(this.searchForm)
      this.currentPage = currentPage
      let params = {
        pageNum: this.currentPage,
        pageSize:20,
        [valueArr[0]]: valueArr[1],
        [valueArr[2]]: valueArr[3],
        [valueArr[4]]: valueArr[5],
        time1: formatDateNew(this.searchForm.time[0]),
        time2: formatDateNew(this.searchForm.time[1]),
        status: this.searchForm.status,
        orderType: this.searchForm.orderType
      }
      this.$http.get('/order/List', {params: params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.orderList = resp.data.lists
          // 算出有多少条数据
          this.totalSize = resp.data.totalSize
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
  .goods-list-img{
    height: 50px;
    width: 50px;
    display: inline-block;
    vertical-align: middle;
    float: left;
  }
  .two-ellipsis{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    width: 200px;
    float: left;
    margin-left: 10px;
  }
}
</style>
