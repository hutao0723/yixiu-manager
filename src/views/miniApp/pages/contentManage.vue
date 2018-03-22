<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="code-stock">
        <i class="iconfont icon-guanlian"></i>
        <router-link :to="{ path: '/manager/miniApp/typeManage/'}">
          <span class="offical-acount">类型管理</span>
        </router-link>
      </span>
    </div>
    <el-tabs v-model="activeType" type="card" @tab-click="handleClick" class="pad-length">
      <el-tab-pane :label="item.aClassType" :name="item.aClassType" v-for="(item,index) in tabList" :key="item.id"  :value="index">
        <div class="content">
          <div class="search-bar">
            <template>
              <el-form :inline="true" :model="searchForm" class="demo-form-inline fl" size="mini">
                <el-form-item class="type-input">
                 <el-select v-model="searchForm.typeTwo" placeholder="二级类型" >
                    <el-option v-for="item in bTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <span class="add-ofa fr">
                <a class="add" href="/图文类型模版_2018-03-12.xlsx">
                  <i class="iconhandle"></i>
                  下载模板
                </a>
                <span class="connect-ad" @click="">导入内容</span>
              </span>
            </template>
          </div>
          <div class="tabel-wrap">
            <template>
              <el-table :data="contentList">
                <el-table-column prop="id" label="ID" width="180"></el-table-column>
                <el-table-column prop="description" label="描述词" ></el-table-column>
                <el-table-column prop="descontent" label="描述内容" width="400"></el-table-column>
                <el-table-column prop="bClassType" label="二级类型"></el-table-column>
                <el-table-column  label="操作">
                  <template slot-scope="scope">
                    <router-link :to="{ path: '/manager/miniApp/editContent/' + scope.row.id + '/2'}">
                      <el-button type="text" size="mini">编辑</el-button>        
                    </router-link>   
                    <el-button type="text" size="mini" @click="deletePageModel(scope.row)">删除</el-button>  
                  </template>
                </el-table-column>
              </el-table>
            </template>        
          </div>
          <div class="form-group">
            <label class="control-label">URL链接：</label>
            <input type="text" id="copy-url" readonly v-model="url" ref="aurlInput">
            <a href="javascript:void(0)" class="btn btn-green btn-lg copy-btn" @click="copyUrl">复制</a>
          </div>
          <div class="page-content">
            <div class="fl total-num">共<span class="blue">{{totalSize}}</span>条</div>
            <div class="page-control">
              <el-pagination background  :page-size="50" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="prev, pager, next" :total="totalSize">
              </el-pagination>
            </div>
          </div>   
        </div>
        <!--上传弹框-->
        <div class="upload-diolog">
          <el-dialog title="导入内容" :visible.sync="uploadVisible">
            <el-form ref="uploadFile" :model="uploadForm" >
              <el-form-item label="Excel附件" :label-width="formLabelWidth"  prop="uploadUrl">
                <div class="input-width"><el-input v-model="uploadForm.uploadUrl" auto-complete="off" :disabled="true"></el-input></div>
                <el-upload class="upload-demo" ref="upload" action="/graphicType/export" :on-remove="handleRemove"  :file-list="fileList" :auto-upload="false" :beforeUpload="beforeAvatarUpload" :on-change="handleChange" :show-file-list="false" :on-error="handleError" :on-success="handleSuccess" :data="dataname">
                  <el-button slot="trigger"  type="primary">选取文件</el-button>
                </el-upload>           
              </el-form-item> 
            </el-form>
             <div class="btn-wrap">
              <el-button size="small" @click="uploadVisible = false">取 消</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确认</el-button>
            </div>       
          </el-dialog>
        </div> 
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import { formatDateNew } from '../../../utils/dateUtils'
export default {
  data () {
    return {
      uploadForm: {
        uploadUrl: ''
      },
      url: 'http://www.baidu.comhahahahah',
      activeType: '',
      fileList: [],
      formLabelWidth: '100px',
      searchForm: {
        typeTwo: ''
      },
      bTypeList: [],
      tabList: [],
      dataname:{file:'111'},
      uploadVisible: false,
      pageOption: {
        pageNum: 1,
        pageSize: 50
      },
      totalSize: 10,
      contentList: []
    }
  },
  created () {
    this.getTypeList()
    // this.getContentList()
  },
  methods: {
    // 获取tab列表数据
    getTypeList () {
      let that = this;
      this.$http.get('/miniApp/getTabList', {}).then(res => {
        let resp = res.data
        if (resp.success) {
          if(resp.data[0] != undefined){
            this.activeType = resp.data[0].aClassType
            this.getContentList(resp.data[0].id)
          }
          this.tabList = resp.data
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    copyUrl () {
      this.$refs.aurlInput[0].select(); // 选择对象
      try {
        var successful = document.execCommand('copy')
        if (successful) {
          this.$message.success("复制成功")
        }
      } catch (err) {}
    },
    // 查询图文列表
    onSearch () {
      const {
        typeOne,
        typeTwo,
        typeThree,
        startTime,
        endTime
      } = this.searchForm
      let params = {
        pageNum: this.pageOption.pageNum,
        typeOne,
        typeTwo,
        typeThree,
        startTime,
        endTime,
        pageSize:50
      }
      this.$http.get('/graphicType/pageList', {params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.contentList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    // 切换tab
    handleClick(tab, event) {
      let tabId = this.tabList[tab.index].id
      console.log(tabId)
      this.getContentList(tabId)
    },
    // 打开上传弹框
    openUploadFile () {
      this.uploadForm.uploadUrl = ''
      this.uploadVisible = true
    },
    // 获取图文列表
    getContentList (tabId) {
      console.log(tabId)
      this.$http.get('/graphicType/pageList', {params:{tabId}}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.contentList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    // 分页请求
    pageChange () {
      const {
        typeOne,
        typeTwo,
        typeThree,
        startTime,
        endTime
      } = this.searchForm
      let params = {
        pageNum: this.pageOption.pageNum,
        typeOne,
        typeTwo,
        typeThree,
        startTime,
        endTime,
        pageSize:50
      }
      this.$http.get('/graphicType/pageList', {params: params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.contentList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    // 删除
    deletePageModel (row) {
      let id = row.id
      this.$confirm('确认删除本条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/graphicType/delete', {params: {id}}).then(res => {
          let msg = res.data.success
          if (msg) {
            if (res.data.data) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getContentList()
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
    // 提交上传文件
    submitUpload () {
      this.$refs['uploadFile'].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 上传失败的处理方式
    handleError (err, file, fileList) {
      this.$message.error('上传失败')
      this.uploadVisible = false
      this.uploadForm.uploadUrl = ''
      console.log('handleError' + err + ',' + file)
    },
    // 上传成功
    handleSuccess (response, file, fileList) {
      this.$message.success(response.desc || '上传成功')
      this.uploadVisible = false
      this.uploadForm.uploadUrl = ''
      this.pageOption.pageNum = 1
      this.getContentList()
    },
    beforeUpload (file) {
      console.log(file)
      let fd = new FormData()
      fd.append('file', file)
      fd.append('groupId', this.groupId)
        // console.log(fd)
        newVideo(fd).then(res => {
         console.log(res)
       })
     return true
    },
    handleRemove (file, fileList) {
      console.log('handleRemove' + file + ',' + fileList)
    },
    // 获取上传文件的名字
    handleChange (file, fileList) {
      this.uploadForm.uploadUrl = file.name
      console.log('handleChange' + file.name)
    },
    // 上传前对文件的大小的判断
    beforeAvatarUpload (file) {
      const extension1 = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      if (!extension1 && !extension2) {
        this.$message.error('上传模板只能是 xls、xlsx格式!')
      }
      return extension1 || extension2
    }
  }
}
</script>
<style lang="less" scoped>
.ofa-main-wrap {
  width: 100%;
  .title-wrap {
    width: 100%;
    height:30px;
    border-bottom: 1px dotted #ccc;
    position: relative;
    .el-breadcrumb {
      position: absolute;
      left: 0;
      bottom: 10px;
      font-size: 16px;
    }
    .code-stock {
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 10px;
      font-size: 12px;
      a{
        text-decoration: none;
      }
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
  .add-ofa {
    display: inline-block;
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
  .page-content{
    overflow: hidden;
    .total-num{
      margin-top: 28px;
      margin-left: 10px;
      color: #606266;
      .blue{
        color: #409eff;
      }
    }
    .page-control {
      float: right;
      margin-top: 20px;
      &:after {
        clear: both;
      }
    }
  }
  .input-width{
    display: inline-block;
    width: 80%;
  }
  .upload-demo{
    display: inline-block;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width:150px;
  }
  .el-dialog__wrapper{
    z-index:3000!important;
  }
}

</style>
