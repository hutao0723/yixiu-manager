<template>
    <section class="ofa-main-wrap" v-loading="loading">
        <div class="title-wrap">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <span>
                        <button class="goToDistribute" :style="{ 'border': 0, 'backgroundColor': 'white', 'font-size': '100%', 'margin': 0, 'padding': 0, 'color': '#606266', 'cursor': 'pointer' }" @click="goToDistribute">分销&nbsp;>&nbsp;分销人员</button>
                        &nbsp;>&nbsp;详情
                    </span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-main>
            <div class="header">
                <el-row class="row">
                    <el-col :span="8">
                        <div class="nickName">
                            昵称/头像：{{ this.distributorMsg.nickName }}
                        </div>
                        <div v-if="this.distributorMsg.headImgurl" class="img-box por nickImg" :style="{ backgroundImage: 'url('+ this.distributorMsg.headImgurl +')', backgroundSize: 'contain', backgroundPosition: 'center' }"></div>
                        <div v-else class="img-box por nickImg" :style="{ backgroundImage: 'url(//yun.dui88.com/yoofans/images/201804/noClassImg.png)',    backgroundSize: 'contain', backgroundPosition: 'center' }"></div>
                    </el-col>
                    <el-col :span="8">累计分销笔数：{{ this.distributorMsg.totalDistributeNum }}</el-col>
                </el-row>
                <el-row class="row">
                    <el-col :span="8">加入日期：{{ this.distributorMsg.gmtCreate }}</el-col>
                    <el-col :span="8">累计分销金额：¥{{ this.distributorMsg.totalTradeMoney/100 }}</el-col>
                </el-row>
            </div>
            <div class="footer">
                <el-tabs v-model="distributorType" type="card" @tab-click="handleClickDistribute" class="pad-length">
                    <el-tab-pane :label="tab1" :name="tab1">
                        
                    </el-tab-pane>
                    <el-tab-pane :label="tab2" :name="tab2">
                        
                    </el-tab-pane>
                    <div class="tabel-wrap">
                            <template>
                                <el-table :data="bindingList">
                                    <el-table-column prop="id" label="用户ID" ></el-table-column>
                                    <el-table-column label="用户信息" width="350">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.headImgurl" class="img-box por" :style="{ backgroundImage: 'url('+ scope.row.headImgurl +')', backgroundSize: 'contain', backgroundPosition: 'center' }"></div>
                                        <div v-else class="img-box por" :style="{ backgroundImage: 'url(//yun.dui88.com/yoofans/images/201804/noClassImg.png)',    backgroundSize: 'contain', backgroundPosition: 'center' }"></div>
                                        <span v-text="scope.row.nickName" class="goods-word"></span>
                                    </template>
                                    </el-table-column>
                                    <el-table-column prop="totalTradeNum" sortable label="累计购买笔数" width="200"></el-table-column>
                                    <el-table-column prop="totalTradeMoney" sortable label="累计购买金额" width="200">
                                      <template slot-scope="scope">
                                        {{scope.row.totalTradeMoney / 100}}
                                      </template>
                                    </el-table-column>
                                    <el-table-column prop="bindTime" sortable label="最新绑定时间" width="200"></el-table-column>
                                    <el-table-column prop="remainingBindTime" sortable label="剩余绑定时间(小时)" width="200"></el-table-column>
                                </el-table>
                            </template>
                        </div>
                    <div class="page-control">
                        <el-pagination background  :page-size="pageOption.pageSize" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="total, prev, pager, next" :total="this.totalSize">
                        </el-pagination>
                    </div>
                </el-tabs>
            </div>
        </el-main>
    </section>
</template>
<script>
export default {
  data() {
    return {
      distributorMsg: {
        nickName: "",
        headImgurl: "",
        totalDistributeNum: "",
        totalTradeMoney: "",
        gmtCreate: ""
      },
      loading: false,
      distributorType: "绑定中",
      tab1: "绑定中",
      tab2: "已解绑",
      tabId: 1,
      tabList: [
        {
          id: 1,
          name: "绑定中"
        },
        {
          id: 0,
          name: "已解绑"
        }
      ],
      bindingList: [],
      beBindedList: [],
      pageOption: {
        pageNum: 1,
        pageSize: 20
      },
      totalSize: 0
    };
  },
  // created() {
  //   this.getUserDistribution(this.tabId);
  // },
  methods: {
    init() {
      this.getUserDistribution(this.tabId);
      let { userId } = this.$route.params;
      this.$http
        .get("/distributor/get?id=" + userId)
        .then(
          res => {
            let resp = res.data;
            if (resp.success) {
              this.distributorMsg = resp.data;
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
    //切换tab
    handleClickDistribute(tab, event) {
      if (this.tabList[tab.index].id == this.tabId) {
        return;
      }
      this.tabId = this.tabList[tab.index].id;
      this.getUserDistribution(this.tabId);
      //   if (this.tabId == 1) {
      //     this.getUserDistribution(1);
      //   }
      //   this.getUserDistribution(0);
    },
    goToDistribute() {
      this.$router.push({ name: "distribute" });
    },
    // 获取全部内容列表
    getUserDistribution(type) {
      let consumerId = sessionStorage.getItem('consumerId');
      let params = {
        superiorId: consumerId,
        pageNum: this.pageOption.pageNum,
        pageSize: this.pageOption.pageSize,
        distributionType: "USER",
        bindStatus: type
      };
      this.$http
        .get("/distributor/userDistribution/pageList", { params: params })
        .then(
          res => {
            let resp = res.data;
            if (resp.success) {
              this.bindingList = resp.data.content;
              // 算出有多少条数据
              this.totalSize = resp.data.totalElements;
            } else {
              this.pageOption.pageNum = 1;
              let msg = resp.desc || "请求失败";
              this.$message.error(msg);
            }
          },
          () => {
            this.$message.error("网络错误");
          }
        );
    },
    //分页请求
    pageChange(page) {
      this.pageOption.pageNum = page;
      this.getUserDistribution(this.tabId);
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="less" scoped>
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
.header {
  border: 1px solid #e4e7ed;
  padding: 30px;
  .row {
    margin-top: 15px;
  }
}
.footer {
  .pad-length {
    margin-top: 20px;
  }
}
.img-box {
  overflow: hidden;
  width: 75px;
  height: 75px;
  display: inline-block;
  float: left;
  background-repeat: no-repeat;
}
.por {
  position: relative;
}
.goods-word {
  margin-left: 10px;
  line-height: 75px;
}
.page-control {
  float: right;
  margin-top: 20px;
  &:after {
    clear: both;
  }
}
.nickName {
  float: left;
}
.nickImg {
  overflow: hidden;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: inline-block;
  float: left;
  background-repeat: no-repeat;
  top: -20px;
  left: 20px;
}
</style>
