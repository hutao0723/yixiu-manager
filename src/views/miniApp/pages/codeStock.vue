<template>
  <section class="app-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/miniApp' }">小程序</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manager/miniApp/codeMng/' + $route.params.id }">代码管理</el-breadcrumb-item>
        <el-breadcrumb-item >代码模板库</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="add-ofa">
        <!-- <i class="iconfont icon-guanlian"></i> -->
        <span class="offical-acount" @click="refreshTemplate">更新代码模板库</span>
      </span>
    </div>
    <div class="content">
      <div class="tabel-wrap">
        <template>
          <el-table :data="templateList"  style="width: 100%" >
            <el-table-column prop="templateId" label="模板ID" ></el-table-column>
            <el-table-column prop="userVersion" label="版本号" ></el-table-column>
            <el-table-column prop="userDesc" label="描述" ></el-table-column>
            <el-table-column prop="createTime" label="修改时间">
              <template slot-scope="scope">
                {{formatDateNew(scope.row.createTime)}}
              </template>
            </el-table-column>
          </el-table>
        </template>        
      </div>  
    </div>
  </section>
</template>

<script>
import { formatDateNew } from '../../../utils/dateUtils';
export default {
  data () {
    return {
      templateList: []
    }
  },
  created () {
    this.getAllTemplate();
  },
  methods: {
    formatDateNew: formatDateNew,
    getAllTemplate () {
      let appId = this.$route.params.id;
      this.$http.get('/miniapp/getAllTemplate', {params: {appId}}).then(res => {
        let resp = res.data;
        if (resp.success) {
          this.templateList = resp.data
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    refreshTemplate () {
      let appId = this.$route.params.id;
      this.$http.get('/miniapp/refreshTemplate', {params: {appId}}).then(res => {
        let resp = res.data;
        if (resp.success && resp.data) {
          this.$message({
            type: 'success',
            message: '刷新成功!'
          })
          this.getAllTemplate()
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
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
}
</style>
