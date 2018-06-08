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
            <el-form-item label="母版标题" prop="title">
              <el-input v-model="masterForm.title" style="width: 60%;" placeholder="1-45字" :maxlength="45"></el-input>
            </el-form-item>
            <el-form-item label="面额" prop="couponPrice">
              <el-col :span="6">
                <el-input v-model="masterForm.couponPrice" placeholder="0.01-999.99" type="number" :maxlength="8">
                  <template slot="append">元</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="有效期">
              <el-radio-group v-model="masterForm.validityType">
                <el-radio :label="1">领券起</el-radio>
                <el-radio :label="2">固定周期</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form ref="masterForm" :model="masterForm" label-width="120px" v-show="masterForm.validityType == 1">
              <el-form-item prop="day">
                <el-col :span="6">
                  <el-input v-model="masterForm.validityDays" placeholder="1-999" type="number" :maxlength="8">
                    <template slot="append">天</template>
                  </el-input>
                </el-col>
              </el-form-item>
            </el-form>
            <el-form ref="masterForm" :model="masterForm" label-width="120px" v-show="masterForm.validityType == 2">
              <el-form-item prop="date">
                <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期" @change="changeDate">
                </el-date-picker>
              </el-form-item>
            </el-form>
            <el-form-item label="定向阅读计划" >
              <el-radio-group v-model="masterForm.useScopeType">
                <el-radio :label="1">定向</el-radio>
                <el-radio :label="2">不定向</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form ref="masterForm" :model="masterForm" label-width="120px" v-show="masterForm.useScopeType == 1">
              <el-form-item>
                <!--列表-->
                <el-table :data="readPlanList" style="width: 100%" border>
                  <el-table-column prop="id" label="阅读计划ID" ></el-table-column>
                  <el-table-column prop="title" label="阅读计划标题" ></el-table-column>
                  <el-table-column prop="presentPrice" label="价格" >
                    <template slot-scope="scope">
                      <span>{{ scope.row.presentPrice/100 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" >
                    <template slot-scope="scope">
                      <el-button type="text" size="mini" @click="deleteReadPlan(scope.$index)">移除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
            <el-form-item>
              <el-button type="primary" v-show="masterForm.useScopeType == 1" @click="showDialog">关联阅读计划</el-button>
            </el-form-item>
            <el-form-item label="立即使用跳转" prop="link">
              <el-col :span="6">
                <el-select v-model="masterForm.pageLocationId">
                  <el-option v-for="item in masterOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item>
              <router-link :to="{ path: '/manager/knowledge/coupon'}">
                  <el-button type="pain">取消</el-button>
              </router-link>
              <el-button type="primary" @click="saveTemplate">保存</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div>

    <!--选择关联计划-->
    <div class="add-read-diolog">
      <el-dialog title="关联阅读计划" :visible.sync="dialogReadPlanVisible">
        <el-form ref="readForm">
          <el-form-item label="阅读计划" prop="readForm">
            <el-select v-model="readForm" filterable>
              <el-option v-for="(item, index) in readOptions" :key="index" :label="item.title + '/' + item.id" :value="item.id" :item="item" @click.native="chooseReadPlan(item)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" @click="dialogReadPlanVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="queryReadPlan">保存</el-button>
        </div>
      </el-dialog>
    </div> 
  </section> 

</template>
<script>
  import { formatDateNew } from '../../../utils/dateUtils'
  import couponrules from '../components/couponrules'
  import { readList, saveTemplate, couponTemplateDetail } from "@/api/index";
  import qs from 'qs'
import numberEditVue from './numberEdit.vue';
  export default {
    data () {
      return {
        date: null,
        type: 'new',
        rules: couponrules,
        masterForm: {
          title: '',
          couponPrice: '',
          validityType: 1,
          useScopeType: 1
        },
        // 页面的列表数据
        orientForm: {},
        readForm: {
          id: null,
          title: null
        },
        dialogReadPlanVisible: false,
        readPlanList:[],
        masterOptions: [
          {
            value: 1,
            label: '一修读书报名页'
          }
        ],
        readOptions: [],
        readList: null,
        getPlanList: []
      }
    },
    created () {
      this.init()
    },
    watch: {
    },
    methods: {
      changeDate() {
        this.masterForm.couponStartTime = this.date ? this.formatDateNew(this.date[0]) : '';
        this.masterForm.couponEndTime = this.date ? this.formatDateNew(this.date[1]) : '';
      },
      // 关联阅读计划
      relatePlan() {
        readList()
        .then(res => {
          if (res.success) {
            this.readOptions = res.data;
          } else {
            let msg = res.data.desc || "请求失败";
            this.$message.error(msg);
          }
        })
      },
      init() {
        this.relatePlan();
        let { id } = this.$route.params;
        if (id === 'new') {
          this.type = 'new';
        } else {
          this.type = 'edit';
          this.getTemplate(id);
        }
      },
      getTemplate(id) {
        let params = {
          couponTemplateId: id
        }
        couponTemplateDetail(params)
        .then(res => {
          if (res.success) {
            this.masterForm = res.data;
            console.log(this.masterForm)
            this.masterForm.couponPrice = this.masterForm.couponPrice/100;
            this.date = [this.formatDateNew(this.masterForm.couponStartTime), this.formatDateNew(this.masterForm.couponEndTime)];
            if (this.masterForm.itemList) {
              for (let index of this.readOptions) {
                for (let index1 of this.masterForm.itemList) {
                  if (index['id'] == index1['itemId']) {
                    this.readPlanList.push(index)
                  }
                }
              }
            }
          } else {
            let msg = res.data.desc || "获取母版详情失败";
            this.$message.error(msg);
          }
        })
      },
      showDialog() {
        this.dialogReadPlanVisible = true;
        this.readForm = null;
      },
      queryReadPlan() {
        this.dialogReadPlanVisible = false;
        this.readPlanList.push(this.readList);
      },
      deleteReadPlan(params) {
        this.readPlanList.splice(params, 1);
      },
      chooseReadPlan(params) {
        this.readList = params;
      },
      formatDateNew(date) {
        if (!date) return '';
        if (typeof date !== 'object') {
          date = new Date(date);
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = ('0' + month).slice(-2);
        day = ('0' + day).slice(-2);
        return year + '-' + month + '-' + day;
      },
      saveTemplate() {
        this.$refs['masterForm'].validate((valid) => {
          if (valid) {
            if (this.masterForm.validityType == 1) {
              this.date = '';
            } else if (this.masterForm.validityType == 2) {
              this.masterForm.validityDays = '';
            }
            if (this.masterForm.useScopeType == 1) {
              for (let list of this.readPlanList) {
                this.getPlanList.push({ itemId: list['id'], itemType: 3})
              }
            } else if (this.masterForm.useScopeType == 2) {
              this.masterForm.itemList = '';
            }
            console.log(this.masterForm.itemList)
            let params = {
              conditionType: 2,
              conditionValue: 0,
              couponEndTime: this.formatDateNew(this.date[1]),
              couponPrice: this.masterForm.couponPrice*100,
              couponStartTime: this.formatDateNew(this.date[0]),
              couponTemplateId: this.$route.params.id = 'new' ? '' : this.$route.params.id,
              itemList: this.getPlanList,
              pageItemType: 3,
              pageLocationId: 1,
              pageType: 2,
              title: this.masterForm.title,
              useScopeType: this.masterForm.useScopeType,
              validityDays: this.masterForm.validityDays,
              validityType: this.masterForm.validityType
            }
            this.$http.post('/coupon/template/save', params).then(res => {
              if (res.data.success) {
                this.$message.success('操作成功')
                this.$router.go(-1);
              } else {
                this.$message.error('操作失败')
              }
            }).catch(() => {
              this.$message.error('网络错误')
            })
          } else {
            return false
          }
        })
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
