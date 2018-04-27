<template>
  <div class="">
    <div class="module-content" @click="changeDeploy">
      <div class="module-content-box">
        <p>{{moduleForm.pageTitle}}</p>
      </div>
    </div>
    <div class="module-deploy" v-show="deployToggle == moduleIndex">
      <h2 class="module-deploy-title">标题</h2>
      <el-form ref="moduleForm" :model="moduleForm" label-width="80px">
        <el-form-item label="页面标题" prop="pageTitle" :rules="[
            { required: true, message: '请输入页面标题', trigger: 'change' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'change' }
          ]">
          <el-input v-model="moduleForm.pageTitle"></el-input>
        </el-form-item>
        <el-form-item label="页面描述" prop="shareDescribe" :rules="{ min: 1, max: 35, message: '长度在 1 到 35 个字符', trigger: 'change' }">
          <el-input v-model="moduleForm.shareDescribe"></el-input>
        </el-form-item>
        <el-form-item label="页面图片" prop="sharePictureUrl">
          <img :src="moduleForm.sharePictureUrl" alt="" v-show="moduleForm.sharePictureUrl" class="module-deploy-img">
          <el-upload class="upload-demo" action="/upload/image" :on-success="submitImage" name="imageFile" :before-upload="beforeImage"
            :show-file-list="false">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpeg/jpg/png文件，且不超过2m。</div>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="背景颜色" prop="backgroundColor">
          <el-color-picker v-model="moduleForm.backgroundColor"></el-color-picker>
        </el-form-item> -->
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
      }
    },
    props: ['deployToggle', 'moduleForm', 'moduleIndex'],

    methods: {
      beforeImage(file) {
        console.log(file)
        const isJPG = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 < 2048;
        if (!isJPG) {
          this.$message.error('上传图片只能是 jpeg/jpg/png 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2M!');
        }
        return isJPG && isLt2M;
      },
      // 上传图片
      submitImage(res, file, fileList) {
        console.log(res.data.fileUrl)
        if (res.success) {
          this.moduleForm.sharePictureUrl = res.data.fileUrl;
        }
      },
      changeDeploy() {
        this.$emit('changeDeploy', this.moduleIndex)
        console.log(this.moduleIndex)
      },
      examineForm(){
        let isValid;
        this.$refs['moduleForm'].validate((valid) => {
          isValid = valid
        });
        return isValid
      },

      

    },

  }
</script>
<style lang="less" scoped>
  @import "../../../styles/components/knowledge.less";
  .module-deploy-img {
    height: 50px;
    width: 50px;
    display: inline-block;
    vertical-align: middle;
  }
</style>