<template>
  <section class="dlv-main">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/dlv/theme' }">公众号主题</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="link-theme">
        <i class="iconfont icon-jia" style="vertical-align: middle;"></i>
        <span class="connect-ad" @click="openDialogTheme" style="vertical-align: middle;">主题</span>
      </span>
    </div>
    <div class="conbtent">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="searchForm" class="form" size="mini">
            <el-form-item>
                <el-select v-model="searchForm.theme" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
                    <el-option v-for="item in themeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>           
            <el-form-item>
              <el-select v-model.number="searchForm.status" placeholder="主题状态">
                <el-option label="启用" value="0"></el-option>
                <el-option label="停用" value="1"></el-option>
                <el-option label="系统停用" value="2"></el-option>
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
          <el-table :data="tableData"  style="width: 100%" :header-cell-style='headerStyle'>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="name" label="主题"></el-table-column>
            <el-table-column prop="province" label="公众号数量" ></el-table-column>
            <el-table-column prop="city" label="主题状态" ></el-table-column>
            <el-table-column  label="操作" width="250">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="openDialogEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="openDilogCpTheme(scope.row)">复制</el-button>     
                <el-button type="text" size="small" @click="openDilogStatus(scope.row)">状态</el-button>
                <router-link :to="{ path: '/manager/dlv/link/' + scope.row.id }">          
                  <el-button type="text" size="small" @click="redirectLinkPage(scope.row)">公众号</el-button>
                </router-link>
                <el-button type="text" size="small" @click="deleteThemeModel(scope.row)">删除</el-button>                          
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="page-control">
        <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
      </div>
    </div>
    <div class="add-theme-diolog">
      <el-dialog title="添加主题" :visible.sync="dialogofTheme">
        <el-form :model="themeForm" :rules="rules">
          <el-form-item label="主题" :label-width="formLabelWidth" prop="newTheme">
            <el-input v-model="themeForm.newTheme" auto-complete="off"></el-input>
          </el-form-item> 
        <div class="btn-wrap">
          <el-button size="small" type="primary" @click="addTheme">保存</el-button>
        </div>         
        </el-form>

      </el-dialog>
    </div>
    <div class="change-status-diolog">
      <el-dialog title="主题状态" :visible.sync="dialogofStatus">
        <template>
          <el-radio-group v-model="themeForm.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">系统停用</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </template>
        <div class="btn-wrap">
          <el-button size="small" type="primary" @click="changeStatus">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="edit-theme-diolog">
      <el-dialog title="编辑主题" :visible.sync="dialogofEdit">
        <el-form :model="themeForm" :rules="rules">
          <el-form-item label="主题" :label-width="formLabelWidth" prop="theme">
            <el-input v-model="themeForm.theme" auto-complete="off"></el-input>
          </el-form-item> 
        <div class="btn-wrap">
          <el-button size="small" type="primary" @click="editTheme()">保存</el-button>
        </div>         
        </el-form>
      </el-dialog>
    </div>
    <div class="copy-theme-diolog">
      <el-dialog title="复制主题" :visible.sync="dialogofCpTheme">
        <el-form :model="themeForm" :rules="rules">
          <el-form-item label="主题" :label-width="formLabelWidth" prop="theme">
            <el-input v-model="themeForm.copyTheme" auto-complete="off"></el-input>
          </el-form-item> 
        <div class="btn-wrap">
          <el-button size="small" type="primary" @click="copyTheme()">保存</el-button>
        </div>         
        </el-form>
      </el-dialog>
    </div>      
  </section>
</template>

<script>
import {rules} from '../components/deliveryValidRules'
console.log(rules)
export default {
  name: 'delivery',
  data () {
    return {
      searchForm: {
        theme: '',
        status: ''
      },
      themeList: [
        {
          label: 'aa',
          value: ''
        }],
      loading: '',
      headerStyle: {
        backgroundColor: '#f8f8f8'
      },
      formLabelWidth: '50px',
      dialogofTheme: false,
      dialogofStatus: false,
      dialogofEdit: false,
      dialogofCpTheme: false,
      rules: rules,
      themeForm: {
        newTheme: '',
        status: '',
        theme: '',
        copyTheme: ''
      },
      tableData: [
        {
          id: '5',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '未启用',
          zip: 200333
        }]
    }
  },

  methods: {
    onSearch () {
      this.$http.get('http://localhost:3000/weChatlist').then(res => {
        let data = res.data
        console.log(data)
      })
    },
    openDialogTheme () {
      this.dialogofTheme = true
    },
    openDilogStatus () {
      this.dialogofStatus = true
    },
    openDialogEdit (row) {
      this.dialogofEdit = true
      this.themeForm.theme = row.name
    },
    openDilogCpTheme (row) {
      this.dialogofCpTheme = true
      this.themeForm.copyTheme = row.name + '[复制]'
    },
    redirectLinkPage (row) {
      let theme = row.name
      this.$store.replaceState({ theme })
      console.log(this.$store)
    },
    deleteThemeModel (row) {
      // TODO
      let id = row.id
      this.$confirm('确定删除主题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('//192.168.2.87:9101/subscriptionTheme/delete', {params: {id}}).then(res => {
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
    remoteMethod () {
      
    },
    changeStatus () {

    },
    addTheme () {

    },
    editTheme () {

    },
    copyTheme () {

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
