<template>
  <section class="ofa-main-wrap" v-loading="loading">
    <el-tabs v-model="activeType" type="card" @tab-click="handleClick" class="pad-length">
      <el-tab-pane :label="tab1" :name="tab1">
        <!--母版列表-->
        <div class="content">
          <div class="search-bar">
            <el-button type="primary" size="small" class="fr" @click="edit(0)">新建母版</el-button>
            <template>
              <el-form :inline="true" :model="parentEditionSearchForm" class="demo-form-inline" size="mini">
                <el-form-item>
                  <el-select v-model="parentEditionSearchForm.selectType" class="iptl w150">
                    <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="parentEditionSearchForm.searchValue" class="iptr"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="parentEditionSearchForm.status" class="w150">
                    <el-option v-for="item in parentEditionStateOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-button type="primary" @click="getParentEditionList" size="small">查询</el-button>
              </el-form>
            </template>
          </div>
          <div class="tabel-wrap">
            <template>
              <el-table :data="parentEditionList">
                <el-table-column prop="parentEditionId" label="母版ID" ></el-table-column>
                <el-table-column prop="parentEditionTitle" sortable label="母版标题"></el-table-column>
                <el-table-column prop="money" sortable label="面额" ></el-table-column>
                <el-table-column prop="effectiveDate" sortable label="有效期" width="250" ></el-table-column>
                <el-table-column prop="status" sortable label="状态" ></el-table-column>
                <el-table-column  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="edit(scope.row.parentEditionId)">编辑</el-button> 
                    <el-button type="text" size="mini" @click="copy(scope.row)">复制</el-button>
                    <el-button type="text" size="mini" @click="changeStatus(scope.row.id, scope.row.status)">{{scope.row.status == 1 ? '下线' : '上线'}}</el-button> 
                    <el-button type="text" size="mini" @click="deleteRow(scope.row)">删除</el-button> 
                  </template>
                </el-table-column>
              </el-table>
            </template>        
          </div>
          <div class="page-control">
            <el-pagination background :page-size="pageOption.pageSize" :current-page.sync="parentEditionSearchForm.pageNum" @current-change="getParentEditionList" layout="total, prev, pager, next" :total="totalSize"></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="tab2" :name="tab2">
        <!--已发券列表-->
        <div class="content">
          <div class="search-bar">
            <template>
              <el-form :inline="true" :model="voucherSearchForm" class="demo-form-inline" size="mini">
                <el-form-item>
                  <el-select v-model="voucherSearchForm.selectType1" class="iptl w150">
                    <el-option v-for="item in searchOptions1" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="voucherSearchForm.searchValue1" class="iptr"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="voucherSearchForm.selectType2" class="iptl w150">
                    <el-option v-for="item in searchOptions2" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-date-picker v-if="voucherSearchForm.selectType2 == 'date'" v-model="voucherSearchForm.searchValue2" type="datetime"
                  placeholder="选择日期时间">
                  </el-date-picker>
                  <el-date-picker v-else v-model="voucherSearchForm.searchValue2" type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期" @change="changeDate">
                  </el-date-picker>
                  <!-- <el-input v-model="voucherSearchForm.searchValue2" class="iptr"></el-input> -->
                </el-form-item>
                <el-form-item>
                  <el-select v-model="voucherSearchForm.status" class="w150">
                    <el-option v-for="item in parentEditionStateOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="voucherSearchForm.orderId" class="iptr" placeholder="订单ID"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="voucherSearchForm.activityId" class="iptr" placeholder="活动ID"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="voucherSearchForm.userId" class="iptr" placeholder="用户ID"></el-input>
                </el-form-item>
                <el-button type="primary" @click="getVoucherList" size="small">查询</el-button>
              </el-form>
            </template>
          </div>
          <div class="tabel-wrap">
            <template>
              <el-table :data="voucherList">
                <el-table-column prop="coupon" sortable label="优惠券ID" ></el-table-column>
                <el-table-column prop="receiveTime" sortable label="领取时间"></el-table-column>
                <el-table-column prop="parentEditionId" sortable label="母版ID" ></el-table-column>
                <el-table-column prop="parentEditionTitle" sortable label="母版标题"></el-table-column>
                <el-table-column prop="money" sortable label="面额" ></el-table-column>
                <el-table-column prop="effectiveDate" sortable label="有效期" ></el-table-column>
                <el-table-column prop="activityId" sortable label="活动ID"></el-table-column>
                <el-table-column prop="userId" sortable label="用户ID" ></el-table-column>
                <el-table-column prop="useTime" sortable label="使用时间"></el-table-column>
                <el-table-column prop="orderId" sortable label="订单ID" ></el-table-column>
                <el-table-column prop="status" sortable label="状态" ></el-table-column>
              </el-table>
            </template>        
          </div>
          <div class="page-control">
            <el-pagination background :page-size="pageOption1.pageSize" :current-page.sync="voucherSearchForm.pageNum" @current-change="getVoucherList" layout="total, prev, pager, next" :total="totalSize1"></el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="删除" width="25%" :visible.sync="dialogDeleteParentEdition">
        <div class="deleteMsg">确定删除母版：<span>{{ deleteTitle }}</span>？</div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogDeleteParentEdition = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="queryDeleteParentEdition">确 定</el-button>
        </span>
    </el-dialog>
  </section>
