<template>
  <section class="app-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>页面</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="add-ofa">
        <i class="iconfont icon-jia"></i>
        <span class="offical-acount" @click="getMiniApp">页面</span>
      </span>
    </div>
    <div class="content">
      <div class="tabel-wrap">
        <template>
          <el-table :data="appList"  style="width: 100%" >
            <el-table-column prop="ID" label="ID" width="80"></el-table-column>
            <el-table-column label="页面标题" >
              <template slot-scope="scope">
                <img :src="scope.row.headImg" class="app-avatar">
                <span class="app-name">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" >
              <template slot-scope="scope">
                {{scope.row.gmtCreate | formatToMs}}
              </template>
            </el-table-column>
            <el-table-column  label="操作" width="500">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="showAppDetail(scope.row.id)">编辑</el-button>
                <el-button type="text" size="mini" @click="showAppDetail(scope.row.id)">删除</el-button>
                <el-button type="text" size="mini" @click="showAppDetail(scope.row.id)">复制</el-button>
                <el-button type="text" size="mini" @click="showAppDetail(scope.row.id)">预览</el-button>
                <el-button type="text" size="mini" @click="showAppDetail(scope.row.id)">设为主页</el-button>
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
import { formatToMs } from '../../../utils/dateUtils'

const api = {

}
export default {
  data () {
    return {
      pageOption: {
        pageNum: 1,
        pageSize: 20
      },
      totalSize: 10,
      appList: []
    }
  },
  filters: {
    formatToMs: formatToMs
  },
  created () {
    this.getAppList()
  },
  methods: {
    getAppList () {
      this.$http.get('/miniapp/list').then(res => {
        let resp = res.data
        if (resp.success) {
          this.appList = resp.data.lists
          // 算出有多少条数据
          this.totalSize = resp.data.totalSize
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    pageChange () {
      this.$http.get('/miniapp/list', {params: this.pageOption}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.appList = resp.data.lists
          // 算出有多少条数据
          this.totalSize = resp.data.totalSize
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    delApp (id) {
      this.$confirm('删除后会影响相关授权功能的使用，确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/miniapp/delete', {params: {id}}).then(res => {
          let resp = res.data
          if (resp.success) {
            if (resp.data) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getAppList()
            } else {
              this.$message({
                type: 'success',
                message: '删除失败!'
              })
            }
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showAppDetail (id) {
      this.appdetailDialog.show = true
      this.$http.get('/miniapp/detail', {params: {id}}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.appDetail = resp.data
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    showDomain (appId) {
      this.domainDialog.show = true
      this.appId = appId
      this.$http.get('/miniapp/getDomain', {params: {appId}}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.appDomain = resp.data
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    setDomain (appId) {
      this.$http.get('/miniapp/setDomain', {params: {appId}}).then(res => {
        let resp = res.data
        if (resp.success && resp.data) {
          this.$message({
            type: 'success',
            message: '刷新成功!'
          })
          this.showDomain(appId)
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    getMiniApp () {
      this.$http.get('/wechat/getAuthorization').then(res => {
        console.log(res)
        if (res.data.success) {
          let redirectUrl = res.data.data
          window.location.href = redirectUrl
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.app-main-wrap {
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
  .tabel-wrap {
    .app-avatar{
      width: 40px;
      height: 40px;
      line-height: 40px;
      display: inline-block;
      float: left;
    }
    .app-name{
      display: inline-block;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
    }

  }
  .page-control {
    float: right;
    margin-top: 20px;
    &:after {
      clear: both;
    }
  }
  .appdetail-diolog, .domain-diolog{
    .el-dialog__body{
      overflow: hidden;
      span {
        display: block;
      }       
    }
  }
   .app-avatar{
      width: 40px;
      height: 40px;
      line-height: 40px;
      display: inline-block;
      float: left;
    }
}
</style>
