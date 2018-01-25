<template>
  <section class="dlv-main">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager' }">投放管理</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="link-theme">
        <i class="iconfont icon-guanlian"></i>
        <span class="connect-ad" @click="openDialogAd">广告计划</span>
      </span>
    </div>
    <div class="conbtent">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
            <el-form-item>
              <el-select v-model="searchForm.name" placeholder="广告计划名称">
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>              
              </el-select>
            </el-form-item>
            <el-form-item >
              <el-input v-model="searchForm.value" placeholder="名称/ID/地址"></el-input>
            </el-form-item> 
            <el-form-item>
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="启用" value="0"></el-option>
                <el-option label="系统停用" value="1"></el-option>
                <el-option label="停用" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>
      <div class="tabel-content">
        <template>
          <el-table :data="tableData"  style="width: 100%">
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="pushUrl" label="投放地址"></el-table-column>
            <el-table-column prop="planName" label="广告计划名称（ID）" width="200"></el-table-column>
            <el-table-column prop="themeInfo" label="公众号主题（ID）" width="200"></el-table-column>
            <el-table-column prop="themeStatus" label="主题状态" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.themeStatus === 0">
                  启用
                </span>
                <span v-else-if="scope.row.themeStatus === 1">
                  停用
                </span>
                <span v-else-if="scope.row.themeStatus === 2">
                  系统停用
                </span>
              </template>               
            </el-table-column>
            <el-table-column prop="planPlatform" label="广告平台" width="120"></el-table-column>
            <el-table-column  label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="delPlan(scope.row)">取关</el-button>               
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
    <div class="creat-ad-connect-diolog">
      <el-dialog title="关联广告计划" :visible.sync="dialogAdVisible">
        <el-form :model="adPlanForm" ref="adPlanForm" :rules="rules">
          <el-form-item label="广告平台" :label-width="formLabelWidth" prop="adPlat">
            <el-select v-model="adPlanForm.planPlatform" placeholder="请选择投放平台">
              <el-option label="推啊" value="0"></el-option>
              <el-option label="广点通" value="1"></el-option>
            </el-select>
          </el-form-item>
          
          <template v-if="adPlanForm.planPlatform == 0">
            <el-form-item label="广告计划" :label-width="formLabelWidth"  prop="planName">
              <el-input v-model="adPlanForm.planName" auto-complete="off"></el-input>
            </el-form-item>              
          </template>

          <template v-else-if="adPlanForm.planPlatform == 1">
            <el-form-item label="广告计划" :label-width="formLabelWidth"  prop="planName">
              <el-input v-model="adPlanForm.planName" auto-complete="off" placeholder="广告计划名称"></el-input>
            </el-form-item> 
            <div class="w200">
              <el-form-item label="广告计划" :label-width="formLabelWidth"  prop="planId">
                <el-input v-model="adPlanForm.planId" auto-complete="off" placeholder="广告计划ID"></el-input>
              </el-form-item>              
            </div>            
          </template>

          <el-form-item label="投放地址" :label-width="formLabelWidth"  prop="pushUrl">
            <el-input v-model="adPlanForm.pushUrl" auto-complete="off" placeholder="https://"></el-input>
          </el-form-item>
          <el-form-item label="公众号主题" :label-width="formLabelWidth" prop="themeId">
            <el-select  v-model="adPlanForm.themeId"  filterable remote reserve-keyword placeholder="请选择" :remote-method="remoteMethod">
                <el-option v-for="item in themeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>            
          </el-form-item> 
          <div class="btn-wrap">
            <el-button size="small" type="primary" @click="savePlan">保存</el-button>
          </div>            
        </el-form>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import {rules} from '../components/deliveryValidRules'
import qs from 'qs'

