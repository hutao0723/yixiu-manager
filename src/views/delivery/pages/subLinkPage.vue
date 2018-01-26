<template>
  <section class="dlv-main">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/dlv/theme' }">公众号主题</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manager/dlv/theme' }">公众号</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manager/dlv/link' }">{{themeName}}</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="link-theme">
        <i class="iconfont icon-jia"></i>
        <span class="connect-ad" @click="openDialogSubscrition">公众号</span>
      </span>
    </div>
    <div class="conbtent">
      <div class="tabel-content">
        <template>
          <el-table :data="tableData"  style="width: 100%">
            <el-table-column prop="id" label="序号" width="50"></el-table-column>
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
                <el-button type="text" size="small" @click="cancelRelation(scope.row)">移除</el-button>               
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </div>
    <div class="connect-loadPage-diolog">
      <el-dialog title="新增公众号" :visible.sync="dialogVisible">
        <el-form  :inline="true" :model="adSubscriptionsForm" :rules="rules">
        <el-form-item label="待选公众号">
          <el-select  v-model="adSubscriptionsForm.subscriptionId"  filterable remote reserve-keyword placeholder="待选公众号" :remote-method="remoteMethod" :loading="loading">
              <el-option v-for="item in subscriptionsList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button type="text"  size="mini" icon="el-icon-search" @click="getLoadPageBySubscription()">查询</el-button>
        </el-form-item> 
        <el-form-item label="待选落地页">
          <el-transfer  :titles="['待选落地页', '已选落地页']" v-model="adSubscriptionsForm.loadPageIds" :data="loadpagesList"></el-transfer>
        </el-form-item> 
        <div class="btn-wrap">
          <el-button size="small" :disabled="!adSubscriptionsForm.loadPageIds.length" type="primary" @click="boundRelation">保存</el-button>
        </div>         
        </el-form>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import {rules} from '../components/deliveryValidRules'
import { mapState } from 'vuex'

export default {
  name: 'delivery',
  data () {
    return {
      themeId: null,
      dialogVisible: false,
      rules: rules,
      adSubscriptionsForm: {
        subscriptionId: null,
        loadPageIds: []
      },
      loading: true,
      subscriptionsList: [

      ],
      loadpagesList: [
        {
          key: 1,
          label: '备选1'
        }
      ],
      tableData: []
    }
  },
  created () {
    this.getList()
    this.themeId = this.$route.params.id
  },
  computed: mapState({
    themeName: state => state.theme
  }),
  methods: {
    openDialogSubscrition () {
      this.dialogVisible = true
    },
    getList () {
      let id = this.$route.params.id
      this.$http.get('/subscriptionTheme/getLoadPage', {params: {id}}).then(res => {
        if (res.data.sucess) {
          this.tableData = res.data.data
        }
      })
    },
    getLoadPageBySubscription () {
      if (this.adSubscriptionsForm.subscriptionId) {
        let _params = {
          themeId: this.themeId,
          subscriptionId: this.adSubscriptionsForm.subscriptionId
        }
        this.$http.get('/subscriptionTheme/getLoadPageBySubscription', {params: _params}).then(res => {
          if (res.data.success) {
            let pageUrlList = res.data.data
            pageUrlList = pageUrlList.map(item => {
              return {
                key: item.id,
                label: item.loadPageUrl
              }
            })
            this.loadpagesList = pageUrlList
          }
        })
      }
    },
    remoteMethod (query) {
      this.$http.get('/subscriptionInfo/list', {params: {name: query}}).then(res => {
        if (res.data.success) {
          let list = res.data.data.lists
          list = list.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          })
          this.subscriptionsList = list
          if (this.subscriptionsList) {
            this.loading = false
          }
        }
      })
    },
    boundRelation () {
      if (this.adSubscriptionsForm.subscriptionId && this.adSubscriptionsForm.loadPageIds.length) {
        let _params = Object.assign({}, this.adSubscriptionsForm)
        // _params.loadPageIds = JSON.stringify(_params.loadPageIds)
        _params.loadPageIds = _params.loadPageIds.toString()
        this.$http.get('/subscriptionTheme/boundRelation', {params: _params}).then(res => {
          if (res.data.success) {
            this.$message.success('保存成功')
            this.dialogVisible = false
            window.location.reload()
          } else {
            this.$message.error('保存失败')
          }
        })
      }
    },
    cancelRelation (row) {
      this.$confirm('确定移除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = row.id
        this.$http.get('/subscriptionTheme/removeBoundRelation', {
          params: {
            id
          }
        }).then(res => {
          if (res.data.success) {
            this.$message.success('移除成功')
          } else {
            this.$message.error('移除失败')
          }
        }, () => {
          this.$message.error('网络错误！')
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
  .conbtent{
      padding: 30px 0
  }
  .el-dialog__body{
    overflow: hidden;
    .btn-wrap{
      float: right;
    }
  }
}

</style>
