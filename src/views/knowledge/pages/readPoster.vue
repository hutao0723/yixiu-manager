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
      let conversion = function (number) {
        return Math.round(number *(750/510))
      };
      let params = {
        itemId: 0,
        itemType: 3
      };
      this.$http.get("/poster/findItemPosters", { params: params }).then(
        res => {
          let resp = res.data;
          if (resp.success === true) {
            this.posterMsg = resp.data;
            for(let item of this.posterMsg){
              // 更新海报参数
              item.portraitLength = conversion(item.portraitLength)
              item.portraitLeftMargin = conversion(item.portraitLeftMargin)
              item.portraitTopMargin = conversion(item.portraitTopMargin)
              item.nicknameFontSize = conversion(item.nicknameFontSize)
              item.nicknameWidth = conversion(item.nicknameWidth)
              item.nicknameHeight = conversion(item.nicknameHeight)
              item.nicknameLeftMargin = conversion(item.nicknameLeftMargin)
              item.nicknameTopMargin = conversion(item.nicknameTopMargin)
              item.ctitleWidth = conversion(item.ctitleWidth)
              item.ctitleHeight = conversion(item.ctitleHeight)
              item.ctitleLeftMargin = conversion(item.ctitleLeftMargin)
              item.ctitleTopMargin = conversion(item.ctitleTopMargin)
              item.ctitleFontSize = conversion(item.ctitleFontSize)
              item.qrcodeLength = conversion(item.qrcodeLength)
              item.qrcodeLeftMargin = conversion(item.qrcodeLeftMargin)
              item.qrcodeTopMargin = conversion(item.qrcodeTopMargin)
            }
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
