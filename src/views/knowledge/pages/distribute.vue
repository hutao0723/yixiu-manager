<template>
  <section class="distributor-box">
    <el-tabs v-model="activeType" type="card" @tab-click="handleClick" class="pad-length">
      <el-tab-pane :label="tab1" :name="tab1">
        <!--分销人员列表-->
        <div class="content">
          <div class="search-bar">
              <template>
                <el-form :inline="true" :model="distributorForm" class="demo-form-inline" size="mini">
                  <el-form-item>
                    <el-input v-model="distributorForm.username" placeholder="用户昵称"></el-input>
                  </el-form-item>
                  <el-form-item label="创建时间">
                      <el-date-picker  v-model="distributorForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                      </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary"  @click="onSearch">查询</el-button>
                  </el-form-item>
                </el-form>
              </template>
          </div>
          <div class="tabel-wrap">
            <template>
              <el-table :data="distributorList" style="width: 100%" @sort-change="sortTable">
                <el-table-column prop="id" label="用户ID" width="100"></el-table-column>
                <el-table-column label="用户信息" width="350">
                  <template slot-scope="scope">
                    <div v-if="scope.row.headImgurl" class="img-box por" :style="{ backgroundImage: 'url('+ scope.row.headImgurl +')', backgroundSize: 'contain', backgroundPosition: 'center' }"></div>
                    <div v-else class="img-box por" :style="{ backgroundImage: 'url(//yun.dui88.com/yoofans/images/201804/noClassImg.png)',    backgroundSize: 'contain', backgroundPosition: 'center' }"></div>
                    <span v-text="scope.row.nickName" class="goods-word"></span>
                  </template>
                </el-table-column>
                <el-table-column prop="totalDistributeNum" sortable="custom" label="累计分销笔数" width="200"></el-table-column>
                <el-table-column prop="totalTradeMoney" sortable="custom" label="累计分销金额" width="200">
                  <template slot-scope="scope">
                    {{scope.row.totalTradeMoney / 100}}
                  </template>
                </el-table-column>
                <el-table-column prop="bindUsers" sortable="custom" label="绑定用户数" width="200"></el-table-column>
                <el-table-column prop="gmtCreate" sortable="custom" label="加入日期" width="300"></el-table-column>
                <el-table-column  label="操作">
                  <template slot-scope="scope">
                  <router-link :to="{ path: '/manager/knowledge/editdistributor/' + scope.row.id}">
                    <el-button type="text" size="mini" @click="gotoDetails(scope.row)">详情</el-button>
                  </router-link>   
                  </template>
                </el-table-column>
              </el-table>
            </template>        
          </div>    
        </div>
      </el-tab-pane>
      <el-tab-pane :label="tab2" :name="tab2">
        <!--设置-->
        <div class="content">
          <div>
            <el-tabs v-model="activeSettingsType" type="card" @tab-click="handleClickSettings" class="pad-length">
              <el-tab-pane :label="childTab1" :name="childTab1">
                <Poster :posterMsg="posterMsg" @queryPoster="queryPoster" @get-poster-list="getPosterList"></Poster>
              </el-tab-pane>
              <!-- <el-tab-pane :label="childTab2" :name="childTab2"> -->
                <!-- <div class="table-wrap">
                  <div class="detail" v-show="this.goodsGroupDetail.id">
                    <span>商品组ID：</span>
                    <span>{{ this.goodsGroupDetail.id }}</span>
                  </div>
                  <div class="detail" v-show="this.goodsGroupDetail.goodsGroupName">
                    <span>分组标题：</span>
                    <span>{{ this.goodsGroupDetail.goodsGroupName }}</span>
                  </div>
                  <div class="detail" v-show="this.goodsGroupDetail.goodsNum">
                    <span>商品数：</span>
                    <el-button type="text" size="mini" class="detailBtn" @click="goToGoodsGroup">{{ this.goodsGroupDetail.goodsNum }}</el-button>
                  </div>
                  <div class="detail" v-show="this.goodsGroupDetail.gmtCreate">
                    <span>创建时间：</span>
                    <span>{{ this.goodsGroupDetail.gmtCreate }}</span>
                  </div>
                  <div class="detail">
                    <span>操作：</span>
                    <el-button type="text" size="mini" class="detailBtn" @click="changeGoodsGroup()">更换分销商品组</el-button>
                  </div>
                </div> -->
              <!-- </el-tab-pane> -->
            </el-tabs>
          </div>
        </div>
      </el-tab-pane>
      <div v-if="this.tabId !== 1" class="page-control">
        <el-pagination background  :page-size="pageOption.pageSize" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="total, prev, pager, next" :total="totalSize"></el-pagination>
      </div>
    </el-tabs>
    <el-dialog title="商品组" :visible.sync="dialogGoods">
      <div class="tar">
        <el-input placeholder="商品组标题" size="small" class="w150 vam" v-model="goodsTitle"></el-input>
        <el-button size="small" type="primary" @click="getGoodsList">查询</el-button>
      </div>
      <el-table :data="appList" highlight-current-row style="width: 100%"  class="none-hover" @row-click="selectRow">
        <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
        <el-table-column prop="goodsGroupName" label="商品组标题">
        </el-table-column>
      </el-table>
      <div class="page-control">
        <el-pagination background :page-size="dialogPageOption.pageSize" :current-page.sync="dialogPageOption.pageNum" @current-change="changePageAppList" layout="total, prev, pager, next"
          :total="dialogTotalSize"></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogGoods = false" size="small">取 消</el-button>
        <el-button @click="primaryBtn" type="primary" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { formatDateNew } from "../../../utils/dateUtils";
