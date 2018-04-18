<template>
  <section class="app-main-wrap">
    <div class="title-wrap">
      <span class="add-ofa">
        <el-button type="primary" @click="getMiniApp" size="small">新增页面</el-button>
      </span>
    </div>
    <div class="content">
      <div class="tabel-wrap">
        <template>
          <el-table :data="appList" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="pageTitle" label="页面标题"></el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                {{scope.row.gmtCreate | formatToMs}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="showAppDetail(scope.row.id)">编辑</el-button>
                <el-button type="text" size="mini" @click="delApp(scope.row.id)">删除</el-button>
                <el-button type="text" size="mini" @click="copyApp(scope.row.id)">复制</el-button>
                <!-- <el-button type="text" size="mini" @click="showAppDetail(scope.row.id)">预览</el-button> -->
                <el-button type="text" size="mini" @click="indexApp(scope.row.id)">设为主页</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="page-control">
        <el-pagination background :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="changePageAppList" layout="total, prev, pager, next"
          :total="totalSize"></el-pagination>
      </div>
    </div>
  </section>
</template>

<script>
  import { formatToMs } from '../../../utils/dateUtils'
  import qs from 'qs'

  const url = '';
  const api = {
    list: url + '/knowledgepage/list',
    delete: url + '/knowledgepage/delete',
    sethomepage: url + '/knowledgepage/sethomepage',
    insert: url + '/knowledgepage/insert',
    update: url + '/knowledgepage/update',
    copy: url + '/knowledgepage/copy',
  }
  export default {
    data() {
      return {
        pageOption: {
          pageNum: 1,
          pageSize: 20
        },
        totalSize: 0,
        appList: [],
        authorizerId: '',
      }
    },
    filters: {
      formatToMs: formatToMs
    },
    created() {
      this.getAppList()
    },
    methods: {
      getAppList() {
        let params = {
          pageTitle: '',
          authorizerId: this.authorizerId ? this.authorizerId : '',
          pageNum: this.pageOption.pageNum,
          pageSize: this.pageOption.pageSize,
        }
        this.$http.get(api.list, { params: params }).then(res => {
          let resp = res.data
          if (resp.success) {
            this.appList = resp.data.lists
            this.totalSize = resp.data.totalSize
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },

      changePageAppList(page) {
        this.pageOption.pageNum = page;
        this.getAppList();
      },

      delApp(id) {
        this.$confirm('确定删除该页面？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id,
          }
          let _params = Object.assign(params)
          this.$http.post(api.delete, qs.stringify(_params)).then(res => {
            let resp = res.data
            if (resp.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getAppList()
            }
          })
        }).catch(() => {
        })
      },
      indexApp(id) {
        this.$confirm('确定设置为主页？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id,
          }
          let _params = Object.assign(params)
          this.$http.post(api.sethomepage,  qs.stringify(_params)).then(res => {
            let resp = res.data
            if (resp.success) {
              this.$message({
                type: 'success',
                message: '设置主页成功!'
              })
              this.getAppList()
            }
          })
        }).catch(() => {
        })
      },
      copyApp(id) {
        this.$confirm('确定复制该页面？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id,
          }
          let _params = Object.assign(params)
          this.$http.post(api.copy, qs.stringify(_params)).then(res => {
            let resp = res.data
            if (resp.success) {
              this.$message({
                type: 'success',
                message: '复制成功!'
              })
              this.getAppList()
            }
          })
        }).catch(() => {

        })
      },






      showAppDetail(id) {
        this.appdetailDialog.show = true
        this.$http.get('/miniapp/detail', { params: { id } }).then(res => {
          let resp = res.data
          if (resp.success) {
            this.appDetail = resp.data
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      showDomain(appId) {
        this.domainDialog.show = true
        this.appId = appId
        this.$http.get('/miniapp/getDomain', { params: { appId } }).then(res => {
          let resp = res.data
          if (resp.success) {
            this.appDomain = resp.data
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      setDomain(appId) {
        this.$http.get('/miniapp/setDomain', { params: { appId } }).then(res => {
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
      getMiniApp() {
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
      height: 50px;
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
      .app-avatar {
        width: 40px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        float: left;
      }
      .app-name {
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
    .appdetail-diolog,
    .domain-diolog {
      .el-dialog__body {
        overflow: hidden;
        span {
          display: block;
        }
      }
    }
    .app-avatar {
      width: 40px;
      height: 40px;
      line-height: 40px;
      display: inline-block;
      float: left;
    }
  }
</style>