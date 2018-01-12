<template>
  <section class="dlv-main">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager' }">落地页</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="link-theme">
        <i class="iconfont icon-guanlian"></i>
        <span class="connect-ad" @click="openDialogAd">落地页</span>
      </span>
    </div>
    <div class="conbtent">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="searchForm.data" class="demo-form-inline" size="mini">
            <el-form-item>
              <el-select v-model="searchForm.data.name" placeholder="选取公众号">
                <el-option
                  v-for="item in searchForm.officalAcountOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>              
              </el-select>
            </el-form-item>
            <el-form-item >
              <el-input v-model="searchForm.data.value" placeholder="名称"></el-input>
            </el-form-item> 
            <el-form-item>
              <el-select v-model="searchForm.data.status" placeholder="状态">
                <el-option label="已使用" value="0"></el-option>
                <el-option label="待使用" value="1"></el-option>
                <el-option label="不可使用" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>
      <div class="tabel-content">
        <template>
          <el-table :data="tableData"  style="width: 100%" :header-cell-style='headerStyle'>
            <el-table-column prop="date" label="ID" width="50"></el-table-column>
            <el-table-column prop="name" label="落地页"></el-table-column>
            <el-table-column prop="province" label="公众号" width="200"></el-table-column>
            <el-table-column prop="city" label="公众号名称" width="200"></el-table-column>
            <el-table-column prop="address" label="当日阈值" width="100"></el-table-column>
            <el-table-column prop="zip" label="当日新增关注" width="120"></el-table-column>
            <el-table-column prop="zip" label="状态" width="120"></el-table-column>           
            <el-table-column  label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="openStatusDilog">状态</el-button>
                <el-button type="text" size="small" @click="openThresholdDilog">阈值</el-button>               
                <el-button type="text" size="small">删除</el-button>               
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="page-control">
        <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
      </div>
    </div>
    <div class="ad-loadPage-diolog">
      <el-dialog title="添加落地页" :visible.sync="dialogAdVisible">
        <el-form :model="addLoadPage" :rules="rules">
          <el-form-item label="公众号名称" :label-width="formLabelWidth" prop="id">
            <el-select v-model="addLoadPage.id" placeholder="请选择公众号名称">
                <el-option
                  v-for="item in subscriptionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option> 
            </el-select>
          </el-form-item>
          <el-form-item label="落地页名称" :label-width="formLabelWidth"  prop="loadPageUrl">
            <el-input v-model="addLoadPage.loadPageUrl" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="阈值" :label-width="formLabelWidth"  prop="thresholdNum">
            <el-input v-model="addLoadPage.thresholdNum" auto-complete="off"></el-input>
          </el-form-item>           
        </el-form>
      </el-dialog>
    </div>
    <div class="change-status-diolog">
      <el-dialog title="落地页状态" :visible.sync="dialogStatusVisible">
        <el-form :model="addLoadPage" :rules="rules">           
        </el-form>
      </el-dialog>
    </div>
    <div class="edit-threshold-diolog">
      <el-dialog title="设置阈值" :visible.sync="dialogThresholdVisible">
        <el-form :model="addLoadPage" :rules="rules">
          <el-form-item label="阈值" :label-width="formLabelWidth"  prop="loadPageUrl">
            <el-input v-model="addLoadPage.loadPageUrl" auto-complete="off"></el-input>
          </el-form-item>                     
        </el-form>
      </el-dialog>
    </div>    
  </section>
</template>

<script>
import rules from '../components/deliveryValidRules'
console.log(rules)
export default {
  name: 'delivery',
  data () {
    return {
      searchForm: {
        data: {
          name: '',
          value: '',
          type: ''
        },
        officalAcountOptions: [
          {
            label: '公众号名称',
            value: 'backupName'
          },
          {
            label: '公众号',
            value: 'name'
          }
        ]
      },

      headerStyle: {
        backgroundColor: '#f8f8f8'
      },
      formLabelWidth: '100px',
      dialogAdVisible: false,
      dialogStatusVisible: false,
      dialogThresholdVisible: false,
      rules: rules,
      addLoadPage: {
        loadPageUrl: '',
        subscriptionId: '',
        thresholdNum: ''
      },
      data: {
        mac: '',
        options: [
          {
            value: '0',
            label: '广告计划名称'
          },
          {
            value: '1',
            label: '广告计划ID'
          },
          {
            value: '2',
            label: '投放地址'
          }
        ],
        region: {
          value: ''
        }
      },
      subscriptionList: [
        {
          name: '1',
          id: null
        },
        {
          name: '2',
          id: null
        },
        {
          name: '3',
          id: null
        }
      ],
      tableData: [
        {
          date: '1',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '未启用',
          zip: 200333
        }, {
          date: '2',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '未启用',
          zip: 200333
        }, {
          date: '3',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '未启用',
          zip: 200333
        }, {
          date: '4',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '未启用',
          zip: 200333
        }, {
          date: '5',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '未启用',
          zip: 200333
        }]
    }
  },

  methods: {
    onSearch () {
      this.$http.get('http://localhost:3000/weChatlist').then(res => {
        let data = res.data
        console.log(data)
      })
    },
    openDialogAd () {
      this.dialogAdVisible = true
    },
    openStatusDilog () {
      this.dialogStatusVisible = true
    },
    openThresholdDilog () {
      this.dialogThresholdVisible = true
    }
  }
}
</script>

<style lang="less">
.dlv-main{
  width: 100%;
  .title-wrap{
    width: 100%;
    height: 30px;
    border-bottom: 1px dotted #ccc;
    position: relative;
    .el-breadcrumb{
      position: absolute;
      left: 0;
      bottom: 10px;
      font-size: 16px;
    }
    .link-theme{
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 10px;
      font-size: 12px;
    }
    .connect-ad{
      cursor: pointer;
      color: #909399;
      font-weight: 400;
      &:hover{
        color:#333
      }
    }
  }
  .search-bar{
    margin-top: 20px
  }
  .page-control{
    float: right;
    margin-top: 20px;
    &:after{
      clear: both;
    }
  }
}

</style>
