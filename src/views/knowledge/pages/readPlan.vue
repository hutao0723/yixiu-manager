<template>
  <section class="ofa-main-wrap" v-loading="loading">
    <div class="title-wrap">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/read' }">阅读计划</el-breadcrumb-item>
        <el-breadcrumb-item>添加|编辑阅读计划</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content ">
      <el-form :model="courseForm" :rules="rules" ref="courseForm" label-width="100px" class="column-uleForm">
        <el-form-item label="计划标题" prop="title">
          <el-input v-model="courseForm.title" placeholder="1-30字，建议14字以内" :maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="计划简介" prop="explain">
          <el-input v-model="courseForm.explain" placeholder="1-30字，建议14字以内" :maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="计划周期" prop="date">
          <el-col :span="6">
            <el-input v-model="courseForm.date" placeholder="1-999" type="number" :maxlength="8">
              <template slot="append">天</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="计划价格" prop="price">
          <el-col :span="6">
            <el-input v-model="courseForm.price" placeholder="0.01-99999.99" type="number" :maxlength="8">
              <template slot="append">元</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="分销抽成" prop="rate">
          <el-col :span="6">
            <el-input v-model="courseForm.rate" placeholder="0.00-100.00" type="number" :maxlength="5">
              <template slot="append">%</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item>

          <el-button @click="cancelForm()">取消</el-button>
          <el-button type="primary" @click="submitForm('courseForm')">保存</el-button>

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
      var dateRule = (rule, value, callback) => {
        if(String(value).indexOf('.') !=-1){
          callback(new Error('周期需要为整数'));
        }else{
          if(value> 999 || value <=0){
            callback(new Error('周期区间在1-999之间'));
          } else{
            callback()
          }
        }

      };

      var priceRule = (rule, value, callback) => {
        if(String(value).indexOf('.') !=-1 && String(value).split('.')[1].length >2){
          callback(new Error('最多两位小数'));
        }else{
          if(value> 99999.99 || value <0){
            callback(new Error('价格区间在0.00-99999.99之间'));
          } else{
            callback()
          }
        }

      };

      var rateRule = (rule, value, callback) => {
        if(String(value).indexOf('.') !=-1 && String(value).split('.')[1].length >2){
          callback(new Error('最多两位小数'));
        }else{
          if(value > 100 || value <0){
            callback(new Error('抽成比例在0.00-100.00之间'));
          }else{
            callback()
          }
        }
      };


      return {
        loading: false,
        courseId:'',
        editorContent:null,
        directTransmissionSign: null, //上传签名
        pageOption: {
          pageNum: 1,
          size: 20
        },
        //分页查询课程信息


        rules: {
          uploadFile: [
            {required: true},
          ],
          title: [
            {required: true, message: '请输入计划标题', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字', trigger: 'blur'}
          ],
          explain: [
            {required: true, message: '请输入计划简介', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字', trigger: 'blur'}
          ],
          date: [
            {required: true, message: '请输入计划周期', trigger: 'blur'},
            {validator: dateRule, trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入计划价格', trigger: 'blur'},
            {validator: priceRule, trigger: 'blur' }
          ],
          rate: [
            {required: true, message: '请输入抽成比例', trigger: 'blur'},
            {validator: rateRule, trigger: 'blur' }
          ]
        },
        //新增编辑课程form 表单
        courseForm: {
          id: null,
          title: null,
          explain: null,
          date:null,
          price: null,
          rate: null
        },
      }
    },

    computed: {

    },
    created() {
      if(this.$route.query.courseId){
        this.courseId = this.$route.query.courseId;
      }
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

      submitForm(formName) {
        console.log(formName)
        this.$refs[formName].validate((valid) => {
          console.log(valid)
          if (valid) {
            this.loading = true;
            const params = Object.assign({},this.courseForm);
            params.price = Math.round(this.courseForm.price*100);
            params.rate = Math.round(this.courseForm.rate*100);
            if (this.courseId!=0) {
              console.log('修改')
              updateCourse(params).then(res => {
                if (res.success) {
                  this.$message.success('修改成功');
                } else {
                  let msg = res.desc || '请求失败'
                  this.$message.error(msg);
                }
                this.loading = false;
              }).catch(() => {
                this.loading = false;
              })
            } else {
              console.log('新增')
              addCourse(params).then(res => {
                if (res.success) {
                  this.$message.success('新增成功');
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
      cancelForm() {
        this.$router.go(-1);
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
