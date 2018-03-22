<template>
  <section class="dlv-main">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager' }">落地页</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="link-theme">
        <i class="iconfont icon-guanlian"></i>
        <span class="connect-ad" @click="openAddDialog">落地页</span>
      </span>
    </div>
    <div class="conbtent">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="searchForm.data" class="demo-form-inline" size="mini">
            <el-form-item>
              <el-select v-model="searchForm.data.searchName" placeholder="选取公众号">
                <el-option v-for="item in searchForm.selectOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.data.value" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.data.status" placeholder="状态">
                <el-option label="已使用" :value="2"></el-option>
                <el-option label="待使用" :value="1"></el-option>
                <el-option label="不可使用" :value="0"></el-option>
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
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column label="落地页">
              <template slot-scope="scope">
                <a :href="scope.row.loadPageUrl" target="_blank">{{scope.row.loadPageUrl}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="subscriptionName" label="公众号" width="200"></el-table-column>
            <el-table-column prop="thresholdNum" label="当日阈值" width="100"></el-table-column>
            <el-table-column prop="todayFollowNum" label="当日新增关注" width="120"></el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">
                  不可使用
                </span>
                <span v-else-if="scope.row.status === 1">
                  待使用
                </span>
                <span v-else-if="scope.row.status === 2">
                  已使用
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="240">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="openAddDialog(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="openStatusDilog(scope.row)">状态</el-button>
                <el-button type="text" size="small" @click="openThresholdDilog(scope.row)">阈值</el-button>
                <el-button type="text" size="small" @click="deletePageModel(scope.row)">删除</el-button>
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
    <div class="ad-loadPage-diolog">
      <el-dialog title="落地页" :visible.sync="dialogLoadPageVisible">
        <el-form :model="addLoadPage" ref="addLoadPage" :rules="rules">
          <el-form-item label="落地页类型" :label-width="formLabelWidth" prop="type">
            <el-radio-group v-model="addLoadPage.loadPageType" @change="changeLoadpageType">
              <el-radio :label="1">外部</el-radio>
              <el-radio :label="2">内部</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="公众号" :label-width="formLabelWidth" prop="subscriptionId">
            <el-select v-model="addLoadPage.subscriptionId" filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading">
              <el-option v-for="item in searchForm.officalAcountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容类型" :label-width="formLabelWidth" v-show="addLoadPage.loadPageType==2">
            <el-select v-model="addLoadPage.putContentType" filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading">
              <el-option label="平铺" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容名称" :label-width="formLabelWidth" prop="putContentId" v-show="addLoadPage.loadPageType==2">
            <el-select v-model="addLoadPage.putContentId" filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading">
              <el-option v-for="item in contentArr" :key="item.id" :label="item.contentName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="皮肤" :label-width="formLabelWidth" prop="skinId" v-show="addLoadPage.loadPageType==2">
            <el-select v-model="addLoadPage.skinId" filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading">
              <el-option v-for="item in dermaArr" :key="item.id" :label="item.skinName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="落地页名称" :label-width="formLabelWidth" prop="loadPageUrl">
            <el-input placeholder="https://" v-model="addLoadPage.loadPageUrl" auto-complete="off" :disabled="addLoadPage.loadPageType == 2"></el-input>
          </el-form-item>
          <el-form-item label="阈值" :label-width="formLabelWidth" prop="thresholdNum" v-show="isFormEdit">
            <el-input v-model="addLoadPage.thresholdNum" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" type="primary" @click="addPage">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="change-status-diolog">
      <el-dialog title="落地页状态" :visible.sync="dialogStatusVisible">
        <template>
          <el-radio-group v-model="changeForm.status">
            <el-radio :label="1">待使用</el-radio>
            <el-radio :label="2">已使用</el-radio>
            <el-radio :label="0">不可使用</el-radio>
          </el-radio-group>
        </template>
        <div class="btn-wrap">
          <el-button size="small" type="primary" @click="changeStatus">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="edit-threshold-diolog">
      <el-dialog title="设置阈值" :visible.sync="dialogThresholdVisible">
        <el-form ref="changeThresho" :model="changeForm" :rules="rules">
          <el-form-item label="阈值" :label-width="formLabelWidth" prop="thresholdNum">
            <el-input v-model="changeForm.thresholdNum" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" type="primary" @click="changeThresholdNum">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <!--落地页编辑-->
    <div class="edit-loadPageUrl-diolog">
      <el-dialog title="编辑落地页地址" :visible.sync="dialogLoadPageUrlVisible">
        <el-form ref="changeLoadPageUrl" :model="changeForm" :rules="rules">
          <el-form-item label="落地页" :label-width="formLabelWidth" prop="loadPageUrl">
            <el-input v-model="changeForm.loadPageUrl" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" @click="dialogLoadPageUrlVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="changeLoadPageUrl">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
  import { loadPagerules } from '../components/deliveryValidRules'
  import qs from 'qs'

  console.log(loadPagerules)
  export default {
    name: 'delivery',
    data() {
      return {
        searchForm: {
          data: {
            searchName: 'name',
            value: '',
            status: ''
          },
          selectOptions: [
            {
              label: '公众号',
              value: 'name'
            },
            {
              label: '落地页',
              value: 'loadPageUrl'
            }
          ],
          officalAcountOptions: [
          ],

        },
        loading: false,
        totalSize: 50,
        formLabelWidth: '100px',
        dialogLoadPageVisible: false,
        dialogLoadPageUrlVisible: false,
        dialogStatusVisible: false,
        dialogThresholdVisible: false,
        rules: {},
        addLoadPage: {
          loadPageUrl: 'https://',
          subscriptionId: null,
          thresholdNum: null,
          loadPageType: 1,
          skinId: null,
          putContentType: 0,
          putContentId: null,
          id: null,
        },
        changeForm: {
          id: '',
          status: '',
          loadPageUrl: '',
          thresholdNum: null
        },
        pageOption: {
          pageNum: 1,
          size: 20
        },
        subList: [],
        default: [
        ],
        tableData: [],


        contentArr: [], // 内容名称
        dermaArr: [], // 皮肤

        isFormEdit: false,
      }
    },
    created() {
      this.getAllList()
    },
    methods: {
      // 获取皮肤列表
      getDermaList() {
        this.$http.get('/skin/all').then(res => {
          if (res.data.success) {
            console.log(res)
            this.dermaArr = res.data.data;
          }
        }, () => {
          this.$message.error('获取皮肤列表失败')
        })
      },
      // 获取内容名称列表
      getPutNameList() {
        this.$http.get('/put/content/all').then(res => {
          if (res.data.success) {
            console.log(res)
            this.contentArr = res.data.data;
          }
        }, () => {
          this.$message.error('获取皮肤列表失败')
        })
      },
      // 新增编辑落地页信息
      openAddDialog(row) {
        this.getDermaList();
        this.getPutNameList();
        this.fileList = [];
        if (row.id) {
          let params = {
            id: row.id
          }
          this.$http.get('/loadpage/find', { params: params }).then(res => {
            if (res.data.success) {
              const {
                id,
                subscriptionId,
                loadPageUrl,
                thresholdNum,
                loadPageType,
                skinId,
                putContentId
              } = res.data.data;

              this.addLoadPage = {
                id,
                subscriptionId,
                loadPageUrl,
                thresholdNum,
                loadPageType,
                skinId,
                putContentId,
                putContentType: 0,
              }
              this.isFormEdit = false;
            }
          })
        } else {
          this.addLoadPage = {
            id: "",
            subscriptionId: "",
            loadPageUrl: "https://",
            thresholdNum: "",
            loadPageType: 1,
            skinId: "",
            putContentId: "",
            putContentType: 0,
          }
          this.isFormEdit = true;
        }
        const {
          loadPageUrl, subscriptionId, thresholdNum, putContentId, skinId, putContentType
        } = loadPagerules;
        if (this.addLoadPage.loadPageType == 1) {
          this.rules = {
            loadPageUrl,
            subscriptionId,
            thresholdNum,
          }
        } else if (this.addLoadPage.loadPageType == 2) {
          this.rules = {
            loadPageUrl,
            subscriptionId,
            thresholdNum,
            putContentId,
            skinId,
            putContentId,
          }
        }
        this.dialogLoadPageVisible = true
        if (this.$refs['addLoadPage'].resetFields) {
          this.$refs['addLoadPage'].resetFields();
        }
      },

      // < -- 分割线以上20180321liugaoshuai新增 -- >

      // 获取内容
      getContentArr() {
        this.$http.get('/skin/all').then(res => {
          if (res.data.success) {
            this.totalSize = res.data.data.totalSize
            this.tableData = res.data.data.lists
          } else {
            this.$message.error('获取数据失败')
          }
        }, () => {
          this.$message.error('网络错误')
        })
      },
      // 搜索
      onSearch() {
        let searchForm = this.searchForm.data
        let params = {}
        if (searchForm.searchName === 'backupName') {
          params.backupName = searchForm.value
        } else if (searchForm.searchName === 'name') {
          params.name = searchForm.value
        } else {
          params.loadPageUrl = searchForm.value
        }
        params.status = searchForm.status
        this.$http.get('/loadpage/list', { params }).then(res => {
          if (res.data.success) {
            this.totalSize = res.data.data.totalSize
            console.log(res.data.data.lists)
            if (res.data.data.lists) {
              this.tableData = res.data.data.lists
            } else {
              this.totalSize = 1
              this.tableData = this.default
            }
          } else {
            this.$message.error('获取数据失败')
          }
        }, () => {
          this.$message.error('网络错误')
        })
      },
      getAllList() {
        this.$http.get('/loadpage/list').then(res => {
          if (res.data.success) {
            this.totalSize = res.data.data.totalSize
            this.tableData = res.data.data.lists
          } else {
            this.$message.error('获取数据失败')
          }
        }, () => {
          this.$message.error('网络错误')
        })
      },
      changeLoadpageType(){
        if (this.$refs['addLoadPage'].clearValidate) {
          this.$refs['addLoadPage'].clearValidate();
        }
      },
      // 新增落地页
      addPage() {
        const {
          loadPageUrl, subscriptionId, thresholdNum, putContentId, skinId, putContentType
        } = loadPagerules;
        if (this.addLoadPage.loadPageType == 1) {
          this.rules = {
            loadPageUrl,
            subscriptionId,
            thresholdNum,
          }
        } else if (this.addLoadPage.loadPageType == 2) {
          this.rules = {
            loadPageUrl,
            subscriptionId,
            thresholdNum,
            putContentId,
            skinId,
            putContentId,
          }
        }
       
        this.$refs['addLoadPage'].validate((valid) => {
          if (valid) {
            const {
              loadPageUrl,
              subscriptionId,
              thresholdNum,
              loadPageType,
              skinId,
              putContentType,
              putContentId,
              id,
            } = this.addLoadPage;

            let params = {};
            if (loadPageType == 1) {
              params = {
                id,
                loadPageUrl,
                subscriptionId,
                thresholdNum,
                loadPageType,
              }
            } else if (loadPageType == 2) {
              params = {
                id,
                loadPageUrl,
                subscriptionId,
                thresholdNum,
                loadPageType,
                skinId,
                putContentId,
              }
            }

            params = Object.assign(params)
            console.log(params)

            this.$http.post('/loadpage/save', qs.stringify(params)).then(res => {
              if (res.data.success) {
                if (res.data.data) {
                  this.$message.success('创建成功')
                  this.dialogLoadPageVisible = false
                  window.location.reload()
                } else {
                  this.$message.error('创建失败')
                }
              } else {
                this.$message.error(`${res.data.desc || '网络错误'}`)
              }
            }, () => {
              this.$message.error('网络错误')
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 编辑落地页
      changeLoadPageUrl() {
        this.$refs['changeLoadPageUrl'].validate((valid) => {
          if (valid) {
            let loadPageUrl = this.changeForm.loadPageUrl
            let id = this.changeForm.id
            console.log(id)
            this.$http.get('/loadpage/update', {
              params: {
                loadPageUrl, id
              }
            }).then(res => {
              if (res.data.data) {
                this.dialogLoadPageUrlVisible = false
                this.$message.success('保存成功')
                this.getAllList()
              } else {
                this.dialogLoadPageUrlVisible = false
                this.$message.error('保存失败')
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 状态
      changeStatus() {
        let status = this.changeForm.status
        let id = this.changeForm.id
        console.log(id)
        this.$http.get('/loadpage/changestatus', {
          params: {
            status, id
          }
        }).then(res => {
          if (res.data.success) {
            if (res.data.data) {
              this.dialogStatusVisible = false
              this.$message.success('切换成功')
              window.location.reload()
            } else {
              this.dialogStatusVisible = false
              this.$message.success('切换失败')
            }
          }
        })
      },
      // 阈值
      changeThresholdNum() {
        this.$refs['changeThresho'].validate((valid) => {
          if (valid) {
            let thresholdNum = +this.changeForm.thresholdNum
            let id = this.changeForm.id
            console.log(id)
            this.$http.get('/loadpage/changethresholdNum', {
              params: {
                thresholdNum, id
              }
            }).then(res => {
              if (res.data.success) {
                this.dialogThresholdVisible = false
                this.$message.success('修改成功')
                window.location.reload()
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      remoteMethod(query) {
        console.log(query)
        this.$http.get('/subscriptionInfo/list', { params: { name: query } }).then(res => {
          if (res.data.success) {
            let list = res.data.data.lists
            list = list.map(item => {
              return {
                label: item.name,
                value: item.id
              }
            })
            this.searchForm.officalAcountOptions = list
            if (this.searchForm.officalAcountOptions) {
              this.loading = false
            }
          }
        })
      },
      // pageChange()
      pageChange() {
        console.log(this.pageOption.pageNum)
        this.$http.get('/loadpage/list', { params: this.pageOption }).then(res => {
          if (res.data.success) {
            this.tableData = res.data.data.lists
          } else {
            this.$message.error('获取数据失败')
          }
        }, () => {
          this.$message.error('网络错误')
        })
      },
      // 删除
      deletePageModel(row) {
        // TODO
        let id = row.id
        this.$confirm('删除后该落地页的公众号将不再监控粉丝情况?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get('/loadpage/delete', { params: { id } }).then(res => {
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
      },
      openDialogAd() {
        this.getDermaList();
        this.getPutNameList();
        this.dialogLoadPageVisible = true
      },
      openStatusDilog(row) {
        this.dialogStatusVisible = true
        this.changeForm.id = row.id
        this.changeForm.status = row.status
      },
      // 新增编辑落地页信息
      openloadPageUrlDialog(row) {
        this.dialogLoadPageUrlVisible = true
        this.changeForm.id = row.id
        this.changeForm.loadPageUrl = row.loadPageUrl
      },
      openThresholdDilog(row) {
        this.changeForm.id = row.id
        this.dialogThresholdVisible = true
        this.changeForm.thresholdNum = row.thresholdNum
      }
    }
  }
</script>

<style lang="less">
  .dlv-main {
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
      .link-theme {
        display: inline-block;
        position: absolute;
        right: 0;
        bottom: 10px;
        font-size: 12px;
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
    .search-bar {
      margin-top: 20px
    }
    .page-control {
      float: right;
      margin-top: 20px;
      &:after {
        clear: both;
      }
    }
    .el-dialog__body {
      overflow: hidden;
      .btn-wrap {
        float: right;
      }
    }

  }
</style>