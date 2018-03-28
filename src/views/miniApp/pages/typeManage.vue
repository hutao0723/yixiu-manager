<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/miniApp/contentManage' }">内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>类型管理</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="link-theme">
        <i class="iconfont icon-jia" style="vertical-align: middle;"></i>
        <span class="connect-ad" @click="openaddDialogType" style="vertical-align: middle;">类型</span>
      </span>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
        </template>
      </div>
      <div class="tabel-wrap">
        <template>
          <el-table :data="typeList" style="width: 100%" >
            <el-table-column prop="id" label="ID" ></el-table-column>
            <el-table-column prop="parentName" label="一级类型" ></el-table-column>
            <el-table-column prop="name" label="二级类型" ></el-table-column>
            <el-table-column  label="操作" >
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="openDialogType(scope.row)">编辑</el-button>        
                <el-button type="text" size="mini" @click="deleteType(scope.row)">删除</el-button>  
              </template>
            </el-table-column>
          </el-table>
        </template>        
      </div>
      <div class="page-content">
        <div class="fl total-num" v-if="totalSize > 0">共<span class="blue">{{totalSize}}</span>条</div>
        <div class="page-control">
          <el-pagination background  :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="prev, pager, next" :total="totalSize"></el-pagination>
        </div>    
      </div>
    </div>
    <!--添加类型-->
    <div class="add-type-diolog">
      <el-dialog title="添加类型" :visible.sync="dialogaddTypeVisible">
        <el-form :model="typeForm" ref="typeForm" :rules="rules">
          <el-form-item label="一级类型" :label-width="formLabelWidth"  prop="parentName">
            <el-input v-model="typeForm.parentName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="二级类型" :label-width="formLabelWidth"  prop="name">
            <el-input v-model="typeForm.name" auto-complete="off"></el-input>
          </el-form-item>           
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" @click="dialogTypeVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="addType">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <!--编辑类型-->
    <div class="add-type-diolog">
      <el-dialog title="编辑类型" :visible.sync="dialogTypeVisible">
        <el-form :model="typeForm" ref="typeForm" :rules="rules">
          <el-form-item label="一级类型" :label-width="formLabelWidth"  prop="parentName">
            <el-input v-model="typeForm.parentName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="二级类型" :label-width="formLabelWidth"  prop="name">
            <el-input v-model="typeForm.name" auto-complete="off"></el-input>
          </el-form-item>           
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" @click="dialogTypeVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="saveType">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import { formatDateNew } from '../../../utils/dateUtils'
import minirules from '../components/miniValidRules'
import qs from 'qs'
export default {
  data () {
    return {
      rules: minirules,
      formLabelWidth: '100px',
      typeForm: {
        id: '',
        parentId: '',
        parentName: '',
        name: ''
      },
      dialogTypeVisible: false,
      dialogaddTypeVisible: false,
      pageOption: {
        pageNum: 1,
        pageSize: 20
      },
      totalSize: 10,
      typeList: []
    }
  },
  created () {
    this.getTypeList()
  },
  methods: {
    // 打开添加类型弹框
    openDialogType (row) {
      this.dialogTypeVisible = true
      this.typeForm.id = row.id
      this.typeForm.parentId = row.parentId
      this.typeForm.parentName = row.parentName
      this.typeForm.name = row.name
    },
    // 打开添加类型弹框
    openaddDialogType (row) {
      this.dialogaddTypeVisible = true
      this.typeForm.parentName = row.parentName
      this.typeForm.name = row.name
    },
    // 获取类型列表
    getTypeList () {
      this.$http.get('/content/type/pageList', {}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.typeList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    // 保存
    saveType () {
      this.$refs['typeForm'].validate((valid) => {
        if (valid) {
          let params = {
            parentName: this.typeForm.parentName,
            name: this.typeForm.name,
            parentId: this.typeForm.parentId,
            id: this.typeForm.id
          }
          this.$http.post('/content/type/update', qs.stringify(params)).then(res => {
            if (res.data.data) {
              this.dialogTypeVisible = false
              this.$message.success('保存成功')
              this.getTypeList()
            } else {
              let msg =res.data.desc || "保存失败"
              this.$message.error(msg)
              this.dialogTypeVisible = false
             
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 新增类型
    addType () {
      this.$refs['typeForm'].validate((valid) => {
        if (valid) {
          let params = {
            parentName: this.typeForm.parentName,
            name: this.typeForm.name
          }
          this.$http.post('/content/type/add', qs.stringify(params)).then(res => {
            if (res.data.data) {
              this.dialogaddTypeVisible = false
              this.$message.success('保存成功')
              this.getTypeList()
            } else {
              let msg =res.data.desc || "保存失败"
              this.$message.error(msg)
              this.dialogaddTypeVisible = false
             
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 分页请求
    pageChange () {
      let params = {
        pageNum: this.pageOption.pageNum,
        pageSize:20
      }
      this.$http.get('/content/type/pageList', {params: params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.typeList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    // 删除
    deleteType (row) {
      let params ={
        id : row.id
      }
      this.$confirm('确认删除本条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/content/type/delete', qs.stringify(params)).then(res => {
          let msg = res.data.success
          if (msg) {
            if (res.data.data) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getTypeList()
            } else {
              this.$message({
                type: 'error',
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
  .page-content{
    overflow: hidden;
    .total-num{
      margin-top: 28px;
      margin-left: 10px;
      color: #606266;
      .blue{
        color: #409eff;
      }
    }
    .page-control {
      float: right;
      margin-top: 20px;
      &:after {
        clear: both;
      }
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
}
</style>
