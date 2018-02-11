<template>
  <section class="main">
  <el-row :span="24">
    <div class="nav-bar">
      <div class="sidebar-container">
          <el-col  :span="24">
            <el-menu  class="el-menu-vertical-demo"  background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
              <router-link :to="{ path: '/manager/dlv' }">
                <el-menu-item index="1">
                  <span slot="title" >
                    <span class="title-main">
                      投放
                    </span>
                  </span>
                </el-menu-item>
              </router-link>
              <router-link :to="{ path: '/manager/officalAcount' }">
                <el-menu-item index="2">
                  <span slot="title" class="txt-color">   
                    <span class="title-main">
                      公众号   
                    </span>
                  </span>
                </el-menu-item>
              </router-link> 
              <router-link :to="{ path: '/manager/miniApp' }">
                <el-menu-item index="3">
                  <span slot="title" class="txt-color">   
                    <span class="title-main">
                      小程序   
                    </span>
                  </span>
                </el-menu-item>
              </router-link> 
            </el-menu>
          </el-col>
          <div class="control-wrap">
            <div class="exit-wrap">
              <span class="logout" @click="logout">退出</span>
            </div>
              <span class="name">有粉</span>
          </div>
      </div>
    </div>
    <el-col :span="24">
      <div class="bg-purple">
        <router-view/>
      </div>
    </el-col> 
  </el-row>
  </section>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {

    }
  },
  methods: {
    logout () {
      this.$http.post('/logout').then(res => {
        let resp = res.data
        if (resp.success) {
          this.$message.success('退出成功')
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.nav-bar{
  width:60px;
  height:100%;
  position: absolute;
  background-color: #545c64;
  top: 0;
  bottom: 0;
  z-index: 100;
  .el-menu{
      border:none
  }
}
.main{
  position: relative;
  height: 100%;
}
.el-row{
  height: 100%;
  position: relative;
}

.title-main{
  font-size: 12px ! important;
  display: inline-block;
}
.control-wrap{
  position: absolute;
  bottom:20px;
  width:100%;
  color:#ccc;
  .exit-wrap{
    margin-bottom:20px;
    .logout{
      cursor: pointer;
    }

  }
  span{
   margin: 0 auto;
   width:100%;
   text-align:center;
   display: inline-block;
  }
}
.bg-purple{
  background: #fff;
}
.sidebar-container{
  position: fixed;
  top:0;
  bottom:0;
  width:60px;
  background-color: #545c64;
}
.el-menu-item{
  padding: 0 !important;
  width: 100%;
  span{
    width: 100%;
    display: inline-block;
  }
}
.title-main{
  display: inline-block;
  text-align: center;
  width: 57px;
  a{
      color: #fff;
      text-decoration: none
  }
}
</style>
