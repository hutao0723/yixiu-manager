<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/miniApp' }">小程序</el-breadcrumb-item>
        <el-breadcrumb-item>内容</el-breadcrumb-item>
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
            <el-form-item label="一级类型" prop="firstTypeId">
              <el-select v-model="typeOneId" placeholder="一级类型" style="width: 60%;" value-key="id" >
                <el-option v-for="(item, index)  in aTypeList" :key="item.id" :label="item.name" :value="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="二级类型" prop="typeId">
              <el-select v-model="typeTwoId" placeholder="二级类型" style="width: 60%;">
                <el-option v-for="(item, index) in bTypeList" :key="item.id" :label="item.name" :value="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <router-link :to="{ path: '/manager/miniApp'}">
                  <el-button type="pain">取消</el-button>
              </router-link>
              <el-button type="primary" @click="saveContentType">保存</el-button>
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
          firstTypeId: '',
          typeId: '',
          parentName: '',
          name: ''
        },
        typeOneId: '',
        typeTwoId: '',
        aTypeList: [],
        bTypeList: []
      }
    },
    created () {
      this.getfirstClassType()
      this.getContentDetail()
    },
    watch: {
      'typeOneId': function (newVal) {
        if (this.aTypeList[newVal] !== undefined) {
          console.log(this.aTypeList[newVal])
          this.typeForm.firstTypeId = this.aTypeList[newVal].id
          this.getSecondTypeList(this.aTypeList[newVal].id)
        }
      },
      'typeTwoId': function (newVal) {
        if (this.bTypeList[newVal] !== undefined) {
          this.typeForm.typeId = this.bTypeList[newVal].id
        }
      }
    },
    methods: {
      // 获取一级类型
      getfirstClassType () {
        this.$http.get('/content/type/getList', {}).then(res => {
          let resp = res.data
          if (resp.success) {
            this.aTypeList = resp.data
          } else {
            let msg = resp.desc || '请求失败' 
            this.$message.error(msg)
          }
        })
      },
      // 根据一级类型获取二级列表数据
      getSecondTypeList (parentId) {
        let that = this
        this.$http.get('/content/type/getList', {params:{parentId}}).then(res => {
          let resp = res.data
          if (resp.success) {
            this.bTypeList = resp.data
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      // 编辑保存图文
      saveContentType () {
        this.$refs['typeForm'].validate((valid) => {
          if (valid) {
            const {
              firstTypeId,
              typeId
            } = this.typeForm
            let params = {
              authorizerId: this.$route.params.id,
              firstTypeId,
              typeId
            }
            this.$http.post('/wxAuthorizerExt/addOrUpdate', qs.stringify(params)).then(res => {
              let data = res.data
              if (data.success) {
                this.$message.success('保存成功')
                this.$router.push('/manager/miniApp')
              } else {
                let msg = data.desc || '保存失败'
                this.$message.error(msg)
                this.$router.push('/manager/miniApp')
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
          authorizerId: id
        }
        this.$http.get('/wxAuthorizerExt/getByAuthorizerId', {params: params}).then(res => {
          let resp = res.data
          if (resp.success) {
            this.typeForm = resp.data
            this.typeForm.firstTypeId = this.typeForm.parentId
            this.typeForm.typeId = this.typeForm.typeId
            this.getSecondTypeList(this.typeForm.firstTypeId)
            this.typeOneId = this.typeForm.parentName
            this.typeTwoId = this.typeForm.name
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
