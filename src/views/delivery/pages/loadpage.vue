<template>
  <section class="dlv-main">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager' }">落地页</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="link-theme">
        <i class="iconfont icon-guanlian"></i>
        <span class="connect-ad" @click="openDialogAd">落地页</span>
      </span>
    </div>
    <div class="conbtent">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="searchForm.data" class="demo-form-inline" size="mini">
            <el-form-item>
              <el-select v-model="searchForm.data.searchName" placeholder="选取公众号">
                <el-option
                  v-for="item in searchForm.officalAcountOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>              
              </el-select>
            </el-form-item>
            <el-form-item >
              <el-input v-model="searchForm.data.value" placeholder="名称"></el-input>
            </el-form-item> 
            <el-form-item>
              <el-select v-model="searchForm.data.status" placeholder="状态">
                <el-option label="已使用" :value="2"></el-option>
                <el-option label="待使用" :value="1"></el-option>
                <el-option label="不可使用" :value="0"></el-option>
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
            <el-table-column prop="loadPageUrl" label="落地页"></el-table-column>
            <el-table-column prop="subscriptionName" label="公众号" width="200"></el-table-column>
            <el-table-column prop="thresholdNum" label="当日阈值" width="100"></el-table-column>
            <el-table-column prop="todayNewFollow" label="当日新增关注" width="120"></el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">
                  不可使用
                </span>
                <span v-else-if="scope.row.status === 1">
                  待使用
                </span>
                <span v-else-if="scope.row.status === 2">
                  已使用
                </span>
              </template>
              </el-table-column>           
            <el-table-column  label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="openStatusDilog(scope.row)">状态</el-button>
                <el-button type="text" size="small" @click="openThresholdDilog(scope.row)">阈值</el-button>               
                <el-button type="text" size="small" @click="deletePageModel(scope.row)">删除</el-button>               
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="page-control">
        <el-pagination background   :page-size="20" :current-page="pageOption.pageNum"
 @current-change="pageChange" layout="prev, pager, next" :total="totalSize"></el-pagination>
      </div>
    </div>
    <div class="ad-loadPage-diolog">
      <el-dialog title="添加落地页" :visible.sync="dialogLoadPageVisible">
        <el-form :model="addLoadPage" ref="addLoadPage" :rules="rules">
          <el-form-item label="公众号" :label-width="formLabelWidth" prop="subscriptionId">
          <el-select  v-model="addLoadPage.subscriptionId"  filterable remote reserve-keyword placeholder="公众号名称" :remote-method="remoteMethod" :loading="loading">
              <el-option v-for="item in searchForm.officalAcountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="落地页名称" :label-width="formLabelWidth"  prop="loadPageUrl">
            <el-input placeholder="https://" v-model="addLoadPage.loadPageUrl" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="阈值" :label-width="formLabelWidth"  prop="thresholdNum">
            <el-input v-model="addLoadPage.thresholdNum" auto-complete="off"></el-input>
          </el-form-item>           
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" type="primary" @click="addPage">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="change-status-diolog">
      <el-dialog title="落地页状态" :visible.sync="dialogStatusVisible">
        <template>
          <el-radio-group v-model="changeForm.status">
            <el-radio :label="1">待使用</el-radio>
            <el-radio :label="2">已使用</el-radio>
            <el-radio :label="0">不可使用</el-radio>
          </el-radio-group>
        </template>
        <div class="btn-wrap">
          <el-button size="small" type="primary" @click="changeStatus">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="edit-threshold-diolog">
      <el-dialog title="设置阈值" :visible.sync="dialogThresholdVisible">
        <el-form :model="changeForm" :rules="rules">
          <el-form-item label="阈值" :label-width="formLabelWidth"  prop="thresholdNum">
            <el-input v-model="changeForm.thresholdNum" auto-complete="off"></el-input>
          </el-form-item>                     
        </el-form>
         <div class="btn-wrap">
          <el-button size="small" type="primary" @click="changeThresholdNum">保存</el-button>
        </div>       
      </el-dialog>
    </div>    
  </section>
</template>

<script>
import {loadPagerules} from '../components/deliveryValidRules'
import qs from 'qs'

