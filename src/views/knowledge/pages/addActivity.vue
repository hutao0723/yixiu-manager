<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/voucherActivities'}">弹层领券</el-breadcrumb-item>
        <el-breadcrumb-item>弹层领券活动</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
        </template>
      </div>
      <div class="tabel-wrap">
        <el-form ref="activityForm" :model="activityForm" label-width="100px" :rules="rules">
            <el-form-item label="活动标题" prop="activity">
              <el-input v-model="activityForm.activity" style="width: 60%;" placeholder="1-45字"></el-input>
            </el-form-item>
            <el-form-item label="奖励优惠券" prop="coupon">
              <el-col :span="6">
                <el-select v-model="activityForm.coupon">
                  <el-option v-for="item in masterOptions" :key="item.id" :label="item.nickName" :value="item.id">
                      </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="领奖限制" prop="limit">
              <el-radio-group v-model="activityForm.limit">
                <el-radio :label="1">奖品数量</el-radio>
                <el-radio :label="2">固定周期</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form ref="pieceForm" :model="pieceForm" label-width="100px" v-show="activityForm.limit == 1">
              <el-form-item  prop="piece">
                <el-col :span="6">
                  <el-input v-model="pieceForm.piece" placeholder="1-99999999" type="number" :maxlength="8">
                    <template slot="append">张</template>
                  </el-input>
                </el-col>
              </el-form-item>
            </el-form>
            <el-form ref="dateForm" :model="dateForm" label-width="100px" v-show="activityForm.limit == 2">
              <el-form-item prop="date">
                <el-date-picker v-model="dateForm.date"  type="datetimerange" range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期"></el-date-picker>
                </el-date-picker>
              </el-form-item>
            </el-form>
            <el-form-item>
              <router-link :to="{ path: '/manager/knowledge/voucherActivities'}">
                  <el-button type="pain">取消</el-button>
              </router-link>
              <el-button type="primary" >保存</el-button>
            </el-form-item>
        </el-form>
      </div>
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
        rules: couponrules,
        activityForm: {
          id: '',
          activity: '',
          limit: 1,
          coupon:'请选择'
        },
        dateForm: {
          date: []
        },
        pieceForm:{
          piece: ''
        },
        readForm: {
          readPlan: ''
        },
        masterOptions: [
          {
            value: '',
            label: '请选择'
          },
          {
            value: 'name',
            label: '一修读书报名页'
          }
        ]
      }
    },
    created () {
      this.getCouponList()
    },
    watch: {
    },
    methods: {
      // 获取奖励优惠券列表
      getCouponList() {
        this.$http.get('/lecturer/pageList', {}).then(res => {
          let resp = res.data
          if (resp.success) {
            this.masterOptions = resp.data.content
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
