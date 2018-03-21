<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/miniApp/contentManage' }">内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>类型管理</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="link-theme">
        <i class="iconfont icon-jia" style="vertical-align: middle;"></i>
        <span class="connect-ad" @click="openDialogTheme" style="vertical-align: middle;">类型</span>
      </span>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
        </template>
      </div>
      <div class="tabel-wrap">
        <template>
          <el-table :data="graphMsgList"  style="width: 100%" >
            <el-table-column prop="date" label="日期" width="180"></el-table-column>
            <el-table-column prop="typeOne" label="类型1" width="160"></el-table-column>
            <el-table-column prop="typeTwo" label="类型2" width="160"></el-table-column>
            <el-table-column prop="typeThree" label="类型3" width="160"></el-table-column>
            <el-table-column prop="title" label="图文标题" ></el-table-column>
            <el-table-column  label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" size="mini">编辑</el-button>        
                <el-button type="text" size="mini" @click="deletePageModel(scope.row)">删除</el-button>  
              </template>
            </el-table-column>
          </el-table>
        </template>        
      </div>
      <div class="page-control">
        <el-pagination background  :page-size="50" :current-page.sync="pageOption.pageNum"
 @current-change="pageChange" layout="prev, pager, next" :total="totalSize"></el-pagination>
      </div>    
    </div>
    <!--添加类型-->
    <div class="ad-loadPage-diolog">
      <el-dialog title="添加落地页" :visible.sync="dialogLoadPageVisible">
        <el-form :model="addLoadPage" ref="addLoadPage" >
          <el-form-item label="公众号" :label-width="formLabelWidth" prop="subscriptionId">
          <el-select  v-model="addLoadPage.subscriptionId"  filterable remote reserve-keyword placeholder="公众号名称" >
              <el-option v-for="item in searchForm.officalAcountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="落地页名称" :label-width="formLabelWidth"  prop="loadPageUrl">
            <el-input placeholder="https://" v-model="addLoadPage.loadPageUrl" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="阈值" :label-width="formLabelWidth"  prop="thresholdNum">
            <el-input v-model="addLoadPage.thresholdNum" auto-complete="off"></el-input>
          </el-form-item>           
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" type="primary" @click="">保存</el-button>
        </div>
      </el-dialog>
    </div>
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
      fileList: [],
      formLabelWidth: '100px',
      searchForm: {
        typeOne: '',
        typeTwo: '',
        typeThree: '',
        startTime: '',
        endTime : ''
      },
      addLoadPage: {
        loadPageUrl: 'https://',
        subscriptionId: '',
        thresholdNum: null
      },
      dataname:{file:'111'},
      uploadVisible: false,
      dialogLoadPageVisible: false,
      pageOption: {
        pageNum: 1,
        pageSize: 50
      },
      totalSize: 10,
      graphMsgList: []
    }
  },
  created () {
    this.getgraphMsgList()
  },
  methods: {
    // 打开添加类型弹框
    openDialogTheme () {
      this.dialogLoadPageVisible = true
    },
    // 获取图文列表
    getgraphMsgList () {
      this.$http.get('/graphicType/pageList', {}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.graphMsgList = resp.data.content
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
          this.graphMsgList = resp.data.content
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
              this.getgraphMsgList()
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
      this.getgraphMsgList()
    },
    // beforeUpload (file) {
    //   console.log(file)
    //   let fd = new FormData()
    //   fd.append('file', file)
    //   fd.append('groupId', this.groupId)
    //     // console.log(fd)
    //     newVideo(fd).then(res => {
    //      console.log(res)
    //    })
    //  return true
    // },
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
    .link-theme{
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 10px;
      font-size: 12px;
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
  .input-width{
    display: inline-block;
    width: 80%;
  }
  .upload-demo{
    display: inline-block;
  }
  .in-line{
    display: inline-block;
    margin-right: 10px;
    color: #aaa;
    margin-top: 8px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width:150px;
  }
}
</style>
