<template>
  <section class="codemng-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/miniApp' }">小程序</el-breadcrumb-item>
        <el-breadcrumb-item>代码管理</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="code-stock">
        <!-- <i class="iconfont icon-guanlian"></i> -->
        <router-link :to="{ path: '/manager/miniApp/codeStock/' + $route.params.id }">
          <span class="offical-acount">代码模板库</span>
        </router-link>
      </span>
    </div>
    <div class="content">
      <div class="version-wrap">
        <span class="version-title">线上版本</span>
        <div class="version-content">
          <el-form label-position="left" size="mini">
            <el-form-item label="模版ID:" :label-width="formLabelWidth">
              <span>{{codeMngInfo.online.templateId || '-'}}</span>
            </el-form-item>
            <el-form-item label="审核编码:" :label-width="formLabelWidth">
              <span>{{codeMngInfo.online.auditId || '-'}}</span>
            </el-form-item>
            <el-form-item label="版本号:" :label-width="formLabelWidth">
              <span>{{codeMngInfo.online.userVersion || '-'}}</span>
            </el-form-item>
            <el-form-item label="描述:" :label-width="formLabelWidth">
              <span>{{codeMngInfo.online.userDesc || '-'}}</span>
            </el-form-item>
            <el-form-item label="提交时间:" :label-width="formLabelWidth">
              <span>{{codeMngInfo.online.gmtCreate | formatToMs}}</span>
            </el-form-item>
          </el-form>
        </div>              
      </div>  
      <div class="version-wrap">
        <span class="version-title">审核版本</span>
        <div class="version-content">
          <el-form label-position="left" size="mini">
            <div class="action-bar">
              <div class="btn-wrap">
                <el-button size="small" type="primary" :disabled="codeMngInfo.audit.templateStatus === 1 || codeMngInfo.audit.templateStatus === 3" @click="showVersion">选择版本</el-button>
              </div>
              <div class="btn-wrap fr">
                <el-button size="small" type="primary" @click="submitAudit" v-if="codeMngInfo.audit.templateStatus === 0">提交审核</el-button>
              </div>
              <div class="btn-wrap fr" v-if="codeMngInfo.audit.templateStatus === 1">
                <el-button size="small" type="text" disabled >审核中</el-button>
                <el-button size="small" type="text" @click="recallAudit">撤回审核</el-button>
                <el-button size="small" type="text" @click="updateAuditstatus" >刷新审核状态</el-button>
              </div>
              <div class="btn-wrap fr" v-if="codeMngInfo.audit.templateStatus === 3">
                <el-button size="small" type="text" disabled >审核通过</el-button>
                <el-button size="small" type="text" @click="publish">发布到线上</el-button>
              </div>            
              <div class="btn-wrap fr" v-if="codeMngInfo.audit.templateStatus === 2">
                <el-button size="small" type="text" disabled>审核不通过</el-button>
              </div>
            </div>
            <el-form-item label="模版ID:" :label-width="formLabelWidth">
              <span>{{codeMngInfo.audit.templateId || '-'}}</span>
            </el-form-item>
            <el-form-item label="审核编码:" :label-width="formLabelWidth">
              <span>{{codeMngInfo.audit.auditId || '-'}}</span>
            </el-form-item>
            <el-form-item label="版本号:" :label-width="formLabelWidth">
              <span>{{codeMngInfo.audit.userVersion || '-'}}</span>
            </el-form-item>
            <el-form-item label="描述:" :label-width="formLabelWidth">
              <span>{{codeMngInfo.audit.userDesc || '-'}}</span>
            </el-form-item>
            <el-form-item label="提交时间:" :label-width="formLabelWidth">
              <span>{{codeMngInfo.audit.gmtCreate | formatToMs}}</span>
            </el-form-item>
            <el-form-item label="审核不通过原因:" :label-width="formLabelWidth" v-if="codeMngInfo.audit.templateStatus === 2">
              <span>{{codeMngInfo.audit.failReason || '-'}}</span>
            </el-form-item>
          </el-form>
        </div>              
      </div>  
    </div>    
    <div class="version-diolog" v-if="versionDialog.show">
      <el-dialog title="选择版本" :visible.sync="versionDialog.show">
        <div class="tabel-wrap">
          <template>
            <el-table :data="templateList"  style="width: 100%" >
              <el-table-column prop="templateId" label="模板ID" width="80px"></el-table-column>
              <el-table-column prop="userVersion" label="版本号" width="80px"></el-table-column>
              <el-table-column prop="userDesc" label="描述" ></el-table-column>
              <el-table-column prop="createTime" label="修改时间">
                <template slot-scope="scope">
                  {{scope.row.createTime | formatToMs}}
                </template>
              </el-table-column>
              <el-table-column label="选择" width="60px">
                <template slot-scope="scope">
                  <el-radio v-model="templateId" :label="scope.row.templateId">{{labelholder}}</el-radio>
                </template>
              </el-table-column>
            </el-table>
          </template>  
        </div>
        <div class="btn-wrap mt20">
          <el-button size="small" type="primary" @click="VersionCommit">保存</el-button>
        </div>
      </el-dialog>
  </div>
  </section>
