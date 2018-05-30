<template>
    <section class="ofa-main-wrap">
        <div class="title-wrap">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <span>
                        <button class="goToDistribute" :style="{ 'border': 0, 'backgroundColor': 'white', 'font-size': '100%', 'margin': 0, 'padding': 0, 'color': '#606266', 'cursor': 'pointer' }" @click="goToReadPlan">阅读&nbsp;>&nbsp;阅读计划</button>
                        &nbsp;>&nbsp;海报
                    </span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="content">
            <Poster :posterMsg="posterMsg" @queryPoster="queryPoster" @get-poster-list="getPosterList"></Poster>
        </div>
    </section>
</template>
<script>
import Poster from "../components/poster";

export default {
    data() {
        return {
            posterMsg: []
        }
    },
  methods: {
    init() {
      let params = {
        itemId: 0,
        itemType: 3
      };
      this.$http.get("/poster/findItemPosters", { params: params }).then(
        res => {
          let resp = res.data;
          if (resp.success === true) {
            this.posterMsg = resp.data;
          } else {
            let msg = resp.desc || "请求失败";
            this.$message.error(msg);
          }
        },
        () => {
          this.$message.error("网络错误");
        }
      );
    },
    getPosterList() {
      this.init();
    },
    goToReadPlan() {
      this.$router.push({ path: "/manager/knowledge/read" });
    },
    queryPoster() {
      this.init();
    }
  },
  mounted() {
      this.init();
  },
  components: {
    Poster
  }
};
</script>

<style lang="less" scoped>
.title-wrap {
  width: 100%;
  height: 30px;
  border-bottom: 1px dotted #ccc;
  position: relative;
  margin-bottom: 30px;
  .el-breadcrumb {
    position: absolute;
    left: 0;
    bottom: 10px;
    font-size: 16px;
  }
}
</style>
