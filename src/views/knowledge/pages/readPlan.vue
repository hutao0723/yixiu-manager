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
          <el-input v-model="courseForm.title" placeholder="1-30字，建议14字以内" :maxlength="30" autofocus></el-input>
        </el-form-item>
        <el-form-item label="计划简介" prop="briefer">
          <div id="editorElem" style="text-align:left" >

          </div>
        </el-form-item>
        <el-form-item class="is-required" label="背景图" prop="bgImgUrl">
          <el-upload
            class="avatar-uploader"
            action="/upload/image"
            name="imageFile"
            :show-file-list=false
            :on-success="firstSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="courseForm.bgImgUrl" :src="courseForm.bgImgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <el-button size="small" type="primary">{{courseForm.bgImgUrl ? '修改文件' : '选择文件'}}</el-button>
            <div slot="tip" class="el-upload__tip">750*545,支持jpg、png、gif格式,最大5M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="计划周期" prop="days">
          <el-col :span="6">
            <el-input v-model="courseForm.days" placeholder="1-999" type="number" :maxlength="8">
              <template slot="append">天</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="计划价格" prop="presentPrice">
          <el-col :span="6">
            <el-input v-model="courseForm.presentPrice" placeholder="0.01-99999.99" type="number" :maxlength="8">
              <template slot="append">元</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="计划原价" prop="costPrice">
          <el-col :span="6">
            <el-input v-model="courseForm.costPrice" placeholder="0.01-99999.99" type="number" :maxlength="8">
              <template slot="append">元</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="分销抽成" prop="distRate">
          <el-col :span="6">
            <el-input v-model="courseForm.distRate" placeholder="0.00-100.00" type="number" :maxlength="5">
              <template slot="append">%</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item>

          <el-button @click="cancelForm()">取消</el-button>
          <el-button type="primary" @click="submitForm()">保存</el-button>

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
  import qs from 'qs'

  import {

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
          if(value > 1 || value <0){
            callback(new Error('抽成比例在0.00-1.00之间'));
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
          title: [
            {required: true, message: '请输入计划标题', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字', trigger: 'blur'}
          ],
          briefer: [
            {required: true, message: '请输入计划简介', trigger: 'blur'},
            //{min: 1, max: 30, message: '长度在 1 到 30 个字', trigger: 'blur'}
          ],
          days: [
            {required: true, message: '请输入计划周期', trigger: 'blur'},
            {validator: dateRule, trigger: 'blur'}
          ],
          presentPrice: [
            {required: true, message: '请输入计划价格', trigger: 'blur'},
            {validator: priceRule, trigger: 'blur' }
          ],
          costPrice:[
            {required: true, message: '请输入计划原价', trigger: 'blur'},
            {validator: priceRule, trigger: 'blur' }
          ],
          bgImgUrl:[
            {required: true, message: '请上传背景图', trigger: 'blur'},
          ],
          distRate: [
            {required: true, message: '请输入抽成比例', trigger: 'blur'},
            {validator: rateRule, trigger: 'blur' }
          ]
        },
        //新增编辑课程form 表单
        courseForm: {
          title: null,//标题
          briefer:null,//简介
          days:null,//周期
          costPrice:null,//原价
          presentPrice:null,//现价
          distRate:null,//分销
          bgImgUrl:null,//背景
          //detail:null
        },
      }
    },
     mounted(){
       this.creatRichText();
     },
    created() {
      if(this.$route.query.courseId){
        this.courseId = this.$route.query.courseId;
        if(this.courseId!=0){
          this.getDetail(this.courseId)
        }
      }

    },
    methods: {
      getDetail(id){
        this.$http.get('/read/detail?id='+id).then(res =>{
          let resp = res.data;
          this.courseForm = resp.data;
          document.getElementsByClassName('w-e-text')[0].innerHTML = this.courseForm.briefer
          console.log(resp.data)
        })
      },
      creatRichText(res){
        var editor = new E('#editorElem')
        /* 处理上传图片的controller路径 */
        editor.customConfig.uploadImgServer = '/upload/image'
        /* 定义上传图片的默认名字 */
        editor.customConfig.uploadFileName = 'imageFile'
        editor.customConfig.withCredentials = false;
        editor.customConfig.debug=true;
        editor.customConfig.menus = [
          'head',  // 标题
          'bold',  // 粗体
          'fontSize',  // 字号
          // 'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          'backColor',  // 背景颜色
          // 'link',  // 插入链接
          // 'list',  // 列表
          'justify',  // 对齐方式
          // 'quote',  // 引用
          // 'emoticon',  // 表情
          'image',  // 插入图片
          // 'table',  // 表格
//          'video',  // 插入视频
          // 'code',  // 插入代码
          'undo',  // 撤销
          'redo'  // 重复
        ];
        editor.customConfig.uploadImgHooks = {
          customInsert: function (insertImg, result, editor) {
            // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
            // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
            // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
            var url = result.data.fileUrl
            insertImg(url)
            // result 必须是一个 JSON 格式字符串！！！否则报错
          }
        };
        editor.customConfig.onchange = (html) => {
          const content = html=='<p><br></p>'?'':html;
          this.courseForm.briefer = content;
        }
        editor.create()
        editor.txt.clear();
        editor.txt.html(res || null)
      },



      priceFilter(data){
        if(/^\d+\.\d+$/.test(String(data.courseForm.presentPrice))) {
          this.courseForm.presentPrice = Number(String(this.courseForm.presentPrice).split('.')[0])
        }
      },

      rateFilter(data){
        if(/^\d+\.\d+$/.test(String(data.courseForm.distRate))) {
          this.courseForm.distRate = Number(String(this.courseForm.distRate).split('.')[0])
        }
      },

      submitForm() {
        let params =  this.courseForm;
        console.log(params)
        this.$refs['courseForm'].validate((valid)=>{
          if (valid) {
            this.loading = true;
            if (this.courseId!=0) {
              console.log('修改')
              params.id = this.courseId;
              this.$http.post('/read/save',qs.stringify(params)).then(res => {
                let resp = res.data
                if (resp.success) {
                  this.$message.success('编辑成功');
                  this.$router.go(-1);
                } else {
                  let msg = resp.desc || '编辑失败'
                  this.$message.error(msg)
                }
              })
            } else {
              console.log('新增')
              this.$http.post('/read/save',qs.stringify(params)).then(res => {
                let resp = res.data
                if (resp.success) {
                  this.$message.success('新增成功');
                  this.$router.go(-1);
                } else {
                  let msg = resp.desc || '新增失败'
                  this.$message.error(msg)
                }
              })
            }
          } else {
            console.log('数据未填写完整');
            return false;
          }
        })

      },
      cancelForm() {
        this.$router.go(-1);
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
          //self.courseForm.bgImgUrl = 'https:' + res.data.fileUrl;
          if (width == 750 && height == 545) {
            self.courseForm.bgImgUrl = 'https:' + res.data.fileUrl;
          } else {
            self.$message.error('上传图片的尺寸必须为 750*545!')
          }
        };

      },
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
