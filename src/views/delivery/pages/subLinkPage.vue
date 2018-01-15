<template>
  <section class="dlv-main">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/dlv/theme' }">公众号主题</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manager/dlv/theme' }">公众号</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manager/dlv/link' }">{{themeName}}</el-breadcrumb-item>

      </el-breadcrumb>
      <span class="link-theme">
        <i class="iconfont icon-jia"></i>
        <span class="connect-ad" @click="openDialogSubscrition">公众号</span>
      </span>
    </div>
    <div class="conbtent">
      <div class="tabel-content">
        <template>
          <el-table :data="tableData"  style="width: 100%" :header-cell-style='headerStyle'>
            <el-table-column prop="id" label="序号" width="50"></el-table-column>
            <el-table-column prop="loadPageUrl" label="落地页"></el-table-column>
            <el-table-column prop="subscriptionName" label="公众号" width="200"></el-table-column>
            <el-table-column prop="subscriptionbackUpName" label="公众号名称" width="200"></el-table-column>
            <el-table-column prop="thresholdNum" label="当日阈值" width="100"></el-table-column>
            <!-- <el-table-column prop="zip" label="当日新增关注" width="120"></el-table-column> -->
            <el-table-column prop="status" label="状态" width="120"></el-table-column>
            <el-table-column  label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small">移除</el-button>               
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="page-control">
        <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
      </div>
    </div>
    <div class="connect-loadPage-diolog">
      <el-dialog title="新增公众号" :visible.sync="dialogVisible">
        <el-form  :label-position="'top'" :inline="true" :model="adPlanForm" :rules="rules">
          <el-form-item label="待选公众号"  prop="adPlat">
            <el-select v-model="adPlanForm.adPlat" placeholder="请选择投放平台">
              <el-option label="推啊" value="0"></el-option>
              <el-option label="广点通" value="1"></el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="待选落地页">
            <el-select multiple placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
        </el-form-item>   
        </el-form>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import {rules} from '../components/deliveryValidRules'
import { mapState } from 'vuex'

console.log(rules)
export default {
  name: 'delivery',
  data () {
    return {
      formInline: {
        region: '',
        user: ''
      },
      dialogVisible: false,
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
          id: '1',
          subscriptionName: '王小虎',
          subscriptionbackUpName: '上海',
          loadPageUrl: '普陀区',
          thresholdNum: 1000,
          status: 0
        }]
    }
  },
  created () {
    this.getList()
  },
  computed: mapState({
    themeName: state => state.theme
  }),
  methods: {
    openDialogSubscrition () {
      this.dialogVisible = true
    },
    getList () {
      let id = this.$route.params.id
      this.$http.get('/subscriptionTheme/getLoadPage', {params: {id}}).then(res => {
        if (res.data.sucess) {
          this.tableData = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
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
  .conbtent{
      padding: 30px 0
  }
.el-dialog__body{
    height: 300px;
}
}

</style>
