<template>
  <section class="ofa-main-wrap" v-loading="loading">
    <el-tabs v-model="activeType" type="card" @tab-click="handleClick" class="pad-length">
      <el-tab-pane :label="tab1" :name="tab1">
        <!--母版列表-->
        <div class="content">
          <div class="search-bar">
            <router-link :to="{ path: '/manager/knowledge/editMaster/new' }">
            <el-button type="primary" size="small" class="fr">新建母版</el-button>
            </router-link>
            <template>
              <el-form :inline="true" :model="parentEditionSearchForm" class="demo-form-inline" size="mini">
                <el-form-item>
                  <el-select v-model="selectType" class="iptl w150">
                    <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="templateValue" class="iptr"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="parentEditionSearchForm.status" class="w150">
                    <el-option v-for="item in parentEditionStateOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-button type="primary" @click="onSearch" size="small">查询</el-button>
              </el-form>
            </template>
          </div>
          <div class="tabel-wrap">
            <template>
              <el-table :data="parentEditionList">
                <el-table-column prop="couponTemplateId" label="母版ID" ></el-table-column>
                <el-table-column prop="title" label="母版标题"></el-table-column>
                <el-table-column prop="couponPrice" label="面额" ></el-table-column>
                <el-table-column v-if="parentEditionList.validityType == 1" prop="validityDays" label="有效期" width="250" ></el-table-column>
                <el-table-column v-else-if="parentEditionList.validityType == 2" prop="couponStartTime + '/' + couponEndTime" label="有效期" width="250" >
                  <template slot-scope="scope">
                    {{scope.row.couponStartTime}}至{{scope.row.couponEndTime}}
                  </template>
                </el-table-column>
                <el-table-column prop="couponStatus" label="状态" :formatter="getStatus"></el-table-column>
                <el-table-column  label="操作">
                  <template slot-scope="scope">
                    <router-link :to="{ path: '/manager/knowledge/editMaster/' + scope.row.couponTemplateId }">
                      <el-button type="text" size="mini" :style="{ marginRight: '10px' }">编辑</el-button>
                    </router-link>
                    <el-button type="text" size="mini" @click="copy(scope.row.couponTemplateId)">复制</el-button>
                    <el-button type="text" size="mini" @click="changeStatus(scope.row.couponTemplateId, scope.row.couponStatus)">{{scope.row.couponStatus == 1 ? '下线' : '上线'}}</el-button> 
                    <el-button type="text" size="mini" @click="deleteRow(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>        
          </div>
          <div class="page-control">
            <el-pagination background :page-size="pageOption.pageSize" :current-page.sync="parentEditionSearchForm.pageNum" @current-change="pageChange" layout="total, prev, pager, next" :total="totalSize"></el-pagination>
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
                  <el-select v-model="selectType1" class="iptl w150">
                    <el-option v-for="item in searchOptions1" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="couponValue1" class="iptr"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="selectType2" class="iptl w150">
                    <el-option v-for="item in searchOptions2" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-date-picker class="date-range" v-model="couponValue2" type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期" @change="changeDate">
                  </el-date-picker>
                  <!-- <el-input v-model="voucherSearchForm.searchValue2" class="iptr"></el-input> -->
                </el-form-item>
                <el-form-item>
                  <el-select v-model="voucherSearchForm.couponStatus" class="w150">
                    <el-option v-for="item in couponOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="voucherSearchForm.activityId" class="iptr" placeholder="活动ID"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="voucherSearchForm.consumerId " class="iptr" placeholder="用户ID"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="voucherSearchForm.orderId" class="iptr" placeholder="订单ID"></el-input>
                </el-form-item>
                <el-button type="primary" @click="onSearchVoucher" size="small">查询</el-button>
                <el-button type="primary" @click="exportVoucherList" size="small">导出</el-button>
              </el-form>
            </template>
          </div>
          <div class="tabel-wrap">
            <template>
              <el-table :data="voucherList">
                <el-table-column prop="couponId" label="优惠券ID" ></el-table-column>
                <el-table-column width="250" prop="gmtCreate" label="领取时间"></el-table-column>
                <el-table-column prop="couponTemplateId" label="母版ID" ></el-table-column>
                <el-table-column prop="couponTemplateTitle" label="母版标题"></el-table-column>
                <el-table-column prop="couponPrice" label="面额" ></el-table-column>
                <el-table-column prop="couponStartTime + '至' + couponEndTime" label="有效期" >
                  <template slot-scope="scope">
                    <div>{{scope.row.couponStartTime}}至{{scope.row.couponEndTime}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="sourceId" label="活动ID"></el-table-column>
                <el-table-column prop="consumerId" label="用户ID" ></el-table-column>
                <el-table-column prop="usedTime" label="使用时间"></el-table-column>
                <el-table-column prop="orderId" label="订单ID" ></el-table-column>
                <el-table-column prop="couponStatus" label="状态" :formatter="getStatus1"></el-table-column>
              </el-table>
            </template>        
          </div>
          <div class="page-control">
            <el-pagination background :page-size="pageOption1.pageSize" :current-page.sync="voucherSearchForm.pageNum" @current-change="pageVoucherList" layout="total, prev, pager, next" :total="totalSize1"></el-pagination>
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
    <el-dialog title="优惠券导出" :visible.sync="dialogVoucher" width="30%" >
      <span v-if="downStatus">正在生成导出文件，请稍后<span class="beat-ellipsis"></span></span>
      <span v-else>优惠券文件已生成，请点击「下载」按钮！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVoucher = false">取 消</el-button>
        <el-button :disabled="this.disabled" class="el-button el-button--primary" @click="queryExport">下 载</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { formatToMs } from "../../../utils/dateUtils";
import { parentEditionList, copyTemplate, updateStatusTemplate, deleteTemplate, voucherList, exportVoucher } from "@/api/index";
import qs from "qs";
export default {
  data() {
    return {
      downStatus: true, // 文字
      downloadUrl: 'http://www.baidu.com',//链接
      disabled: true,
      dialogVoucher: false,
      loading: false,
      templateValue: '',
      selectType: 'title',
      selectType1: 'couponTemplateTitle',
      selectType2: 'dateGroup1',
      satrtTime: null,
      endTime: null,
      couponValue1: '',
      couponValue2: '',
      deleteTitle: "",
      deleteID: "",
      dialogDeleteParentEdition: false,
      parentEditionSearchForm: {
        couponTemplateId: null,
        couponStartTime: null,
        couponEndTime: null,
        validityDays: null,
        validityType: null,
        title: null,
        couponPrice: null,
        couponStatus: "",
        pageNum: 1,
        pageSize: 20,
        columns: null,
        order: null
      },
      voucherSearchForm: {
        consumerId: '',
        activityId: '',
        couponTemplateId: '',
        couponTemplateTitle: '',
        createEndTime: '',
        createStartTime: '',
        usedEndTime: '',
        usedStartTime: '',
        orderId: '',
        couponStatus: "",
        pageNum: 1,
        pageSize: 20
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
          value: -1,
          label: "已下线"
        }
      ],
      couponOptions: [
        //母版状态|待上线|已上线|已下线
        {
          value: "",
          label: "状态"
        },
        {
          value: 0,
          label: "待使用"
        },
        {
          value: 1,
          label: "已使用"
        },
        {
          value: -1,
          label: "已过期"
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
          value: "couponTemplateTitle",
          label: "母版标题"
        },
        {
          value: "couponTemplateId",
          label: "母版ID"
        }
      ],
      searchOptions2: [
        {
          value: "dateGroup1",
          label: "领取时间"
        },
        {
          value: "dateGroup2",
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
      this.satrtTime = this.couponValue2 ? formatToMs(this.couponValue2[0]) : '';
      this.endTime = this.couponValue2 ? formatToMs(this.couponValue2[1]) : '';
    },
    //获取母版列表
    getParentEditionList() {
      this.loading = true;
      if (this.selectType == 'title') {
        this.parentEditionSearchForm.title = this.templateValue;
        this.parentEditionSearchForm.couponTemplateId = '';
      } else if (this.selectType == 'id') {
        this.parentEditionSearchForm.title = '';
        this.parentEditionSearchForm.couponTemplateId = this.templateValue;
      }
      let params = {
        couponTemplateId: this.parentEditionSearchForm.couponTemplateId,
        title: this.parentEditionSearchForm.title,
        status: this.parentEditionSearchForm.status,
        pageNum: this.parentEditionSearchForm.pageNum,
        pageSize: this.parentEditionSearchForm.pageSize
      }
      parentEditionList(params)
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
    // 分页改变
    pageChange (currentPage) {
      this.parentEditionSearchForm.pageNum = currentPage
      this.getParentEditionList() 
    },
    // 分页查询
    onSearch () {
      this.parentEditionSearchForm.pageNum = 1
      this.getParentEditionList()
    },
    //获取已发券列表
    getVoucherList() {
      this.loading = true;
      if (this.selectType1 == 'couponTemplateTitle') {
        this.voucherSearchForm.couponTemplateTitle = this.couponValue1;
        this.voucherSearchForm.couponTemplateId = '';
      } else if (this.selectType1 == 'couponTemplateId') {
        this.voucherSearchForm.couponTemplateTitle = '';
        this.voucherSearchForm.couponTemplateId = this.couponValue1;
      }
      if (this.selectType2 == 'dateGroup1') {
        this.voucherSearchForm.createStartTime = this.satrtTime;
        this.voucherSearchForm.createEndTime = this.endTime;
        this.voucherSearchForm.usedStartTime = '';
        this.voucherSearchForm.usedEndTime = '';
      } else if (this.selectType2 == 'dateGroup2') {
        this.voucherSearchForm.createStartTime = '';
        this.voucherSearchForm.createEndTime = '';
        this.voucherSearchForm.usedStartTime = this.satrtTime;
        this.voucherSearchForm.usedEndTime = this.endTime;
      }
      console.log(this.voucherSearchForm)
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
    // 分页改变
    pageVoucherList (currentPage) {
      this.parentEditionSearchForm.pageNum = currentPage
      this.getVoucherList() 
    },
    // 分页查询
    onSearchVoucher () {
      this.parentEditionSearchForm.pageNum = 1
      this.getVoucherList()
    },
    queryExport() {
      if (this.selectType2 == 'dateGroup1') {
        this.voucherSearchForm.createStartTime = this.satrtTime;
        this.voucherSearchForm.createEndTime = this.endTime;
        this.voucherSearchForm.usedStartTime = '';
        this.voucherSearchForm.usedEndTime = '';
      } else if (this.selectType2 == 'dateGroup2') {
        this.voucherSearchForm.createStartTime = '';
        this.voucherSearchForm.createEndTime = '';
        this.voucherSearchForm.usedStartTime = this.satrtTime;
        this.voucherSearchForm.usedEndTime = this.endTime;
      }
      for (let key in this.voucherSearchForm) {
        if (key == 'pageNum' || key == 'pageSize') {
          delete this.voucherSearchForm[key]
        }
      }
      console.log(this.voucherSearchForm)
      exportVoucher(this.voucherSearchForm)
      .then(res => {
        if (resp.success) {
          let msg = resp.desc || '导出成功'
        } else {
          let msg = resp.desc || '导出失败'
          this.$message.error(msg)
        }
      }, () => {
        this.$message.error('网络错误')
      })
    },
    //导出已发券列表
    exportVoucherList() {
      this.dialogVoucher = true;
      this.disabled = true;
      this.downStatus = true;
      let that = this;
      let coupons = setInterval(function() {
        clearInterval(coupons);
        that.disabled = false;
        that.downStatus = false;
      }, 1000)
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
    getStatus(row, column) {
      switch (row.couponStatus) {
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
    getStatus1(row, column) {
      switch (row.couponStatus) {
        case '':
          return '状态';
        case 0:
          return '待使用';
        case 1:
          return '已使用';
        case -1:
          return '已过期';
      }
    },
    //复制母版
    copy(id) {
      let params = {
        couponTemplateId: id
      }
      copyTemplate(params)
      .then(res => {
        if (res.success) {
          let msg = res.data.desc || "复制成功";
          this.$message.success(msg);
          this.getParentEditionList();
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
        couponTemplateId: id,
        status: status
      }
      updateStatusTemplate(params)
      .then(res => {
        if (res.success) {
          let msg = res.data.desc || "修改状态成功";
          this.$message.success(msg);
          this.getParentEditionList();
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
    //删除母版
    deleteRow(row) {
      this.deleteTitle = row.title;
      this.deleteID = row.couponTemplateId;
      this.dialogDeleteParentEdition = true;
    },
    //确认删除母版
    queryDeleteParentEdition() {
      let params = {
        couponTemplateId: this.deleteID
      }
      deleteTemplate(params)
      .then(res => {
        if (res.success) {
          this.dialogDeleteParentEdition = false;
          if(res.data){
            let msg = res.data.desc || "删除母版成功";
            this.$message.success(msg);
            this.getParentEditionList();
          }else{
            let msg = res.data.desc || "删除失败，已经关联";
            this.$message.error(msg);
          }
          
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
.date-range {
  margin-top: 1px;
}
.beat-ellipsis:after {
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  animation: ellipsis 2s infinite;
  content: "\2026"; 
}
</style>