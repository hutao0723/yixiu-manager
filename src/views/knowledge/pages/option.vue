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
              <el-select v-model="optionForm.orderStatus" placeholder="全部" class="w150">
                <el-option label="全部" value=""></el-option>
                <el-option label="待审核" value="TO_PAY"></el-option>
                <el-option label="已通过" value="SUCCESS"></el-option>
                <el-option label="已隐藏" value="FAILED"></el-option>
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
          <el-table :data="orderList"  ref="multipleTable"  tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column property="optionId" label="观点ID"></el-table-column>  
            <el-table-column property="userId" label="用户ID"></el-table-column>
            <el-table-column property="course" label="课程"></el-table-column>
            <el-table-column property="readPlan" label="阅读计划"></el-table-column>
            <el-table-column property="option" label="观点"></el-table-column> 
            <el-table-column property="optionStatus" label="观点状态"></el-table-column>  
            <el-table-column  label="操作" >
              <template slot-scope="scope">
                <el-button type="text" size="mini" >通过</el-button> 
                <el-button type="text" size="mini" >隐藏</el-button>  
                <el-button type="text" size="mini" >权重</el-button>   
              </template>
            </el-table-column>      
          </el-table>
        </template>        
      </div>
      <div class="clearfix">
        <div class="btn-left">
          <el-button @click="chooseAll(orderList)">全选</el-button>
          <el-button @click="hideAll()">批量隐藏</el-button>
          <el-button @click="cancelHideAll()">批量取消隐藏</el-button>
          <el-button @click="passAll()">批量通过</el-button>
        </div>
        <div class="page-control">
          <el-pagination background  :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="total, prev, pager, next" :total="totalSize"></el-pagination>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import knowlwdgerules from '../components/knowledgeValidRules'
import { formatDateNew } from '../components/knowledgeValidRules'
import qs from 'qs'
export default {
  data () {
    return {
      rules: knowlwdgerules,
      formLabelWidth: '100px',
      optionForm: {
        name: 'viewpoint',
        inputOne: '',
        userId: '',
        course: 'courseTitle',
        inputTwo: '',
        read: 'readTitle',
        inputThree: '',
        time: [],
        orderStatus: ''
      },
      arrColumnStatus: [],
      startTime: '',
      endTime: '',
      viewOptions: [
        {
          value: 'viewpoint',
          label: '观点'
        },
        {
          value: 'viewpointId',
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
          value: 'readTitle',
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
      ids: []
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
    passAll() {
      if(this.ids.length > 0){
        console.log(this.ids)
      }else{
        this.$message.error("请选择批量处理的数据")
      }
      
    },
    hideAll() {
      if(this.ids.length > 0){
        console.log(this.ids)
      }else{
        this.$message.error("请选择批量处理的数据")
      }
    },
    cancelHideAll() {
      if(this.ids.length > 0){
        console.log(this.ids)
      }else{
        this.$message.error("请选择批量处理的数据")
      }
    },

    // handleRowClick(row) {
    //   this.$refs.multipleTable.toggleRowSelection(row)
    //   console.log(this.$refs.multipleTable)
    // },
    chooseAll(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, !this.allSelect)
        })
        this.allSelect = !this.allSelect
      }
    },
    // 获取观点列表
    getOrdersList () {
      let valueArr = Object.values(this.optionForm)
      this.startTime = this.optionForm.time ? formatDateNew(this.optionForm.time[0]): ''
      this.endTime = this.optionForm.time ? formatDateNew(this.optionForm.time[1]): ''
      let params = {
        pageNum: 1,
        pageSize: 20,
        [valueArr[0]]: valueArr[1],
        userId: valueArr[2],
        [valueArr[3]]: valueArr[4],
        [valueArr[5]]: valueArr[6],
        startTime: this.startTime,
        endTime: this.endTime,
        orderStatus: this.optionForm.orderStatus
      }
      this.$http.get('/option/list', {params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.orderList = resp.data.lists
          // 算出有多少条数据
          this.totalSize = resp.data.totalSize
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      }, () => {
        this.$message.error('网络错误')
      })
    },
    onSearch () {
      this.getOrdersList();
    },
    // 分页请求
    pageChange (currentPage) {
      let valueArr = Object.values(this.optionForm)
      this.currentPage = currentPage
      this.startTime = this.optionForm.time ? formatDateNew(this.optionForm.time[0]): ''
      this.endTime = this.optionForm.time ? formatDateNew(this.optionForm.time[1]): ''
      let params = {
        pageNum: this.currentPage,
        pageSize:20,
        [valueArr[0]]: valueArr[1],
        userId: valueArr[2],
        [valueArr[3]]: valueArr[4],
        [valueArr[5]]: valueArr[6],
        startTime: this.startTime,
        endTime: this.endTime,
        orderStatus: this.optionForm.orderStatus
      }
      this.$http.get('/option/list', {params: params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.orderList = resp.data.lists
          // 算出有多少条数据
          this.totalSize = resp.data.totalSize
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
  .search-bar {
    margin-top: 20px;
  }
  .btn-left{
    float: left;
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
