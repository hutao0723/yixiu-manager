<template>
  <section class="ofa-main-wrap" v-loading="loading">
    <el-tabs v-model="activeType" type="card" @tab-click="handleClick" class="pad-length">
      <el-tab-pane :label="tab1" :name="tab1">
        <!--发券活动列表-->
        <div class="content">
          <div class="search-bar">
            <el-button type="primary" size="small" class="fr" @click="edit(0)">新建活动</el-button>
            <template>
              <el-form :inline="true" :model="voucherActivitiesSearchForm" class="demo-form-inline" size="mini">
                <el-form-item>
                  <el-select v-model="voucherActivitiesSearchForm.selectType1" class="iptl w150">
                    <el-option v-for="item in searchOptions1" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="voucherActivitiesSearchForm.searchValue1" class="iptr"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="voucherActivitiesSearchForm.status" class="w150">
                    <el-option v-for="item in voucherActivitiesStateOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="voucherActivitiesSearchForm.selectType" class="iptl w150">
                    <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="voucherActivitiesSearchForm.searchValue" class="iptr"></el-input>
                </el-form-item>
                <el-button type="primary" @click="getVoucherActivitiesList" size="small">查询</el-button>
              </el-form>
            </template> 
          </div>
          <div class="tabel-wrap">
            <template>
              <el-table :data="voucherActivitiesList">
                <el-table-column prop="activityId" label="活动ID" ></el-table-column>
                <el-table-column prop="outCode" sortable label="外码"></el-table-column>
                <el-table-column prop="activityTitle" sortable label="活动标题" ></el-table-column>
                <el-table-column prop="status" sortable label="状态" ></el-table-column>
                <el-table-column  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="edit(scope.row.activityId)">编辑</el-button> 
                    <el-button type="text" size="mini" @click="copy(scope.row)">复制</el-button>
                    <el-button type="text" size="mini" @click="changeStatus(scope.row.id, scope.row.status)">{{scope.row.status == 1 ? '下线' : '上线'}}</el-button> 
                    <el-button type="text" size="mini" @click="deleteRow(scope.row)">删除</el-button> 
                  </template>
                </el-table-column>
              </el-table>
            </template>        
          </div>
          <div class="page-control">
            <el-pagination background :page-size="pageOption.pageSize" :current-page.sync="voucherActivitiesSearchForm.pageNum" @current-change="getVoucherActivitiesList" layout="total, prev, pager, next" :total="totalSize"></el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="删除" width="25%" :visible.sync="dialogDeleteVoucherActivities">
        <div class="deleteMsg">确定删除母版：<span>{{ deleteTitle }}</span>？</div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogDeleteVoucherActivities = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="queryDeleteVoucherActivities">确 定</el-button>
        </span>
    </el-dialog>
  </section>
</template>

<script>
import { formatDateNew } from "../../../utils/dateUtils";
import { voucherActivitiesList } from "@/api/index";
import qs from "qs";
export default {
  data() {
    return {
      loading: false,
      deleteTitle: "",
      dialogDeleteVoucherActivities: false,
      voucherActivitiesSearchForm: {
        selectType: "title",
        selectType1: "title",
        searchValue: null,
        searchValue1: null,
        id: null,
        title: null,
        id1: null,
        title1: null,
        status: "",
        pageNum: 1,
        pageSize: null
      },
      voucherActivitiesStateOptions: [
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
          label: "活动标题"
        },
        {
          value: "id",
          label: "活动ID"
        }
      ],
      activeType: "弹层领券",
      tab1: "弹层领券",
      tabId: "0",
      tabList: [
        {
          id: 0,
          name: "弹层领券"
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
      voucherActivitiesList: [],
      voucherList: []
    };
  },
  created() {
    this.getVoucherActivitiesList();
  },
  watch: {},
  methods: {
    //获取母版列表
    getVoucherActivitiesList() {
      voucherActivitiesList(this.voucherActivitiesSearchForm)
        .then(res => {
          if (res.success) {
            this.voucherActivitiesList = res.data.content;
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
    // 切换tab
    handleClick(tab, event) {
      if (this.tabList[tab.index].id == this.tabId) {
        return;
      }
      this.tabId = this.tabList[tab.index].id;
      if (this.tabId == 0) {
        // 获取活动列表
        this.getVoucherActivitiesList();
      }
    },
    //编辑活动
    edit(id) {
      console.log(id);
      this.$router.push({
        path: 'addActivity',
        params: {
          id: id
        }
      });
    },
    //复制活动
    copy() {
      console.log("copy");
    },
    //改变状态
    changeStatus() {
      console.log("change");
    },
    //删除活动
    deleteRow(row) {
      this.deleteTitle = row.activityTitle;
      this.dialogDeleteVoucherActivities = true;
    },
    //确认删除活动
    queryDeleteVoucherActivities() {
      console.log("queryDeleteVoucherActivities");
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