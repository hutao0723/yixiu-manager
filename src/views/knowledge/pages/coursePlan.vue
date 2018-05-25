<template>
  <section class="ofa-main-wrap" v-loading="loading">
    <div class="title-wrap">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/read' }">阅读计划</el-breadcrumb-item>
        <el-breadcrumb-item>书籍管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" @click="addBook()" size="small" class="fr">新增书籍</el-button>

    </div>
    <div class="content">

      <div class="tabel-wrap">
        <template >
          <el-table :data="courseManageList" border style="width: 100%;text-align: center" :span-method="arraySpanMethod">

            <el-table-column prop="courseTitle" label="书籍标题"style="text-align: center">
            </el-table-column>

            <el-table-column prop="dayNum" label="解锁日期">
            </el-table-column>

            <el-table-column prop="courseID" label="课程id">
            </el-table-column>

            <el-table-column prop="courseType" label="课程类型">
            </el-table-column>
            <el-table-column prop="title" label="课程标题">

            </el-table-column>
            <el-table-column prop = "manageStatus"  label="课程状态">
              <template slot-scope="manageScope">
                {{manageScope.row.manageStatus == 1 ? '已上线' : '待上线'}}
              </template>
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="edit">

                <el-button type="text" size="mini" @click="editCourse(1,edit.row)">编辑课程</el-button>
                <el-button type="text" size="mini" >移除</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="edit">

                <el-button type="text" size="mini" @click="editCourse(2,edit.row)">添加课程</el-button>
                <el-button type="text" size="mini" @click="addBook()">编辑</el-button>
                <el-button type="text" size="mini" >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="page-control">
         <el-pagination background  :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="total, prev, pager, next" :total="totalSize"></el-pagination>
      </div>
    </div>
    <!--弹窗-->
    <div class="add-type-diolog">
      <el-dialog :title="digTite + '课程'" :visible.sync="editDiolog">
        <el-form >
          <el-form-item label="解锁日期：">
            {{courseDay}}
          </el-form-item>
          <el-form-item label="关联课程：">
            <el-select v-model="courseSearchForm.selectType" class="iptl w150">
              <el-option v-for="(item,index) in courseList" :key="index" :label="item.label" :value="index">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" @click="editDiolog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="subCourse()">保存</el-button>
        </div>
      </el-dialog>
    </div>

    <!--新增|编辑书籍 弹窗-->
    <div class="add-type-diolog">
      <el-dialog title="添加|编辑书籍" :visible.sync="bookDiolog">
        <el-form >
          <el-form-item label="计划标题" prop="bookTitle">
            <el-col :span="8">
              <el-input v-model="courseForm.title" placeholder="1-30字，建议14字以内" :maxlength="30"></el-input>

            </el-col>
          </el-form-item>
          <el-form-item class="is-required" label="书籍封面" >
            <el-upload
              class="avatar-uploader"
              action="/upload/image"
              name="imageFile"
              :show-file-list=false
              :on-success="firstSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="courseForm.lateralCover" :src="courseForm.lateralCover" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <el-button size="small" type="primary">{{courseForm.lateralCover ? '修改文件' : '选择文件'}}</el-button>
              <div slot="tip" class="el-upload__tip">750*545,支持jpg、png、gif格式,最大5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" @click="bookDiolog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="saveBook()">保存</el-button>
        </div>
      </el-dialog>
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

  } from '@/api/index'

  export default {
    data() {
      return {
        spanArr:[],
        contactDot:0,
        editDiolog:false,
        bookDiolog:false,
        courseDay:null,
        loading: false,
        contactDot:null,
        editorContent:null,
        digTite:'编辑',
        digType:1,
        directTransmissionSign: null, //上传签名
        pageOption: {
          pageNum: 1,
          size: 20
        },
        totalSize: 0,
        courseManageList:[],
        //分页查询课程信息
        courseSearchForm: {
          id: null,
          title: null,
          status: '',
          pageNum: 1,
          pageSize: null,
        },
        //新增编辑课程form 表单
        courseForm: {
          bookTitle: null,
          lateralCover:null
        },
        courseList:[
          {
            label: '西游记'
          },
          {
            label: '红楼梦'
          },
          {
            label: '水浒传'
          }
        ]
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
        this.$http.get('/read/book/list', {params}).then(res => {
          let resp = res.data
          if (resp.success) {
            this.courseManageList = resp.data.content ;
            this.totalSize = resp.data.totalElements ;
            let arr = this.courseManageList;
            let spanArr = this.spanArr;
            let contactDot = 0;//占几格
            if(!arr){
              return false;
            }
            arr.forEach(function (item,index) {
              item.index = index;
              if(index===0){
                spanArr.push(1)
                //console.log(spanArr)
              }else {
                if(item.bookId === arr[index-1].bookId){
                  spanArr[contactDot] +=1
                  spanArr.push(0)
                 // console.log(spanArr)
                }else {
                  spanArr.push(1);
                  contactDot = index;
                  console.log(spanArr)
                }
              }
            })
          this.contactDot = contactDot;
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }){
        if (columnIndex === 0||columnIndex === 7) {

          const _row = this.spanArr[rowIndex]
          const _col = _row>0?1:0;
          return{
            rowspan:_row,
            colspan:_col
          }
        }
      },
      addBook(){
        this.bookDiolog = true;
      },
      beforeAvatarUpload(file) {
        const isJLtType = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif' || file.type ==='image/jpeg';
        const isLtSize = file.size / 1024 <= 5000;
        if (!isJLtType) {
          this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!');
        }
        if (!isLtSize) {
          this.$message.error('上传图片大小不能超过 5M!');
        }
        return isJLtType && isLtSize;
      },
      firstSuccess(res, file) {
        const self = this;
        const image = new Image();
        image.src = 'https:' + res.data.fileUrl;
        image.onload = function () {
          const width = image.width;
          const height = image.height;
          if (width == 750 && height == 545) {
            self.courseForm.lateralCover = 'https:' + res.data.fileUrl;
          } else {
            self.$message.error('上传图片的尺寸必须为 750*545!')
          }
        };

      },
      editCourse(title,row) {
        console.log(row)
        this.editDiolog = true ;
        this.digType = title;
        this.digTite = title == 1?'编辑':'添加' ;
        this.courseDay = row.time;
      },
      subCourse(){
        if(this.digType==1){
          console.log('编辑')

        }else{
          console.log('添加')
        }
      },
      // 分页请求
      pageChange (currentPage) {
        this.pageOption.pageNum = currentPage
        this.getData() 
      },
      // 保存书籍
      saveBook () {
        console.log()
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
        left: 280px;
        top: 0;
      }
      .el-upload__tip {
        top: 30px;
      }
    }
  }
</style>
