<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/miniApp' }">小程序</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manager/miniApp/templateMsg/' + $route.params.id }">模板消息</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manager/miniApp/templateStock/' + $route.params.id }">微信模板管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加微信模板</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="add-ofa"></span>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
          <el-form :inline="true" class="demo-form-inline" size="mini">
            <el-form-item >
              <el-input v-model="atId" placeholder="微信模板ID"></el-input>
            </el-form-item> 
            <el-form-item>
              <el-button type="primary" @click="findMsgTemplate">获取</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>  
      <div class="template-wrap">
        <div class="template-shown">
          <span class="temp-title">{{title}}</span>
          <span class="temp-subtitle">{{time}}</span>
          <div class="temp-content">
            <template v-for="(item, index) in keywordSelected">
              <div class="temp-item">
                <span class="temp-key">{{item.name}}</span>
                <span class="temp-value">{{item.example}}</span>
              </div>
            </template>
          </div>
        </div>
        <div class="template-options">
          <span class="temp-title">配置关键词:</span>
          <div class="temp-toselect">
            <template v-for="(item, index) in keywordList">
              <div class="item">
                <el-checkbox v-model="item.checked" >{{ item.name }}</el-checkbox>
              </div>
            </template>
          </div>
          <span class="temp-title">已选中关键词:</span>
          <span class="temp-subtitle">上下拖拽关键词可排序</span>
          <div class="temp-selected">
            <draggable v-model="keywordSelected">
                <transition-group>
                    <div class="item" v-for="(item, index) in keywordSelected" :key="item.keywordId" >
                      <el-checkbox v-model="item.checked" >{{ item.name }}</el-checkbox>
                    </div>
                </transition-group>
            </draggable>
          </div>
        </div>          
      </div> 
      <div class="btn-wrap">
        <el-button size="small" type="primary" @click="save">保存</el-button>
        <router-link :to="{ path: '/manager/miniApp/templateStock/' + $route.params.id}">
          <el-button size="small" type="pain" @click="">取消</el-button>
        </router-link>
      </div>  
    </div>     
  </section>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
  　　draggable
  },
  data () {
    return {
      title: '',
      time: '2018-01-11',
      keywordSelected: [],
      keywordList: [],
      atId: ''
    }
  },
  computed: {
    keywordSelecting () {
      let keywordSelecting = [];
      this.keywordList.forEach(function (item) {
        if (item.checked) keywordSelecting.push(item);
      })
      return keywordSelecting;
    }
  },
  watch: {
    keywordSelecting (val) {
      this.keywordSelected = val
    }
  },
  created () {
    this.keywordSelected = this.keywordSelecting
  },
  methods: {
    findMsgTemplate () {
      let atId = this.atId
      let appId = this.$route.params.id
      if (!atId) {
        this.$message.error('请输入模板id')
        return
      } else {
        if (!atId.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]/)) {
          this.$message.error('请输入正确的模板id')
          return
        }
      }
      this.$http.get('/miniapp/templateLibraryGet', { params: {atId, appId}}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.keywordList = resp.data.keywordList
          this.id = resp.data.id
          this.title = resp.data.title
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    save () {
      let keywordList = Object.assign([], this.keywordSelected) 
      if (keywordList.length < 2 || keywordList.length > 10) {
        this.$message({
          type: 'info',
          message: '只能添加2～10条关键词!'
        })
        return
      }
      let appId = this.$route.params.id
      // keywordList.forEach( item => delete item.checked )
      let params = {
        appId: appId,
        atId: this.id,
        title: this.title,
        keywordList: keywordList
      }
      this.$http.post('/miniapp/msgTemplateAdd', params).then(res => {
        let resp = res.data
        if (resp.success) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
         this.$router.push('/manager/miniApp/templateStock/' + appId)
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
      margin-bottom: 100px;
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
        overflow-y: scroll;
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
          height: 250px;
          overflow-y: scroll;
          background: #fff;
          .item{
            padding: 4px 20px;
          }
        }
        .temp-selected{
          height: 300px;
          overflow-y: scroll;
          .item{
            padding: 4px 20px;
            background: #fff;
            margin-top: 5px;
          }
        }
      }
      
    }
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