</template>

<script>
import { formatToMs } from "../../../utils/dateUtils";
import { parentEditionList, voucherList } from "@/api/index";
import qs from "qs";
export default {
  data() {
    return {
      loading: false,
      deleteTitle: "",
      dialogDeleteParentEdition: false,
      parentEditionSearchForm: {
        selectType: "title",
        searchValue: null,
        id: null,
        title: null,
        status: "",
        pageNum: 1,
        pageSize: null
      },
      voucherSearchForm: {
        selectType1: "title",
        selectType2: "date",
        searchValue1: null,
        searchValue2: null,
        orderId: "",
        activityId: "",
        userId: "",
        id: null,
        title: null,
        status: "",
        pageNum: 1,
        pageSize: null,
        satrtTime:'',
        endTime: ''
      },
      parentEditionStateOptions: [
        //母版状态|待上线|已上线|已下线
        {
          value: "",
          label: "状态"
        },
        {
          value: 0,
          label: "待上线"
        },
        {
          value: 1,
          label: "已上线"
        },
        {
          value: 2,
          label: "已下线"
        }
      ],
      searchOptions: [
        {
          value: "title",
          label: "母版标题"
        },
        {
          value: "id",
          label: "母版ID"
        }
      ],
      searchOptions1: [
        {
          value: "title",
          label: "母版标题"
        },
        {
          value: "id",
          label: "母版ID"
        }
      ],
      searchOptions2: [
        {
          value: "date",
          label: "领取时间"
        },
        {
          value: "dateGroup",
          label: "使用时间周期"
        }
      ],
      activeType: "母版",
      tab1: "母版",
      tab2: "已发券",
      tabId: "0",
      tabList: [
        {
          id: 0,
          name: "母版"
        },
        {
          id: 1,
          name: "已发券"
        }
      ],
      pageOption: {
        pageNum: 1,
        pageSize: 20
      },
      pageOption1: {
        pageNum: 1,
        pageSize: 20
      },
      totalSize: 0,
      totalSize1: 0,
      parentEditionList: [],
      voucherList: []
    };
  },
  created() {
    this.getParentEditionList();
  },
  watch: {},
  methods: {
    changeDate() {
      this.voucherSearchForm.satrtTime = this.voucherSearchForm.searchValue2 ? formatToMs(this.voucherSearchForm.searchValue2[0]) : '';
      this.voucherSearchForm.endTime = this.voucherSearchForm.searchValue2 ? formatToMs(this.voucherSearchForm.searchValue2[1]) : '';
      console.log(this.voucherSearchForm.satrtTime, this.voucherSearchForm.endTime)
    },
    //获取母版列表
    getParentEditionList() {
      parentEditionList(this.parentEditionSearchForm)
        .then(res => {
          if (res.success) {
            this.parentEditionList = res.data.content;
            this.totalSize = res.data.totalElements;
          } else {
            let msg = res.data.desc || "请求失败";
            this.$message.error(msg);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //获取已发券列表
    getVoucherList() {
      voucherList(this.voucherSearchForm)
        .then(res => {
          if (res.success) {
            this.voucherList = res.data.content;
            this.totalSize1 = res.data.totalElements;
          } else {
            let msg = res.data.desc || "请求失败";
            this.$message.error(msg);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 切换tab
    handleClick(tab, event) {
      if (this.tabList[tab.index].id == this.tabId) {
        return;
      }
      this.tabId = this.tabList[tab.index].id;
      if (this.tabId == 0) {
        // 获取母版列表
        this.getParentEditionList();
      } else {
        this.getVoucherList();
      }
    },
    //编辑母版
    edit(id) {
      this.$router.push({
        path: 'editMaster',
        params: {
          id: id
        }
      });
    },
    //复制母版
    copy() {
      console.log("copy");
    },
    //改变状态
    changeStatus() {
      console.log("change");
    },
    //删除母版
    deleteRow(row) {
      this.deleteTitle = row.parentEditionTitle;
      this.dialogDeleteParentEdition = true;
    },
    //确认删除母版
    queryDeleteParentEdition() {
      console.log("queryDeleteParentEdition");
    }
  }
};
</script>
<style lang="less" scoped>
.ofa-main-wrap {
  width: 100%;
  .page-control {
    float: right;
    margin-top: 20px;
    &:after {
      clear: both;
    }
  }
}
.search-bar {
  margin-top: 20px;
}
.deleteMsg {
  text-align: center;
}
</style>