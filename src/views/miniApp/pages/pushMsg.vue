<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/miniApp' }">小程序</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manager/miniApp/templateMsg/' + pushInfo.appId }">模板消息</el-breadcrumb-item>
        <el-breadcrumb-item >推送</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="add-ofa">
        <i class="iconfont icon-jia"></i>
        <span class="offical-acount" @click="addPushPlan">推送消息</span>
      </span>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
          <el-form :inline="true" class="demo-form-inline" size="mini">
            <el-form-item label="小程序:">{{pushInfo.nickName}}</el-form-item>
            <el-form-item label="创建时间:">{{pushInfo.gmtCreate | formatDateNew}}</el-form-item>
            <el-form-item label="触发类型:">{{pushInfo.formTypeValue}}</el-form-item>
          </el-form>
        </template>
      </div>
      <div class="tabel-wrap">
        <template>
          <el-table :data="pushList"  style="width: 100%" >
            <el-table-column prop="id" label="ID" width="60"></el-table-column>
            <el-table-column prop="gmtCreate" label="创建时间" >
              <template slot-scope="scope">
                {{scope.row.gmtCreate | formatToMs}}
              </template>
            </el-table-column>
            <el-table-column prop="gmtModified" label="更新时间">
              <template slot-scope="scope">
                {{scope.row.gmtModified | formatToMs}}
              </template>
            </el-table-column>
            <el-table-column prop="pushTime" label="推送时间" >
              <template slot-scope="scope">
                {{scope.row.pushTime | formatToMs}}
              </template>
            </el-table-column>
            <el-table-column prop="pushNum" label="预计可触达用户数" width="140"></el-table-column>
            <el-table-column prop="pushStatusValue" label="推送状态" width="100px"></el-table-column>
            <el-table-column  label="操作">
              <template slot-scope="scope">
                <router-link :to="{ path: '/manager/miniApp/addEditPushMsg/' + pushInfo.appId + '/' + pushInfo.odpsId + '/' + pushInfo.expireDate + '/' + scope.row.id }" v-if="scope.row.pushStatusValue === '待推送'">
                  <el-button type="text" size="mini">编辑</el-button>   
                </router-link>
                <el-button type="text" size="mini" disabled v-else>编辑</el-button>
                <el-button type="text" size="mini" @click="delPlan(scope.row)">删除</el-button>           
              </template>
            </el-table-column>
          </el-table>
        </template>        
      </div>   
    </div>     
  </section>
</template>

<script>
import { formatDateNew, formatToMs } from '../../../utils/dateUtils'
export default {
  data () {
    return {
      pushInfo: {},
      pushList: []
    }
  },
  filters: {
    formatToMs: formatToMs,
    formatDateNew: formatDateNew
  },
  created () {
    this.templatePushList()
  },
  methods: {
    formatDateNew: formatDateNew,
    templatePushList () {
      let odpsId = this.$route.params.id
      this.$http.get('/miniapp/templatePushList', {params: {odpsId}}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.pushInfo = resp.data.odpsInfo
          // 算出有多少条数据
          this.pushList = resp.data.pushList
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    addPushPlan () {
      if (this.pushList && this.pushList.length) {
        this.$message({
          type: 'info',
          message: '已存在一条推送计划，暂时不能再添加'
        })
      } else {
        this.$router.push('/manager/miniApp/addEditPushMsg/' + this.pushInfo.appId + '/' + this.pushInfo.odpsId + '/' + this.pushInfo.expireDate)
      }
    },
    delPlan (row) {
      this.$confirm('确定删除该推送计划吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let appId = row.appId
        let id = row.id
        this.$http.get('/miniapp/templatePushDel', {params: {id, appId}}).then(res => {
          let msg = res.data.success
          if (msg) {
            if (res.data.data) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.templatePushList()
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
    color: #606266;
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
