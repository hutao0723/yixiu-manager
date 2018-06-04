<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/coupon' }">母版</el-breadcrumb-item>
        <el-breadcrumb-item>{{ this.type == 'new' ? '新建母版' : '编辑母版' }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
        </template>
      </div>
      <div class="tabel-wrap">
        <!-- :rules="rules" -->
        <el-form ref="masterForm" :model="masterForm" label-width="120px" :rules="rules">
            <el-form-item label="母版标题" prop="keyWord">
              <el-input v-model="masterForm.keyWord" style="width: 60%;" placeholder="1-45字" :maxlength="45"></el-input>
            </el-form-item>
            <el-form-item label="面额" prop="price">
              <el-col :span="6">
                <el-input v-model="masterForm.price" placeholder="0.01-999.99" type="number" :maxlength="8">
                  <template slot="append">元</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="有效期">
              <el-radio-group v-model="masterForm.period">
                <el-radio :label="1">领券起</el-radio>
                <el-radio :label="2">固定周期</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form ref="dayForm" :model="dayForm" label-width="120px" v-show="masterForm.period == 1">
              <el-form-item  prop="day">
                <el-col :span="6">
                  <el-input v-model="dayForm.day" placeholder="1-999" type="number" :maxlength="8">
                    <template slot="append">天</template>
                  </el-input>
                </el-col>
              </el-form-item>
            </el-form>
            <el-form ref="dayForm" :model="dateForm" label-width="120px" v-show="masterForm.period == 2">
              <el-form-item prop="date">
                <el-date-picker v-model="dateForm.date"  type="daterange" range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-form>
            <el-form-item label="定向阅读计划" >
              <el-radio-group v-model="masterForm.direction">
                <el-radio :label="1">定向</el-radio>
                <el-radio :label="2">不定向</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form ref="dayForm" :model="orientForm" label-width="120px" v-show="masterForm.direction == 1">
              <el-form-item>
                <!--列表-->
                <el-table :data="readPlanList" style="width: 100%" border>
                  <el-table-column prop="id" label="阅读计划ID" ></el-table-column>
                  <el-table-column prop="readTitle" label="阅读计划标题" ></el-table-column>
                  <el-table-column prop="price" label="价格" ></el-table-column>
                  <el-table-column  label="操作" >
                    <template slot-scope="scope">
                      <el-button type="text" size="mini">移除</el-button>        
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
            <el-form-item>
              <el-button type="primary" v-show="masterForm.direction == 1" @click="relatePlan">关联阅读计划</el-button>
            </el-form-item>
            <el-form-item label="立即使用跳转" prop="link">
              <el-col :span="6">
                <el-select v-model="masterForm.link">
                  <el-option v-for="item in masterOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item>
              <router-link :to="{ path: '/manager/knowledge/coupon'}">
                  <el-button type="pain">取消</el-button>
              </router-link>
              <el-button type="primary" >保存</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div>

    <!--选择关联计划-->
    <div class="add-read-diolog">
      <el-dialog title="关联阅读计划" :visible.sync="dialogReadPlanVisible">
        <el-form :model="readForm" ref="readForm">
          <el-form-item label="阅读计划"   prop="readForm">
            <el-select v-model="readForm.readPlan" filterable>
              <el-option v-for="item in readOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" @click="dialogReadPlanVisible = false">取 消</el-button>
          <el-button size="small" type="primary">保存</el-button>
        </div>
      </el-dialog>
    </div> 
  </section> 

</template>
<script>
  import { formatDateNew } from '../../../utils/dateUtils'
  import couponrules from '../components/couponrules'
  import qs from 'qs'
  export default {
    data () {
      return {
        type: 'new',
        rules: couponrules,
        masterForm: {
          id: '',
          keyWord: '',
          price: null,
          period: 1,
          date: [],
          direction: 1,
          link:''
        },
        // 页面的列表数据
        orientForm: {},

        dayForm :{
          day: ''
        },
        dateForm :{
          date: ''
        },
        readForm: {
          readPlan: ''
        },
        dialogReadPlanVisible: false,
        readPlanList:[],
        masterOptions: [
          {
            value: 'name',
            label: '一修读书报名页'
          }
        ],
        readOptions: [
          {
            value: 'name',
            label: '一修读书报名页'
          }
        ]
      }
    },
    created () {
      this.init()
    },
    watch: {
    },
    methods: {
      // 关联阅读计划
      relatePlan() {
        console.log("关联阅读计划")
        this.dialogReadPlanVisible = true
      },
      init() {
        let { id } = this.$route.params;
        if (id === 'new') {
          this.type = 'new';
        } else {
          this.type = 'edit';
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .search-bar {
    margin-top: 20px;
  }
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
  }
</style>