export default {
  name: 'delivery',
  data () {
    return {
      searchForm: {
        name: '',
        value: '',
        status: ''
      },
      selectOptions: [
        {
          value: 'planName',
          label: '广告计划名称'
        },
        {
          value: 'planId',
          label: '广告计划id'
        },
        {
          value: 'pushUrl',
          label: '投放地址'
        }

      ],
      dialogAdVisible: false,
      tableData: [
        {
          id: 3,
          pushUrl: 'www.tmall.com',
          planName: '',
          planId: 2,
          planPlatform: '',
          themeInfo: '',
          themeStatus: 1
        }
      ],
      pageOption: {
        pageNum: 1,
        size: 20
      },
      totalSize: 50,
      rules: rules,
      adPlanForm: {
        pushUrl: '',
        planName: '',
        planId: null,
        themeId: '',
        planPlatform: ''
      },
      themeList: [

      ],
      formLabelWidth: '100px'
    }
  },
  created () {
    this.getAllPlanList()
  },
  methods: {
    onSearch () {
      let valueArr = Object.values(this.searchForm)
      let params = {
        [valueArr[0]]: valueArr[1],
        status: valueArr[2]
      }
      this.$http.get('/advplan/list', {
        params
      }).then(res => {
        if (res.data.success) {
          if (res.data.data) {
            this.tableData = res.data.data.lists
            this.totalSize = res.data.data.totalSize
          } else {
            this.tableData = []
            this.totalSize = 1
          }
        } else {
          let msg = res.data.desc
          this.$message.error(msg || '获取失败')
        }
      }, () => {
        this.$message.error('网络错误！')
      })
    },
    getAllPlanList () {
      this.$http.get('/advplan/list').then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.lists
          this.totalSize = res.data.data.totalSize
        } else {
          let msg = res.data.desc
          this.$message.error(msg || '获取失败')
        }
      }, () => {
        this.$message.error('网络错误！')
      })
    },
    pageChange () {
      let valueArr = Object.values(this.searchForm)
      let params = {
        [valueArr[0]]: valueArr[1],
        status: valueArr[2],
        pageNum: this.pageOption.pageNum
      }
      this.$http.get('/advplan/list', {params}).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.lists
        } else {
          this.$message.error('获取数据失败')
        }
      }, () => {
        this.$message.error('网络错误')
      })
    },
    savePlan () {
      this.$refs['adPlanForm'].validate((valid) => {
        if (valid) {
          let _params = Object.assign(this.adPlanForm)
          this.$http.post('/advplan/save', qs.stringify(_params)).then(res => {
            if (res.data.success) {
              this.$message.success('添加成功')
              this.dialogAdVisible = false
              window.location.reload()
            } else {
              this.$message.error('添加失败')
            }
          }, () => {
            this.$message.error('网络错误')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delPlan (row) {
      let id = row.id
      this.$confirm('确定删除主题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/advplan/delete', {params: {id}}).then(res => {
          let msg = res.data.success
          if (msg) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            window.location.reload()
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
    openDialogAd () {
      this.dialogAdVisible = true
    },
    // 模糊查询 主题
    remoteMethod (query) {
      this.$http.get('/subscriptionTheme/list', {
        params: {
          theme: query,
          size: 999
        }
      }).then(res => {
        if (res.data.success) {
          let data = res.data.data.lists
          data = data.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          })
          this.themeList = data
        } else {
          this.$message.success('获取失败')
        }
      }, () => {
        this.$message.error('网络错误！')
      })
    }

  }
}
</script>

<style lang="less">
.dlv-main{
  width: 100%;
  .title-wrap{
    width: 100%;
    height: 30px;
    border-bottom: 1px dotted #ccc;
    position: relative;
    .el-breadcrumb{
      position: absolute;
      left: 0;
      bottom: 10px;
      font-size: 16px;
    }
    .link-theme{
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 10px;
      font-size: 12px;
    }
    .connect-ad{
      cursor: pointer;
      color: #909399;
      font-weight: 400;
      &:hover{
        color:#333
      }
    }
  }
  .search-bar{
    margin-top: 20px
  }
  .page-control{
    float: right;
    margin-top: 20px;
    &:after{
      clear: both;
    }
  }
  .w200{
    width: 200px;
    margin-top: 20px
  }
}
.el-dialog__body{
  overflow: hidden;
  .btn-wrap{
    float: right;
  }
}
</style>
