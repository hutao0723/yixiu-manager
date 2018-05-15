<template>
  <section class="order-container">
    <div class="content">
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
          <el-table :data="orderList" >
            <el-table-column  label="选择">
              <template slot-scope="scope">
                  <el-checkbox @change="handleCheckedChange($event, scope.row)"  :checked="arrColumnStatus[scope.row.id]" v-model="scope.row.checked"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column property="id" label="观点ID"></el-table-column>  
            <el-table-column property="id" label="用户ID"></el-table-column>
            <el-table-column property="id" label="课程"></el-table-column>
            <el-table-column property="id" label="阅读计划"></el-table-column>
            <el-table-column property="id" label="观点"></el-table-column> 
            <el-table-column property="id" label="观点状态"></el-table-column>  
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
      <div class="page-control">
        <el-pagination background  :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="total, prev, pager, next" :total="totalSize"></el-pagination>
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
        orderStatus: '',
        orderType: ''
      },
      arrClassStatus: [],
      startTime: '',
      endTime: '',
      teacher: '',
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
      pageOption: {
        pageNum: 1,
        pageSize: 20
      },
      currentPage: 1,
      totalSize: 0,
      orderList: [],

      dialogVisible: false, // 弹框
      downStatus: true, // 文字
      disabled: true, // 按钮状态
      downloadUrl: 'http://www.baidu.com',//链接
      filename: ''
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    // 获取讲师列表
    getOrdersList () {
      this.$http.get('/knowledge/order/page', {}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.orderList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    handleCheckedChange(event,row){
      this.arrClassStatus[row.id] = event
    },
    onSearch () {
      let valueArr = Object.values(this.optionForm)
      this.startTime = this.optionForm.time ? formatDateNew(this.optionForm.time[0]): ''
      this.endTime = this.optionForm.time ? formatDateNew(this.optionForm.time[1]): ''
      let params = {
        pageNum: 1,
        pageSize: 20,
        [valueArr[0]]: valueArr[1],
        [valueArr[2]]: valueArr[3],
        [valueArr[4]]: valueArr[5],
        startTime: this.startTime,
        endTime: this.endTime,
        orderStatus: this.optionForm.orderStatus,
        orderType: this.optionForm.orderType
      }
      this.$http.get('/knowledge/order/page', {params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.orderList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
          this.pageOption.pageNum = 1
          this.currentPage = 1
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        } 
      }, () => {
        this.$message.error('网络错误')
      })
    },
    // 导出
    exportOrders () {
      this.dialogVisible = true
      this.disabled = true
      this.downStatus = true
      let valueArr = Object.values(this.optionForm)
      console.log(valueArr)
      this.startTime = this.optionForm.time ? formatDateNew(this.optionForm.time[0]): ''
      this.endTime = this.optionForm.time ? formatDateNew(this.optionForm.time[1]): ''
      let params = {
        [valueArr[0]]: valueArr[1],
        [valueArr[2]]: valueArr[3],
        [valueArr[4]]: valueArr[5],
        startTime: this.startTime,
        endTime: this.endTime,
        orderStatus: this.optionForm.orderStatus,
        orderType: this.optionForm.orderType
      }
      this.$http.get('/knowledge/order/export', {params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.filename = resp.data
          let that = this
          let orders = setInterval(function(){
            let params = {
              filename: that.filename
            }
            that.$http.get('/knowledge/order/checkExport', {params}).then(res => {
              let resp = res.data
              if (resp.success) {
                if(resp.data.succeed){
                  clearInterval(orders)
                  that.disabled = false
                  that.downStatus = false
                  that.downloadUrl = resp.data.fileUrl
                }else{
                  // let msg = resp.data.message || '文件正在上传中'
                  // that.$message.error(msg)
                  console.log(resp.data.message)
                }
              } else {
                let msg = resp.desc || '请求失败'
                that.$message.error(msg)
              } 
            }, () => {
              that.$message.error('网络错误')
            })
          }, 500)
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        } 
      }, () => {
        this.$message.error('网络错误')
      })
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
        [valueArr[2]]: valueArr[3],
        [valueArr[4]]: valueArr[5],
        startTime: this.startTime,
        endTime: this.endTime,
        orderStatus: this.optionForm.orderStatus,
        orderType: this.optionForm.orderType
      }
      this.$http.get('/knowledge/order/page', {params: params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.orderList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
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
  .page-control {
    float: right;
    margin-top: 20px;
    &:after {
      clear: both;
    }
  }
  .goods-mask{
    right: 0;
    bottom: 0;
    width: 30px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background-color: #000;
    opacity: 0.6;
    color: #FFF;
    position:absolute;
  }
  .goods-word{
    margin-left: 10px;
    line-height: 75px;
  }
  .btn-disabled {
    color: #fff;
    background-color: #bdc5ce;
    border-color: #bdc5ce;
  }
  .beat-ellipsis:after {
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    animation: ellipsis 2s infinite;
    content: "\2026"; 
  }
  .twoLines{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    float: left;
    margin-left: 10px;
  }
  .ln75{
    line-height:75px;
  }
  .ln37{
    line-height:37px;
  }
  .w150{
    width:150px;
  }
  .img-box{
    overflow: hidden;
    width: 75px;
    height: 75px;
    display: inline-block;
    float: left;
    background-repeat: no-repeat;
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
