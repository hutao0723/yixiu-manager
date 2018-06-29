<template>
  <section class="order-container">
    <div class="lists">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="optionForm" class="form" size="small">
            <el-form-item>
              <el-select v-model="optionForm.name" placeholder="观点" class="w150 iptl">
                <el-option v-for="(item,index) in viewOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="optionForm.inputOne" placeholder="请输入" class="iptr"></el-input>              
            </el-form-item>
            <el-form-item>
              <el-select v-model="optionForm.course" placeholder="课程标题" class="w150 iptl">
                <el-option v-for="(item,index) in courseOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="optionForm.inputTwo" placeholder="请输入" class="iptr"></el-input>              
            </el-form-item>
            <el-form-item label="用户ID">
             <el-input v-model="optionForm.userId" placeholder="请输入" class="iptr"></el-input>              
            </el-form-item>
           
            <el-form-item label="观点状态">
              <el-select v-model="optionForm.commentState" placeholder="全部" class="w150">
                <el-option label="全部" value=""></el-option>
                <el-option label="待审核" value="1"></el-option>
                <el-option label="已通过" value="2"></el-option>
                <el-option label="已隐藏" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="optionForm.read" placeholder="阅读计划标题" class="w150 iptl">
                <el-option v-for="(item,index) in readOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="optionForm.inputThree" placeholder="请输入" class="iptr"></el-input>              
            </el-form-item>
            <el-form-item>
              <el-date-picker  v-model="optionForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
              <router-link :to="{ path: '/manager/knowledge/optionOrder'}">
                <el-button type="primary" size="small">报名观点排序</el-button>
              </router-link>
            </el-form-item>
          </el-form>
        </template>
      </div>
      <div class="tabel-wrap">
        <template>
          <el-table :data="orderList"  ref="multipleTable"  tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange"  :default-expand-all="true">
            <el-table-column type="expand" >
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item>
                    <span>观点：{{ props.row.content }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column label="观点ID">
              <template slot-scope="scope">{{scope.row.id}}<br/>{{scope.row.releaseTime}}</template>
            </el-table-column>  
            <el-table-column property="userId" label="用户ID"></el-table-column>
            <el-table-column label="课程">
              <template slot-scope="scope">{{scope.row.courseTitle}}<br/>{{scope.row.courseId}}</template>
            </el-table-column>
            <el-table-column label="阅读计划">
              <template slot-scope="scope">{{scope.row.readName}}<br/>{{scope.row.readId}}</template>
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
                <el-button v-if="scope.row.commentState === 1" type="text" size="mini" @click="hideOne(scope.row,2)">通过</el-button> 
                <el-button v-if="scope.row.commentState === 1 || scope.row.commentState === 2" type="text" size="mini" @click="hideOne(scope.row,3)">隐藏</el-button>  
                <el-button v-if="scope.row.commentState === 3" type="text" size="mini" @click="hideOne(scope.row,2)">取消隐藏</el-button>

                <el-button type="text" size="mini" @click="openDialogWeight(scope.row)">权重</el-button>   
              </template>
            </el-table-column>     
          </el-table>
        </template>        
      </div>
      <div class="clearfix">
        <div class="page-control">
          <el-pagination background  :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="total, prev, pager, next" :total="totalSize"></el-pagination>
        </div>
      </div>
      <div class="btn-left">
        <el-button type="primary" @click="chooseAll(orderList)">全选</el-button>
        <el-button type="primary" @click="passAll(3)">批量隐藏</el-button>
        <el-button type="primary" @click="passAll(2)">批量取消隐藏</el-button>
        <el-button type="primary" @click="passAll(2)">批量通过</el-button>
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
import { formatDateNew } from '../components/knowledgeValidRules'
import { formatToMs } from '../components/knowledgeValidRules'

import qs from 'qs'
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
      optionForm: {
        name: 'content',
        inputOne: '',
        userId: '',
        course: 'courseTitle',
        inputTwo: '',
        read: 'readName',
        inputThree: '',
        time: [],
        commentState: ''
      },
      startTime: '',
      endTime: '',
      viewOptions: [
        {
          value: 'content',
          label: '观点'
        },
        {
          value: 'id',
          label: '观点ID'
        }
      ],
      courseOptions: [
        {
          value: 'courseTitle',
          label: '课程标题'
        },
        {
          value: 'courseId',
          label: '课程ID'
        }
      ],
      readOptions: [
        {
          value: 'readName',
          label: '阅读计划标题'
        },
        {
          value: 'readId',
          label: '阅读计划Id'
        }
      ],

      allSelect: false,

      pageOption: {
        pageNum: 1,
        pageSize: 20
      },

      currentPage: 1,
      totalSize: 0,

      orderList: [],
      ids: [],

      dialogWeightVisible: false,
      weightForm: {
        id: '',
        sorted: '',
      },
      releaseTime: '' //时间
      // 1.待审核 2.已通过 3.已隐藏
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    //多选
    handleSelectionChange(val) {
      // console.log(val)
      this.ids = []
      for(let i = 0;i < val.length;i++){
        this.ids.push(val[i].id)
      }
      // console.log(val)
    },
    // 批量通过
    passAll(status) {
      if (this.ids.length > 0) {
        let params = {
          ids : this.ids.join(','),
          status: status
        }
        this.$http.post('/comment/changeStatus', qs.stringify(params)).then(res => {
          let resp = res.data
          if (resp.success) {
            this.$message.success('切换成功');
            this.getOrdersList();
          } else {
            let msg = resp.desc || '切换失败'
            this.$message.error(msg)
          }
          this.ids = []
        })
      } else {
        this.$message.error("请选择关联商品")
        return false
      }
    },

    // 全选
    chooseAll(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, !this.allSelect)
        })
        this.allSelect = !this.allSelect
      }
    },
    // 隐藏
    hideOne(row,status) {
      let params = {
        ids : row.id,
        status: status
      }
      this.$http.post('/comment/changeStatus', qs.stringify(params)).then(res => {
        let resp = res.data
        if (resp.success) {
          this.$message.success('切换成功');
          this.getOrdersList();
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
        this.ids = []
      }).catch(() => {
        this.$message.error("网络错误")
      })
    },
    // 打开权值弹框
    openDialogWeight (row) {
      this.dialogWeightVisible = true
      this.weightForm.id = row.id
      this.weightForm.sorted = row.sorted
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
              this.getOrdersList()
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
    },
    // 获取观点列表
    getOrdersList () {
      let valueArr = Object.values(this.optionForm)
      this.startTime = this.optionForm.time ? formatDateNew(this.optionForm.time[0]): ''
      this.endTime = this.optionForm.time ? formatDateNew(this.optionForm.time[1]): ''
      let params = {
        pageNum: this.pageOption.pageNum,
        pageSize: 20,
        [valueArr[0]]: valueArr[1],
        userId: valueArr[2],
        [valueArr[3]]: valueArr[4],
        [valueArr[5]]: valueArr[6],
        startTime: this.startTime,
        endTime: this.endTime,
        commentState: this.optionForm.commentState
      }
      this.$http.get('/comment/page', {params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.orderList = resp.data.content
        //   this.orderList.forEach((item,index)=>{
        //     this.orderList[index].releaseTime = formatToMs(item.releaseTime)
        //   })
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      }, () => {
        this.$message.error('网络错误')
      })
    },
    onSearch () {
      this.pageOption.pageNum = 1
      this.getOrdersList()
    },
    // 分页请求
    pageChange (currentPage) {
      this.pageOption.pageNum = currentPage
      this.getOrdersList() 
    }
  }
}
</script>
<style lang="less" scoped>
.order-container {
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
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-left: 60px;
    margin-bottom: 0;
    width: 100%;
    box-sizing: border-box;
  }
  .search-bar {
    margin-top: 20px;
  }
  .btn-left{
    float: left;
    position:fixed;
    bottom: 10px;
    z-index: 100;
    margin-top: 15px;
  }
  .page-control {
    float: right;
    margin-top: 20px;
    &:after {
      clear: both;
    }
  }
  .btn-disabled {
    color: #fff;
    background-color: #bdc5ce;
    border-color: #bdc5ce;
  }
  
  .por{
    position:relative;
  }
  @keyframes ellipsis {
      from {
          width: 2px;
      }
      to {
          width: 15px;
      }
  }       
}
</style>
