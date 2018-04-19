<template>
  <div>
    <div class="module">
      <div class="module-deploy" v-show="deployToggle == -2">
        <h2 class="module-deploy-title">新增</h2>
        <el-row :gutter="20">
          <el-col :span="6" v-for="item in moduleList" :key="item.id">
            <div class="module-deploy-item" @click="addModuleFun(item.id)">{{item.name}}</div>
          </el-col>
        </el-row>
      </div>
      <div class="module-item">
        <div is="PAGE" :deploy-toggle="deployToggle" :module-form="boxData" :module-index="-1" v-on:changeDeploy="changeDeploy"></div>
        <i class="module-add module-btn el-icon-circle-plus-outline" @click="clickModuleFun(-1)"></i>
      </div>
      <div class="module-item" v-for="(item,index) in boxList" :key="index" v-dragging="{ item: item, list: boxList, group: 'item' }">
        <div :is="item.componentType" :key="index" :deploy-toggle="deployToggle" :module-form="item" :module-index="index" v-on:changeDeploy="changeDeploy"></div>
        <i class="module-add module-btn el-icon-circle-plus-outline" @click="clickModuleFun(index)"></i>
        <i class="module-close module-btn el-icon-circle-close-outline" @click="deleteModuleFun(index)"></i>
      </div>

    </div>
    <div>
      <router-link :to="{ path: '/manager/knowledge?authorizerId=' + authorizerId}">
        <el-button>取消</el-button>
      </router-link>
      <el-button @click="submitAdd" class="mt10" type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
  import TITLE from "../components/navModule";
  import SWIPER from "../components/slideModule";
  import BLANK from "../components/blankModule";
  import PAGE from "../components/titleModule";
  import GOODSBOX from "../components/shoplistModule";
  import qs from 'qs';

  export default {
    data() {
      return {
        addModuleToggle: false,

        moduleList: [
          {
            name: '标题', id: 'TITLE'
          }, {
            name: '轮播图', id: 'SWIPER'
          }, {
            name: '商品组', id: 'GOODSBOX'
          }, {
            name: '空白', id: 'BLANK'
          }
        ],
        deployToggle: -1,
        boxData: {
          id: null,
          components: [],
          pageTitle: "页面标题",
          shareDescribe: "页面描述内容",
          sharePictureUrl: "",
          backgroundColor: "",
        },
        boxList: [
          
        ],
        modulePosition: 0,
        editId: null,
      }
    },
    filters: {
    },
    created() {

      this.editId = this.$route.query.id ? this.$route.query.id : null;
      this.authorizerId = this.$route.query.authorizerId ? this.$route.query.authorizerId : null;
      
      if (this.editId) {
        this.$http.get('/knowledgepage/component/detail', { params: { id: this.editId } }).then(res => {
          if (res.data.data) {
            this.boxData = res.data.data;

            this.boxList = res.data.data.components;
            this.boxList.forEach(item => {
              if (item.componentType == "SWIPER" && item.tabs) {
                item.tabs.forEach(items => {
                  items.linkDataJson = JSON.parse(items.linkDataJson)
                })
              }
              if (item.componentType == "TITLE") {
                item.linkDataJson = JSON.parse(item.linkDataJson)
              }
              if (item.componentType == "GOODSBOX" && item.tabs) {
                item.tabs.forEach(items => {
                  items.linkDataJson = JSON.parse(items.linkDataJson)
                })
              }
            })
          } else {
            let msg = res.data.desc || "保存失败"
            this.$message.error(msg)
            this.dialogLecturerVisible = false
          }
        })
      }
    },
    methods: {
      submitAdd() {
        let params = this.boxData;
        params['authorizerId'] = this.authorizerId ;
        params.components = JSON.stringify(this.boxList);
        let _params = Object.assign(params)
        this.$http.post('/knowledgepage/component/insert', qs.stringify(_params)).then(res => {
          if (res.data.data) {
            this.$router.push({
              path: '/manager/knowledge?authorizerId=' + this.authorizerId,

            })
          } else {
            let msg = res.data.desc || "保存失败"
            this.$message.error(msg)
            this.dialogLecturerVisible = false
          }
        })
      },
      clickModuleFun(index) {
        this.modulePosition = index + 1;
        this.deployToggle = -2;
        console.log(this.modulePosition)
      },
      deleteModuleFun(index) {
        this.boxList.splice(index, 1);
      },
      addModuleFun(id) {
        let obj = {};
        switch (id) {
          case 'TITLE':
            obj = {
              "componentType": "TITLE",
              "titleName": "标题",
              "showTitle": true,
              "linkType": 0,
              "linkDataJson": {},
              "subTitle": "查看更多",
              "layout": "BASE"
            }
            break;
          case 'SWIPER':
            obj = {
              "componentType": "SWIPER",
              "fillType": "widthFix",
              "layout": "MAX",
              "tabs": [
              ]
            }
            break;
          case 'GOODSBOX':
            obj = {
              "componentType": "GOODSBOX",
              "fillType": "aspectFit",
              "layout": "NOPIC",
              "tabs": []
            }
            break;
          case 'BLANK':
            obj = {
              "componentType": "BLANK",
              "blankHeight": 50,
              "blankWidth": 0,
              "blankFillColor": ""
            }
            break;
          default:
            break;
        }
        this.boxList.splice(this.modulePosition, 0, obj);
        this.deployToggle = this.modulePosition;

        console.log(this.$refs)


      },
      changeDeploy(event) {
        this.deployToggle = event;
      }
    },
    components: {
      TITLE: TITLE,
      SWIPER: SWIPER,
      GOODSBOX: GOODSBOX,
      BLANK: BLANK,
      PAGE: PAGE,
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/components/knowledge.less";
</style>