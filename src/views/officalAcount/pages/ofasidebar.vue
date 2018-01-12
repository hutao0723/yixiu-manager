<template>
  <section class="main">
  <el-container>
    <el-aside :width="hiddenWith" >
      <div class="side-wrap" v-show="isShow">
        <p class="page-title" >公众号管理</p>
        <el-menu :collapse="isCollapse" class="menu-collapse" default-active="1">
          <el-menu-item index="1">
            <i class="iconfont icon-feiji"></i>
            <span slot="title">公众号</span>
          </el-menu-item>
        </el-menu>                
      </div>
    </el-aside>
    <el-container>
        <el-header>
          <hamburger class="hamburger-container" :toggleClick="openCollapse" :isActive="!isShow"></hamburger>
        </el-header>
        <el-main>
          <div class="content">
              <router-view/>
          </div>
        </el-main>
    </el-container>  
  </el-container>
  </section>
</template>

<script>
import Hamburger from '@/components/Hamburger'

export default {
  name: 'dlvsidebar',
  components: {
    Hamburger
  },
  data () {
    return {
      isCollapse:false,
      hiddenWith: '180px',
      isShow: true,
    }
  },
  methods:{
    openCollapse(){
      console.log(1)
      if (this.isShow) {
        console.log(2)
        this.hiddenWith = 0 + 'px'
        this.isShow = false
      } else {
        this.hiddenWith = 180 + 'px'
        console.log(3)
        this.isShow = true
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.main{
  margin-left: 60px;
  .el-container{
    .el-aside{
      background-color: #fff;
    }
    .el-header{
      padding:5px 10px;
      height:30px !important
    }
    .el-main{
      padding: 10px 40px;
    }
    .page-title{
      width:100%;
      text-align:center
    }
  }
  .menu-collapse{
    background-color: #eee;
      .el-tooltip{
        padding:0;

      }
    }
  .menu-collapse:not(.el-menu--collapse) {
      width: 180px;
      li{
        display:block
      }
  }
  .content{

  }

}
.transition-box {
  margin-bottom: 10px;
  width: 200px;
  height: 100px;
  border-radius: 4px;
  background-color: #409EFF;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
.side-wrap{
  background-color: #eee;
  top: 0;
  bottom: 0;
  position: fixed;
}
</style>
