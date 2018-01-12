<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager' }">公众号</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="add-ofa">
        <!-- <i class="iconfont icon-guanlian"></i> -->
         <router-link :to="{ path: '/manager/officalAcount/create' }">
          <span class="offical-acount">公众号</span>
         </router-link>
      </span>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="ofaSearchForm" class="demo-form-inline" size="mini">
            <el-form-item>
              <el-select v-model="ofaSearchForm.searchWay" placeholder="查询方式">
                <el-option
                  v-for="item in searchOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>              
              </el-select>
            </el-form-item>
            <el-form-item >
              <el-input v-model="ofaSearchForm.searchValue" placeholder="名称"></el-input>
            </el-form-item> 
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>
      <div class="tabel-wrap">
        <template>
          <el-table :data="officalAcountList"  style="width: 100%" >
            <el-table-column prop="id" label="ID" ></el-table-column>
            <el-table-column prop="name" label="公众号" ></el-table-column>
            <el-table-column prop="backupName" label="公众号名称" ></el-table-column>
            <el-table-column prop="todayNewFollow" label="当日新增关注" ></el-table-column>
            <el-table-column prop="todayNewUnFollow" label="当日取消关注"></el-table-column>
            <el-table-column  label="操作" width="150">
              <template slot-scope="scope">
                <el-button size="mini" @click="edit(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini">删除</el-button>               
              </template>
            </el-table-column>
          </el-table>
        </template>        
      </div>
      <div class="page-control">
        <el-pagination background  :current-page.sync="pageOption.pageNum"
 @current-change="pageChange" layout="prev, pager, next" :total="1000"></el-pagination>
      </div>    
    </div>     
  </section>
</template>

<script>
export default {
  data () {
    return {
      searchOptions: [
        {
          value: 'backupName',
          label: '公众号名称'
        },
        {
          value: 'name',
          label: '公众号'
        }
      ],

      ofaSearchForm: {
        searchWay: '',
        searchValue: ''
      },
      pageOption: {
        pageNum: 1,
        size: 10
      },
      officalAcountList: [
        {
          id: "1",
          name: "今日财经",
          backupName: "今日财经0.1",
          todayNewFollow: "100",
          todayNewUnFollow: "200"
        }
      ]
    }
  },
  methods: {
    handleCurrentChange () {
      console.log(this.pageOption.currentPage)
    },
    onSearch () {
      let searchName = this.ofaSearchForm.searchWay
      let searchValue = this.ofaSearchForm.searchValue
      let name, backupName
      searchName === 'name' ? name = searchValue : backupName = searchValue
      this.$http.get('//192.168.2.87:9101/subscriptionInfo/list', {params: {name: name, backupName: backupName}}).then(res => {
        if (res.data.success) {
          this.officalAcountList = res.data.data.lists
        } else {
          let msg = res.data.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    pageChange () {
      this.$http.get('//192.168.2.87:9101/subscriptionInfo/list', {params: this.pageOption}).then(res => {
        if (res.data.success) {
          this.officalAcountList = res.data.data.lists
        } else {
          let msg = res.data.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    edit (row) {
      this.$router.push('/manager/officalAcount/create/' + row.id)
      
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
