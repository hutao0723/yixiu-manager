<template>
      <div class="">
        <div class="module-content" @click="changeDeploy">
          <div class="module-content-box"></div>
        </div>
        <div class="module-deploy" v-show="deployToggle == moduleIndex">
          <h2 class="module-deploy-title">标题</h2>
          <el-form ref="moduleForm" :model="moduleForm" label-width="80px">
            <el-form-item label="页面标题">
              <el-input v-model="moduleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="页面描述">
              <el-input v-model="moduleForm.describe"></el-input>
            </el-form-item>
            <el-form-item label="页面图片">
              <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :file-list="moduleForm.img" list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="背景颜色">
              <el-radio-group v-model="moduleForm.bgcolorType">
                <el-radio :label="0">默认</el-radio>
                <el-radio :label="1">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="背景颜色" v-show="moduleForm.bgcolorType == 1">
              <el-color-picker v-model="moduleForm.bgcolor"></el-color-picker>
            </el-form-item>
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
    props:['deployToggle','moduleForm','moduleIndex'],
    
    methods: {
      changeDeploy(){
        this.$emit('changeDeploy',this.moduleIndex)
        console.log(this.moduleIndex)
      }
    },
    
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/components/knowledge.less";
</style>