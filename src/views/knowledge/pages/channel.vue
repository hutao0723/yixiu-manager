<template>
  <section class="app-main-wrap">
    <div class="title-wrap">
      <el-button type="primary" size="small" class="fr" @click="showAppAdd">新增渠道</el-button>
    </div>
    <div class="content">
      <div class="tabel-wrap">
        <template>
          <el-table :data="appList" style="width: 100%">
            <el-table-column prop="id" label="渠道ID"></el-table-column>
            <el-table-column prop="name" label="渠道名称"></el-table-column>
            <el-table-column prop="rate" label="分成比例（%）"></el-table-column>
            <el-table-column prop="validPeriod" label="用户有效期（天）"></el-table-column>
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
    <el-dialog :title="titleDialog" :visible.sync="addDialog">
      <el-form :model="addForm">
        <el-form-item label="渠道名称" label-width="100px">
          <el-input v-model="addForm.name" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="分成比例" label-width="100px">
          <el-input v-model="addForm.rate" class="w200">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="用户有效期" label-width="100px">
          <el-input v-model="addForm.validPeriod" class="w200 mr20">
            <template slot="append">天</template>
          </el-input>
          <el-button type="text" @click="changeValidPeriod(30)">1个月</el-button>
          <el-button type="text" @click="changeValidPeriod(90)">3个月</el-button>
          <el-button type="text" @click="changeValidPeriod(365)">12个月</el-button>
          
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="getAppAdd" v-show="!editId">确 定</el-button>
        <el-button type="primary" @click="getAppEdit" v-show="editId">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
	import qs from 'qs'

  const url = '';
  const api = {
    pageList: url + '/channel/pageList',
    update: url + '/channel/update',
    add: url + '/channel/add',
    
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
          rate: '',
          validPeriod: '',
          name: '',
        },
        titleDialog: '',
        editId: '',
      }
    },
    filters: {
    },
    created() {
      this.getAppList()
    },
    methods: {
      changeValidPeriod(days){
        if(days){
          this.addForm.validPeriod = days;
        }
      },
      getAppList() {
        let params = {
          id: '',
          name: '',
          pageNum: this.pageOption.pageNum,
          pageSize: this.pageOption.pageSize,
        }
        this.$http.get(api.pageList, { params: params }).then(res => {
          let resp = res.data
          if (resp.success) {
            this.appList = resp.data.content;
            this.totalSize = resp.data.totalElements;
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
          rate: '',
          validPeriod: '',
          name: '',
        };
        this.addDialog = true;
      },
      showAppEdit(obj) {
        this.editId = obj.id;
        this.titleDialog = '编辑';
        this.addForm = {
          rate: obj.rate,
          validPeriod: obj.validPeriod,
          name: obj.name,
        };
        this.addDialog = true;
      },
      getAppAdd() {
        this.addDialog = false;
        let params = {
          name: this.addForm.name,
          rate: this.addForm.rate,
          validPeriod: this.addForm.validPeriod,
        }
        this.$http.post(api.add, qs.stringify(params)).then(res => {
          if (res.data.success) {
            this.getAppList();
          }
        })
      },
      getAppEdit() {
        this.addDialog = false;
        let params = {
          name: this.addForm.name,
          rate: this.addForm.rate,
          validPeriod: this.addForm.validPeriod,
          id: this.editId,
        }
        this.$http.post(api.update, qs.stringify(params)).then(res => {
          if (res.data.success) {
            this.getAppList();
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