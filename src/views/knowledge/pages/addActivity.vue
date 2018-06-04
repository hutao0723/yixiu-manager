<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/voucherActivities'}">弹层领券</el-breadcrumb-item>
        <el-breadcrumb-item>{{ this.type == 'new' ? '新建' : '编辑' }}弹层领券活动</el-breadcrumb-item>
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
                  <el-option v-for="item in masterOptions" :key="item.parentEditionId" :label="item.parentEditionTitle" :value="item.parentEditionId">
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
            <el-form-item  prop="piece" v-if="activityForm.limit == 1" :maxlength="8" type="number" :rules="[
                { required: true, message: '请输入张数', trigger: 'blur' }
            ]">
              <el-col :span="6">
                <el-input v-model="activityForm.piece" placeholder="1-99999999" type="number" :maxlength="8">
                  <template slot="append">张</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item prop="date" v-if="activityForm.limit == 2" :rules="[
                { required: true, message: '请选择时间', trigger: 'blur' }
            ]">
              <el-date-picker v-model="activityForm.date"  type="datetimerange" range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <router-link :to="{ path: '/manager/knowledge/voucherActivities'}">
                  <el-button type="pain">取消</el-button>
              </router-link>
              <el-button type="primary" @click="saveActivity">保存</el-button>
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
        type: 'new',
        rules: couponrules,
        activityForm: {
          id: null,
          activityId: null,
          activity: '',
          limit: 1,
          coupon:'',
          piece: null,
          date: []
        },
        prize:'',
        masterOptions: []
      }
    },
    created () {
      this.getCouponList()
      this.getPopActivity()
    },
    watch: {
      'activityForm.coupon': function (newVal) {
        if (this.masterOptions[newVal] !== undefined) {
          this.activityForm.id = this.masterOptions[newVal].parentEditionId
        }
      }
    },
    methods: {
      // 获取奖励优惠券列表
      getCouponList () {
        this.$http.get('/get/prize/coupon', {}).then(res => {
          let resp = res.data
          if (resp.success) {
            if(resp.data){
              this.masterOptions = resp.data.content
            }
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      // 获取单个活动详情
      getPopActivity () {
        let id = this.$route.params.id
        if (id === "new") {
          this.type = 'new';
          id = '' 
        } else {
          this.type = 'edit';
        }
        let params = {
          id: id
        }
        this.$http.get('/get/pop/activity', {params: params}).then(res => {
          let resp = res.data
          if (resp.success) {
            if(resp.data){
              this.activityForm = resp.data
              this.activityForm.date =[new Date(resp.data.startdate),new Date(resp.data.enddate)] 
              this.masterOptions.parentEditionTitle = this.activityForm.coupon
              this.masterOptions.parentEditionId = this.activityForm.titleId
            }
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      // 保存活动
      saveActivity () {
        this.$refs['activityForm'].validate((valid) => {
          if (valid) {
            console.log(this.activityForm)
            let {id, activityId, activity, limit, coupon, piece, date} = this.activityForm
            let params = {
              id, 
              activityId, 
              activity, 
              limit, 
              coupon, 
              piece, 
              date
            };
            this.$http.post('/save/activity', qs.stringify(params)).then(res => {
              if (res.data.success) {
                this.$message.success('操作成功')
                this.$router.push('skinMarket')
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
      },
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