</template>

<script>
import { formatToMs } from '../../../utils/dateUtils'
export default {
  data () {
    return {
      templateId: '',
      labelholder: '',
      formLabelWidth: '120px',
      codeMngInfo: {
        appId: '',
        online: {
          templateId: '',
          auditId: '',
          userVersion: '',
          userDesc: '',
          gmtCreate: ''
        },
        audit: {
          templateStatus: '',
          templateId: '',
          auditId: '',
          userVersion: '',
          userDesc: '',
          gmtCreate: ''
        }
      },
      templateList: [
        {
          templateId: 1,
          userVersion: '',
          userDesc: '',
          createTime: ''
        }
      ],
      versionDialog: {
        show: false,
        formLabelWidth: '100px'
      }
    }
  },
  filters: {
    formatToMs: formatToMs
  },
  created () {
    this.getCodeMngInfo()
  },
  methods: {
    getCodeMngInfo () {
      let appId = this.$route.params.id
      this.$http.get('/miniapp/codemng', {params: {appId}}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.codeMngInfo.appId = resp.data.appId
          if (resp.data.online) this.codeMngInfo.online = resp.data.online
          if (resp.data.audit) this.codeMngInfo.audit = resp.data.audit
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    getAllTemplate () {
      let appId = this.$route.params.id
      this.$http.get('/miniapp/getAllTemplate', {params: {appId}}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.templateList = resp.data
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    VersionCommit () {
      let appId = this.$route.params.id
      let templateId = this.templateId
      if (this.templateId === '') {
        this.$message.error('请选择版本')
        return
      };
      this.$http.get('/miniapp/commit', {params: {appId, templateId}}).then(res => {
        let resp = res.data
        if (resp.success && resp.data) {
          this.versionDialog.show = false
          this.getCodeMngInfo()
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    showVersion () {
      this.templateId = ''
      this.versionDialog = {
        show: true
      }
      this.getAllTemplate()
    },
    publish () {
      let appId = this.$route.params.id
      this.$confirm('确定发布到线上?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/miniapp/release', {params: {appId}}).then(res => {
          let msg = res.data.success
          if (msg) {
            if (res.data.data) {
              this.$message({
                type: 'success',
                message: '发布成功!'
              })
              this.getCodeMngInfo()
            } else {
              this.$message({
                type: 'error',
                message: '发布失败!'
              })
            }
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        })
      })
    },
    submitAudit () {
      let appId = this.$route.params.id
      this.$confirm('确定提交审核吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/miniapp/submitAudit', {params: {appId}}).then(res => {
          let msg = res.data.success
          if (msg) {
            if (res.data.data) {
              this.$message({
                type: 'success',
                message: '提交审核成功!'
              })
              this.getCodeMngInfo()
            } else {
              this.$message({
                type: 'error',
                message: '提交审核失败!'
              })
            }
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    updateAuditstatus () {
      let appId = this.$route.params.id
      this.$http.get('/miniapp/updateAuditstatus', {params: {appId}}).then(res => {
        let resp = res.data
        if (resp.success && resp.data) {
          this.$message({
            type: 'success',
            message: '刷新成功!'
          })
          this.getCodeMngInfo()
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    recallAudit () {
      let appId = this.$route.params.id
      this.$confirm('确定撤回审核吗?注意：当天可以撤回1次，每个月最多撤回10次', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/miniapp/undocodeaudit', {params: {appId}}).then(res => {
          let msg = res.data.success
          if (msg) {
            if (res.data.data) {
              this.$message({
                type: 'success',
                message: '撤回审核成功!'
              })
              this.getCodeMngInfo()
            } else {
              this.$message({
                type: 'error',
                message: '撤回审核失败!'
              })
            }
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤回'
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.codemng-main-wrap {
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
    .code-stock {
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
  .content{
    .version-wrap{
      .el-form-item{
        margin-left: 30px;
      }
      .version-title{
        display: block;
        line-height: 60px;
        font-size: 16px;
        font-weight: bold;
        color: #303133;
      }
      .action-bar{
        line-height: 50px;
        border-bottom: 1px solid #d7d7d7;
        padding: 0 20px;
      }
      .version-content{
        color: #606266;
        border: 1px solid #d7d7d7;
      }
    }
  }
}
.el-dialog__body{
  overflow: hidden;
}
.btn-wrap{
  display: inline-block;
}
</style>
