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

            <el-form-item label="活动标题" prop="title">
              <el-input v-model="activityForm.title" style="width: 60%;" placeholder="1-45字"></el-input>
            </el-form-item>

            <el-form-item label="奖励优惠券" prop="coupon">

                <el-select v-model="activityForm.coupon" filterable >
                    <el-option v-for="item in masterOptions" :key="item.couponTemplateId" :label="item.name + '/' + item.id" :value="item.couponTemplateId">
                    </el-option>
                </el-select>
             
            </el-form-item>

            <el-form-item label="领奖限制" prop="limitType">
              <el-radio-group v-model="activityForm.limitType">
                <el-radio :label="1">奖品数量</el-radio>
                <el-radio :label="2">固定周期</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item  v-if="activityForm.limitType == 1"  prop='itemSize'>
              <el-col :span="6">
                <el-input v-model="activityForm.itemSize" placeholder="1-99999999" type="text" max="99999999" :maxlength="8" >
                  <template slot="append">张</template>
                </el-input>
              </el-col>
            </el-form-item>

            <el-form-item prop="date" v-if="activityForm.limitType == 2">
              <el-date-picker v-model="date" type="datetimerange" range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期" @change="changeDate"></el-date-picker>
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
  import { formatDateNew, formatToMs } from '../../../utils/dateUtils'
  import couponrules from '../components/couponRules'
  import qs from 'qs'
  export default {
    data () {
      return {
        type: 'new',
        rules: couponrules,
        date: null,
        activityForm: {
          activityStartTime: '',
          activityEndTime: '',
          activityType: 1,
          title: '',
					limitType: 1,
					coupon:'',
          awardItems:[
            {
              activityId: '',
              awardContentId: '',
              awardContentType: 1,
              id: null 
            }
          ],
          itemSize: null
        },
        masterOptions: []
      }
    },
    created () {
      this.getCouponList()
      this.getPopActivity()
    },
    watch: {
      'activityForm.coupon': function (newVal) {
				console.log(newVal)
        if (this.masterOptions[newVal] !== undefined) {
          this.activityForm.id = this.masterOptions[newVal].parentEditionId
        }
      }
    },
    methods: {
      changeDate() {
        this.activityForm.activityStartTime = this.date ? formatToMs(this.date[0]) : '';
        this.activityForm.activityEndTime = this.date ? formatToMs(this.date[1]) : '';
      },
      // 获取奖励优惠券列表
      getCouponList () {
        this.$http.get('/coupon/template/simple/list', {}).then(res => {
          let resp = res.data
          if (resp.success) {
            if(resp.data){
              this.masterOptions = resp.data
              console.log(this.masterOptions)
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
        this.$http.get('/activity/get', {params: params}).then(res => {
          let resp = res.data
          if (resp.success) {
            if(resp.data){
							this.activityForm = resp.data
							// 额外添加参数
							//this.activityForm.coupon = this.activityForm.awardItems[0].awardContentId;
							this.$set(this.activityForm,'coupon',this.activityForm.awardItems[0].awardContentId)
              this.activityForm.itemSize = resp.data.itemSize
              this.date =[resp.data.activityStartTime, resp.data.activityEndTime];
              this.masterOptions.couponTemplateId = this.activityForm.awardItems[0].awardContentId;
            }
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      // 保存活动
      saveActivity () {
				console.log(this.activityForm.coupon)
				this.activityForm['date'] = this.date;
				this.activityForm.awardItems[0].awardContentId = this.activityForm.coupon;
        for (let key in this.activityForm) {
          if (key == 'activityId' || key == 'activityStatus' || key == 'deleted' || key == 'gmtCreate' || key == 'gmtModified') {
            delete this.activityForm[key]
          }
        }
        if (this.activityForm.awardItems) {
          for (let key in this.activityForm.awardItems[0]) {
            if (key == 'activityId') {
              delete this.activityForm.awardItems[0][key]
            }
          }
        }
        this.$refs['activityForm'].validate((valid) => {
          if (valid) {
						//验证通过
						//this.activityForm

            if (this.activityForm.limitType == 1) {
              this.activityForm.activityStartTime = null;
              this.activityForm.activityEndTime = null;
            } else if (this.activityForm.limitType == 2) {
              this.activityForm.itemSize = null;
            }
            console.log(this.activityForm)
            this.$http.post('/activity/save', this.activityForm).then(res => {
              if (res.data.success) {
                this.$message.success('操作成功')
                this.$router.go(-1);
              } else {
                this.$message.error(res.data.desc||'操作失败')
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
