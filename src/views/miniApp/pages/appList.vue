<template>
  <section class="app-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>小程序</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="add-ofa">
        <i class="iconfont icon-jia"></i>
        <span class="offical-acount" @click="getMiniApp">小程序</span>
      </span>
    </div>
    <div class="content">
      <div class="tabel-wrap">
        <template>
          <el-table :data="appList"  style="width: 100%" >
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column label="小程序" >
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
            <el-table-column prop="authorized" label="是否授权">
              <template slot-scope="scope">
                {{scope.row.authorized ? '是' : '否'}}
              </template>
            </el-table-column>
            <el-table-column  label="操作" width="500">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="showAppDetail(scope.row.id)">详情</el-button>
                <el-button type="text" size="mini" @click="getMiniApp">授权</el-button>
                <el-button type="text" size="mini" @click="showDomain(scope.row.appId)">域名配置</el-button>
                <router-link :to="{ path: '/manager/miniApp/codeMng/' + scope.row.appId }">
                  <el-button type="text" size="mini">代码管理</el-button>
                </router-link>
                <router-link :to="{ path: '/manager/miniApp/templateMsg/' + scope.row.appId}">
                  <el-button type="text" size="mini">模板消息</el-button>
                </router-link>
                <el-button type="text" size="mini" @click="delApp(scope.row.id)">删除</el-button>               
              </template>
            </el-table-column>
          </el-table>
        </template>        
      </div>
      <div class="page-control">
        <el-pagination background  :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="prev, pager, next" :total="totalSize"></el-pagination>
      </div>    
    </div>
    <div class="appdetail-diolog">
      <el-dialog title="小程序基本信息" :visible.sync="appdetailDialog.show" width="600px">
        <el-form label-position="left" size="mini">
          <el-form-item label="名称:" :label-width="appdetailDialog.formLabelWidth">
            <span>{{appDetail.nickName}}</span>
          </el-form-item>
          <el-form-item label="头像:" :label-width="appdetailDialog.formLabelWidth">
            <img :src="appDetail.headImg" class="app-avatar">
          </el-form-item>
          <el-form-item label="主体信息:" :label-width="appdetailDialog.formLabelWidth">
            <span>{{appDetail.principalName}}</span>
          </el-form-item>
          <el-form-item label="微信认证:" :label-width="appdetailDialog.formLabelWidth">
            <span>{{appDetail.serviceTypeInfo === 0 ? '已认证' : '未认证'}}</span>
          </el-form-item>
           <el-form-item label="原始Id:" :label-width="appdetailDialog.formLabelWidth">
            <span>{{appDetail.userName}}</span>
          </el-form-item>     
           <el-form-item label="appId:" :label-width="appdetailDialog.formLabelWidth">
            <span>{{appDetail.appId}}</span>
          </el-form-item> 
        </el-form>
      </el-dialog>
    </div>
    <div class="domain-diolog">
      <el-dialog title="域名配置" :visible.sync="domainDialog.show" width="600px">
        <el-form label-position="left" size="mini">
          <el-form-item label="request合法域名:" :label-width="domainDialog.formLabelWidth">
            <span v-for="(item, index) in appDomain.requestdomain">{{item}}</span>
          </el-form-item>
          <el-form-item label="socket合法域名:" :label-width="domainDialog.formLabelWidth">
            <span v-for="(item, index) in appDomain.wsrequestdomain">{{item}}</span>
          </el-form-item>
          <el-form-item label="uploadFile合法域名:" :label-width="domainDialog.formLabelWidth">
            <span v-for="(item, index) in appDomain.uploaddomain">{{item}}</span>
          </el-form-item>
          <el-form-item label="downloadFile合法域名:" :label-width="domainDialog.formLabelWidth">
            <span v-for="(item, index) in appDomain.downloaddomain">{{item}}</span>
          </el-form-item>
          <el-form-item label="业务域名:" :label-width="domainDialog.formLabelWidth">
            <span v-for="(item, index) in appDomain.webviewdomain">{{item}}</span>
          </el-form-item>
          <div class="btn-wrap">
            <el-button size="small" type="primary" @click="setDomain(appId)">更新域名</el-button>
          </div> 
        </el-form>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import { formatToMs } from '../../../utils/dateUtils'
export default {
  data () {
    return {
      appId: '',
      appdetailDialog: {
        show: false,
        formLabelWidth: '100px'
      },
      domainDialog: {
        show: false,
        formLabelWidth: '160px'
      },
      appDetail: {},
      appDomain: {},
      pageOption: {
        pageNum: 1,
        size: 20
      },
      totalSize: 40,
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
