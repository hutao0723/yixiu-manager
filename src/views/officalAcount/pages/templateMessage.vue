<template>
    <section class="ofa-main-wrap">
        <div class="title-wrap">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <span>
                        <button class="goToDistribute" :style="{ 'border': 0, 'backgroundColor': 'white', 'font-size': '100%', 'margin': 0, 'padding': 0, 'color': '#606266', 'cursor': 'pointer' }" @click="goToOfficalList">公众号</button>
                        &nbsp;>&nbsp;模板消息
                    </span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-tabs v-model="activeType" type="card" @tab-click="handleClick" class="pad-length">
            <el-tab-pane :label="tab1" :name="tab1">
                <div class="content">
                    <el-col :span="6" class="listCol" v-for="(item, index) in this.templateList" :key="index">
                        <el-card class="templateCard" :body-style="{ padding: '0px' }">
                            <div class="templateTitle">{{ item.templateTitle }}
                              <el-tooltip class="item" effect="light" 
                              placement="top">
                                <div slot="content" v-html="item.toolTipContent"></div>
                                <i class="el-icon-question" :style="{ float: 'right' }"></i>
                              </el-tooltip>
                            </div>
                            <div class="templateContent">
                                <div class="msg msgTitle">推送时间：</div>
                                <div class="msg msgContent">{{ item.templateDate }}</div>
                            </div>
                            <div class="templateContent">
                                <div class="msg msgTitle">推送状态：</div>
                                <div class="msg msgContent">{{ item.templateStatus }}</div>
                            </div>
                            <div class="templateFooter">
                                <div class="footerLeft">{{ item.templatePushRole }}</div>
                                <div class="footerRight" @click="editTemplate(item.id, item.templateTitle, item.templateType)">编辑</div>
                            </div>
                        </el-card>
                    </el-col>
                </div>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>
<script>
export default {
  data() {
    return {
      tab1: "消息提醒",
      tabId: 0,
      activeType: "消息提醒",
      tabList: [
        {
          id: 0,
          name: "消息提醒"
        }
      ],
      templateList: [
        {
          id: '',
          templateType: 1,
          templatePushRole: '推送给用户',
          templateTitle: "支付成功通知",
          templateDate: "支付成功后",
          templateStatus: "",
          toolTipContent:
            '<div style="font-size: 22px; font-weight: bold; margin-bottom: 20px">支付成功通知</div><div style="margin-left: 20px"><div style="margin-bottom: 20px">订单商品：课程或专栏的标题</div><div style="margin-bottom: 20px">主订单号：用户支付完成后，平台生成的订单编号</div><div style="margin-bottom: 20px">支付金额：订单的实际付款金额</div><div style="margin-bottom: 20px">支付时间：平台主订单的交易完成时间</div></div>'
        },
        // {
        //   templateType: "2",
        //   templateTitle: "绑定成功通知",
        //   templateDate: "关联成功后",
        //   templateStatus: "",
        //   toolTipContent:
        //     '<div style="font-size: 22px; font-weight: bold; margin-bottom: 20px">绑定成功通知</div><div style="margin-left: 20px"><div style="margin-bottom: 20px">用户昵称：微信用户昵称</div><div style="margin-bottom: 20px">绑定时间：用户绑定分销员的时间</div></div>'
        // },
        {
          id: '',
          templateType: 3,
          templatePushRole: '推送给分销员',
          templateTitle: "绑定成功通知",
          templateDate: "新用户绑定",
          templateStatus: "",
          toolTipContent:
            '<div style="font-size: 22px; font-weight: bold; margin-bottom: 20px">绑定成功通知</div><div style="margin-left: 20px"><div style="margin-bottom: 20px">用户昵称：微信用户昵称</div><div style="margin-bottom: 20px">绑定时间：用户绑定分销员的时间</div><div style="margin-bottom: 20px">备注 :快来邀请小伙伴一起读书吧～</div><div style="margin-bottom: 20px">注：新用户（未绑定过任何分销员）绑定分销员</div><div style="margin-bottom: 20px">时，会给分销员1分钱奖励</div></div>'
        },
        {
          id: '',
          templateType: 4,
          templatePushRole: '推送给分销员',
          templateTitle: "收益到账提醒",
          templateDate: "收益到账后",
          templateStatus: "",
          toolTipContent:
            '<div style="font-size: 22px; font-weight: bold; margin-bottom: 20px">收益到账提醒</div><div style="margin-left: 20px"><div style="margin-bottom: 20px">收益金额：分销员绑定用户的订单支付金额*分销比例</div><div style="margin-bottom: 20px">收益来源：分销商品 </div><div style="margin-bottom: 20px">到账时间：收益金额打入分销员账户的时间</div></div>'
        },
        {
          id: '',
          templateType: 5,
          templatePushRole: '推送给分销员',
          templateTitle: "提现失败通知",
          templateDate: "提现失败后",
          templateStatus: "",
          toolTipContent:
            '<div style="font-size: 22px; font-weight: bold; margin-bottom: 20px">提现失败通知</div><div style="margin-left: 20px"><div style="margin-bottom: 20px">提现金额：分销员体现的金额</div><div style="margin-bottom: 20px">提现时间：提现金额打入分销员微信账户的时间</div><div style="margin-bottom: 20px">理由：用户提现失败的理由</div></div></div>'
        }
      ]
    };
  },
  methods: {
    handleClick(tab, event) {
      if (this.tabList[tab.index].id == this.tabId) {
        return;
      }
      this.tabId = this.tabList[tab.index].id;
      if (this.tabId == 0) {
        // 获取模板消息列表
        this.init();
      }
    },
    init() {
      let authorizerId = this.$route.params.id;
      this.$http.get("/authorizerMpTemplate/list?authorizerId="+ authorizerId).then(
        res => {
          let resp = res.data;
          if (resp.success === true) {
            let list = resp.data;
            for (let key in list) {
              if (list[key].pushStatus === 0) {
                list[key].pushStatus = "停用中";
              } else if (list[key].pushStatus === 1) {
                list[key].pushStatus = "启用中";
              }
              for (let detail of this.templateList) {
                if (detail.templateType == key) {
                  detail.templateStatus = list[key].pushStatus;
                  detail.id = list[key].id;
                }
              }
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
    goToOfficalList() {
      this.$router.go(-1);
    },
    editTemplate(id, title, type) {
      if (!id) {
        id = 0
      }
      sessionStorage.setItem('title', title);
      sessionStorage.setItem('type', type);
      sessionStorage.setItem('postId', this.$route.params.id);
      this.$router.push({
        name: "templateDetail",
        params: {
          id: id
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
.ofa-main-wrap {
  width: 100%;
  .listCol {
    margin-right: 20px;
    margin-top: 20px;
  }
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
  }
  .templateTitle {
    font-size: 18px;
    font-weight: bold;
    margin: 10px 15px 20px 15px;
  }
  .templateContent {
    margin: 0 15px 20px 15px;
    .msg {
      display: inline-block;
      font-size: 15px;
    }
    .msgTitle {
      margin-right: 50px;
    }
  }
  .templateFooter {
    height: 25px;
    line-height: 25px;
    padding: 0 10px;
    background-color: gray;
    color: #ffffff;
    .footerLeft {
      cursor: pointer;
      float: left;
    }
    .footerRight {
      cursor: pointer;
      float: right;
    }
  }
}
.pad-length {
  margin-top: 10px;
}
</style>
