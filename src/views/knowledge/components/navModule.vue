<template>
  <div class="">
    <div class="module-content" @click="changeDeploy">
      <h2 class="module-title">{{moduleForm.titleName}}<a href="javascript:void(0);" v-show="moduleForm.linkUrl" class="module-title-all">{{moduleForm.subTitle}}</a></h2>
    </div>
    <div class="module-deploy" v-show="deployToggle == moduleIndex">
      <h2 class="module-deploy-title">标题</h2>
      <el-form ref="moduleForm" :model="moduleForm" label-width="80px">
        <el-form-item label="标题栏">
          <el-input v-model="moduleForm.titleName"></el-input>
        </el-form-item>
        <el-form-item label="展示类型">
          <el-checkbox name="type" v-model="moduleForm.showTitle" :label="1">{{moduleForm.subTitle}}</el-checkbox>
        </el-form-item>
        <el-form-item label="跳转链接" v-show="moduleForm.showTitle">
          <el-input v-model="moduleForm.linkUrl"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {}
    },
    props:['deployToggle','moduleForm','moduleIndex'],
    methods: {
      changeDeploy(){
        this.$emit('changeDeploy',this.moduleIndex)
      }
    },

  }
</script>
<style lang="less" scoped>
  @import "../../../styles/components/knowledge.less";
  .module-content{
    padding: 0 15px;
  }
  .module-title{
    padding: 15px 0;
    line-height: 28px;
    height: 28px;
    font-size: 20px;
    font-weight: bold;
    color: #222;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
    .module-title-all{
      position: absolute;
      right: 15px;
      top: 16px;
      font-size: 13px;
      line-height: 26px;
      color: #555;
      border: 1px solid #555;
      padding: 0 10px;
      border-radius: 20px;
    }
  }
</style>