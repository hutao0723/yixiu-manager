
<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>图文类型</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="add-ofa">
        <!-- <i class="iconfont icon-guanlian"></i> -->
        <a class="add" href="http://yun.duiba.com.cn/maila/file/活动名称_2017-07-29.csv">
          <i class="iconhandle"></i>
          下载模板
        </a>
        <span class="connect-ad" @click="">导入内容</span>
      </span>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
            <el-form-item>
              <el-input v-model="searchForm.type1" placeholder="图文类型1"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.type2" placeholder="图文类型2"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.type3" placeholder="图文类型3"></el-input>
            </el-form-item>
            <el-form-item>
              <el-date-picker v-model="searchForm.time1" type="date" value-format="yyyy-MM-dd" placeholder="时间"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-date-picker v-model="searchForm.time2" type="date" value-format="yyyy-MM-dd" placeholder="时间"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>
      <div class="tabel-wrap">
        <template>
          <el-table :data="graphMsgList"  style="width: 100%" >
            <el-table-column prop="date" label="日期" width="180"></el-table-column>
            <el-table-column prop="type1" label="类型1" width="150"></el-table-column>
            <el-table-column prop="type2" label="类型2" width="150"></el-table-column>
            <el-table-column prop="type3" label="类型3" width="150"></el-table-column>
            <el-table-column prop="text" label="图文标题" ></el-table-column>
            <el-table-column  label="操作" width="200">
              <template slot-scope="scope">
                <router-link :to="{ path: '/manager/officalAcount/editGraphType/' + scope.row.id }">
                  <el-button type="text" size="mini">编辑</el-button>        
                </router-link>   
                <!-- delAcount(scope.row) -->
                <el-button type="text" size="mini" @click="deletePageModel(scope.row)">删除</el-button>  
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
      searchForm: {
        type1: '',
        type2: '',
        type3: '',
        time1: formatDateNew(new Date()),
        time2: formatDateNew(new Date())
      },
      dialogAdVisible: false,
      pageOption: {
        pageNum: 1,
        size: 20
      },
      totalSize: 10,
      graphMsgList: []
    }
  },
  created () {
    this.getgraphMsgList()
  },
  methods: {
    onSearch () {
      let appId = this.$route.params.id
      this.pageOption.pageNum = 1
      // let params = {
      //   appId: appId,
      //   [valueArr[0]]: valueArr[1]
      // }
      this.$http.get('/officalAcount/graphmsg/page', {params: this.searchForm}).then(res => {
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
    openDialogAd() {
      this.dialogAdVisible = true
    },
    getgraphMsgList () {
      let appId = this.$route.params.id
      let valueArr = Object.values(this.searchForm)
      let params = {
        appId: appId,
        [valueArr[0]]: valueArr[1]
      }
      this.$http.get('/officalAcount/graphmsg/page', {params: params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.graphMsgList = resp.data.lists
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
      this.$http.get('/officalAcount/graphmsg/page', {params: params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.graphMsgList = resp.data.lists
          // 算出有多少条数据
          this.totalSize = resp.data.totalSize
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    // 删除
    deletePageModel (row) {
      // TODO
      let id = row.id
      this.$confirm('确认删除本条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/officalAcount/del/graph', {params: {id}}).then(res => {
          let msg = res.data.success
          if (msg) {
            if (res.data.data) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              // window.location.reload()
              this.getgraphMsgList();
            } else {
              this.$message({
                type: 'error',
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
      .connect-ad {
        cursor: pointer;
        color: #909399;
        font-weight: 400;
        &:hover {
          color: #333
        }
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
