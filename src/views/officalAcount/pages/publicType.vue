<template>
  <section class="app-main-wrap">
    <div class="title-wrap">
      <el-button type="primary" size="small" class="fr" @click="showAppAdd">新增公众号类型</el-button>
    </div>
    <div class="content">
      <div class="tabel-wrap">
        <template>
          <el-table :data="appList" style="width: 100%">
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="name" label="类型"></el-table-column>
            <el-table-column prop="appNum" label="公众号数量"></el-table-column>
            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="showAppEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="delApp(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="page-control">
        <el-pagination background :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="changePageAppList" layout="total, prev, pager, next"
          :total="totalSize"></el-pagination>
      </div>
    </div>
    <el-dialog :title="titleDialog" :visible.sync="addDialog" @close="closeDialog('addForm')">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="类型名称" label-width="100px" prop="name">
          <el-input v-model="addForm.name" class="w200"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="getAppAdd('addForm')" v-show="!editId">确 定</el-button>
        <el-button type="primary" @click="getAppEdit('addForm')" v-show="editId">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import qs from 'qs'

  const url = '';
  const api = {
    pageList: url + '/content/type/appType/list',
    insert: url + '/content/type/insert ',
    delete: url + '/content/type/appType/delete'

  }
  export default {
    data() {
      return {
        pageOption: {
          pageNum: 1,
          pageSize: 20
        },
        totalSize: 0,
        appList: [],
        addDialog: false,
        addForm: {
          name: '',
        },
        titleDialog: '',
        editId: '',

        addRules: {
          name: [
            { required: true, message: '请输入类型名称', trigger: 'change' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
          ],
        }
      }
    },

    filters: {
    },
    created() {
      this.getAppList()
    },
    methods: {
      delApp(id) {
        this.$confirm('确定删除该公众号类型？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id,
          }
          let _params = Object.assign(params)
          this.$http.post(api.delete, qs.stringify(_params)).then(res => {
            let resp = res.data
            if (resp.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getAppList()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
        }).catch(() => {
        })
      },
      closeDialog(formName) {
        this.$refs[formName].resetFields();
      },
      getAppList() {
        let params = {
          modelType: 2,
          name: '',
          pageNum: this.pageOption.pageNum,
          pageSize: this.pageOption.pageSize,
        }
        this.$http.get(api.pageList, { params: params }).then(res => {
          let resp = res.data
          if (resp.success) {
            this.appList = resp.data.lists;
            this.totalSize = resp.data.totalSize;
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },

      changePageAppList(page) {
        this.pageOption.pageNum = page;
        this.getAppList();
      },

      showAppAdd() {
        this.editId = '';
        this.titleDialog = '新增';
        this.addForm = {
          name: '',
        };
        this.addDialog = true;
      },
      showAppEdit(obj) {
        this.editId = obj.id;
        this.titleDialog = '编辑';
        this.addForm = {
          name: obj.name,
        };
        this.addDialog = true;
      },
      getAppAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addDialog = false;
            let params = {
              name: this.addForm.name,
              modelType: 2,
            }
            let _params = Object.assign(params)
            this.$http.post(api.insert, qs.stringify(_params)).then(res => {
              if (res.data.success) {
                this.$message.success('保存成功!');
                this.getAppList();
              } else {
              this.$message({
                type: 'error',
                message: '保存失败!'
              })
            }
            })
          }
        })
      },
      getAppEdit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addDialog = false;
            let params = {
              name: this.addForm.name,
              modelType: 2,
              id: this.editId,
            }
            let _params = Object.assign(params)
            this.$http.post(api.insert, qs.stringify(_params)).then(res => {
              if (res.data.success) {
                this.$message.success('保存成功');
                this.getAppList();
              } else {
              this.$message({
                type: 'error',
                message: '保存失败!'
              })
            }
            })
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
      height: 50px;
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
    .tabel-wrap {
      .app-avatar {
        width: 40px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        float: left;
      }
      .app-name {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
      }

    }
    .page-control {
      float: right;
      margin-top: 20px;
      &:after {
        clear: both;
      }
    }
    .appdetail-diolog,
    .domain-diolog {
      .el-dialog__body {
        overflow: hidden;
        span {
          display: block;
        }
      }
    }
    .app-avatar {
      width: 40px;
      height: 40px;
      line-height: 40px;
      display: inline-block;
      float: left;
    }
  }
</style>