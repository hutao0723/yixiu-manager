<template>
  <section class="ofa-main-wrap" v-loading="loading">
    <div class="title-wrap">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/read' }">阅读计划</el-breadcrumb-item>
        <el-breadcrumb-item>期数管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="search-bar">
        <el-button type="primary"  size="small" class="fr" @click="buildNewCourse(0)">新建期数</el-button>
      </div>
      <div class="tabel-wrap">
        <template>
          <el-table :data="courseGroup" style="width: 100%">
            <el-table-column prop="beginDate" label="开课日期">
            </el-table-column>
            <el-table-column prop="stageNum" label="第几期">
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="edit">

                <el-button type="text" size="mini" @click="buildNewCourse(edit.row.readId)">编辑</el-button>

              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="page-control">
       <el-pagination background  :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="total, prev, pager, next" :total="totalSize"></el-pagination>
      </div>
    </div>

  </section>

</template>
<script>
  import {formatHourSec} from '../../../utils/dateUtils'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import E from 'wangeditor'
  import plupload from 'plupload';

  export default {
    data() {
      return {
        loading: false,
        pageOption: {
          pageNum: 1,
          pageSize: 20
        },
        totalSize: 0,
        courseGroup:[]
        //分页查询课程信息
      }
    },

    computed: {

    },
    created() {
      this.getData();
    },
    methods: {
      //获取列表数据
      getData() {
        let params ={
          readId: this.$route.query.id,
          pageNum: this.pageOption.pageNum,
          pageSize: 20,
        }
        this.$http.get('/read/stage/page', {params}).then(res => {
          let resp = res.data
          if (resp.success) {
            this.courseGroup = resp.data.content ;
            this.totalSize = resp.data.totalElements ;
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      buildNewCourse(id) {
         this.$router.push("/manager/knowledge/numberEdit?number=" + id);
      },
      // 分页请求
      pageChange (currentPage) {
        this.pageOption.pageNum = currentPage
        this.getData() 
      }

    }
  }

</script>
<style lang="less" scoped>
  .ofa-main-wrap {
    width: 100%;
    .totle-time {
      color: #333;
    }
    .audio-list {
      .file-container {
        width: 300px;
        height: 40px;
        border: 1px solid #aaa;
        text-align: center;
        color: #606266;
      }

      .el-upload-list__item, .el-upload-list__item:first-child {
        line-height: 40px;
        margin-top: 0
      }
      .el-upload-list {
        width: 300px;
        height: 40px;
        border: 1px solid #ccc;
        line-height: 40px;
      }
    }
    .course-title {
      font-size: 18px;
      font-weight: bold;
      padding-bottom: 10px;
      border-bottom: 1px solid #c0c0c0;
    }

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
    .search-bar, .column-uleForm {
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

    .avatar-uploader {
      position: relative;
      .el-upload {
        cursor: none !important;
      }
      .el-icon-plus {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .el-icon-plus:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
      .el-upload__tip, .el-button {
        position: absolute;
        left: 200px;
        top: 0;
      }
      .el-upload__tip {
        top: 30px;
      }
    }
  }
</style>
