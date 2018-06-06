<template>
  <section class="main">
    <el-container>
      <el-aside :width="hiddenWith">
        <div class="side-wrap" v-show="isShow">
          <p class="page-title">投放管理</p>
          <el-menu class="menu-collapse" :default-active="pathIndex">
            <router-link :to="{ path: '/manager/dlv' }">
              <el-menu-item index="1">
                <span slot="title">投放管理</span>
              </el-menu-item>
            </router-link>
            <router-link :to="{ path: '/manager/dlv/theme' }">
              <el-menu-item index="2">
                <span slot="title">公众号主题</span>
              </el-menu-item>
            </router-link>
            <router-link :to="{ path: '/manager/dlv/loadpage' }">
              <el-menu-item index="3">
                <span slot="title">落地页</span>
              </el-menu-item>
            </router-link>
            <router-link :to="{ path: '/manager/dlv/skinMarket' }">
            <el-menu-item index="4">
              <span slot="title">皮肤市场</span>
            </el-menu-item>
          </router-link>
            <router-link :to="{ path: '/manager/dlv/putcontent' }">
              <el-menu-item index="5">
                <span slot="title">投放内容</span>
              </el-menu-item>
            </router-link>
            <router-link :to="{ path: '/manager/dlv/monitor' }">
              <el-menu-item index="6">
                <span slot="title">页面监控</span>
              </el-menu-item>
            </router-link>
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
    data() {
      return {
        hiddenWith: '180px',
        isShow: true,
        pathIndex: "1",
      }
    },
    created() {
      console.log(this.$route.path)
      let pathIndex;
      let path = this.$route.path;
      switch (path) {
        case '/manager/dlv':
          pathIndex = "1";
          break;
        case '/manager/dlv/theme':
          pathIndex = "2";
          break;
        case '/manager/dlv/loadpage':
          pathIndex = "3";
          break;
        case '/manager/dlv/skinMarket':
          pathIndex = "4";
          break;
        case '/manager/dlv/putcontent':
          pathIndex = "5";
          break;
        case '/manager/dlv/monitor':
          pathIndex = "6";
          break;
        default:
          break;
      }
      this.pathIndex = pathIndex;
    },
    methods: {
      openCollapse() {
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
  .main {
    margin-left: 60px;
    a {
      text-decoration: none;
    }
    .el-container {
      .el-aside {
        background-color: #fff;
      }
      .el-header {
        padding: 5px 10px;
        height: 30px !important
      }
      .el-main {
        padding: 10px 20px;
      }
      .page-title {
        width: 100%;
        text-align: center;
        line-height: 60px;
      }
    }
    .menu-collapse {
      .el-tooltip {
        padding: 0;

      }
    }
    .menu-collapse:not(.el-menu--collapse) {
      width: 180px;
    }
    .content {}

  }

  .menu-collapse {
    background-color: #F7F9FA;
    top: 0;
    bottom: 0;
  }

  .el-menu {
    border-right: none
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

  .side-wrap {
    position: fixed;
    top: 0;
    bottom: 0;
    background-color: #F7F9FA
  }

</style>

