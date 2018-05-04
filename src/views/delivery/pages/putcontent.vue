<template>
  <section class="dlv-main">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager' }">投放内容</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="link-theme">
        <i class="iconfont icon-jia" style="vertical-align: middle;"></i>
        <span class="connect-ad" @click="openAddDialog">投放内容</span>
      </span>
    </div>
    <div class="conbtent">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="searchForm.data" class="demo-form-inline" size="mini">
            <el-select v-model="searchForm.data.value" filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading"
              size="mini">
              <el-option v-for="item in officalAcountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
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
            <el-table-column label="内容类型">
              <template slot-scope="scope">
                <span v-if="scope.row.contentType == 1">平铺</span>
                <span v-if="scope.row.contentType == 2">首屏</span>
              </template>
            </el-table-column>
            <el-table-column prop="contentName" label="内容名称"></el-table-column>
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
        <el-pagination background :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="total,prev, pager, next"
          :total="totalSize"></el-pagination>
      </div>
    </div>

    <!--投放内容编辑-->
    <div>
      <el-dialog title="投放内容" :visible.sync="dialogAddVisible" width="1100px">
        <el-form ref="addForm" :model="addForm" :rules="rules">
          <el-form-item label="公众号" prop="subscriptionId" :label-width="formLabelWidth">
            <el-select v-model="addForm.subscriptionId" filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading">
              <el-option v-for="item in officalAcountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容类型" prop="contentType" :label-width="formLabelWidth">
            <el-select v-model="addForm.contentType">
              <el-option label="平铺" :value="1"></el-option>
              <el-option label="首屏" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容名称" :label-width="formLabelWidth" v-if="addForm.contentType == 1" prop="contentName" :rules="[
            { required: true, message: '请输入内容名称', trigger: 'change' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'change' }
          ]">
            <el-input v-model="addForm.contentName"></el-input>
          </el-form-item>
          <el-form-item label="跳转链接地址" :label-width="formLabelWidth" v-if="addForm.contentType == 2" prop="targetUrl" :rules="[
            { required: true, message: '请输入跳转链接地址', trigger: 'change' },
            { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'change' }
          ]">
            <el-input v-model="addForm.targetUrl"></el-input>
          </el-form-item>
          <el-form-item label="图片素材" prop="pictureUrl" :label-width="formLabelWidth">
            <div class="image clearfix">
                <div class="image-item" v-for="(item,index) in fileList"  :key="index" v-dragging="{ item: item, list: fileList}">
                  <img :src="item.url" alt="" :draggable="false">
                  <i class="image-item-delete el-icon-circle-close-outline" @click="deleteImage(index)"></i>
                </div>
              </div>
            <el-upload class="upload-demo" action="/upload/image" :on-success="submitImage" name="imageFile" :on-remove="removeImage"
              :before-upload="beforeImage" :limit="10" :file-list="fileList" list-type="picture" :show-file-list="false">
              
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpeg/jpg/png文件，且不超过100kb，图片宽度限制750px</div>
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
        formLabelWidth: '120px',
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
        },
        loading: false,
        officalAcountOptions: [],
      }
    },
    created() {
      this.getAllList()
      this.getPublicList();
    },
    methods: {
      deleteImage(index) {
        this.fileList.splice(index, 1);
      },
      remoteMethod(query) {
        this.$http.get('/subscriptionInfo/all', { params: { subscriptionName: query } }).then(res => {
          if (res.data.success) {
            let list = res.data.data
            list = list.map(item => {
              return {
                label: item.nickName,
                value: item.id
              }
            })
            this.officalAcountOptions = list
            if (this.officalAcountOptions) {
              this.loading = false
            }
          }
        })
      },
      beforeImage(file) {
        console.log(file)
        const isJPG = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 < 100;
        if (!isJPG) {
          this.$message.error('上传图片只能是 jpeg/jpg/png 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 100kb!');
        }
        return isJPG && isLt2M;
      },

      // 上传图片
      submitImage(res, file, fileList) {
        console.log(file)
        let self = this
        let arr = [];
        for (let i = 0; i < fileList.length; i++) {
          const element = fileList[i];
          let url;
          if (element.response) {
            url = element.response.data.fileUrl
          } else {
            url = element.url
          }
          let image = new Image();
          image.src = url
          image.onload = function () {
            let width = image.width;
            if (width == 750) {
              arr.push({ url: url })
            } else {
              self.$message.error('上传图片的宽度必须为 750px!');
            }
          };
        }
        this.fileList = arr;
      },
      removeImage(file, fileList) {
        console.log(file)
        let arr = [];
        for (let i = 0; i < fileList.length; i++) {
          const element = fileList[i];
          if (element.response) {
            arr.push({ url: element.response.data.fileUrl })
          } else {
            arr.push({ url: element.url })
          }
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
        params["subscriptionId"] = searchForm.value
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
        this.remoteMethod();
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
                targetUrl,
              } = res.data.data;

              this.addForm = {
                contentType,
                contentName,
                subscriptionName,
                subscriptionId,
                id,
                pictureUrl,
                targetUrl,
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
            contentType: 1,
            contentName: "",
            subscriptionName: "",
            subscriptionId: "",
            id: "",
            pictureUrl: "",
            targetUrl: "",
          }
        }
        this.dialogAddVisible = true
        if (this.$refs['addForm']) {
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
        let validType = null;
        this.$refs['addForm'].validate((valid) => {
          console.log(valid)
          validType = valid;
        })
        if (validType) {
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
        }
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
    .el-upload-list--picture .el-upload-list__item {
      padding: 20px 10px 20px 100px;
      float: left; // font-size: 0;
      margin: 10px;
      width: auto;
      height: auto;
    }
    .el-upload-list__item-name {
      // margin-right: 0;
    }
    .el-upload-list--picture .el-upload-list__item.is-success .el-upload-list__item-name {
      display: none;
    }

  }

  .image-item {
    border: 1px solid #c0ccda;
    padding: 10px;
    position: relative;
    margin: 5px;
    float: left;
    border-radius: 4px;
    img {
      display: block;
      width: 60px;
      height: 60px;
    }
    .image-item-delete {
      position: absolute;
      right: 0;
      top: 0;
      height: 20px;
      width: 20px;
    }
    .el-icon-circle-close-outline{
      line-height: 20px;
      text-align: center;
      cursor: pointer;      
    }
  }
  
</style>