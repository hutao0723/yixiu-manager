<template>
  <section class="lecturer-container">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>讲师</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="add-type">
        <i class="iconfont icon-jia" style="vertical-align: middle;"></i>
        <span class="connect-ad" @click="openaddDialogLecturer" style="vertical-align: middle;">讲师</span>
      </span>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="searchForm" class="form" size="mini">
            <el-form-item>
              <el-select v-model="searchForm.name" placeholder="讲师名称">
                <el-option v-for="(item,index) in selectOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.value" placeholder="请输入"></el-input>              
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>
      <div class="tabel-wrap">
        <template>
          <el-table :data="typeList" style="width: 100%" >
            <el-table-column prop="id" label="讲师ID" ></el-table-column>
            <el-table-column prop="nickName" label="讲师昵称" ></el-table-column>
            <el-table-column  label="操作" >
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="openDialogLecturer(scope.row)">编辑</el-button>        
                <el-button type="text" size="mini" @click="deleteLecturer(scope.row)">删除</el-button>  
              </template>
            </el-table-column>
          </el-table>
        </template>        
      </div>
      <div class="page-control">
        <el-pagination background  :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="total, prev, pager, next" :total="totalSize"></el-pagination>
      </div>    
    </div>
    <!--添加讲师-->
    <div class="add-type-diolog">
      <el-dialog title="添加讲师" :visible.sync="dialogaddLecturerVisible">
        <el-form :model="typeForm" ref="typeForm" :rules="rules">
          <el-form-item label="讲师昵称" :label-width="formLabelWidth"  prop="nickName">
            <el-input v-model="typeForm.nickName" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" @click="dialogaddLecturerVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="addLecturer">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <!--编辑讲师-->
    <div class="add-type-diolog">
      <el-dialog title="编辑讲师" :visible.sync="dialogLecturerVisible">
        <el-form :model="typeForm" ref="typeForm" :rules="rules">
          <el-form-item label="讲师昵称" :label-width="formLabelWidth"  prop="nickName">
            <el-input v-model="typeForm.nickName" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" @click="dialogLecturerVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="saveLecturer">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import { formatDateNew } from '../../../utils/dateUtils'
import knowlwdgerules from '../components/knowledgeValidRules'
import qs from 'qs'
export default {
  data () {
    return {
      rules: knowlwdgerules,
      formLabelWidth: '100px',
      typeForm: {
        id: '',
        nickName: ''
      },
      character: '%',
      searchForm: {
        name: 'nickName',
        value: ''
      },
      teacher: '',
      selectOptions: [
        {
          value: 'nickName',
          label: '讲师昵称'
        },
        {
          value: 'id',
          label: '讲师ID'
        }
      ],
      dialogLecturerVisible: false,
      dialogaddLecturerVisible: false,
      pageOption: {
        pageNum: 1,
        pageSize: 20
      },
      currentPage: 1,
      totalSize: 0,
      typeList: []
    }
  },
  created () {
    this.getLecturerList()
   
  },
  methods: {
    // 修改讲师弹框
    openDialogLecturer (row) {
      this.dialogLecturerVisible = true
      this.typeForm.id = row.id
      this.searchForm.value = ""
      this.getLecturerList()
      this.typeForm.nickName = row.nickName
    },
    // 添加讲师弹框
    openaddDialogLecturer (row) {
      this.typeForm.id = ""
      this.typeForm.nickName = ""
      this.searchForm.value = ""
      this.getLecturerList()
      this.dialogaddLecturerVisible = true
    },
    // 获取讲师列表
    getLecturerList () {
      this.$http.get('/lecturer/pageList', {}).then(res => {
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
    saveLecturer () {
      this.$refs['typeForm'].validate((valid) => {
        if (valid) {
          let params = {
            nickName: this.typeForm.nickName,
            id: this.typeForm.id
          }
          this.$http.post('/lecturer/update', qs.stringify(params)).then(res => {
            if (res.data.data) {
              this.dialogLecturerVisible = false
              this.$message.success('保存成功')
              this.getLecturerList()
            } else {
              let msg =res.data.desc || "保存失败"
              this.$message.error(msg)
              this.dialogLecturerVisible = false
             
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onSearch () {
      let valueArr = Object.values(this.searchForm)
      let params = {
        pageNum: 1,
        pageSize: 20,
        [valueArr[0]]: valueArr[1]
      }
      this.$http.get('/lecturer/pageList', {params: params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.typeList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
          this.pageOption.pageNum = 1
          this.currentPage = 1
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        } 
      }, () => {
        this.$message.error('网络错误')
      })
    },
    // 新增讲师
    addLecturer () {
      this.$refs['typeForm'].validate((valid) => {
        if (valid) {
          let params = {
            nickName: this.typeForm.nickName
          }
          this.$http.post('/lecturer/add', qs.stringify(params)).then(res => {
            if (res.data.data) {
              this.dialogaddLecturerVisible = false
              this.$message.success('保存成功')
              this.getLecturerList()
            } else {
              let msg =res.data.desc || "保存失败"
              this.$message.error(msg)
              this.dialogaddLecturerVisible = false
             
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
      let valueArr = Object.values(this.searchForm)
      this.currentPage = currentPage
      let params = {
        pageNum: this.currentPage,
        pageSize:20,
        [valueArr[0]]: valueArr[1]
      }
      this.$http.get('/lecturer/pageList', {params: params}).then(res => {
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
    deleteLecturer (row) {
      let params ={
        id : row.id
      }
      this.$confirm('确认删除讲师吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/lecturer/delete', qs.stringify(params)).then(res => {
          let msg = res.data.success
          if (msg) {
            if (res.data.data) {
              this.$message.success('删除成功')
              this.getLecturerList()
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
    }
  }
}
</script>
<style lang="less" scoped>
.lecturer-container {
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
    .link-rate{
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
  .character {
    .el-input:first-child{
      width:90%;
    }
    .el-input:last-child{
      width: 10%;
      color: #000;
      margin-left:-1%;
    }
  }
}
</style>
