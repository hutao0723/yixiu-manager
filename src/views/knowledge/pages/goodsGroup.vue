<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>商品组</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="add-type">
        <i class="iconfont icon-jia" style="vertical-align: middle;"></i>
        <span class="connect-ad" @click="openaddDialogTitle" style="vertical-align: middle;">商品组</span>
      </span>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
        </template>
      </div>
      <div class="tabel-wrap">
        <template>
          <el-table :data="groupList" style="width: 100%" >
            <el-table-column prop="id" label="ID" ></el-table-column>
            <el-table-column prop="goodsGroupName" label="分组标题" ></el-table-column>
            <el-table-column label="商品数">
              <template slot-scope="scope">
                <router-link :to="{ path: '/manager/knowledge/goodsNumber/' + scope.row.id }">          
                  <el-button type="text">{{scope.row.goodsNum}}</el-button>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="创建时间" ></el-table-column>
            <el-table-column  label="操作" >
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="openDialogTitle(scope.row)">编辑</el-button>        
                <el-button type="text" size="mini" @click="deleteTitle(scope.row)">删除</el-button>
                <el-button type="text" size="mini" @click="copy(scope.row)">复制</el-button>   
              </template>
            </el-table-column>
          </el-table>
        </template>        
      </div>
      <div class="page-control">
        <el-pagination background  :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="total, prev, pager, next" :total="totalSize"></el-pagination>
      </div>    
    </div>
    <!--添加类型-->
    <div class="add-type-diolog">
      <el-dialog title="添加" :visible.sync="dialogaddTitleVisible">
        <el-form :model="titleForm" ref="titleForm" :rules="rules">
          <el-form-item label="分组标题" :label-width="formLabelWidth"  prop="goodsGroupName">
            <el-input v-model="titleForm.goodsGroupName" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" @click="dialogaddTitleVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="addTitle">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <!--编辑类型-->
    <div class="add-type-diolog">
      <el-dialog title="编辑" :visible.sync="dialogTitleVisible">
        <el-form :model="titleForm" ref="titleForm" :rules="rules">
          <el-form-item label="分组标题" :label-width="formLabelWidth"  prop="goodsGroupName">
            <el-input v-model="titleForm.goodsGroupName" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" @click="dialogTitleVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="saveTitle">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import { formatDateNew } from '../../../utils/dateUtils'
import qs from 'qs'
import knowlwdgerules from '../components/knowledgeValidRules'
export default {
  data () {
    return {
      rules: knowlwdgerules,
      formLabelWidth: '100px',
      titleForm: {
        id: '',
        goodsGroupName: '',
      },
      dialogTitleVisible: false,
      dialogaddTitleVisible: false,
      pageOption: {
        pageNum: 1,
        pageSize: 20
      },
      totalSize: 0,
      groupList: [],
      currentPage: 1
    }
  },
  created () {
    this.getGoodsGroupList()
  },
  methods: {
    // 打开添加类型弹框
    openDialogTitle (row) {
      this.dialogTitleVisible = true
      this.titleForm.id = row.id
      this.titleForm.goodsGroupName = row.goodsGroupName
    },
    // 打开添加类型弹框
    openaddDialogTitle (row) {
      this.dialogaddTitleVisible = true
      this.titleForm.goodsGroupName = row.goodsGroupName
    },
    // 获取类型列表
    getGoodsGroupList () {
      this.$http.get('/goodsGroup/list', {}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.groupList = resp.data.lists
          // 算出有多少条数据
          this.totalSize = resp.data.totalSize
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    // 保存
    saveTitle () {
      this.$refs['titleForm'].validate((valid) => {
        if (valid) {
          let params = {
            goodsGroupName: this.titleForm.goodsGroupName,
            id: this.titleForm.id
          }
          this.$http.post('/goodsGroup/insert', qs.stringify(params)).then(res => {
            if (res.data.data) {
              this.dialogTitleVisible = false
              this.$message.success('保存成功')
              this.getGoodsGroupList()
            } else {
              let msg =res.data.desc || "保存失败"
              this.$message.error(msg)
              this.dialogTitleVisible = false
             
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 新增
    addTitle () {
      this.$refs['titleForm'].validate((valid) => {
        if (valid) {
          let params = {
            goodsGroupName: this.titleForm.goodsGroupName
          }
          this.$http.post('/goodsGroup/insert', qs.stringify(params)).then(res => {
            if (res.data.data) {
              this.dialogaddTitleVisible = false
              this.$message.success('保存成功')
              this.getGoodsGroupList()
            } else {
              let msg =res.data.desc || "保存失败"
              this.$message.error(msg)
              this.dialogaddTitleVisible = false
             
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 分页请求
    pageChange (currentPage) {
      this.currentPage = currentPage
      let params = {
        pageNum: this.currentPage,
        pageSize:20
      }
      this.$http.get('/goodsGroup/list', {params: params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.groupList = resp.data.lists
          // 算出有多少条数据
          this.totalSize = resp.data.totalSize
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    // 删除
    deleteTitle (row) {
      let params ={
        id : row.id
      }
      this.$confirm('确认删除本条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/goodsGroup/delete', qs.stringify(params)).then(res => {
          let msg = res.data.success
          if (msg) {
            if (res.data.data) {
              this.$message.success('删除成功')
              this.getGoodsGroupList()
            } else {
              let msg = res.data.desc || '删除失败'
              this.$message.error(msg)
            }
          } else {
            let msg = res.data.desc || '删除失败'
            this.$message.error(msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 复制
    copy (row) {
      let params ={
        id : row.id
      }
      this.$confirm('确认复制本条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$http.post('/goodsGroup/copy', qs.stringify(params)).then(res => {
          let msg = res.data.success
          if (msg) {
            if (res.data.data) {
              this.$message.success('复制成功')
              this.getGoodsGroupList()
            } else {
              let msg = res.data.desc || '复制成功'
              this.$message.error(msg)
            }
          } else {
            let msg = res.data.desc || '复制成功'
            this.$message.error(msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消复制'
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

    .add-type {
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 10px;
      font-size: 12px;
      a{
        text-decoration: none;
        color: #909399;
        margin-right:20px;
      }
      .connect-ad {
        cursor: pointer;
        color: #909399;
        font-weight: 400;
        &:hover {
          color: #333
        }
      }
    }
    .link-theme{
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 10px;
      font-size: 12px;
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
  
  .input-width{
    display: inline-block;
    width: 80%;
  }
  .upload-demo{
    display: inline-block;
  }
  .in-line{
    display: inline-block;
    margin-right: 10px;
    color: #aaa;
    margin-top: 8px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width:150px;
  }

  .link-blue{
    color: #409eff;
    &:visited{
      color: #409eff;
    }
  }
}
</style>
