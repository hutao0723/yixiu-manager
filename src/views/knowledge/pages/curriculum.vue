<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><span @click="pageType = 0">课程</span></el-breadcrumb-item>
        <el-breadcrumb-item v-if="pageType == 1">新建课程</el-breadcrumb-item>
        <el-breadcrumb-item v-if="pageType == 2">编辑课程</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content" v-if="pageType == 0">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="courseSearchForm" class="demo-form-inline" size="mini">
            <el-col :span="3">
              <el-form-item>
                <el-select v-model="courseSearchForm.selectType">
                  <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-input v-model="courseSearchForm.searchValue"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-select v-model="courseSearchForm.specialState">
                  <el-option v-for="item in specialStateOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-select v-model="courseSearchForm.searchTeacherType">
                  <el-option v-for="item in searchTeacherTypeOption" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-form-item>
              <el-input v-model="courseSearchForm.lecturerValue"></el-input>
            </el-form-item>
            <el-button type="primary" @click="getData" size="mini">查询</el-button>
            <el-button type="primary" @click="newcourseForm" size="mini">新建课程</el-button>
          </el-form>
        </template>
      </div>
      <div class="tabel-wrap">
        <template>
          <el-table :data="courseList" style="width: 100%">
            <el-table-column prop="id" label="课程ID">
            </el-table-column>
            <el-table-column prop="courseType" label="课程类型" :formatter="getCourseType">
            </el-table-column>
            <el-table-column prop="title" label="课程标题">
            </el-table-column>
            <el-table-column prop="price" label="课程价格">
            </el-table-column>
            <el-table-column prop="status" label="课程状态" :formatter="getStatus"></el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <!--openDialogAdmin(scope.row.managerName,scope.row.id）-->
                <el-button type="text" size="mini" @click="getCourseDetail(scope.row.id)">编辑</el-button>
                <el-button type="text" size="mini" @click="changeStatus(scope.row.id,scope.row.status)">{{scope.row.status==1?'上线':'下线'}}</el-button>
                <el-button type="text" size="mini" @click="deleteItem(scope.row.id)" :disabled="false">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="page-control">
        <el-pagination background :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="getData"
                       layout="total, prev, pager, next"
                       :total="totalSize"></el-pagination>
      </div>
    </div>
    <div class="content " v-else>
      <el-form :model="courseForm" :rules="rules" ref="courseForm" label-width="100px" class="column-uleForm">
        <div class="course-title  mb10 ">课程内容</div>
        <el-form-item label="课程类型" prop="courseType" :formatter="getCourseType">
          <el-col :span="4">
            <el-select v-model="courseForm.courseType" filterable placeholder="请选择">
              <el-option
                v-for="item in courseTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="音频上传" prop="address" class="audio-list">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :limit="1"
            :on-remove="audioRemove"
            :on-progress="audioSuccess"
            :file-list="courseForm.address">
            <el-button size="small" type="primary" v-if="courseForm.address.length==0">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">支持mp3、m4a格式，最大500M</div>
          </el-upload>
        </el-form-item>
        <div class="course-title  mb10 ">基本信息</div>
        <el-form-item label="课程标题" prop="title">
          <el-input v-model="courseForm.title" placeholder="1-45个字"></el-input>
        </el-form-item>
        <el-form-item label="课程副标题" prop="subTitle">
          <el-input v-model="courseForm.subTitle" placeholder="1-45个字"></el-input>
        </el-form-item>
        <el-form-item label="课程封面" required>
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="courseForm.frontCover[0]" :src="courseForm.frontCover[0].url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">750*560,支持jpg、png、gif格式,最大5M</div>
          </el-upload>

          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="courseForm.frontCover[1]" :src="courseForm.frontCover[1].url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">750*xxx,支持jpg、png、gif格式,最大5M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程详情" prop="detail">
          <quill-editor v-model="courseForm.detail"></quill-editor>
        </el-form-item>
        <el-form-item label="试听时长" prop="freeTime">
          <el-col :span="4">
            <el-input v-model="courseForm.freeTime">
              <template slot="append">秒</template>
            </el-input>
            <div class="totle-time">总长{{audioTimeLength}}</div>
          </el-col>
        </el-form-item>
        <el-form-item label="讲师" prop="lecturerId">
          <el-col :span="4">
            <el-select v-model="courseForm.lecturerId" filterable placeholder="请选择">
              <el-option
                v-for="item in lecturerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="课程日期" prop="publishTime">
          <el-col :span="4">
            <el-date-picker
              v-model="courseForm.publishTime"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="课程价格" prop="price">
          <el-col :span="4">
            <el-input v-model="courseForm.price">
              <template slot="append">元</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="讲师抽成" prop="rate">
          <el-col :span="4">
            <el-input v-model="courseForm.rate">
              <template slot="append">%</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('courseForm')">保存</el-button>
          <el-button @click="cancelForm('courseForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>
<script>
  import {formatHourSec} from '../../../utils/dateUtils'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {quillEditor} from 'vue-quill-editor'
  import {addCourse, deleteCourse, updateCourse, getCourse, pageListCourse, updateStatusCourse} from '@/api/index'

  export default {
    components: {
      quillEditor
    },
    data() {
      return {
        pageType: 0,
        courseTypeOptions: [
          {
            value: 1,
            label: '音频'
          }
        ],
        lecturerOptions: [
          {
            value: 0,
            label: '王老师'
          },
          {
            value: 1,
            label: '张老师'
          }
        ],
        searchOptions: [
          {
            value: 'title',
            label: '课程标题'
          }, {
            value: 'id',
            label: '课程ID'
          }],
        specialStateOptions: [
//          课程状态|待上线|已上线|已下线
          {
            value: '',
            label: '课程状态'
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
        searchTeacherTypeOption: [
//          讲师昵称|讲师Id
          {
            value: 'lecturerNickName',
            label: '讲师昵称'
          }, {
            value: 'lecturerId',
            label: '讲师ID'
          }
        ],
        pageOption: {
          pageNum: 1,
          size: 20
        },
        totalSize: 1,
        courseList: [],

        //分页查询课程信息
        courseSearchForm: {
          selectType: 'title',
          searchValue: null,
          specialState:'',
          searchTeacherType:'lecturerNickName',
          id: null,
          title: null,
          status: null,
          lecturerId: null,
          lecturerNickName: null,
          lecturerValue: null,
          pageNum: null,
          pageSize: null,
        },

        rules: {
          address: [
            {required: true, message: '请选择上传文件', trigger: 'change'},
          ],
          courseType: [
            {required: true, message: '请选择课程类型', trigger: 'change'}
          ],
          title: [
            {required: true, message: '请输入课程标题', trigger: 'blur'},
            {min: 1, max: 45, message: '长度在 1 到 45 个字', trigger: 'blur'}
          ],
          frontCover: [
            {required: true, message: '请选择课程封面', trigger: 'change'}
          ],
          detail: [
            {required: true, message: '请输入课程详情', trigger: 'blur'}
          ],
          lecturerId: [
            {required: true, message: '请选择讲师', trigger: 'change'}
          ],
          publishTime: [
            {required: true, message: '请选择课程日期', trigger: 'change'}
          ],
          price: [
            {required: true, message: '请输入课程价格', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '请填写活动形式', trigger: 'blur'}
          ],
          rate: [
            {required: true, message: '请填写抽成比例', trigger: 'blur'}
          ]
        },
        //新增编辑课程form表单
        courseForm: {
          id: null,
          title: null,
          subTitle:null,
          courseType: null,
          frontCover: [],
          detail: null,
          freeTime:null,
          timeLength:null,
          price: null,
          address: [],
          lecturerId: null,
          publishTime: null,
          rate: null
        },
      }
    },

    computed:{
      audioTimeLength:function (){
        let s = this.courseForm.timeLength;
        if (!s) return '-';
        let hour = Math.floor(s/3600);
        let min = Math.floor(s/60) % 60;
        let sec = s % 60;
        return  `${hour}时${min}分${sec}秒`
      }
    },
    created() {
      this.getData()
    },
    methods: {

      //上下线
      changeStatus(id,status) {
        updateStatusCourse({
            id,
            status
        }).then(res => {
          if (res.success) {
            this.$message.success('切换成功')
          } else {
            let msg = res.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },

      //删除课程
      deleteItem(id) {
        this.$confirm('确认删除课程？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCourse({id}).then(res => {
            if (res.success) {
              this.$message.success('删除成功');
              this.getData();
            } else {
              let msg = res.desc || '删除失败'
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

      //获取列表数据
      getData() {
        [this.courseSearchForm.id,this.courseSearchForm.title] = this.courseSearchForm.selectType == 'id'?[this.courseSearchForm.searchValue,'']:['',this.courseSearchForm.searchValue];
        [this.courseSearchForm.lecturerNickName,this.courseSearchForm.lecturerId]=this.courseSearchForm.searchTeacherType == 'lecturerId'?['',this.courseSearchForm.lecturerValue]:[this.courseSearchForm.lecturerValue,''];
        pageListCourse(this.courseSearchForm).then(res => {
          if (res.success) {
            this.courseList = res.data.content;
            this.totalSize = res.data.totalElements;
          } else {
            let msg = res.data.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },

      getCourseDetail(id) {
        getCourse({id}).then(res => {
          if (res.success) {
            this.courseForm = Object.assign({},res.data);
            this.pageType = 2; //1 新增 2 编辑
          } else {
            let msg = res.desc || '获取课程内容失败'
            this.$message.error(msg)
          }
        })
      },

      audioRemove(){
        this.courseForm.address.shift();
      },

      audioSuccess(event, file, fileList){
        this.courseForm.address.push({
          'name':file.name,
          'url':file.url
        })
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updateCourse(this.courseForm).then(res => {
              if (res.success) {
                this.$message.success('修改成功')
                this.pageType = 0;
              } else {
                let msg = res.desc || '请求失败'
                this.$message.error(msg);
              }
            })
          } else {
            console.log('数据未填写完整');
            return false;
          }
        });
      },

      cancelForm(formName) {
        this.$refs[formName].resetFields();
        this.pageType = 0;
      },

      newcourseForm(){
        for(let i in this.courseForm){
          this.courseForm[i] = null
        }
        this.courseForm.frontCover=[];
        this.courseForm.address = [];
        console.log(this.courseForm)
        this.pageType = 1
      },

      getStatus(row, column){
        switch (row.status){
          case '':
            return '课程状态';
          case 0:
            return '待上线';
          case 1:
            return '已上线';
          case 2:
            return '已下线';
        }
      },

      getCourseType(row,column){
        return row.courseType == 1?'音频':'视频'
      },

      beforeAvatarUpload(file) {
        const isJLtType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        const isLtSize = file.size / 1024 <= 10000;
        if (!isJLtType) {
          this.$message.error('上传皮肤图片只能是 JPG/PNG/GIF 格式!');
        }
        if (!isLtSize) {
          this.$message.error('上传皮肤图片大小不能超过 100KB!');
        }
        return isJLtType && isLtSize;
      },

      handleAvatarSuccess(res, file) {
        const image = new Image();
        image.src = 'https:' + res.data.fileUrl;
        image.onload = function () {
          const width = image.width;
          if (width != 750) {
            this.courseForm.frontCover = res.data.fileUrl;
          } else {
            this.$message.error('上传图片的宽度必须为 750px!')
          }
        };
      },

    }
  }

</script>
<style lang="less" scoped>
  .ofa-main-wrap {
    width: 100%;
    .totle-time{
      position: absolute;
      top: 0;
      left: 235px;
      color: #333;
    }
    .audio-list{
      .el-upload-list__item,.el-upload-list__item:first-child{
        line-height:40px;
        margin-top:0}
      .el-upload-list{
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
      .el-upload__tip,.el-button{
        position: absolute;
        left: 200px;
        top: 0;
      }
      .el-upload__tip{
        top:30px;
      }
    }
  }
</style>
