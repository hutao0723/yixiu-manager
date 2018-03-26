<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/miniApp/contentManage' }">内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑内容</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
        </template>
      </div>
      <div class="tabel-wrap">
        <!-- :rules="rules" -->
        <el-form ref="typeForm" :model="typeForm" label-width="80px" :rules="rules">
            <el-form-item label="二级类型" prop="secondTypeName">
              <el-select v-model="typeTwo" placeholder="二级类型" >
                <el-option v-for="(item,index) in secondTypeList" :key="item.id" :label="item.name" :value="index"></el-option>
              </el-select>
            </el-form-item>
            <div v-if="typeTwo == '测试机'">
              <el-form-item label="描述词" prop="keyWord">
                <el-input v-model="typeForm.keyWord" style="width: 60%;"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="描述内容"  prop="description">
              <el-input v-model="typeForm.description" style="width: 60%;" type="textarea" :rows="8"></el-input>
            </el-form-item>
            <el-form-item>
              <router-link :to="{ path: '/manager/miniApp/contentManage'}">
                  <el-button type="pain">取消</el-button>
              </router-link>
              <el-button type="primary" @click="saveContent">保存</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div> 
  </section> 

</template>
<script>
  import { formatDateNew } from '../../../utils/dateUtils'
  import minirules from '../components/miniValidRules'
  import qs from 'qs'
  export default {
    data () {
      return {
        rules: minirules,
        typeForm: {
          id: '',
          secondTypeName: '',
          firstTypeId: '',
          secondTypeId: '',
          description: '',
          keyWord: ''
        },
        typeTwo: '',
        secondTypeList: []
      }
    },
    created () {
      this.getContentDetail()
      this.getTwoTypeList()
    },
    watch: {
      'typeTwo': function (newVal) {
        if (this.secondTypeList[newVal] !== undefined) {
        // 选择下拉数据
          this.typeForm.secondTypeId = this.secondTypeList[newVal].id
          this.typeForm.secondTypeName = this.secondTypeList[newVal].name
          this.typeTwo = this.secondTypeList[newVal].name
        }
      }
    },
    methods: {
      // 编辑保存图文
      saveContent () {
        this.$refs['typeForm'].validate((valid) => {
          if (valid) {
            this.typeForm.id = this.$route.params.id
            this.typeForm.firstTypeId = this.$route.params.parentId
            if(this.typeForm.secondTypeName === "印象词"){
              this.typeForm.keyWord = ''
            }
            this.$http.post('/content/detail/update', qs.stringify(this.typeForm)).then(res => {
              let data = res.data
              if (data.success) {
                this.$message.success('保存成功')
                this.$router.push('/manager/miniApp/contentManage')
              } else {
                let msg = data.desc || '保存失败'
                this.$message.error(msg)
                this.$router.push('/manager/miniApp/contentManage')
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 获得单个内容详情
      getContentDetail () {
        let id = this.$route.params.id
        let params = {
          id: id
        }
        this.$http.get('/content/detail/get', {params: params}).then(res => {
          let resp = res.data
          if (resp.success) {
            this.typeForm = resp.data
            this.typeTwo = this.typeForm.secondTypeName
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      // 获取二级列表数据
      getTwoTypeList () {
        let parentId = this.$route.params.parentId
        this.$http.get('/content/type/List', {params:{parentId}}).then(res => {
          let resp = res.data
          if (resp.success) {
            this.secondTypeList = resp.data
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .search-bar {
    margin-top: 20px;
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
      a{
        text-decoration: none;
        color: #909399;
        margin-right:20px;
      }
      .connect-ad {
        cursor: pointer;
        color: #909399;
        font-weight: 400;
        &:hover {
          color: #333
        }
      }
    }
  }
</style>