console.log(loadPagerules)
export default {
  name: 'delivery',
  data () {
    return {
      searchForm: {
        data: {
          searchName: 'name',
          value: '',
          status: ''
        },
        officalAcountOptions: [
          {
            label: '公众号',
            value: 'name'
          },
          {
            label: '落地页',
            value: 'loadPageUrl'
          }
        ]
      },
      loading: false,
      totalSize: 50,
      formLabelWidth: '100px',
      dialogLoadPageVisible: false,
      dialogStatusVisible: false,
      dialogThresholdVisible: false,
      rules: loadPagerules,
      addLoadPage: {
        loadPageUrl: 'https://',
        subscriptionId: '',
        thresholdNum: null
      },
      changeForm: {
        id: '',
        status: '',
        thresholdNum: null
      },
      subscriptionList: [
        {
          name: '福利会',
          id: 1
        },
        {
          name: '红花会',
          id: 2
        },
        {
          name: '哈哈哈哈会',
          id: 3
        }
      ],
      pageOption: {
        pageNum: 1,
        size: 20
      },
      subList: [],
      default: [
      ],
      tableData: []
    }
  },
  created () {
    this.getAllList()
  },
  methods: {
    // 搜索
    onSearch () {
      let searchForm = this.searchForm.data
      let params = {}
      if (searchForm.searchName === 'backupName') {
        params.backupName = searchForm.value
      } else if (searchForm.searchName === 'name') {
        params.name = searchForm.value
      } else {
        params.loadPageUrl = searchForm.value
      }
      params.status = searchForm.status
      this.$http.get('/loadpage/list', {params}).then(res => {
        if (res.data.success) {
          this.totalSize = res.data.data.totalSize
          console.log(res.data.data.lists)
          if (res.data.data.lists) {
            this.tableData = res.data.data.lists
          } else {
            this.totalSize = 1
            this.tableData = this.default
          }
        } else {
          this.$message.error('获取数据失败')
        }
      }, () => {
        this.$message.error('网络错误')
      })
    },
    getAllList () {
      this.$http.get('/loadpage/list').then(res => {
        if (res.data.success) {
          this.totalSize = res.data.data.totalSize
          this.tableData = res.data.data.lists
        } else {
          this.$message.error('获取数据失败')
        }
      }, () => {
        this.$message.error('网络错误')
      })
    },
    // 新增落地页
    addPage () {
      this.$refs['addLoadPage'].validate((valid) => {
        if (valid) {
          let params = Object.assign(this.addLoadPage)
          params.thresholdNum = +params.thresholdNum
          console.log(params)
          this.$http.post('/loadpage/save', qs.stringify(params)).then(res => {
            console.log(res)
            if (res.data.success) {
              this.$message.success('创建成功')
              this.dialogLoadPageVisible = false
              window.location.reload()
            } else {
              this.$message.error(`${res.data.desc || 'erroe'}`)
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
    // 状态
    changeStatus () {
      let status = this.changeForm.status
      let id = this.changeForm.id
      console.log(id)
      this.$http.get('/loadpage/changestatus', {params: {
        status, id
      }}).then(res => {
        if (res.data.success) {
          if (res.data.data) {
            this.dialogStatusVisible = false
            this.$message.success('切换成功')
          } else {
            this.dialogStatusVisible = false
            this.$message.success('切换失败')
          }
        }
      })
    },
    // 阈值
    changeThresholdNum () {
      let thresholdNum = +this.changeForm.thresholdNum
      let id = this.changeForm.id
      console.log(id)
      this.$http.get('/loadpage/changethresholdNum', {params: {
        thresholdNum, id
      }}).then(res => {
        if (res.data.success) {
          this.dialogThresholdVisible = false
          this.$message.success('修改成功')
        }
      })
    },
    remoteMethod (query) {
      console.log(query)
      this.$http.get('/subscriptionInfo/list', {params: {name: query}}).then(res => {
        if (res.data.success) {
          let list = res.data.data.lists
          list = list.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          })
          this.searchForm.officalAcountOptions = list
          if (this.searchForm.officalAcountOptions) {
            this.loading = false
          }
        }
      })
    },
    // pageChange()
    pageChange () {
      console.log(this.pageOption.pageNum)
      this.$http.get('/loadpage/list', {params: this.pageOption}).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.lists
        } else {
          this.$message.error('获取数据失败')
        }
      }, () => {
        this.$message.error('网络错误')
      })
    },
    // 删除
    deletePageModel (row) {
      // TODO
      let id = row.id
      this.$confirm('删除后该落地页的公众号将不再监控粉丝情况?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/loadpage/delete', {params: {id}}).then(res => {
          let msg = res.data.success
          if (!msg) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
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
      this.dialogLoadPageVisible = true
    },
    openStatusDilog (row) {
      this.dialogStatusVisible = true
      this.changeForm.id = row.id
      this.changeForm.status = row.status
    },
    openThresholdDilog (row) {
      this.changeForm.id = row.id
      this.dialogThresholdVisible = true
      this.changeForm.thresholdNum = row.thresholdNum
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
  .el-dialog__body{
    overflow: hidden;
  .btn-wrap{
    float: right;
  }
  }

}

</style>
