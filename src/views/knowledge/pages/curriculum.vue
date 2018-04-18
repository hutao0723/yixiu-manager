<template>
  <section class="ofa-main-wrap" v-loading="loading">
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
                <el-select v-model="courseSearchForm.status">
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
                <el-button type="text" size="mini" @click="changeStatus(scope.row.id,scope.row.status)">
                  {{scope.row.status == 1 ? '下线' : '上线'}}
                </el-button>
                <el-button type="text" size="mini" @click="deleteItem(scope.row.id)" :disabled="false">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="page-control">
        <el-pagination background :page-size="20" :current-page.sync="courseSearchForm.pageNum" @current-change="getData"
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
        <el-form-item label="音频上传" class="audio-list" prop="uploadFile">
          <div>
            <div class="file-container">{{courseForm.uploadFile.name}}</div>
            <el-button size="small" type="primary" id="selectfiles">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">支持mp3、m4a格式，最大500M</div>
            <el-button size="small" type="primary" id="start_upload">点击上传</el-button>
          </div>
        </el-form-item>
        <div class="course-title  mb10 ">基本信息</div>
        <el-form-item label="课程标题" prop="title">
          <el-input v-model="courseForm.title" placeholder="1-45个字"></el-input>
        </el-form-item>
        <el-form-item label="课程副标题" prop="subTitle">
          <el-input v-model="courseForm.subTitle" placeholder="1-45个字"></el-input>
        </el-form-item>
        <el-form-item label="课程封面">
          <el-upload
            class="avatar-uploader"
            action="http://172.31.20.47:9101/upload/image"
            name="imageFile"
            :show-file-list=false
            :on-success="firstSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="courseForm.coverList[0]" :src="courseForm.coverList[0]" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <el-button size="small" type="primary">{{courseForm.coverList[0]?'修改文件':'选择文件'}}</el-button>
            <div slot="tip" class="el-upload__tip">750*560,支持jpg、png、gif格式,最大5M</div>
          </el-upload>
          <el-upload
            class="avatar-uploader"
            action="http://172.31.20.47:9101/upload/image"
            name="imageFile"
            :show-file-list=false
            :on-success="secondSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="courseForm.coverList[1]" :src="courseForm.coverList[1]" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <el-button size="small" type="primary">{{courseForm.coverList[1]?'修改文件':'选择文件'}}</el-button>
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
            <div class="totle-time" v-if="courseForm.timeLength">总长{{audioTimeLength}}</div>
          </el-col>
        </el-form-item>
        <el-form-item label="讲师" prop="lecturerId">
          <el-col :span="4">
            <el-select
              v-model="courseForm.lecturerId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="getLecturerList"
            >
              <el-option
                v-for="item in lecturerOptions"
                :key="item.id"
                :label="item.nickName"
                :value="item.id">
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
  import plupload from 'plupload';

  import {
    addCourse,
    deleteCourse,
    updateCourse,
    getCourse,
    pageListCourse,
    updateStatusCourse,
    lecturerList,
    getDirectTransmissionSign
  } from '@/api/index'

  export default {
    components: {
      quillEditor
    },
    data() {
      return {
        loading: false,
        directTransmissionSign:null, //上传签名
        pageType: 0,
        courseTypeOptions: [
          {
            value: 1,
            label: '音频'
          }
        ],
        lecturerOptions: [],
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
          specialState: '',
          searchTeacherType: 'lecturerNickName',
          id: null,
          title: null,
          status: '',
          lecturerId: null,
          lecturerNickName: null,
          lecturerValue: null,
          pageNum: 1,
          pageSize: null,
        },

        rules: {
          uploadFile: [
            {required: true},
          ],
          courseType: [
            {required: true, message: '请选择课程类型', trigger: 'change'}
          ],
          title: [
            {required: true, message: '请输入课程标题', trigger: 'blur'},
            {min: 1, max: 45, message: '长度在 1 到 45 个字', trigger: 'blur'}
          ],
          freeTime: [
            {required: true, message: '请输入试听时长', trigger: 'blur'}
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
          rate: [
            {required: true, message: '请输入抽成比例', trigger: 'blur'}
          ]
        },
        //新增编辑课程form表单
        courseForm: {
          id: null,
          title: null,
          subTitle: null,
          courseType: null,
          coverList: [],
          detail: null,
          freeTime: null,
          timeLength: null,
          price: null,
          uploadFile: {},
          lecturerId: null,
          publishTime: null,
          rate: null
        },
      }
    },

    computed: {
      audioTimeLength: function () {
        let s = this.courseForm.timeLength;
        if (!s) return '-';
        let hour = Math.floor(s / 3600);
        let min = Math.floor(s / 60) % 60;
        let sec = s % 60;
        return `${hour}时${min}分${sec}秒`
      }
    },
    created() {
      this.getData()
    },
    methods: {

      //上下线
      changeStatus(id, changeStatus) {
        this.loading = true;
        const status = changeStatus%2==0?1:2;
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
        }).catch(()=>{
          this.loading = false;
        })
      },

      //删除课程
      deleteItem(id) {
        this.$confirm('确认删除课程？', '删除', {
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
        [this.courseSearchForm.id, this.courseSearchForm.title] = this.courseSearchForm.selectType == 'id' ? [this.courseSearchForm.searchValue, ''] : ['', this.courseSearchForm.searchValue];
        [this.courseSearchForm.lecturerNickName, this.courseSearchForm.lecturerId] = this.courseSearchForm.searchTeacherType == 'lecturerId' ? ['', this.courseSearchForm.lecturerValue] : [this.courseSearchForm.lecturerValue, ''];
        this.loading = true;

        pageListCourse(this.courseSearchForm).then(res => {
          if (res.success) {
            this.courseList = res.data.content;
            this.totalSize = res.data.totalElements;
          } else {
            let msg = res.data.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },

      getLecturerList(nickName) {
        this.loading = true;

        lecturerList({
          nickName
        }).then(res => {
          if (res.success) {
            this.lecturerOptions = res.data;
          } else {
            let msg = res.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },


      getCourseDetail(id) {
        this.loading = true;

        getCourse({id}).then(res => {
          if (res.success) {
            this.courseForm = Object.assign({}, res.data);
            this.getDirectTransmission();
            this.pageType = 2; //1 新增 2 编辑
          } else {
            let msg = res.desc || '获取课程内容失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
if(this.courseForm.id){
  updateCourse(this.courseForm).then(res => {
    if (res.success) {
      this.$message.success('修改成功')
      this.pageType = 0;
    } else {
      let msg = res.desc || '请求失败'
      this.$message.error(msg);
    }
    this.loading = false;
  }).catch(() => {
    this.loading = false;
  })
}else{
  addCourse(this.courseForm).then(res => {
    if (res.success) {
      this.$message.success('新增成功')
      this.pageType = 0;
    } else {
      let msg = res.desc || '请求失败'
      this.$message.error(msg);
    }
    this.loading = false;
  }).catch(() => {
    this.loading = false;
  })
}
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

      newcourseForm() {
        for (let i in this.courseForm) {
          this.courseForm[i] = null
        }
        this.courseForm.coverList = [];
        this.courseForm.uploadFile = {};
        this.getLecturerList();
        this.getDirectTransmission();
        this.pageType = 1
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
      },

      getCourseType(row, column) {
        return row.courseType == 1 ? '音频' : '视频'
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

      firstSuccess(res, file) {
        const self = this;
        const image = new Image();
        image.src = 'https:' + res.data.fileUrl;
        image.onload = function () {
          const width = image.width;
          if (width != 750) {
            self.courseForm.coverList.unshift('https:' + res.data.fileUrl);
          } else {
            self.$message.error('上传图片的宽度必须为 750px!')
          }
        };
      },

      secondSuccess(res, file) {
        const self = this;
        const image = new Image();
        image.src = 'https:' + res.data.fileUrl;
        image.onload = function () {
          const width = image.width;
          if (width != 750) {
            self.courseForm.coverList.push('https:' + res.data.fileUrl);
          } else {
            self.$message.error('上传图片的宽度必须为 750px!')
          }
        };
      },

      getDirectTransmission() {
        getDirectTransmissionSign().then(res => {
          const self = this;
          if (res.success) {
            this.directTransmissionSign = res.data;

            //        实例化一个plupload上传对象
            var multipart_params = this.directTransmissionSign;
            console.log(multipart_params);

            var uploader = new plupload.Uploader({
              runtimes : 'html5,flash,silverlight,html4',
              browse_button : 'selectfiles',
              url : 'http://youfen.oss-cn-hangzhou.aliyuncs.com/',
              multipart_params: {
                'key' : multipart_params.dir+new Date().getTime(),
                'policy': multipart_params.policy,
                'OSSAccessKeyId': multipart_params.accessid,
                'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
                'signature': multipart_params.signature,
              },
            })

            uploader.init();
            uploader.bind('FilesAdded',function(uploader,files){
              self.courseForm.uploadFile.name = files[0].name;
              self.courseForm.uploadFile.url = uploader.settings.multipart_params.key;
            });
            uploader.bind('uploadProgress',function(uploader,files){
              self.courseForm.uploadFile.name = `已完成${files.percent}%`;
            });
            uploader.bind('UploadComplete',function(uploader,files){
              self.courseForm.uploadFile.name = files[0].name;
            });
            document.getElementById('start_upload').onclick = function(){
              uploader.start();
            }
          } else {
            let msg = res.desc || '获取上传路径失败'
            this.$message.error(msg)
          }
        }).catch(()=>{
          this.$message.error('网络错误')
        })
      }
    }
  }

</script>
<style lang="less" scoped>
  .ofa-main-wrap {
    width: 100%;
    .totle-time {
      position: absolute;
      top: 10px;
      left: 235px;
      color: #333;
    }
    .audio-list {
      .file-container{
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
