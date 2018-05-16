<template>
  <section class="main">
    <el-container>
      <el-aside :width="hiddenWith">
        <div class="side-wrap" v-show="isShow">
          <p class="page-title">知识付费</p>
          <el-menu :collapse="isCollapse" class="menu-collapse" :default-active="pathIndex">
            <router-link :to="{ path: '/manager/knowledge' }">
              <el-menu-item index="1">
                <span>页面</span>
              </el-menu-item>
            </router-link>
            <el-submenu index="2">
              <span slot="title">内容</span>
              <router-link :to="{ path: '/manager/knowledge/curriculum' }">
                <el-menu-item index="2-1">
                  <span>课程</span>
                </el-menu-item>
              </router-link>
              <router-link :to="{ path: '/manager/knowledge/specialColumn' }">
                <el-menu-item index="2-2">
                  <span>专栏</span>
                </el-menu-item>
              </router-link>
              <router-link :to="{ path: '/manager/knowledge/goodsGroup' }">
                <el-menu-item index="2-3">
                  <span>商品组</span>
                </el-menu-item>
              </router-link>
            </el-submenu>
            <router-link :to="{ path: '/manager/knowledge/read' }">
              <el-menu-item index="6">
                <span>阅读</span>
              </el-menu-item>
            </router-link>
            <router-link :to="{ path: '/manager/knowledge/order' }">
              <el-menu-item index="3">
                <span>订单</span>
              </el-menu-item>
            </router-link>
            <router-link :to="{ path: '/manager/knowledge/lecturer' }">
              <el-menu-item index="4">
                <span>讲师</span>
              </el-menu-item>
            </router-link>
             <el-submenu index="5">
              <span slot="title">渠道</span>
              <router-link :to="{ path: '/manager/knowledge/channel' }">
                <el-menu-item index="5-1">
                  <span>渠道管理</span>
                </el-menu-item>
              </router-link>
              <router-link :to="{ path: '/manager/knowledge/extend' }">
                <el-menu-item index="5-2">
                  <span>推广位管理</span>
                </el-menu-item>
              </router-link>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <!-- <el-header>
          <hamburger class="hamburger-container" :toggleClick="openCollapse" :isActive="!isShow"></hamburger>
        </el-header> -->
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
        isCollapse: false,
        hiddenWith: '180px',
        isShow: true,
        pathIndex: 1
      }
    },
    created() {
      console.log(this.$route.path)
      let pathIndex;
      let path = this.$route.path;
      switch (path) {
        case '/manager/knowledge':
          pathIndex = "1";
          break;
        case '/manager/knowledge/curriculum':
          pathIndex = "2-1";
          break;
        case '/manager/knowledge/specialColumn':
          pathIndex = "2-2";
          break;
        case '/manager/knowledge/goodsGroup':
          pathIndex = "2-3";
          break;
        case '/manager/knowledge/order':
          pathIndex = "3";
          break;
          case '/manager/knowledge/lecturer':
          pathIndex = "4";
          break;
          case '/manager/knowledge/channel':
          pathIndex = "5-1";
          break;
          case '/manager/knowledge/extend':
          pathIndex = "5-2";
          break;
          case '/manager/knowledge/add':
          pathIndex = "1";
          break;
        case '/manager/knowledge/read':
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
      flex-basis: 0;
      .el-aside {
        background-color: #fff;
      }
      .el-header {
        padding: 5px 10px;
        height: 30px !important
      }
      .el-main {
        padding: 10px 40px;
      }
      .page-title {
        width: 100%;
        text-align: center;
        line-height: 60px;
      }
    }
    .el-menu {
      border-right: none
    }
    .menu-collapse {
      background-color: #F7F9FA;
      .el-tooltip {
        padding: 0;

      }
    }
    .menu-collapse:not(.el-menu--collapse) {
      width: 180px;
      li {
        display: block
      }
    }
    .content {}

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
    background-color: #F7F9FA;
    top: 0;
    bottom: 0;
    position: fixed;
  }
</style>
