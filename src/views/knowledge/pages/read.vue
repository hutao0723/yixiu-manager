<template>
  <section class="ofa-main-wrap" v-loading="loading">
    <div class="content">
      <div class="search-bar">
        <el-button type="primary" @click="newcourseForm(0)" size="small" class="fr">新建阅读计划</el-button>
        <template>
          <el-form :inline="true" :model="courseSearchForm" class="demo-form-inline" size="small">
              <el-form-item>
                <el-select v-model="courseSearchForm.selectType" class="iptl w150">
                  <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="courseSearchForm.searchValue" class="iptr"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="courseSearchForm.status" class="w150">
                  <el-option v-for="item in specialStateOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

            <el-button type="primary" @click="getData" size="small">查询</el-button>
          </el-form>
        </template>
      </div>
      <div class="tabel-wrap">
        <template>
          <el-table :data="courseList" style="width: 100%">
            <el-table-column prop="id" label="计划ID">
            </el-table-column>

            <el-table-column prop="title" label="计划标题">
            </el-table-column>
            <el-table-column prop="price" label="计划价格">
              <template slot-scope="scope">
                {{scope.row.price}}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="计划状态" :formatter="getStatus">
              <template slot-scope="scope">
                {{scope.row.status == 1 ? '下线' : '上线'}}
              </template>

            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <!--openDialogAdmin(scope.row.managerName,scope.row.id）-->
                <el-button type="text" size="mini" @click="newcourseForm(scope.row.id)">编辑</el-button>
                <el-button type="text" size="mini" @click="courseManagement()">课程</el-button>
                <el-button type="text" size="mini" @click="courseGroup()">期数</el-button>
                <el-button type="text" size="mini" @click="changeStatus(scope.row.id,scope.row.status)">
                  {{scope.row.status == 1 ? '下线' : '上线'}}
                </el-button>
                <el-button type="text" size="mini" @click="deleteItem(scope.row.title,scope.row.id)" :disabled="false">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="page-control">
        <el-pagination background :page-size="20" :current-page.sync="courseSearchForm.pageNum"
                       @current-change="getData"
                       layout="total, prev, pager, next"
                       :total="totalSize"></el-pagination>
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

  import {
    addCourse,
    deleteCourse,
    updateCourse,
    getCourse,
    pageListCourse,
    updateStatusCourse,
    lecturerList,
    getCdnFileUrl
  } from '@/api/index'

  export default {
    data() {
      return {
        loading: false,
        editorContent:null,
        directTransmissionSign: null, //上传签名

        searchOptions: [
          {
            value: 'title',
            label: '计划标题'
          }, {
            value: 'id',
            label: '计划ID'
          }],
        specialStateOptions: [
//          计划状态|待上线|已上线|已下线
          {
            value: '',
            label: '计划状态'
          }, {
            value: 0,
            label: '待上线'
          },
          {
            value: 1,
            label: '已上线'
          }, {
            value: 2,
            label: '已下线'
          }
        ],

        pageOption: {
          pageNum: 1,
          size: 20
        },
        totalSize: 0,
        courseList: [],
        //分页查询课程信息
        courseSearchForm: {
          selectType: 'title',
          searchValue: null,
          specialState: '',
          id: null,
          title: null,
          status: null,
          pageNum: 1,
          pageSize: null,
        },


        //新增编辑课程form表单
        courseForm: {
          id: null,
          title: null,
          lateralCover:null,
          verticalCover:null,
          detail: null,
          timeLength: null,
          price: null,
          uploadFile: {},
          lecturerName: null,
          rate: null,
          explain:null,
          date:null,
        },
        fileText: null,
        fileSrc: null
      }
    },

    computed: {

    },
    created() {
      this.getData();
    },
    methods: {
      priceFilter(data){
        if(/^\d+\.\d+$/.test(String(data.courseForm.price))) {
          this.courseForm.price = Number(String(this.courseForm.price).split('.')[0])
        }
      },

      rateFilter(data){
        if(/^\d+\.\d+$/.test(String(data.courseForm.rate))) {
          this.courseForm.rate = Number(String(this.courseForm.rate).split('.')[0])
        }
      },
      //上下线
      changeStatus(id, changeStatus) {
        this.loading = true;
        const status = changeStatus % 2 == 0 ? 1 : 2;
        updateStatusCourse({
          id,
          status
        }).then(res => {
          if (res.success) {
            this.$message.success('切换成功');
            this.getData();
          } else {
            let msg = res.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },

      //删除课程
      deleteItem(title, id) {
        this.$confirm('确认删除阅读计划:'+ title, '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;

          deleteCourse({id}).then(res => {
            if (res.success) {
              this.$message.success('删除成功');
              this.getData();
            } else {
              let msg = res.desc || '删除失败'
              this.$message.error(msg)
            }
            this.loading = false;
          }).catch(() => {
            this.loading = false;
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },

      //获取列表数据
      getData() {
        console.log(this.courseSearchForm.selectType)
        console.log(this.courseSearchForm.searchValue)
        console.log(this.courseSearchForm.status)
        this.$http.get('/planList/list', {}).then(res => {
          let resp = res.data
          if (resp.success) {
            this.courseList = resp.data.lists ;
            this.totalSize = resp.data.totalSize ;
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      newcourseForm(courseId) {
        this.$router.push("/manager/knowledge/readPlan?courseId=" + courseId);
      },
      courseManagement() {
        this.$router.push("/manager/knowledge/coursePlan");
      },
      courseGroup(){
        this.$router.push("/manager/knowledge/courseGroup");
      },
      getStatus(row, column) {
        switch (row.status) {
          case '':
            return '课程状态';
          case 0:
            return '待上线';
          case 1:
            return '已上线';
          case 2:
            return '已下线';
        }
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
