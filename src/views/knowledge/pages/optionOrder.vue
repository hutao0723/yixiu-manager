<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap"></div>
    <div class="content">
      <div class="tabel-wrap">
        <template>
          <el-table :data="optionList" style="width: 100%"  :default-expand-all="true">
            <el-table-column type="expand" >
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item>
                    <span>观点:{{ props.row.content }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="序号" >
              <template slot-scope="scope">{{scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column prop="sorted" label="权重值" ></el-table-column>
            <el-table-column label="观点ID">
              <template slot-scope="scope">{{scope.row.id}}<br/>{{scope.row.releaseTime}}</template>
            </el-table-column>
            <el-table-column prop="userId" label="用户ID" ></el-table-column>
            <el-table-column label="课程" >
              <template slot-scope="scope">{{scope.row.courseTitle}}<br/>{{scope.row.courseId}}</template>
            </el-table-column>
            <el-table-column label="阅读计划" >
              <template slot-scope="scope">{{scope.row.relationName}}<br/>{{scope.row.relationId}}</template>
            </el-table-column>
            <el-table-column  label="观点状态">
              <template slot-scope="scope">
                <span v-if="scope.row.commentState === 1">待审核</span>
                <span v-if="scope.row.commentState === 2">已通过</span>
                <span v-if="scope.row.commentState === 3">已隐藏</span>
              </template>
            </el-table-column>
            <el-table-column  label="操作" >
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="openDialogWeight(scope.row)">权重</el-button>        
              </template>
            </el-table-column>
          </el-table>
        </template>        
      </div>   
    </div>
    <!--编辑权重值-->
    <div class="add-type-diolog">
      <el-dialog title="权重值配置" :visible.sync="dialogWeightVisible">
        <el-form :model="weightForm" ref="weightForm" :rules="rules">
          <el-form-item label="权重值" :label-width="formLabelWidth"  prop="sorted">
            <el-input v-model="weightForm.sorted" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" @click="dialogWeightVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="saveWeight">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import qs from 'qs'
import { formatToMs } from '../components/knowledgeValidRules'
export default {
  data () {
    const rateRule = (rule, value, callback) => {
      const res = /^[+]{0,1}(\d+)$/;
      if (!res.test(value)) {
        callback(new Error('请输入正整数'));
      } else {
        if (value > 9999 || value < 0) {
          callback(new Error('请输入0-9999的正整数'));
        } else {
          callback()
        }
      }
    };
    return {
      rules: {
        sorted: [
          { required: true, message: '请输入权重值', trigger: 'blur' },
          { validator: rateRule, trigger: 'blur' },
        ]
      },
      formLabelWidth: '100px',
      weightForm: {
        id: '',
        sorted: '',
      },
      dialogWeightVisible: false,
      pageOption: {
        pageNum: 1,
        pageSize: 20
      },
      totalSize: 0,
      optionList: [],
      currentPage: 1
    }
  },
  created () {
    this.getWeightList()
  },
  methods: {
    // 打开添加类型弹框
    openDialogWeight (row) {
      this.dialogWeightVisible = true
      this.weightForm.id = row.id
      this.weightForm.sorted = row.sorted
    },
    // 获取类型列表
    getWeightList () {
      this.$http.get('/comment/topList', {}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.optionList = resp.data
          this.optionList.forEach((item,index)=>{
            this.optionList[index].releaseTime = formatToMs(item.releaseTime)
          })
          // 算出有多少条数据
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    // 保存
    saveWeight () {
      this.$refs['weightForm'].validate((valid) => {
        if (valid) {
          let params = {
            sorted: this.weightForm.sorted,
            id: this.weightForm.id
          }
          this.$http.post('/comment/changeSorted', qs.stringify(params)).then(res => {
            if (res.data.data) {
              this.dialogWeightVisible = false
              this.$message.success('保存成功')
              this.getWeightList()
            } else {
              let msg =res.data.desc || "保存失败"
              this.$message.error(msg)
              this.dialogWeightVisible = false
             
            }
          })
        } else {
          console.log('error submit!!')
          return false
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
    // border-bottom: 1px dotted #ccc;
    position: relative;
    .el-breadcrumb {
      position: absolute;
      left: 0;
      bottom: 10px;
      font-size: 16px;
    }

    .add-type {
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
    .link-theme{
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 10px;
      font-size: 12px;
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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-left: 10px;
    margin-bottom: 0;
    width: 100%;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width:150px;
  }

  .link-blue{
    color: #409eff;
    &:visited{
      color: #409eff;
    }
  }
}
</style>
