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
                <el-button type="text" size="mini" @click="openTypeDilog(scope.row)">类型</el-button>
                <router-link :to="{ path: '/manager/miniApp/contentType/' + scope.row.id +'/' + scope.row.appId}">
                  <el-button type="text" size="mini">内容</el-button>
                </router-link>
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
    <!--选择类型-->
    <div class="edit-threshold-diolog">
      <el-dialog title="类型" :visible.sync="dialogTypeVisible">
        <el-form ref="typeName" :model="changeForm" :rules="rules">
          <el-form-item label="类型名称" :label-width="formLabelWidth" prop="typeNameId">
            <el-select v-model="showTypeName" value-key="id" filterable placeholder="请选择" style="width:100%">
              <el-option v-for="(item, index)  in typeList" :key="item.id" :label="item.typeName" :value="index"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" @click="dialogTypeVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="selectType">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import { formatToMs } from '../../../utils/dateUtils'
import minirules from '../components/miniValidRules'
import qs from 'qs'
export default {
  data () {
    return {
      rules: minirules,
      appId: '',
      appdetailDialog: {
        show: false,
        formLabelWidth: '100px'
      },
      changeForm:{
        id:'',
        typeNameId: '',
        typeName: ''
      },
      showTypeName:'',
      domainDialog: {
        show: false,
        formLabelWidth: '160px'
      },
      formLabelWidth: '100px',
      dialogTypeVisible: false,
      appDetail: {},
      appDomain: {},
      pageOption: {
        pageNum: 1,
        size: 20
      },
      totalSize: 40,
      appList: [],
      typeList: []
    }
  },
  filters: {
    formatToMs: formatToMs
  },
  created () {
    this.getAppList()
    this.getTypeList()
  },
  watch: {
    'showTypeName': function (newVal) {
      if (this.typeList[newVal] !== undefined) {
        this.changeForm.typeNameId = this.typeList[newVal].id
      }
    }
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
    },
    // 打开获取单个小程序类型
    openTypeDilog(row) {
      this.changeForm.id = row.id
      let id = this.changeForm.id
      this.$http.get('/wxAuthorizerExt/getByAuthorizerId', {id}).then(res => {
        let resp = res.data
        if (resp.success) {
          if(resp.data){
            this.changeForm.typeNameId = resp.data.id
            this.changeForm.typeName = resp.data.parentName
            this.showTypeName = resp.data.parentName
          }
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
      this.dialogTypeVisible = true
    },
    // 获取全部小程序的类型
    getTypeList(){
      this.$http.get('/content/type/select', {}).then(res => {
        let resp = res.data
        if (resp.success) {
          if(resp.data){
            this.typeList  = resp.data
          }
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    // 选择小程序类型
    selectType() {
      this.$refs['typeName'].validate((valid) => {
        if (valid) {
          let params = {
            id : this.changeForm.id,
            typeNameId : this.changeForm.typeNameId
          }
          this.$http.post('/content/detail/update', qs.stringify(params)).then(res => {
            if (res.data.data) {
              this.dialogTypeVisible = false
              this.$message.success('保存成功')
            } else {
              this.dialogTypeVisible = false
              this.$message.error('保存失败')
            }
          })
        } else {
          console.log('error submit!!')
          return false
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
