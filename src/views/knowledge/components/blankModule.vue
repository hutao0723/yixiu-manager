<template>
      <div class="module-item" @click="changeDeploy">
        <div class="module-content" v-bind:style="{ height: moduleForm.height + 'px', lineHeight: moduleForm.height + 'px' }">
          空白
        </div>
        <div class="module-deploy" v-show="deployToggle == moduleIndex">
          <h2 class="module-deploy-title">空白</h2>
          <el-form ref="moduleForm" :model="moduleForm" label-width="80px">
            <el-form-item label="空白距离">
              <el-slider v-model="moduleForm.height"></el-slider>
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
      }
    },
    
  }
</script>
<style lang="less" scoped>
    @import "../../../styles/components/knowledge.less";
    .module-content{
    height: 200px;
    line-height: 200px;
    text-align: center;
  }
</style>