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
        <el-form-item class="is-required" label="老师微信" >
          <el-form-item style="margin-bottom: 10px" v-for="(item,index) in teachterArr" :key="index" v-on:click.native="getImgIndex(index)" prop="wxQrcodeUrl">
            <div style="color:#606266;">第{{item.startNum}}~{{item.startEnd}}单</div>
            <el-upload
                       class="avatar-uploader"
                       action="/upload/image"
                       name="imageFile"
                       :show-file-list=false
                       :on-success="firstSuccess"
                       :before-upload="beforeAvatarUpload"
            >
              <img v-if="item.teacherWxQrcodeUrl" :src="item.teacherWxQrcodeUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <el-button size="small" type="primary">{{columnForm.teacherWxQrcodeUrl ? '修改文件' : '选择文件'}}</el-button>
              <div slot="tip" class="el-upload__tip">540*630,支持jpg、png、gif格式,最大5M</div>
            </el-upload>
            <!--<el-form-item label="微信号" style="padding:30px 0" >-->
              <!--<el-col :span="6">-->
                <!--<el-input @input="getWxnumber(index)" :rules="[-->
            <!--{ required: true, message: '请输入分组名称', trigger: 'change' },-->
            <!--{ validator: textLength, trigger: 'change' }-->
          <!--]" :value="item.teacherWxNumber" v-model="wxNumArr[index]">-->

                <!--</el-input>-->
              <!--</el-col>-->
            <!--</el-form-item>-->
          </el-form-item>
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
      // var textLength = (rule, value, callback) => {
      //   if (value) {
      //     console.log(value)
      //     callback()
      //   }else{
      //     callback(new Error('微信号不能为空'));
      //   }
      // }
      return {
        teachterArr:[
          {markCode:"1-500",startNum:1,startEnd:500,teacherWxNumber:'',teacherWxQrcodeUrl:''}
        ],
        wxNumArr:[],
        imgIndex:0,
        startEnd:'',
        startNum:'',
        imgSrc:'',
        editorContent:null,
        loading: false,
        readId:null,
        numId:null,
        imgArr:[],
        wxNum:null,
        //新增编辑专栏form表单
        columnForm: {
          beginDate:'',
          stageNum:'',
          wxQrcodeUrl:null
        },
        rules: {
          stageNum: [
            {required: true, message: '请输入课程期数', trigger: 'blur'},
            {validator: courseNumRule, trigger: 'blur' }
          ],
          beginDate: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'blur' }
          ],
          wxNum: [
            { type: 'date', required: true, message: '请填写微信号', trigger: 'blur' }
          ],
          wxQrcodeUrl:[
            {required: true, message: '请上传至少一张背景图', trigger: 'blur'},
          ]
        }
      }
    },
    computed: {

    },
    created() {
      this.numId = this.$route.query.numId
      if(this.numId!=0){
        this.getDetail(this.numId)
      }
      this.readId = this.$route.query.readId;
    },
    methods: {
      getWxnumber(index){
        this.teachterArr[index].teacherWxNumber = this.wxNumArr[index]
      },
      getDetail(id){
        this.$http.get('/read/stage/detail?id='+id).then(res =>{
          let resp = res.data;
          this.columnForm = resp.data;
          this.columnForm.beginDate = new Date(resp.data.beginDate)
          if(JSON.parse(this.columnForm.wxQrcodeUrl).length>0){
            this.teachterArr = JSON.parse(this.columnForm.wxQrcodeUrl)
          }

        })
      },
      addTeach(){
        for(let i=0;i<this.teachterArr.length;i++){
          this.startNum = this.teachterArr[i].startNum
          this.startEnd = this.teachterArr[i].startEnd
        }
        let teachObj = {
          startNum:this.startEnd+1,
          startEnd:this.startEnd + 500,
          markCode:(this.startEnd+1) +'-'+ (this.startEnd+500),
          teacherWxNumber:"",
          teacherWxQrcodeUrl:""
        }
        this.teachterArr.push(teachObj)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            const params = Object.assign({},this.columnForm);
            params.readId = this.readId;
            params.beginDate = formatDateNew(params.beginDate);
            params.stageNum = this.columnForm.stageNum;
            params.wxQrcodeUrl =JSON.stringify(this.teachterArr)
            if (this.numId!=0) {
              console.log('修改')
              params.id = this.numId;
              this.$http.post('/read/stage/save',params).then(res =>{
                let resp = res.data
                if(resp.success){
                  this.$message.success('修改成功');
                  this.getData();
                  //this.$router.go(-1);
                }else{
                  let msg = resp.desc || '请求失败';
                  this.$message.error(msg)
                }
                this.loading = false;
              }).catch(() =>{
                this.loading = false;
                this.$router.go(-1);
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
                this.$router.go(-1);
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
      getImgIndex(index){
        this.imgIndex = index;

      },
      firstSuccess(res, file) {
        const self = this;
        const image = new Image();
        image.src = 'https:' + res.data.fileUrl;
        image.onload = function () {
          const width = image.width;
          const height = image.height;
          if (width == 540 && height == 630) {
            self.columnForm.wxQrcodeUrl = 'https:' + res.data.fileUrl;
            self.teachterArr[self.imgIndex].teacherWxQrcodeUrl = 'https:' + res.data.fileUrl;
            self.$set(self.teachterArr, self.imgIndex,self.teachterArr[self.imgIndex] );
          } else {
            self.$message.error('上传图片的尺寸必须为 540*630!')
          }
      };

  }
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

