<template>
  <section class="distributor-box wrap-box">
    <el-tabs v-model="activeType" type="card" @tab-click="handleClick" class="pad-length">
      <el-tab-pane :label="tab1" :name="tab1">
        <!--分销人员列表-->
        <div class="content">
          <div class="search-bar">
              <template>
                <el-form :inline="true" :model="distributorForm" class="demo-form-inline" size="mini">
                  <el-form-item>
                    <el-input v-model="distributorForm.username" placeholder="用户昵称"></el-input>
                  </el-form-item>
                  <el-form-item label="创建时间">
                      <el-date-picker  v-model="distributorForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                      </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary"  @click="onSearch">查询</el-button>
                  </el-form-item>
                </el-form>
              </template>
          </div>
          <div class="tabel-wrap">
            <template>
              <el-table :data="distributorList">
                <el-table-column prop="id" label="用户ID" ></el-table-column>
                <el-table-column prop="userinfo" label="用户信息"></el-table-column>
                <el-table-column prop="distributionPen" sortable label="累计分销笔数"></el-table-column>
                <el-table-column prop="distributionPrice" sortable label="累计分销金额" ></el-table-column>
                <el-table-column prop="bindUser" sortable label="绑定同户数" width="250" ></el-table-column>
                <el-table-column prop="joinDate" sortable label="加入日期" ></el-table-column>
                <el-table-column  label="操作">
                  <template slot-scope="scope">
                  <router-link :to="{ path: '/manager/knowledge/editdistributor/' + scope.row.id}">
                    <el-button type="text" size="mini">详情</el-button>
                  </router-link>   
                  </template>
                </el-table-column>
              </el-table>
            </template>        
          </div>    
        </div>
      </el-tab-pane>
      <el-tab-pane :label="tab2" :name="tab2">
        <!--设置-->
      </el-tab-pane>
      <div class="page-control">
        <el-pagination background  :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="total, prev, pager, next" :total="totalSize">
        </el-pagination>
      </div>
    </el-tabs>
  </section>
</template>

<script>
import { formatDateNew } from '../../../utils/dateUtils'
import qs from 'qs'
export default {
  data () {
    return {
      formLabelWidth: '100px',
      activeType: '分销人员',
      tab1: '分销人员',
      tab2: '设置',
      tabId: '0',
      tabList: [
      {
        'id': 0,
        'name': '分销人员'
      },
      {
        'id': 1,
        'name': '设置'
      }],
      distributorForm: {
        username: '',
        time: ''
      },
      startTime: '',
      endTime: '',
      pageOption: {
        pageNum: 1,
        pageSize: 20
      },
      totalSize: 0,
      distributorList: [],
      voucherList: []
    }
  },
  created () {
    this.getdistributor();
  },
  watch: {
    
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
      if(this.tabList[tab.index].id == this.tabId){
        return
      }
      this.tabId = this.tabList[tab.index].id
      if(this.tabId == 0){
        // 获取分销人员列表
        this.getdistributor()
      }
    },
    // 获取全部内容列表
    getdistributor () {
      let valueArr = Object.values(this.distributorForm)
      this.startTime = this.distributorForm.time ? formatDateNew(this.distributorForm.time[0]): ''
      this.endTime = this.distributorForm.time ? formatDateNew(this.distributorForm.time[1]): ''
      let params = {
        username: valueArr[0],
        pageNum: this.pageOption.pageNum,
        pageSize: 20,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$http.get('/knowledge/distributor/getList', {params:params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.distributorList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
        } else {
          this.pageOption.pageNum = 1
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      }, () => {
        this.$message.error('网络错误')
      })
    },
    // 分页请求
    pageChange (page) {
      this.pageOption.pageNum = page;
      this.getdistributor();
    },
    onSearch () {
      this.pageOption.pageNum = 1;
      this.getdistributor();
    },
 
  }
}
</script>
<style lang="less" scoped>
.distributor-box {
  width: 100%;
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

}
</style>
