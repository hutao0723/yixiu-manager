<template>
  <section class="app-main-wrap">
    <div class="title-wrap">
      <!-- <span class="add-ofa">
        <el-button type="primary" icon="el-icon-circle-plus" @click="getMiniApp" size="small">页面</el-button>
      </span> -->
      <el-select v-model="topForm.extendType" size="small" class="fl mr10 w150">
        <el-option label="渠道ID" :value="0"></el-option>
        <el-option label="渠道名称" :value="1"></el-option>
      </el-select>
      <el-input v-model="topForm.extendValue" placeholder="请输入" size="small" class="fl mr10 w200"></el-input>
      <el-select v-model="topForm.channelType" size="small" class="fl mr10 w150">
        <el-option label="推广位ID" :value="0"></el-option>
        <el-option label="推广位名称" :value="1"></el-option>
      </el-select>
      <el-input v-model="topForm.channelValue" placeholder="请输入" size="small" class="fl mr10 w200"></el-input>
      <el-button type="primary" size="small" @click="getAppList">查询</el-button>


      <el-button type="primary" size="small" class="fr" @click="showAppAdd">新增推广位</el-button>
    </div>
    <div class="content">
      <div class="tabel-wrap">
        <template>
          <el-table :data="appList" style="width: 100%">
            <el-table-column prop="id" label="推广位ID"></el-table-column>
            <el-table-column prop="name" label="推广位名称"></el-table-column>
            <el-table-column prop="channelId" label="渠道ID"></el-table-column>
            <el-table-column prop="channelName" label="渠道名称"></el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="showAppEdit(scope.row)">编辑</el-button>
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
        <el-form-item label="渠道名称" label-width="100px" prop="channelId">
          <el-select v-model="addForm.channelId" placeholder="请选择" :disabled="editId>0" class="w200">
            <el-option :label="item.name" :value="item.id" v-for="item in channelList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推广位名称" label-width="100px" prop="name">
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
    add: url + '/adzone/add',
    update: url + '/adzone/update',
    pageList: url + '/adzone/pageList',
    getList: url + '/channel/getList',
  }
  export default {
    data() {
      return {
        topForm: {
          extendType: 0,
          channelType: 0,
          extendValue: '',
          channelValue: '',
        },
        pageOption: {
          pageNum: 1,
          pageSize: 20
        },
        totalSize: 0,
        appList: [],
        addDialog: false,
        addForm: {
          channelId: '',
          name: '',
        },
        channelList: [], // 渠道列表
        titleDialog: '',
        editId: '',
        addRules: {
          channelId: [
            { required: true, message: '请选择渠道', trigger: 'change' },
          ],
          name: [
            { required: true, message: '请输入推广位名称', trigger: 'change' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
          ],
        }
      }
    },
    filters: {
    },
    created() {
      this.getAppList();
      this.getChannelList();
    },
    methods: {
      closeDialog(formName) {
        this.$refs[formName].resetFields();
      },
      getChannelList() {


        this.$http.get(api.getList).then(res => {
          let resp = res.data
          if (resp.success) {
            this.channelList = resp.data
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      getAppList() {
        let params = {
          channelName: this.topForm.extendType ? this.topForm.extendValue : '',
          channelId: this.topForm.extendType ? '' : this.topForm.extendValue,
          name: this.topForm.channelType ? this.topForm.channelValue : '',
          id: this.topForm.channelType ? '' : this.topForm.channelValue,
          pageNum: this.pageOption.pageNum,
          pageSize: this.pageOption.pageSize,
        }
        this.$http.get(api.pageList, { params: params }).then(res => {
          let resp = res.data
          if (resp.success) {
            this.appList = resp.data.content
            this.totalSize = resp.data.totalElements
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
          channelId: '',
          name: '',
        };
        this.addDialog = true;
      },
      showAppEdit(obj) {
        this.editId = obj.id;
        this.titleDialog = '编辑';
        this.addForm = {
          channelId: obj.channelId,
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
              channelId: this.addForm.channelId,
            }
            let _params = Object.assign(params)
            this.$http.post(api.add, qs.stringify(_params)).then(res => {
              if (res.data.success) {
                this.getAppList();
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
              channelId: this.addForm.channelId,
              id: this.editId,
            }
            let _params = Object.assign(params)
            this.$http.post(api.update, qs.stringify(_params)).then(res => {
              if (res.data.success) {
                this.getAppList();
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