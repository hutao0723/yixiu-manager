<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/miniApp' }">小程序</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manager/miniApp/templateMsg/' + $route.params.appId }">模板消息</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manager/miniApp/pushMsg/' + $route.params.odpsId }">推送</el-breadcrumb-item>
        <el-breadcrumb-item >添加|编辑推送消息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
          <el-form :inline="true" class="demo-form-inline" size="mini">
            <el-form-item >
              <el-select value-key="id" v-model="id" filterable placeholder="请选择模板" @change="selectChange">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.title + '(' + item.id + ')'"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item> 
          </el-form>
        </template>
      </div> 
      <div class="template-wrap">
        <div class="template-shown">
          <span class="temp-title">{{title}}</span>
          <span class="temp-subtitle">{{time}}</span>
          <div class="temp-content">
            <template v-for="(item, index) in pushKeyList">
              <div class="temp-item">
                <span class="temp-key">{{item.templateName}}</span>
                <span class="temp-value" :class="{fontlarge: item.templateKey === emphasisKeyword }" :style="{color: item.color}">{{item.templateValue}}</span>
              </div>
            </template>
          </div>
        </div>
        <div class="template-options">
          <span class="temp-title">配置模板内容:</span>
          <div class="temp-toselect">
            <el-form  size="mini" label-position="left" label-width="80px"> 
              <template v-for="(item, index) in pushKeyList">
                <el-form-item :label="item.templateName" required>
                  <el-input v-model="item.templateValue"></el-input>
                  <el-color-picker v-model="item.color"></el-color-picker>
                  <el-radio v-model="emphasisKeyword" :label="item.templateKey">{{labelholder}}</el-radio>
                </el-form-item>
              </template>
            </el-form>
            <el-button size="small" type="pain" @click="reset" class='fr'>取消加粗</el-button>
          </div>
          <span class="temp-title">配置落地页:</span>
          <div class="temp-selected">
            <el-form size="mini" label-position="left" label-width="80px"> 
              <el-form-item label="落地页" required><el-input v-model="jumpPage"></el-input></el-form-item>
            </el-form>
          </div>
        </div>          
      </div> 
      <div class="pushset-wrap">
        <el-form size="mini">
          <el-form-item >
            <span class="temp-title">推送时间设置:</span>
            <el-radio v-model="pushNow" label="0">定时推送</el-radio>
            <el-radio v-model="pushNow" label="1">实时推送</el-radio>
          </el-form-item>
          <el-form-item v-if="pushNow === '0'">
            <span class="temp-title">可选择时间:</span>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']" readonly>
            </el-date-picker>
          </el-form-item> 
          <el-form-item v-if="pushNow === '0'">
            <span class="temp-title">推送时间:</span>
            <el-date-picker type="datetime" v-model="pushTime"  placeholder="选择推送时间"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-wrap">
        <el-button size="small" type="primary" @click="save">保存</el-button>
        <router-link :to="{ path: '/manager/miniApp/pushMsg/' + $route.params.odpsId }">
          <el-button size="small" type="pain">取消</el-button>
        </router-link>
      </div>  
    </div>    
  </section>
</template>

