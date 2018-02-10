<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/miniApp' }">小程序</el-breadcrumb-item>
        <el-breadcrumb-item>模板消息</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="add-ofa">
        <!-- <i class="iconfont icon-guanlian"></i> -->
        <router-link :to="{ path: '/manager/miniApp/templateStock/' + $route.params.id}">
          <span class="offical-acount">微信模板管理</span>
        </router-link>
      </span>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
            <el-form-item>
              <el-select v-model="searchForm.name" placeholder="创建时间">
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>              
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker v-model="searchForm.value" type="date" value-format="yyyy-MM-dd" placeholder="创建时间／失效时间"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>
      <div class="tabel-wrap">
        <template>
          <el-table :data="tempMsgList"  style="width: 100%" >
            <el-table-column prop="id" label="序号" width="60"></el-table-column>
            <el-table-column prop="wxAppName" label="小程序"></el-table-column>
            <el-table-column prop="belongDate" label="创建时间" ></el-table-column>
            <el-table-column prop="expireDate" label="失效时间"></el-table-column>
            <el-table-column prop="eventTypeDesc" label="触发类型" ></el-table-column>
            <el-table-column prop="touchTotal" label="可触达人次"></el-table-column>
            <el-table-column prop="touchUsers" label="可触达用户数" ></el-table-column>
            <el-table-column  label="操作" width="80px">
              <template slot-scope="scope">
                <router-link :to="{ path: '/manager/miniApp/pushMsg/' + scope.row.id }">
                  <el-button type="text" size="mini">推送</el-button>        
                </router-link>     
              </template>
            </el-table-column>
          </el-table>
        </template>        
      </div>
      <div class="page-control">
        <el-pagination background  :page-size="20" :current-page.sync="pageOption.pageNum"
 @current-change="pageChange" layout="prev, pager, next" :total="totalSize"></el-pagination>
      </div>    
    </div>     
  </section>
</template>

<script>
import { formatDateNew } from '../../../utils/dateUtils'
export default {
  data () {
    return {
      selectOptions: [
        {
          value: 'belongDate',
          label: '创建时间'
        },
        {
          value: 'expireDate',
          label: '失效时间'
        }
      ],
      searchForm: {
        name: 'belongDate',
        value: formatDateNew(new Date())
      },
      pageOption: {
        pageNum: 1,
        size: 20
      },
      totalSize: 10,
      tempMsgList: []
    }
  },
  created () {
    this.getTempMsgList()
  },
  methods: {
    onSearch () { 
      let appId = this.$route.params.id
      let valueArr = Object.values(this.searchForm)
      this.pageOption.pageNum = 1
      let params = {
        appId: appId,
        [valueArr[0]]: valueArr[1]
      }
      this.$http.get('/miniapp/tplmsg/page', {params: params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.tempMsgList = resp.data.lists
          // 算出有多少条数据
          this.totalSize = resp.data.totalSize
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    getTempMsgList () {
      let appId = this.$route.params.id
      let valueArr = Object.values(this.searchForm)
      let params = {
        appId: appId,
        [valueArr[0]]: valueArr[1]
      }
      this.$http.get('/miniapp/tplmsg/page', {params: params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.tempMsgList = resp.data.lists
          // 算出有多少条数据
          this.totalSize = resp.data.totalSize
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    pageChange () {
      let appId = this.$route.params.id
      let valueArr = Object.values(this.searchForm)
      let params = {
        appId: appId,
        [valueArr[0]]: valueArr[1],
        pageNum: this.pageOption.pageNum
      }
      this.$http.get('/miniapp/tplmsg/page', {params: params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.tempMsgList = resp.data.lists
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
.ofa-main-wrap {
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
    .add-ofa {
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 10px;
      font-size: 12px;
      a{
        text-decoration: none;
      }
    }
    .offical-acount {
      cursor: pointer;
      color: #909399;
      font-weight: 400;
      &:hover {
        color: #333;
      }
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
}
</style>
