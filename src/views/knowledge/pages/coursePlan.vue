<template>
  <section class="ofa-main-wrap" v-loading="loading">
    <div class="title-wrap">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/read' }">阅读计划</el-breadcrumb-item>
        <el-breadcrumb-item>书籍管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" @click="addBook(1)" size="small" class="fr">新增书籍</el-button>

    </div>
    <div class="content">

      <div class="tabel-wrap removeDefStyle">
        <template >
          <el-table :data="courseManageList" border style="width: 100%;text-align: center" > <!--:span-method="arraySpanMethod"-->

            <el-table-column prop="title" label="书籍标题" width="200">
            </el-table-column>

            <el-table-column  label="解锁日期" >
              <template slot-scope="scope">
                <div  class="itemStyle"  v-for="(item,index) in scope.row.readBookCourseVOList">第{{item.dayNum}}天</div>
              </template>
            </el-table-column>

            <el-table-column  prop="id" label="课程id" >
              <template slot-scope="scope" >
                <div class="itemStyle" v-for="(item,index) in scope.row.readBookCourseVOList">{{item.courseID}}</div>
              </template>
            </el-table-column>

            <el-table-column prop="courseType" label="课程类型" >
              <template slot-scope="scope">
                <div class="itemStyle" v-for="(item,index) in scope.row.readBookCourseVOList">{{item.courseType==1?'音频':'其它'}}</div>
              </template>
            </el-table-column>

            <el-table-column prop="title" label="课程标题" width="300">
              <template slot-scope="scope">
                <div class="itemStyle" v-for="(item,index) in scope.row.readBookCourseVOList">{{item.courseTitle}}</div>
              </template>
            </el-table-column>

            <el-table-column prop = "manageStatus"  label="课程状态" >
              <template slot-scope="scope">
                <div class="itemStyle" v-for="(item,index) in scope.row.readBookCourseVOList">
                  <template v-if="item.courseStatus==0">待上线</template>
                  <template v-if="item.courseStatus==1">已上线</template>
                  <template v-if="item.courseStatus==2">已下线</template>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="120">
              <template slot-scope="edit">
                <div class="itemStyle" v-for="(item,index) in edit.row.readBookCourseVOList">
                  <el-button type="text" size="mini" @click="editCourse(1,item)">编辑课程</el-button>
                  <el-button type="text" size="mini" @click="removeCourse(item)">移除</el-button>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="140">
              <template slot-scope="edit">
                <el-button type="text" size="mini" @click="editCourse(2,edit.row)">添加课程</el-button>
                <el-button type="text" size="mini" @click="addBook(2,edit.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="deleteBook(edit.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </template>
      </div>
    </div>
    <!--弹窗-->

    <div class="add-type-diolog">
      <el-dialog :title="digTite + '课程'" :visible.sync="editDiolog" style="width:80%;left:50%;margin-left:-40%;">
        <el-form :model="courseSearchForm" ref="courseSearchForm" :rules="rules">
          <el-form-item label="解锁日期：">
            第{{courseDay}}天
          </el-form-item>
          <el-form-item label="关联课程：">
            <el-select filterable v-model="courseSearchForm.selectType" style="width:50%;" @change="selChange">
              <el-option v-for="(item,index) in courseList" :key="index" :label="item.title" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="海报背景图">
            <el-upload
              class="avatar-uploader"
              action="/upload/image"
              name="imageFile"
              :show-file-list=false
              :on-success="firstSuccess3"
              :before-upload="beforeAvatarUpload">
              <img v-if="courseSearchForm.imgUrl" :src="courseSearchForm.imgUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <el-button size="small" type="primary">{{courseSearchForm.imgUrl ? '修改文件' : '选择文件'}}</el-button>
              <div slot="tip" class="el-upload__tip">750*544,支持jpg、png、gif格式,最大5M</div>
            </el-upload>
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
        <el-form :model="courseForm" ref="courseForm" :rules="rules">
          <el-form-item label="书籍标题" prop="title">
            <el-col :span="8">
              <el-input v-model="courseForm.title" placeholder="1-30字，建议14字以内" :maxlength="30"></el-input>

            </el-col>
          </el-form-item>
          <el-form-item class="is-required" label="书籍封面" prop="imgUrl">
            <el-upload
              class="avatar-uploader"
              action="/upload/image"
              name="imageFile"
              :show-file-list=false
              :on-success="firstSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="courseForm.imgUrl" :src="courseForm.imgUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <el-button size="small" type="primary">{{courseForm.imgUrl ? '修改文件' : '选择文件'}}</el-button>
              <div slot="tip" class="el-upload__tip">360*484,支持jpg、png、gif格式,最大5M</div>
            </el-upload>
          </el-form-item>

          <el-form-item label="海报背景图">
            <el-upload
              class="avatar-uploader"
              action="/upload/image"
              name="imageFile"
              :show-file-list=false
              :on-success="firstSuccess2"
              :before-upload="beforeAvatarUpload">
              <img v-if="courseForm.backGroundUrl" :src="courseForm.backGroundUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <el-button size="small" type="primary">{{courseForm.backGroundUrl ? '修改文件' : '选择文件'}}</el-button>
              <div slot="tip" class="el-upload__tip">750*544,支持jpg、png、gif格式,最大5M</div>
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
  import E from 'wangeditor'
  import plupload from 'plupload';
  import qs from 'qs'

  import {

  } from '@/api/index'

  export default {
    data() {
      return {
        rules:{
          title: [
            {required: true, message: '请输入计划标题', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字', trigger: 'blur'}
          ],
          imgUrl:[
            {required: true, message: '请上传书籍封面', trigger: 'blur'},
          ]
        },
        courseEditId:null,
        readId:null,
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
        bookType:1,
        bookId:null,
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
          imgUrl:''
        },
        //新增编辑课程form 表单
        courseForm: {
          title:null,
          imgUrl:'',
          backGroundUrl:''
        },
        courseList:[]
      }
    },

    computed: {

    },
    mounted(){

    },
    created() {
      this.readId = this.$route.query.readId;
      this.getData();
    },
    methods: {
      selChange(val){
          this.courseSearchForm.selectType = val;
      },
      //获取列表数据
      getData() {
        let params ={
          readId: this.$route.query.readId,
          pageNum: this.pageOption.pageNum,
          pageSize: 20,
        }
        this.$http.get('/read/book/list', {params}).then(res => {
          let resp = res.data;
          if (resp.success) {
            this.courseManageList = resp.data ;
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
              }else {
                if(item.title === arr[index-1].title){
                  spanArr[contactDot] +=1
                  spanArr.push(0)
                }else {
                  spanArr.push(1);
                  contactDot = index;
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
      removeCourse(item){
        this.$confirm('确认移除阅读课程:'+item.courseTitle, '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/read/book/course/delete?id='+item.id).then(res => {
            let resp = res.data
            if (resp.success) {
              this.$message.success('删除成功');
              this.getData()
            } else {
              let msg = resp.desc || '删除失败'
              this.$message.error(msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

      },
      deleteBook(id){
        let params = {
          id:id
        }
        this.$confirm('确认删除','删除',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>{
          this.$http.post('/read/book/delete',qs.stringify(params)).then(res =>{
            let resp = res.data
            if(resp.success){
              this.$message.success('删除成功');
              this.getData();
            }else{
              let msg = resp.desc || '请求失败';
              this.$message.error(msg)
            }
            this.loading = false;
          }).catch(() =>{
            this.loading = false;
          })
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
      getDetail(id){
        this.$http.post('/read/book/detail?id='+id).then(res =>{
          let resp = res.data;
          this.courseForm = resp.data;
          console.log(resp.data)
        })
      },
      addBook(type,row){
        if(row){
          this.bookId = row.id;
          this.getDetail(this.bookId)
        }else{
          this.courseForm.title = null;
          this.courseForm.imgUrl = '';
        }
        this.bookDiolog = true;
        this.bookType = type;
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
          if (width == 360 && height == 484) {
            self.courseForm.imgUrl = 'https:' + res.data.fileUrl;
          } else {
            self.$message.error('上传图片的尺寸必须为 360*484!')
          }
        };
      },
      firstSuccess2(res, file) {
        const self = this;
        const image = new Image();
        image.src = 'https:' + res.data.fileUrl;
        image.onload = function () {
          const width = image.width;
          const height = image.height;
          if (width == 750 && height == 544) {
            self.courseForm.backGroundUrl = 'https:' + res.data.fileUrl;
          } else {
            self.$message.error('上传图片的尺寸必须为 750*544!')
          }
        };
      },
      firstSuccess3(res, file) {
        const self = this;
        const image = new Image();
        image.src = 'https:' + res.data.fileUrl;
        image.onload = function () {
          const width = image.width;
          const height = image.height;
          if (width == 750 && height == 545) {
            self.courseSearchForm.imgUrl = 'https:' + res.data.fileUrl;
          } else {
            self.$message.error('上传图片的尺寸必须为 750*544!')
          }
        };
      },
      getAllCourse(title){
        let params ={
          title:title
        }
        this.$http.get('/course/all',qs.stringify(params)).then(res =>{
          let resp = res.data;
          if (resp.success) {
            this.courseList = resp.data;
          } else {
            let msg = resp.desc || '编辑失败'
            this.$message.error(msg)
          }
        })
      },
      getCourseDetail(id){
        this.$http.get('/read/book/course/detail?id='+id).then(res =>{
          let resp = res.data;
          console.log(resp.data)
          if (resp.success) {
            this.courseSearchForm.selectType = resp.data.courseId
            this.courseSearchForm.imgUrl = resp.data.imgUrl
          } else {
            let msg = resp.desc || '编辑失败'
            this.$message.error(msg)
          }
        })
      },
      editCourse(title,row) {
        this.courseEditId = row.id;
        this.editDiolog = true ;
        this.digType = title;
        this.digTite = title == 1?'编辑':'添加' ;
        if(title==1){
          this.courseDay = row.dayNum;
          this.getCourseDetail(row.id)
        }else{
          this.courseDay = row.lastDayNum+1;
        }
        this.getAllCourse(row.courseTitle)

      },
      subCourse(){
        let params = {
          courseId:this.courseSearchForm.selectType,
          imgUrl:this.courseSearchForm.imgUrl
        };

        if(this.digType==1){
          params.id = this.courseEditId
          console.log('编辑')
          this.$http.post("/read/book/course/edit",qs.stringify(params)).then(res =>{
            let resp = res.data;
            if (resp.success) {
              this.$message.success('编辑成功');
              this.editDiolog = false;

              this.getData();
            } else {
              let msg = resp.desc || '编辑失败'
              this.$message.error(msg)
            }
          })
        }else{
          console.log('新增')
          params.readId = this.readId;
          params.bookId =this.courseEditId;
          this.$http.post("/read/book/course/add",qs.stringify(params)).then(res =>{
            let resp = res.data;
            if (resp.success) {
              this.$message.success('编辑成功');

              this.editDiolog = false;

              this.getData();
            } else {
              let msg = resp.desc || '编辑失败'
              this.$message.error(msg)
            }
          })
        }
      },
      // 分页请求
      pageChange (currentPage) {
        this.pageOption.pageNum = currentPage
        this.getData()
      },
      // 保存书籍
      saveBook () {
        let params =  this.courseForm;
        params.readId = this.readId;
        this.$refs['courseForm'].validate((valid)=>{
          if (valid) {
            this.loading = true;
            if (this.bookType!=1) {
              params.id = this.bookId;
              this.$http.post('/read/book/save',qs.stringify(params)).then(res => {
                let resp = res.data
                if (resp.success) {
                  this.$message.success('编辑成功');
                  this.loading = false;
                  this.bookDiolog = false;
                  this.getData()
                } else {
                  this.loading = false;
                  let msg = resp.desc || '编辑失败'
                  this.$message.error(msg)
                }
              })
            } else {
              this.$http.post('/read/book/save',qs.stringify(params)).then(res => {
                let resp = res.data
                if (resp.success) {
                  this.$message.success('新增成功');
                  this.getData()
                  this.loading = false;
                  this.bookDiolog = false;
                } else {
                  this.loading = false;
                  let msg = resp.desc || '新增失败'
                  this.$message.error(msg)
                }
              })
            }
          } else {
            return false;
          }
        })
      }


    }
  }

</script>
<style lang="less" >
  .ofa-main-wrap {
    .removeDefStyle{
      .el-table .cell{
        display: block !important;
      }
      .el-table td, .el-table th{
        padding:0;
        text-align:center;
        min-height:40px;
        line-height:40px;
      }
      .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{
        padding-left:0;
        min-height:50px;
        line-height:50px;
      }
      .el-table .cell, .el-table th div{
        padding-right:0;
      }
      .itemStyle{
        border-bottom:1px solid #ebeef5;
      }
      .itemStyle:last-child{
        border:0
      }
    }

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
