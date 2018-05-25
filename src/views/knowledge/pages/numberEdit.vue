<template>
  <section class="ofa-main-wrap" v-loading="loading">
    <div class="title-wrap">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/read' }">阅读计划</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/courseGroup?readId='+ readId}" >期数管理</el-breadcrumb-item>
        <el-breadcrumb-item>新建|编辑期数</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content ">
      <el-form :model="columnForm" :rules="rules" ref="columnForm"  label-width="100px" class="column-uleForm" label-position="left">
        <el-form-item prop="beginDate" label="开课日期">
          <el-col :span="6">
            <el-date-picker type="date" placeholder="选择日期" v-model="columnForm.beginDate" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="第几期" prop="stageNum">
          <el-col :span="6">
            <el-input v-model="columnForm.stageNum" placeholder="1-999" type="number" :maxlength="3">
              <template slot="append">期</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item class="is-required" label="老师微信">
          <div v-for="(item,index) in teachterArr">
            <div style="color:#606266">第{{item.startNum}}~{{item.startEnd}}单</div>
            <el-upload
                       class="avatar-uploader"
                       action="/upload/image"
                       name="imageFile"
                       :show-file-list=false
                       :on-success="firstSuccess"
                       :before-upload="beforeAvatarUpload"
                       ref="index"
            >
              <img v-if="columnForm.wxQrcodeUrl" :src="item.teacherWxQrcodeUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <el-button size="small" type="primary">{{columnForm.teacherWxQrcodeUrl ? '修改文件' : '选择文件'}}</el-button>
              <div slot="tip" class="el-upload__tip">750*545,支持jpg、png、gif格式,最大5M</div>
            </el-upload>
            <!--<el-form-item label="微信号" style="padding:30px 0">-->
              <!--<el-col :span="6">-->
                <!--<el-input>-->
                <!---->
                <!--</el-input>-->
              <!--</el-col>-->
            <!--</el-form-item>-->
          </div>
        </el-form-item>
        <el-form-item>
          <a href="javascript:;" @click="addTeach()">新增老师微信</a>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelForm()">取消</el-button>
          <el-button type="primary" @click="submitForm('columnForm')">保存</el-button>
        </el-form-item>
      </el-form>

    </div>
  </section>
</template>
<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import qs from 'qs'
  import { formatDateNew } from '../components/knowledgeValidRules'

  import {
    //updateStatusColumn,
    //pageListColumn,
    //getLinkCourse,
    updateColumn,
    //deleteColumn,
    addColumn,
    //removeColumn,
    //updateWatchStatus,
    relateCourse,
    coursePageList,
    lecturerList,
    courseSort,
  } from '@/api/index'

  export default {
    components: {

    },
    data() {
      var courseNumRule = (rule, value, callback) => {
        if(/^\d+\.\d+$/.test(String(value))){
          callback(new Error('不可以为小数'));
        }else{
          if(value > 999){
            callback(new Error('最大值为999'));
          }else{
            if(value < 1){
              callback(new Error('最小值为1'));
            }else{
              callback()
            }
          }
        }
      };
      return {
        teachterArr:[
          {code:"1-3000",startNum:1,startEnd:3000,teacherWxNumber:'ssss',teacherWxQrcodeUrl:''}
        ],
        imgIndex:0,
        startEnd:'',
        startNum:'',
        imgSrc:'',
        editorContent:null,
        loading: false,
        readId:null,
        numId:null,
        imgArr:[],
        //新增编辑专栏form表单
        columnForm: {
          beginDate:'',
          stageNum:'',
          wxQrcodeUrl:null,
          //readId:'',

        },
        rules: {
          stageNum: [
            {required: true, message: '请输入课程期数', trigger: 'blur'},
            {validator: courseNumRule, trigger: 'blur' }
          ],
          beginDate: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {

    },
    created() {
      this.numId = this.$route.query.numId
      this.readId = this.$route.query.readId;
    },
    methods: {
      changeUpload: function(file) {
        this.$nextTick(
          () => {
            console.log(file)
            this.imgSrc = file.url;
          });
      },
      addTeach(){
        for(let i=0;i<this.teachterArr.length;i++){
          this.startNum = this.teachterArr[i].startNum
          this.startEnd = this.teachterArr[i].startEnd
        }
        let aa = {
          startNum:this.startEnd+1,
          startEnd:this.startEnd + 3000,
          code:(this.startEnd+1) +'-'+ (this.startEnd+3000),
          teacherWxNumber:"ssssssss"
        }
        this.teachterArr.push(aa)
        console.log(this.teachterArr)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            const params = Object.assign({},this.columnForm);
            params.readId = this.readId;
            params.beginDate = formatDateNew(params.beginDate);
            params.stageNum = this.columnForm.stageNum;
            params.wxQrcodeUrl = this.teachterArr;
            console.log(params)
            if (this.numId!=0) {
              console.log('修改')
              params.id = this.numId;
              console.log(params)
              this.$http.post('/read/stage/save',params).then(res =>{
                let resp = res.data
                if(resp.success){
                  this.$message.success('修改成功');
                  this.getData();
                  this.$router.go(-1);
                }else{
                  let msg = resp.desc || '请求失败';
                  this.$message.error(msg)
                }
                this.loading = false;
              }).catch(() =>{
                this.loading = false;
              })
            } else {
              console.log('新增')
              this.$http.post('/read/stage/save',params).then(res =>{
                let resp = res.data
                if(resp.success){
                  this.$message.success('新增成功');
                  this.getData();
                  this.$router.go(-1);
                }else{
                  let msg = resp.desc || '请求失败';
                  this.$message.error(msg)
                }
                this.loading = false;
              }).catch(() =>{
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
        console.log(res)
        this.imgIndex = this.$refs.index.length-1;
        const self = this;
        const image = new Image();
        image.src = 'https:' + res.data.fileUrl;
        image.onload = function () {
          const width = image.width;
          const height = image.height;
          self.columnForm.wxQrcodeUrl = 'https:' + res.data.fileUrl;
          self.teachterArr[self.imgIndex].teacherWxQrcodeUrl = self.columnForm.wxQrcodeUrl
          //self.imgArr.push(self.columnForm.wxQrcodeUrl)
          console.log(self.teachterArr)
          // if (width == 750 && height == 545) {
          //   self.columnForm.wxQrcodeUrl = 'https:' + res.data.fileUrl;
          // } else {
          //   self.$message.error('上传图片的尺寸必须为 750*545!')
          // }
      };

  },
  // secondSuccess(res, file) {
  //     const self = this;
  //     const image = new Image();
  //     image.src = 'https:' + res.data.fileUrl;
  //     image.onload = function () {
  //       const width = image.width;
  //       const height = image.height;
  //
  //       if (width == 360 && height ==484) {
  //         self.columnForm.verticalCover = 'https:' + res.data.fileUrl
  //       } else {
  //         self.$message.error('上传图片的尺寸必须为 360*484!')
  //       }
  //     };
  // }
    }
  }

</script>
<style lang="less" scoped>
  .ql-container {
    min-height: 200px !important;
  }

.min-search{
  vertical-align: -webkit-baseline-middle;
}
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
    .link-columm {
      float: right;
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
