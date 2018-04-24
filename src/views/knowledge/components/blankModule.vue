<template>
  <div class="module-item" @click="changeDeploy">
    <div class="module-content" v-bind:style="{ 
          height: moduleForm.blankHeight / 2 + 'px', 
          lineHeight: moduleForm.blankHeight / 2 + 'px',
          width: 375 - moduleForm.blankWidth + 'px',
          backgroundColor: moduleForm.blankFillColor?moduleForm.blankFillColor:'inherit',
        }">
      空白
    </div>
    <div class="module-deploy" v-show="deployToggle == moduleIndex">
      <h2 class="module-deploy-title">空白</h2>
      <el-form ref="moduleForm" :rules="rulesForm" :model="moduleForm" label-width="80px">
        <el-form-item label="空白高度" prop="blankHeight">
          <el-input v-model.number="moduleForm.blankHeight" size="small" class="w200"></el-input> px
        </el-form-item>
        <el-form-item label="内边距" prop="blankWidth">
          <el-input v-model.number="moduleForm.blankWidth" size="small" class="w200"></el-input> px
        </el-form-item>
        <el-form-item label="背景颜色">
          <el-color-picker v-model="moduleForm.blankFillColor"></el-color-picker>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        rulesForm: {
          
          blankHeight: [
            { required: true, message: '请输入空白高度', trigger: 'change' },
            { type: 'number',  message: '只能输入数字', trigger: 'change' }
          ],
          blankWidth: [
            { required: true, message: '请输入空白高度', trigger: 'change' },
            { type: 'number',  message: '只能输入数字', trigger: 'change' }
          ],
        },
      }
    },
    props: ['deployToggle', 'moduleForm', 'moduleIndex'],
    methods: {
      examineForm(){
        let isValid;
        this.$refs['moduleForm'].validate((valid) => {
          isValid = valid
        });
        return isValid
      },
      changeDeploy() {
        this.$emit('changeDeploy', this.moduleIndex)
      }
    },

  }
</script>
<style lang="less" scoped>
  @import "../../../styles/components/knowledge.less";
  .module-content {
    margin: 0 auto;
    text-align: center;
  }
</style>