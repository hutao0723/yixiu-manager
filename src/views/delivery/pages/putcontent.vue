<template>
  <section class="dlv-main">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager' }">投放内容</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="link-theme">
        <i class="iconfont icon-guanlian"></i>
        <span class="connect-ad" @click="openAddDialog">投放内容</span>
      </span>
    </div>
    <div class="conbtent">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="searchForm.data" class="demo-form-inline" size="mini">
            <el-form-item>
              <el-input v-model="searchForm.data.value" placeholder="公众号"></el-input>
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
            <el-table-column prop="subscriptionName" label="公众号">
              <template slot-scope="scope">
                <img :src="scope.row.subscriptionImageUrl" alt="" class="table-headimg">
                <span v-text="scope.row.subscriptionName"></span>
              </template>
            </el-table-column>
            <el-table-column prop="contentName" label="内容类型"></el-table-column>
            <el-table-column label="操作" width="240">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="openAddDialog(scope.row)">编辑</el-button>
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

    <!--投放内容编辑-->
    <div>
      <el-dialog title="投放内容" :visible.sync="dialogAddVisible">
        <el-form ref="addForm" :model="addForm" :rules="rules">
          <el-form-item label="公众号" prop="subscriptionId" :label-width="formLabelWidth">
            <el-select v-model="addForm.subscriptionId">
              <el-option v-for="item in publicArr" :key="item.id" :label="item.nickName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容类型" prop="contentType" :label-width="formLabelWidth">
            <el-select v-model="addForm.contentType">
              <el-option label="平铺" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容名称" prop="contentName" :label-width="formLabelWidth">
            <el-input v-model="addForm.contentName"></el-input>
          </el-form-item>
          <el-form-item label="图片素材" prop="pictureUrl" :label-width="formLabelWidth">
            <el-upload class="upload-demo" action="/upload/image" :on-success="submitImage" name="imageFile" :on-remove="removeImage"
              :before-upload="beforeImage" :limit="10" :file-list="fileList" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过100kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" @click="dialogAddVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submitPutContent">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
  import { putContentRules } from '../components/deliveryValidRules'
  import qs from 'qs'

  console.log(putContentRules)
  export default {
    name: 'delivery',
    data() {
      return {
        searchForm: {
          data: {
            value: '',
          },
        },
        totalSize: 50,
        formLabelWidth: '100px',
        dialogAddVisible: false,
        rules: putContentRules,
        addForm: {
          id: null,
          pictureUrl: null,
          subscriptionName: null,
          subscriptionId: null,
          contentName: null,
          contentType: 1,
        },
        pageOption: {
          pageNum: 1,
          pageSize: 20
        }, // 分页控制
        tableData: [], // 列表数据
        publicArr: [], // 公众号列表
        fileList: [],
        imageFile: {
          imageFile: 'image',
        }
      }
    },
    created() {
      this.getAllList()
    },
    methods: {
      beforeImage(file) {
        console.log(file)
        const isJPG = file.type === 'image/jpg' || 'image/png';
        const isLt2M = file.size / 1024 / 1024 / 1024 < 100;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG/PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 100KB!');
        }
        return isJPG && isLt2M;
      },

      // 上传图片

      submitImage(res, file, fileList) {
        console.log(file)
        var arr = [];
        for (let i = 0; i < fileList.length; i++) {
          const element = fileList[i];
          arr.push({ url: element.response.data.fileUrl })
        }

        this.fileList = arr;

      },
      removeImage(file, fileList) {
        var arr = [];
        for (let i = 0; i < fileList.length; i++) {
          const element = fileList[i];
          arr.push({ url: element.response.data.fileUrl })
        }
        this.fileList = arr;
      },
      // 获取公众号列,表
      getPublicList() {
        this.$http.get('/subscriptionInfo/all').then(res => {
          if (res.data.success) {
            this.publicArr = res.data.data;
          }
        })
      },

      // 搜索
      onSearch() {
        let searchForm = this.searchForm.data
        let params = {}
        params["contentName"] = searchForm.value
        this.$http.get('/put/content/list', { params }).then(res => {
          if (res.data.success) {
            this.totalSize = res.data.data.totalSize
            console.log(res.data.data.lists)
            if (res.data.data.lists) {
              this.tableData = res.data.data.lists
            } else {
              this.totalSize = 1
              this.tableData = []
            }
          } else {
            this.$message.error('获取数据失败')
          }
        }, () => {
          this.$message.error('网络错误')
        })
      },


      // 列表
      getAllList() {
        this.$http.get('/put/content/list', { params: this.pageOption }).then(res => {
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
      // 新增编辑落地页信息
      openAddDialog(row) {
        this.getPublicList();
        this.fileList = [];
        if (row.id) {
          let params = {
            id: row.id
          }
          this.$http.get('/put/content/find', { params: params }).then(res => {
            if (res.data.success) {
              const {
                contentType,
                contentName,
                subscriptionId,
                subscriptionName,
                id,
                pictureUrl,
              } = res.data.data;

              this.addForm = {
                contentType,
                contentName,
                subscriptionName,
                subscriptionId,
                id,
                pictureUrl,
              }
              let arr = this.addForm.pictureUrl.split(',')
              for (let i = 0; i < arr.length; i++) {
                const element = arr[i];
                this.fileList.push({ url: element });
              }
            }
          })
        } else {
          this.addForm = {
            contentType: "",
            contentName: "",
            subscriptionName: "",
            subscriptionId: "",
            id: "",
            pictureUrl: "",
          }
        }
        this.dialogAddVisible = true
        if (this.$refs['addForm'].resetFields) {
          this.$refs['addForm'].resetFields();
        }
      },
      // 新增落地页
      submitPutContent() {
        let urlArr = [];
        for (let i = 0; i < this.fileList.length; i++) {
          const element = this.fileList[i];
          urlArr.push(element.url)
        }
        this.addForm.pictureUrl = urlArr.join(',')

        if (!this.addForm.subscriptionName) {
          for (let i = 0; i < this.publicArr.length; i++) {
            const element = this.publicArr[i];
            if (this.addForm.subscriptionId == element.id) {
              this.addForm.subscriptionName = element.nickName;
              break;
            }
          }
        }
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            let params = Object.assign(this.addForm)
            this.$http.post('/put/content/save', qs.stringify(params)).then(res => {
              if (res.data.success) {
                if (res.data.data) {
                  this.$message.success('创建成功')
                  this.dialogAddVisible = false
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

      pageChange() {
        this.$http.get('/put/content/list', { params: this.pageOption }).then(res => {
          if (res.data.success) {
            this.tableData = res.data.data.lists;
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
        this.$confirm('确定删除本条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get('/put/content/delete', { params: { id } }).then(res => {
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
    .table-headimg {
      height: 50px;
      width: 50px;
      display: inline-block;
      vertical-align: middle;
    }

  }
</style>