<template>
      <div class="">
        <div class="module-content" @click="changeDeploy">
          <el-carousel trigger="click" height="150px">
            <el-carousel-item v-for="item in 4" :key="item">
              <h3>{{ item }}</h3>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="module-deploy" v-show="deployToggle == moduleIndex">
          <h2 class="module-deploy-title">轮播</h2>
          <el-form ref="moduleForm" :model="moduleForm" label-width="80px">
            <el-form-item label="轮播类型">
              <el-radio-group v-model="moduleForm.slideType">
                <el-radio :label="0">左右轮播</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="填充方式">
              <el-radio-group v-model="moduleForm.fillType">
                <el-radio :label="0">固定宽度x自适应高度</el-radio>
                <el-radio :label="1">自适应宽度x固定高度</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="图片链接">
              <div class="shop">
                <div class="shop-list" v-for="item in moduleForm.img">
                  <el-form :model="item" label-width="80px">
                    <el-form-item label="商品">
                      <img :src="item.src" alt="" width="50">
                    </el-form-item>
                    <el-form-item label="跳转链接">
                      <el-input v-model="item.shopSource" size="small" disabled>
                        <el-button slot="append" icon="el-icon-edit"></el-button>
                      </el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="图片上传">
              <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :file-list="form.img" list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
</template>

<script>

  export default {
    data() {
      return {
        form: {
          slideType: 0,
          fillType: 0,
          img: [
            {
              src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523284997796&di=b00cf74ce3d224c142ba409c4770e390&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F13%2F90%2F37%2F77j58PIC7WZ_1024.png',
              shopSource: '小程序-跳转首页',
            }
          ],
        },
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
      padding: 15px;
    }
</style>