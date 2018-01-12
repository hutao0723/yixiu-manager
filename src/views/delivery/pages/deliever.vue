<template>
  <section class="dlv-main">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager' }">投放管理</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="link-theme">
        <i class="iconfont icon-guanlian"></i>
        <span class="connect-ad" @click="openDialogAd">广告计划</span>
      </span>
    </div>
    <div class="conbtent">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
            <el-form-item>
              <el-select v-model="formInline.region" placeholder="广告计划名称">
                <el-option
                  v-for="item in data.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>              
              </el-select>
            </el-form-item>
            <el-form-item >
              <el-input v-model="formInline.user" placeholder="名称/ID/地址"></el-input>
            </el-form-item> 
            <el-form-item>
              <el-select v-model="data.region" placeholder="请选择状态">
                <el-option label="已使用" value="shanghai"></el-option>
                <el-option label="待使用" value="beijing"></el-option>
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
            <el-table-column prop="name" label="投放地址"></el-table-column>
            <el-table-column prop="province" label="广告计划名称（ID）" width="200"></el-table-column>
            <el-table-column prop="city" label="公众号名称（ID）" width="200"></el-table-column>
            <el-table-column prop="address" label="主题状态" width="100"></el-table-column>
            <el-table-column prop="zip" label="广告平台" width="120"></el-table-column>
            <el-table-column  label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small">取关</el-button>               
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="page-control">
        <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
      </div>
    </div>
    <div class="creat-ad-connect-diolog">
      <el-dialog title="关联广告计划" :visible.sync="dialogAdVisible">
        <el-form :model="adPlanForm" :rules="rules">
          <el-form-item label="广告平台" :label-width="formLabelWidth" prop="adPlat">
            <el-select v-model="adPlanForm.adPlat" placeholder="请选择投放平台">
              <el-option label="推啊" value="0"></el-option>
              <el-option label="广点通" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="广告计划" :label-width="formLabelWidth"  prop="adPlan">
            <el-input v-model="adPlanForm.adPlan" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="投放地址" :label-width="formLabelWidth"  prop="adress">
            <el-input v-model="adPlanForm.adress" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="公众号主题" :label-width="formLabelWidth" prop="subject">
            <el-input v-model="adPlanForm.subject" auto-complete="off"></el-input>
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
      formInline: {
        region: '',
        user: ''
      },
      headerStyle: {
        backgroundColor: '#f8f8f8'
      },
      formLabelWidth: '100px',
      dialogAdVisible: false,
      rules: rules,
      adPlanForm: {
        adPlat: '',
        adPlan: '',
        adress: '',
        subject: ''
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
