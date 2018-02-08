<template>
  <section class="app-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/miniApp' }">小程序</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manager/miniApp/templateMsg/' + $route.params.id }">模板消息</el-breadcrumb-item>
        <el-breadcrumb-item >微信模板管理</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="add-ofa">
        <i class="iconfont icon-jia"></i>
        <span class="offical-acount" @click="addTemplate">微信模板</span>
      </span>
    </div>
    <div class="content">
      <div class="tabel-wrap">
        <template>
          <el-table :data="msgTemplateList"  style="width: 100%" >
            <el-table-column prop="id" label="ID" ></el-table-column>
            <el-table-column prop="title" label="微信模板名称" ></el-table-column>
            <el-table-column prop="" label="关键词" >
              <template slot-scope="scope">
                <el-popover
                  ref="popoverkeywords"
                  placement="top-start"
                  title="关键词"
                  width="200"
                  trigger="hover"
                  :content="scope.row.keywords">
                </el-popover>
                <span v-popover:popoverkeywords>{{scope.row.keywords.substr(0,9) + '...'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="创建时间">
              <template slot-scope="scope">
                {{scope.row.gmtCreate | formatToMs}}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="delTemplate(scope.row.id)">删除</el-button>               
              </template>
            </el-table-column>
          </el-table>
        </template>        
      </div>  
    </div>
  </section>
</template>

<script>
import { formatToMs } from '../../../utils/dateUtils';
export default {
  components: {},
  data () {
    return {
      msgTemplateList: []
    }
  },
  filters: {
    formatToMs: formatToMs
  },
  created () {
    this.getMsgTemplateList()
  },
  methods: {
    getMsgTemplateList () {
      let appId = this.$route.params.id
      this.$http.get('/miniapp/msgTemplateList', {params: {appId}}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.msgTemplateList = resp.data
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    delTemplate (id) {
      this.$confirm('确认删除该微信模板？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let appId = this.$route.params.id
        this.$http.get('/miniapp/msgTemplateDel', {params: {id, appId}}).then(res => {
          let msg = res.data.success
          if (msg) {
            if (res.data.data) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getMsgTemplateList()
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
    addTemplate () {
      if (this.msgTemplateList && this.msgTemplateList.length === 25) {
        this.$message({
          type: 'info',
          message: '暂时只能添加25条模板'
        })
      } else {
        this.$router.push('/manager/miniApp/addWxTemplate/' + this.$route.params.id )
      }
    },
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
