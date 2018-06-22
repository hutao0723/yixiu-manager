<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager' }">公众号</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="add-ofa">
        <!-- <i class="iconfont icon-guanlian"></i> -->
        <!-- <router-link :to="{ path: '/manager/officalAcount/create' }"> -->
        <span class="offical-acount" @click="getWeChatSetting">公众号</span>
        <!-- </router-link> -->
      </span>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="ofaSearchForm" class="demo-form-inline" size="mini">
            <el-form-item>
              <el-select v-model="ofaSearchForm.searchWay" placeholder="查询方式">
                <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="ofaSearchForm.searchValue" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>
      <div class="tabel-wrap">
        <template>
          <el-table :data="officalAcountList" style="width: 100%">
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column label="公众号类型">
              <template slot-scope="scope">
                <span v-if="scope.row.serviceTypeInfo == 0 || scope.row.serviceTypeInfo == 1">订阅号</span>
                <span v-if="scope.row.serviceTypeInfo == 2">服务号</span>
              </template>
            </el-table-column>
            <el-table-column label="公众号">
              <template slot-scope="scope">
                <img :src="scope.row.headImg" alt="" class="table-headimg">
                <span v-text="scope.row.name"></span>
              </template>
            </el-table-column>
            <el-table-column label="公众号状态">
              <template slot-scope="scope">
                <el-select v-model="scope.row.serviceStatus" placeholder="请选择" size="small" @change="setGzhSatus($event,scope.row.id)">
                  <el-option v-for="(item,index) in gzhStatus" :key="index" :label="item" :value="index">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="todayNewFollow" label="当日新增关注"></el-table-column>
            <el-table-column prop="todayNewUnFollow" label="当日取消关注"></el-table-column>
            <el-table-column prop="managerName" label="管理员"></el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button v-if="scope.row.serviceTypeInfo == 2" type="text" size="mini" @click="goToTemplateMessage(scope.row)">模板消息</el-button>
                <el-button type="text" size="mini" @click="openDialogType(scope.row.appId,scope.row.id)">类型</el-button>
                <el-button type="text" size="mini" @click="openDialogAdmin(scope.row.managerName,scope.row.id)">管理员</el-button>
                <el-button type="text" size="mini" @click="getWeChatSetting">授权</el-button>
                <el-button type="text" size="mini" @click="delAcount(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="page-control">
        <el-pagination background :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="prev, pager, next"
          :total="totalSize"></el-pagination>
      </div>
    </div>
    <el-dialog title="设置类型" :visible.sync="dialogType" width="30%">
      <el-form :rules="typeRules" ref="typeForm" :model="typeForm">
        <el-form-item label="类型名称" label-width="100px" prop="name">
          <el-select v-model="typeForm.name" class="iptl w150">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogType = false">取 消</el-button>
        <el-button type="primary" @click="setTypeName">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置管理员" :visible.sync="dialogAdmin" width="30%">
      <el-form :rules="rules" ref="adminForm" :model="adminForm">
        <el-form-item label="管理员名称" label-width="100px" prop="adminName">
          <el-input v-model="adminForm.adminName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdmin = false">取 消</el-button>
        <el-button type="primary" @click="setAdminName">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import qs from 'qs'

  export default {
    data() {
      return {
        searchOptions: [{
          value: 'name',
          label: '公众号'
        }],

        ofaSearchForm: {
          searchWay: '',
          searchValue: ''
        },
        pageOption: {
          pageNum: 1,
          size: 20
        },
        totalSize: 1,
        officalAcountList: [{
          id: 1,
          name: 'adsa',
          todayNewFollow: 10,
          todayNewUnFollow: 200
        }],
        gzhStatus: [
          '未投放', '投放中', '托管', '运营中'
        ], // 公众号状态
        dialogAdmin: false, // 管理员弹窗
        adminName: '', // 管理员名称
        adminId: '', // 管理员id
        adminForm: {
          adminName: '',
        },
        rules: {
          adminName: [{
              required: true,
              message: '请输入管理员名称',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 64,
              message: '长度在 1 到 64 个字符',
              trigger: 'blur'
            }
          ],
        },
        appId: '',
        typeId: '',
        typeForm: {
          name: '',
        },
        typeRules: {
          name: [{
            required: true,
            message: '请输入管理员名称',
            trigger: 'blur'
          }, ],
        },
        typeList: [],
        dialogType: false,


      }
    },
    created() {
      this.getAllList()
      this.getTypeList()
    },
    methods: {
			getTypeList() {
        let params = {
          modelType: 2,
          name: '',
        }
        this.$http.get('/content/type/appType/all', { params: params }).then(res => {
          let resp = res.data
          if (resp.success) {
            this.typeList = resp.data
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      //打开设置管理员弹窗
      openDialogType(appId, id) {
        console.log(appId, id)
        this.$http.get('/content/type/band/info?authorizerId=' + id).then(res => {
          if (res.data.success) {
						console.log(id)
            this.typeForm.name = res.data.data?res.data.data.id:'';
            this.typeId = id;
            this.appId = appId;
            this.dialogType = true;
          } else {
            let msg = res.data.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      // 设置管理员
      setTypeName() {
        this.$refs['typeForm'].validate((valid) => {
          if (valid) {
            let name = this.typeForm.name;
            let typeId = this.typeId;
            let appId = this.appId;
            this.$http.post('/content/type/band', qs.stringify({
              appId,
							authorizerId: typeId,
							authorizerTypeId: name
            })).then(res => {
              this.dialogType = false;
              if (res.data.success) {
                this.$message.success('修改类型成功')
                this.onSearch();
              } else {
                let msg = res.data.desc || '请求失败'
                this.$message.error(msg)
              }
            })
          }
        })
      },
      //打开设置管理员弹窗
      openDialogAdmin(name, id) {
        this.dialogAdmin = true;
        this.adminForm.adminName = name ? name : '';
        this.adminId = id;
      },
      // 设置管理员
      setAdminName() {
        this.$refs['adminForm'].validate((valid) => {
          if (valid) {
            let name = this.adminForm.adminName;
            let id = this.adminId;
            this.$http.get('/subscriptionInfo/update', {
              params: {
                id: id,
                managerName: name,
              }
            }).then(res => {
              this.dialogAdmin = false;
              if (res.data.success) {
                this.$message.success('修改管理员成功')
                this.onSearch();
              } else {
                let msg = res.data.desc || '请求失败'
                this.$message.error(msg)
              }
            })
          }
        })
      },
      setGzhSatus(e, id) {
        this.$http.get('/subscriptionInfo/update', {
          params: {
            id: id,
            serviceStatus: e,
          }
        }).then(res => {
          if (res.data.success) {
            this.$message.success('切换成功')
          } else {
            let msg = res.data.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      handleCurrenthange() {
        console.log(this.pageOption.currentPage)
      },
      onSearch() {
        let searchName = this.ofaSearchForm.searchWay
        let searchValue = this.ofaSearchForm.searchValue
        let name
        searchName === 'name' ? name = searchValue : name = searchValue
        this.$http.get('/subscriptionInfo/list', {
          params: {
            name: name,
            size: 999
          }
        }).then(res => {
          if (res.data.success) {
            if (res.data.data.lists) {
              this.officalAcountList = res.data.data.lists
              // 算出有多少条数据
              this.totalSize = res.data.data.totalSize
            } else {
              this.officalAcountList = []
              this.totalSize = 1
            }
          } else {
            let msg = res.data.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      getAllList() {
        this.$http.get('/subscriptionInfo/list').then(res => {
          if (res.data.success) {
            this.officalAcountList = res.data.data.lists
            // 算出有多少条数据
            this.totalSize = res.data.data.totalSize
          } else {
            let msg = res.data.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      pageChange() {
        this.$http.get('/subscriptionInfo/list', {
          params: this.pageOption
        }).then(res => {
          if (res.data.success) {
            this.officalAcountList = res.data.data.lists
          } else {
            let msg = res.data.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      edit(row) {
        this.$router.push('/manager/officalAcount/create/' + row.id)
      },
      delAcount(row) {
        let id = row.id
        this.$confirm('确定删除主题吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get('/subscriptionInfo/delete', {
            params: {
              id
            }
          }).then(res => {
            let msg = res.data.success
            if (msg) {
              if (res.data.data) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                window.location.reload()
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
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getWeChatSetting() {
      this.$http.get("/wechat/getAuthorization").then(res => {
        console.log(res);
        if (res.data.success) {
          let redirectUrl = res.data.data;
          window.location.href = redirectUrl;
        }
      });
    },
    goToTemplateMessage(row, index) {

      if(!row.authorizerTypeId){
        this.$message({
          type: "error",
          message: "该公众号未关联类型"
        });
        return false;
      }
      this.$router.push({
        name: "templateMessage",
        params: {
          type: row.authorizerTypeId,
          id: row.id
        }
      });
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
    .table-headimg {
      height: 50px;
      width: 50px;
      display: inline-block;
      vertical-align: middle;
    }
  }

</style>
