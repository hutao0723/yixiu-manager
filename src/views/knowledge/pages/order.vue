<template>
  <section class="lecturer-container">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="searchForm" class="form" size="mini">
            <el-form-item>
              <el-select v-model="searchForm.name" placeholder="商品标题">
                <el-option v-for="(item,index) in selectOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.value" placeholder="请输入"></el-input>              
            </el-form-item>
            <el-form-item label="皮肤名称">
              <el-input v-model="searchForm.searchTwo" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>

      <div class="tabel-wrap">
        <template>
          <el-table :data="orderList" style="width: 100%" >
            <el-table-column prop="id" label="商品ID" ></el-table-column>
            <el-table-column prop="nickName" label="讲师昵称" ></el-table-column>
            <el-table-column  label="操作" >
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="openDialogLecturer(scope.row)">编辑</el-button>        
                <el-button type="text" size="mini" @click="deleteLecturer(scope.row)">删除</el-button>  
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
import { formatDateNew } from '../../../utils/dateUtils'
import knowlwdgerules from '../components/knowledgeValidRules'
import qs from 'qs'
export default {
  data () {
    return {
      rules: knowlwdgerules,
      formLabelWidth: '100px',
      orderForm: {
        id: '',
        nickName: ''
      },
      searchForm: {
        name: 'title',
        searchOne: '',
        searchTwo: ''
      },
      teacher: '',
      selectOptions: [
        {
          value: 'title',
          label: '商品标题'
        },
        {
          value: 'nickName',
          label: '卖家昵称'
        },
        {
          value: 'courseId',
          label: '课程ID'
        },
        {
          value: 'culumnId',
          label: '课程ID'
        }
      ],
      pageOption: {
        pageNum: 1,
        pageSize: 20
      },
      currentPage: 1,
      totalSize: 0,
      orderList: []
    }
  },
  created () {
    this.getLecturerList()
  },
  methods: {
    // 获取讲师列表
    getLecturerList () {
      this.$http.get('/lecturer/pageList', {}).then(res => {
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
    onSearch () {
      let valueArr = Object.values(this.searchForm)
      let params = {
        pageNum: 1,
        pageSize: 20,
        [valueArr[0]]: valueArr[1]
      }
      this.$http.get('/lecturer/pageList', {params: params}).then(res => {
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
    // 分页请求
    pageChange (currentPage) {
      let valueArr = Object.values(this.searchForm)
      this.currentPage = currentPage
      let params = {
        pageNum: this.currentPage,
        pageSize:20,
        [valueArr[0]]: valueArr[1]
      }
      this.$http.get('/lecturer/pageList', {params: params}).then(res => {
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
.lecturer-container {
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
    .link-rate{
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
  
  .input-width{
    display: inline-block;
    width: 80%;
  }
  .upload-demo{
    display: inline-block;
  }
  .in-line{
    display: inline-block;
    margin-right: 10px;
    color: #aaa;
    margin-top: 8px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width:150px;
  }
  .character {
    .el-input:first-child{
      width:90%;
    }
    .el-input:last-child{
      width: 10%;
      color: #000;
      margin-left:-1%;
    }
  }
}
</style>