import Poster from "../components/poster";
import qs from "qs";
export default {
  data() {
    return {
      selectId: null,
      appList: [],
      goodsTitle: "",
      dialogGoods: false,
      formLabelWidth: "100px",
      activeType: "分销人员",
      activeSettingsType: "公共海报",
      tab1: "分销人员",
      tab2: "设置",
      childTab1: "公共海报",
      childTab2: "分销商品组",
      tabId: "0",
      posterMsg: [],
      tabSettingsId: "0",
      goodsGroupDetail: {
        id: "",
        goodsGroupName: "",
        goodsNum: "",
        gmtCreate: ""
      },
      tabList: [
        {
          id: 0,
          name: "分销人员"
        },
        {
          id: 1,
          name: "设置"
        }
      ],
      tabSettingsList: [
        {
          id: 0,
          name: "公共海报"
        },
        {
          id: 1,
          name: "分销商品组"
        }
      ],
      distributorForm: {
        username: "",
        time: ""
      },
      startTime: "",
      endTime: "",
      pageOption: {
        pageNum: 1,
        pageSize: 20
      },
      columns: null,
      order: null,
      dialogPageOption: {
        pageNum: 1,
        pageSize: 20
      },
      totalSize: 0,
      dialogTotalSize: 0,
      distributorList: [],
      voucherList: []
    };
  },
  created() {
    this.getdistributor();
  },
  watch: {},
  methods: {
    sortTable(row) {
      this.columns = row.prop;
      if (row.order == 'ascending') {
        this.order = 'asc';
      } else {
        this.order = 'desc';
      }
      this.getdistributor();
    },
    getPosterList() {
      this.getPublicPoster();
    },
    // 切换tab
    handleClick(tab, event) {
      if (this.tabList[tab.index].id == this.tabId) {
        return;
      }
      this.tabId = this.tabList[tab.index].id;
      if (this.tabId == 0) {
        // 获取分销人员列表
        this.getdistributor();
      }
      this.getPublicPoster();
    },
    handleClickSettings(tab, event) {
      if (this.tabSettingsList[tab.index].id == this.tabSettingsId) {
        return;
      }
      this.tabSettingsId = this.tabSettingsList[tab.index].id;
      if (this.tabSettingsId == 0) {
        this.getPublicPoster();
      } else if (this.tabSettingsId == 1) {
        // this.getDistributionGoodsGroup();
      }
    },
    //更换分销商品组
    changeGoodsGroup() {
      this.getGoodsList();
      this.dialogGoods = true;
    },
    queryPoster() {
      this.getPublicPoster();
    },
    primaryBtn() {
      let params = {
        id: this.selectId
      };
      this.$http
        .post("/goodsGroup/setDistributionGoodsGroup", params)
        .then(res => {
          let resp = res.data;
          if (resp.success === true) {
            let msg = resp.desc || "更换分销商品组成功";
            this.dialogGoods = false;
            this.$message.success(msg);
            this.getDistributionGoodsGroup();
          } else {
            this.dialogGoods = false;
            let msg = resp.desc || "请求失败";
            this.$message.error(msg);
          }
        });
    },
    //查询商品组列表
    getGoodsList() {
      let params = {
        goodsGroupName: this.goodsTitle ? this.goodsTitle : "",
        pageNum: this.dialogPageOption.pageNum,
        pageSize: this.dialogPageOption.pageSize
      };
      this.$http.get("/goodsGroup/list", { params: params }).then(
        res => {
          let resp = res.data;
          if (resp.success) {
            this.appList = resp.data.lists;
            this.dialogTotalSize = resp.data.totalSize;
          } else {
            this.dialogPageOption.pageNum = 1;
            let msg = resp.desc || "请求失败";
            this.$message.error(msg);
          }
        },
        () => {
          this.$message.error("网络错误");
        }
      );
    },
    gotoDetails(row) {
      sessionStorage.setItem('consumerId', row.consumerId);
    },
    changePageAppList(page) {
      this.dialogPageOption.pageNum = page;
      this.getGoodsList();
    },
    selectRow(row) {
      this.selectId = row.id;
    },
    //查询分销商品组信息
    getDistributionGoodsGroup() {
      this.$http.get("/goodsGroup/getDistributionGoodsGroup").then(
        res => {
          let resp = res.data;
          if (resp.success === true) {
            this.goodsGroupDetail = res.data.data;
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
    //查询公共海报列表
    getPublicPoster() {
      let params = {
        itemId: 0,
        itemType: 0
      }

      let conversion = function (number) {
        return Math.round(number *(750/510))
      };

      this.$http.get("/poster/findItemPosters", {params: params}).then(
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
    //点击商品数跳转到商品数页面
    goToGoodsGroup() {
      this.$router.push({
        path: "/manager/knowledge/goodsNumber/" + this.goodsGroupDetail.id
      });
    },
    // 获取全部内容列表
    getdistributor() {
      let valueArr = Object.values(this.distributorForm);
      this.startTime = this.distributorForm.time
        ? formatDateNew(this.distributorForm.time[0])
        : "";
      this.endTime = this.distributorForm.time
        ? formatDateNew(this.distributorForm.time[1])
        : "";
      let params = {
        nickName: valueArr[0],
        pageNum: this.pageOption.pageNum,
        pageSize: this.pageOption.pageSize,
        createTimeStart: this.startTime,
        createTimeEnd: this.endTime,
        order: this.order,
        columns: this.columns
      };
      this.$http.get("/distributor/pageList", { params: params }).then(
        res => {
          let resp = res.data;
          if (resp.success) {
            this.distributorList = resp.data.content;
            // 算出有多少条数据
            this.totalSize = resp.data.totalElements;
            this.order = null;
            this.columns = null;
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
    // 分页请求
    pageChange(page) {
      this.pageOption.pageNum = page;
      this.getdistributor();
    },
    onSearch() {
      this.pageOption.pageNum = 1;
      this.getdistributor();
    }
  },
  components: {
    Poster
  }
};
</script>
<style lang="less" scoped>
.img-box {
  overflow: hidden;
  width: 55px;
  height: 55px;
  display: inline-block;
  float: left;
  background-repeat: no-repeat;
}
.por {
  position: relative;
}
.goods-word {
  margin-left: 10px;
  line-height: 55px;
}
.distributor-box {
  width: 100%;
  .search-bar {
    margin-top: 20px;
    margin-bottom: 30px;
  }
  .page-control {
    float: right;
    margin-top: 20px;
    &:after {
      clear: both;
    }
  }
}
.table-wrap {
  margin-top: 20px;
  margin-left: 50px;
  font-size: 14px;
  .detail {
    margin-top: 20px;
  }
}
.detailBtn {
  font-size: 100%;
}
</style>
<style>
.el-table .cell {
  display: flex;
}
.el-table .cell span {
  flex: 1;
}
</style>
