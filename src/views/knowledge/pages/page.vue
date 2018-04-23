<template>
  <section class="app-main-wrap">
    <el-row class="tar">
      <el-select v-model="appId" placeholder="请选择" size="small" @change="changeAppId">
        <el-option v-for="item in wechatList" :key="item.id" :label="item.nickName" :value="item.id"></el-option>
      </el-select>
    </el-row>
    <el-row class="home-page mt10" v-show="homePage.pageTitle">
      <el-col :span="6">
        <!-- <img :src="appId.headImg" alt="" class="home-page-header"> -->
        <span class="" v-text="homePage.pageTitle"></span>
      </el-col>
      <el-col :span="6">
        <span class="" v-text="homePage.gmtCreate"></span>
      </el-col>
      <el-col :span="6">
        <router-link :to="{ path:'/manager/knowledge/add?id=' + homePage.id + '&authorizerId=' + this.appId}">
          <el-button type="text" size="mini">编辑</el-button>
        </router-link>
      </el-col>
    </el-row>
    <div class="title-wrap">
      <span class="add-ofa">
        <router-link :to="{ path: '/manager/knowledge/add?authorizerId=' + appId}">
          <el-button type="primary" size="small">新增页面</el-button>
        </router-link>
      </span>
    </div>
    <div class="content">
      <div class="tabel-wrap">
        <template>
          <el-table :data="appList" style="width: 100%">
            <el-table-column prop="id" label="ID" width="150">
                <template slot-scope="scope">
                    {{scope.row.id}}
                    <el-tag v-show="scope.row.homePage == 1" size="small">小程序主页</el-tag>
                  </template>
            </el-table-column>
            <el-table-column prop="pageTitle" label="页面标题"></el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                {{scope.row.gmtCreate}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="editApp(scope.row.id)">编辑</el-button>
                <el-button type="text" size="mini" @click="delApp(scope.row.id)">删除</el-button>
                <el-button type="text" size="mini" @click="copyApp(scope.row.id)">复制</el-button>
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
    appList: url + '/subscriptionInfo/all'
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
        homePage: {},
        wechatList: [],
        appId: null,
      }
    },
    filters: {
      formatToMs: formatToMs
    },
    created() {
      this.getWechatList()
      this.appId = this.$route.query.authorizerId ? this.$route.query.authorizerId : null;

    },
    methods: {
      editApp(id) {
        this.$router.push({
          path: '/manager/knowledge/add?id=' + id + '&authorizerId=' + this.appId,
        })
      },
      changeAppId(item) {
        console.log(item)
        this.appId = item;
        this.getAppList();
      },
      getWechatList() {
        this.$http.get(api.appList,{authorizerType: 1}).then(res => {
          let resp = res.data
          if (resp.success) {
            this.wechatList = resp.data;

            this.appId = this.appId ? Number(this.appId) : resp.data[0].id;
            this.getAppList()
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      getAppList() {
        let params = {
          pageTitle: '',
          authorizerId: this.appId,
          pageNum: this.pageOption.pageNum,
          pageSize: this.pageOption.pageSize,
        }
        this.$http.get(api.list, { params: params }).then(res => {
          let resp = res.data
          if (resp.success) {
            this.appList = resp.data.lists;
            this.totalSize = resp.data.totalSize;
            this.homePage = resp.data.homePage ? resp.data.homePage : {};
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
          this.$http.post(api.sethomepage, qs.stringify(_params)).then(res => {
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

  .home-page {
    height: 70px;
    line-height: 50px;
    padding: 10px 20px;
    border: 1px solid #ebeef5;
    .home-page-header {
      height: 50px;
      width: 50px;
      display: inline-block;
      vertical-align: middle;
      font-size: 0;
    }
  }
</style>