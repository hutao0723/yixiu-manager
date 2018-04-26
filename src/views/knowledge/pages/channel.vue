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
            <el-table-column label="分成比例（%）">
              <template slot-scope="scope">
                <span>{{scope.row.rate/100}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="validPeriod" label="用户有效期（天）" :render-header="renderHeader"></el-table-column>
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
        <el-form-item label="渠道名称" label-width="100px" prop="name">
          <el-input v-model="addForm.name" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="分成比例" label-width="100px" prop="rate">
          <el-input v-model="addForm.rate" class="w200">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="用户有效期" label-width="100px" prop="validPeriod">
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
    pageList: url + '/channel/pageList',
    update: url + '/channel/update',
    add: url + '/channel/add',

  }
  export default {
    data() {
      var rateRule = (rule, value, callback) => {
        if(/^\d+\.\d+$/.test(String(value*100))){
          callback(new Error('最多两位小数'));
        }else{
          if(value > 100){
            callback(new Error('最大值为100.00'));
          }else{
            callback()
          }
        }
      };
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

        addRules: {
          rate: [
            { required: true, message: '请输入分成比例', trigger: 'change' },
            {validator: rateRule, trigger: 'change' },
          ],
          validPeriod: [
            { required: true, message: '请输入用户有效期', trigger: 'change' },
            { pattern: /^[1-9][0-9]{0,4}$/, message: '数值为 1 到 99999', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入渠道名称', trigger: 'change' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
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
      renderHeader(h) {
        return (
          <div>
            用户有效期（天）
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">用户点击推广链接会和渠道绑定用户关系，在有效期内用户再次进入小程序下单，无论是再<br/>通过该渠道的推广链接还是直接进入小程序购买，都算渠道收入；若用户点击其他渠道的推<br/>广链接，则会与最新的渠道绑定用户关系，且收入都算最新绑定渠道。</div>
              <i class="el-icon-question cp"></i>
            </el-tooltip>
          </div>

        )
      },
      closeDialog(formName) {
        this.$refs[formName].resetFields();
      },
      changeValidPeriod(days) {
        if (days) {
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
          rate: obj.rate / 100,
          validPeriod: obj.validPeriod,
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
              rate: this.addForm.rate * 100,
              validPeriod: this.addForm.validPeriod,
            }
            let _params = Object.assign(params)
            this.$http.post(api.add, qs.stringify(_params)).then(res => {
              if (res.data.success) {
                this.$message.success('保存成功');
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
              rate: this.addForm.rate * 100,
              validPeriod: this.addForm.validPeriod,
              id: this.editId,
            }
            let _params = Object.assign(params)
            this.$http.post(api.update, qs.stringify(_params)).then(res => {
              if (res.data.success) {
                this.$message.success('保存成功');
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