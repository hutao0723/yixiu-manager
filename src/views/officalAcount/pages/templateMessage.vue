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
                    <el-col :span="7" class="listCol" v-for="(item, index) in this.templateList" :key="index">
                        <el-card class="templateCard" :body-style="{ padding: '0px' }">
                            <div class="templateTitle">{{ item.templateName }}
                              <el-tooltip class="item" effect="light"
                              placement="top">
                                <div slot="content" >
                                    <h5 style="font-size: 22px; font-weight: bold; margin-bottom: 20px">{{ item.templateName }}</h5>
                                    <p style="margin-bottom: 20px" v-for='el in item.templateDescribe'>{{el}}</p>
                                </div>
                                <i class="el-icon-question" :style="{ float: 'right' }"></i>
                              </el-tooltip>
                            </div>
                            <div class="templateContent">
                                <div class="msg msgTitle">推送时间：</div>
                                <div class="msg msgContent">{{ item.pushTime }}</div>
                            </div>
                            <div class="templateContent">
                                <div class="msg msgTitle">推送状态：</div>
                                <div class="msg msgContent">{{ item.pushStatus*1?"启用中":"未启用" }}</div>
                            </div>
                            <div class="templateFooter">
                                <div class="footerLeft">{{ item.pushUser }}</div>
                                <div class="footerRight" @click="editTemplate(item.authorizeMpTemplateId, item.templateName, item.templateType)">编辑</div>
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
      let config = {
        authorizerId:this.$route.params.id,
        typeId:this.$route.params.type,
      }
      this.$http.get("/mpTypeTemplate/list",{ params: config }).then(
        res => {
          let resp = res.data;
          if (resp.success === true) {
            this.templateList = resp.data;

            this.templateList.forEach((el)=>{
              el.templateDescribe = el.templateDescribe.split(';')
            })
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

      console.log(id,this.$route.params.id)
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
    min-width: 395px;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .msg {
      display: inline-block;
      font-size: 14px;
    }
    .msgTitle {
      /*margin-right: 20px;*/
    }


  }
  .templateFooter {
    height: 30px;
    line-height: 30px;
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
