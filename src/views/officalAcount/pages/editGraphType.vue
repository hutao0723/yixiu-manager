<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/officalAcount/graphType' }">图文类型</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
        </template>
      </div>
      <div class="tabel-wrap">
        <el-form ref="graphForm" :model="graphForm" label-width="80px":rules="rules" >
            <el-form-item label="日期">
                <el-date-picker type="date" placeholder="选择日期" v-model="graphForm.date" style="width: 60%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="图文标题"  prop="text">
              <el-input v-model="graphForm.text" style="width: 60%;"></el-input>
            </el-form-item>
            <el-form-item label="类型1" prop="type1">
              <el-input v-model="graphForm.type1" style="width: 60%;"></el-input>
            </el-form-item>
            <el-form-item label="类型2" prop="type2">
              <el-input v-model="graphForm.type2" style="width: 60%;"></el-input>
            </el-form-item>
            <el-form-item label="类型3" prop="type3">
              <el-input v-model="graphForm.type3" style="width: 60%;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="editGraph">保存</el-button>
              <el-button>取消</el-button>
            </el-form-item>
        </el-form>
   
      </div>
    </div>     
  </section>
</template>

<script>
import { formatDateNew } from '../../../utils/dateUtils'
import ofarules from '../components/ofaCreateValidRules'
export default {
  data () {
    return {
      rules: ofarules,
      graphForm: {
          id: '',
          date: '',
          text: '',
          type1: '',
          type2: '',
          type3: ''
      }
    }
  },
  created () {
    this.getTempMsgList()
  },
  methods: {
    editGraph () {
      this.$refs['graphForm'].validate((valid) => {
        if (valid) {
          this.graphForm.id = this.$route.params.id
          this.$http.post('/officalAcount/edit/graph',this.graphForm).then(res => {
            let data = res.data
            if (data.success) {
              this.$message.success('保存成功')
              this.$router.push('/manager/officalAcount/graphType')
            } else {
              let msg = data.desc || '保存失败'
              this.$message.error(msg)
              this.$router.push('/manager/officalAcount')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getTempMsgList () {
      let appId = this.$route.params.id
      let params = {
        appId: appId
      }
      this.$http.get('/officalAcount/getGraph', {params: params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.graphForm = resp.data
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
      a{
        text-decoration: none;
      }
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
  .search-bar {
    margin-top: 20px;
  }
  .page-control {
    float: right;
    margin-top: 20px;
    &:after {
      clear: both;
    }
  }
}
</style>