<script>
export default {
  data () {
    return {
      id: '',
      title: '',
      time: '2018-01-11',
      labelholder: '加粗',
      emphasisKeyword: '',
      jumpPage: '',
      pushNow: '0',
      pushTime: '',
      templateId: '',
      pushKeyList: [],
      options: [],
      msgTemplateId: ''
    } 
  },
  computed: {
    dateRange () {
      let gmtCreate = new Date().getTime()
      let expireDate = +this.$route.params.expireDate
      return [gmtCreate, expireDate]
    },
    valid () {
      let flag = true
      if (this.pushNow === '1') {
        if (!this.jumpPage) {
          flag = false
        } else {
          this.pushKeyList.forEach(item => {
            if (!item.templateValue) flag = false
          })
        }
      } else {
        if (!this.jumpPage || !this.pushTime) {
          flag = false
        } else {
          this.pushKeyList.forEach(item => {
            if (!item.templateValue) flag = false
          })
        }
      }    
      return flag
    }
  },
  created () {
    this.getTemplateList()
    if (this.$route.params.id) this.getTemplatePushDetail()
  },
  methods: {
    selectChange () {
      let that = this
      let id = this.id
      this.$http.get('/miniapp/msgTemplateDetail', {params: {id}}).then(res => {
        let resp = res.data
        if (resp.success) {
          let msgTemplate = resp.data
          this.title = msgTemplate.title
          this.templateId = msgTemplate.templateId
          this.emphasisKeyword = ''
          this.jumpPage = ''
          this.pushNow = '0'
          this.pushTime = ''
          this.pushKeyList = []
          msgTemplate.mpMsgTemplateKeyList.forEach(item => {
            let pushKey = {
              color: "#6D6E70",
              templateKey: item.templateKey,
              templateName: item.templateName,
              templateValue: item.example
            }
            that.pushKeyList.push(pushKey)
          })
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      }) 
    },
    getTemplateList () {
      let appId = this.$route.params.appId
      this.$http.get('/miniapp/msgTemplateList', {params: {appId}}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.options = resp.data
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    getTemplatePushDetail () {
      let id = this.$route.params.id
      this.$http.get('/miniapp/templatePushGet', {params: {id}}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.id = resp.data.id
          this.title = resp.data.title
          this.emphasisKeyword = resp.data.emphasisKeyword
          this.jumpPage = resp.data.jumpPage
          this.pushNow = resp.data.pushNow ? '1' : '0'
          this.pushTime = resp.data.pushTime
          this.templateId = resp.data.templateId
          this.pushKeyList = resp.data.mpPushKeyList
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    save () {
      let pushTime = new Date(this.pushTime).getTime()
      if (pushTime && (pushTime < new Date().getTime() || pushTime > this.dateRange[1])) {
        this.$message({
          type: 'error',
          message: '请在范围内选择推送时间!'
        })
        return
      }
      let params = {
        appId: this.$route.params.appId,
        odpsId: this.$route.params.odpsId,
        templateId: this.templateId,
        jumpPage: this.jumpPage,
        emphasisKeyword: this.emphasisKeyword,
        pushTime: this.pushNow === '0' ? pushTime : '' ,
        pushNow: this.pushNow === '0' ? false : true,
        pushKeyList: this.pushKeyList
      } 
      if (this.$route.params.id) params.id = this.$route.params.id
      if (this.valid) {
        this.$http.post('/miniapp/templatePushSave', params).then(res => {
          let resp = res.data
          if (resp.success) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.$router.push('/manager/miniApp/pushMsg/' + this.$route.params.odpsId)
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请将配置信息填写完整!'
        })
      }
    },
    reset () {
      this.emphasisKeyword = ''
    }

  }
}
</script>
<style lang="less" scoped>
.ofa-main-wrap {
  width: 100%;
  padding-bottom: 40px;
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
      }
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
  .content{
    .template-wrap{ 
      overflow: hidden;
      background: #F7F9FA;
      .template-shown{
        width: 480px;
        height: 500px;
        padding: 50px 20px 100px;
        margin: 10px;
        font-size: 16px;
        float: left;
        background: #ffffff;
        .temp-title, .temp-subtitle{
          display: block;
          height: 30px;
          line-height: 30px;
        }
        .temp-title{
          font-size: 20px;
        }
        .temp-subtitle{
          color: #d6d6d6;
        }
        .temp-content{
          margin-top: 50px;
          .temp-item{
            padding-top: 5px;
          }
          .temp-key{
            display: inline-block;
            width: 100px;
            height: 25px;
            line-height: 25px;
            color: #d6d6d6;
            float: left;
          }
          .temp-value{
            display: inline-block;
            width: 300px;
            height: 25px;
            line-height: 25px;
          }
          .fontlarge{
            font-size: 32px;
          }
        }
      }
      .template-options{
        height: 650px;
        padding: 0 60px;
        font-size: 16px;
        font-weight: bold;
        margin-left: 500px;
        background: #F7F9FA;
        .temp-title{
          display: inline-block;
          font-size: 18px;
          height: 48px;
          line-height: 48px;
        }
        .temp-subtitle{
          display: inline-block;
          font-size: 14px;
          height: 48px;
          line-height: 48px;
          padding-left: 20px;
          color: #d6d6d6;
        }
        .temp-toselect{
          padding: 20px;
          height: 460px;
          overflow-y: scroll;
          background: #fff;
          .el-radio{
            float: left;
            line-height: 2;
            margin-right: 10px;
          }
        }
        .temp-selected{
          padding: 20px;
          height: 20px;
          background: #fff;
        }
        .el-input{
          width: 80%;
          float: left;
          margin-right: 10px;
        }
      }
      
    }
  }
  .pushset-wrap{
    margin: 40px 0;
    span{
      display: inline-block;
      font-size: 16px;
      width: 120px;
    }
  }
}
</style>
