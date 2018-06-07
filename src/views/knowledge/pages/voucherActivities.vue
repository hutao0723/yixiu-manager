<template>
  <section class="ofa-main-wrap" v-loading="loading">
    <el-tabs v-model="activeType" type="card" @tab-click="handleClick" class="pad-length">
      <el-tab-pane :label="tab1" :name="tab1">
        <!--发券活动列表-->
        <div class="content">
          <div class="search-bar">
            <router-link :to="{ path: '/manager/knowledge/addActivity/new' }"> 
            <el-button type="primary" size="small" class="fr">新建活动</el-button>
            </router-link>
            <template>
              <el-form :inline="true" :model="voucherActivitiesSearchForm" class="demo-form-inline" size="mini">
                <el-form-item>
                  <el-select v-model="selectType1" class="iptl w150">
                    <el-option v-for="item in searchOptions1" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="activityValue1" class="iptr"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="voucherActivitiesSearchForm.activityStatus" class="w150">
                    <el-option v-for="item in voucherActivitiesStateOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="selectType2" class="iptl w150">
                    <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="activityValue2" class="iptr"></el-input>
                </el-form-item>
                <el-button type="primary" @click="getVoucherActivitiesList" size="small">查询</el-button>
              </el-form>
            </template> 
          </div>
          <div class="tabel-wrap">
            <template>
              <el-table :data="voucherActivitiesList">
                <el-table-column prop="id" label="活动ID" ></el-table-column>
                <el-table-column prop="activityId" sortable label="外码"></el-table-column>
                <el-table-column prop="title" sortable label="活动标题" ></el-table-column>
                <el-table-column prop="activityStatus" sortable label="状态" :formatter="getStatus"></el-table-column>
                <el-table-column  label="操作">
                  <template slot-scope="scope">
                    <router-link :to="{ path: '/manager/knowledge/addActivity/' + scope.row.id }">
                    <el-button type="text" size="mini" :style="{ marginRight: '10px' }">编辑</el-button>
                    </router-link>
                    <el-button type="text" size="mini" @click="copy(scope.row.id)">复制</el-button>
                    <el-button type="text" size="mini" @click="changeStatus(scope.row.id, scope.row.activityStatus)">{{scope.row.activityStatus == 1 ? '下线' : '上线'}}</el-button> 
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
        <div class="deleteMsg">确定删除活动：<span>{{ deleteTitle }}</span>？</div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogDeleteVoucherActivities = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="queryDeleteVoucherActivities">确 定</el-button>
        </span>
    </el-dialog>
  </section>
</template>

<script>
import { formatDateNew } from "../../../utils/dateUtils";
import { voucherActivitiesList, copyActivity, updateStatusActivity, deleteActivity } from "@/api/index";
import qs from "qs";
export default {
  data() {
    return {
      deleteID: null,
      activityValue1: '',
      activityValue2: '',
      selectType1: 'title',
      selectType2: 'couponTemplateTitle',
      loading: false,
      deleteTitle: "",
      dialogDeleteVoucherActivities: false,
      voucherActivitiesSearchForm: {
        id: null,
        title: null,
        couponTemplateId: null,
        couponTemplateTitle: null,
        activityStatus: "",
        pageNum: 1,
        pageSize: 20,
        columns: null,
        order: null
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
          value: -1,
          label: "已下线"
        }
      ],
      searchOptions: [
        {
          value: "couponTemplateTitle",
          label: "母版标题"
        },
        {
          value: "couponTemplateId",
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
    getStatus(row, column) {
      switch (row.activityStatus) {
        case '':
          return '状态';
        case 0:
          return '待上线';
        case 1:
          return '已上线';
        case -1:
          return '已下线';
      }
    },
    //获取活动列表
    getVoucherActivitiesList() {
      this.loading = true;
      if (this.selectType1 == 'title') {
        this.voucherActivitiesSearchForm.title = this.activityValue1;
        this.voucherActivitiesSearchForm.id = '';
      } else if (this.selectType1 == 'id') {
        this.voucherActivitiesSearchForm.title = '';
        this.voucherActivitiesSearchForm.id = this.activityValue1;
      }
      if (this.selectType2 == 'couponTemplateTitle') {
        this.voucherActivitiesSearchForm.couponTemplateTitle = this.activityValue2;
        this.voucherActivitiesSearchForm.couponTemplateId = '';
      } else if (this.selectType2 == 'couponTemplateId') {
        this.voucherActivitiesSearchForm.couponTemplateTitle = '';
        this.voucherActivitiesSearchForm.couponTemplateId = this.activityValue2;
      }
      console.log(this.voucherActivitiesSearchForm)
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
    //复制活动
    copy(id) {
      console.log("copy");
      let params = {
        id: id
      }
      copyActivity(params)
      .then(res => {
        if (res.success) {
          let msg = res.data.desc || "复制成功";
          this.$message.success(msg);
          this.getVoucherActivitiesList();
        } else {
          let msg = res.data.desc || "复制失败";
          this.$message.error(msg);
        }
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
    },
    //改变状态
    changeStatus(id, status) {
      if (status == 1) {
        status = -1;
      } else {
        status = 1;
      }
      let params = {
        id: id,
        activityStatus: status
      }
      updateStatusActivity(params)
      .then(res => {
        if (res.success) {
          let msg = res.data.desc || "修改状态成功";
          this.$message.success(msg);
          this.getVoucherActivitiesList();
        } else {
          let msg = res.data.desc || "修改状态失败";
          this.$message.error(msg);
        }
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
    },
    //删除活动
    deleteRow(row) {
      this.deleteTitle = row.title;
      this.deleteID = row.id;
      this.dialogDeleteVoucherActivities = true;
    },
    //确认删除活动
    queryDeleteVoucherActivities() {
      let params = {
        id: this.deleteID
      }
      deleteActivity(params)
      .then(res => {
        if (res.success) {
          this.dialogDeleteVoucherActivities = false;
          let msg = res.data.desc || "删除母版成功";
          this.$message.success(msg);
          this.getVoucherActivitiesList();
        } else {
          let msg = res.data.desc || "删除母版失败";
          this.$message.error(msg);
        }
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
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