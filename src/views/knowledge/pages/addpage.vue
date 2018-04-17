<template>
  <div class="module">
    <!-- <div class="module-item">
      <div is="title-module" :deploy-toggle="deployToggle" v-on:changeDeploy="changeDeploy"></div>
      <i class="module-add module-btn" @click="deployToggle = 'add-module'"></i>
      <i class="module-close module-btn"></i>
    </div> -->
    <div class="module-deploy" v-show="deployToggle == -1">
      <h2 class="module-deploy-title">新增</h2>
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in moduleList" :key="item.id">
          <div class="module-deploy-item" @click="addModuleFun(item.id)">{{item.name}}</div>
        </el-col>
      </el-row>
    </div>

    <div class="module-item" v-for="(item,index) in boxList" :key="index" v-dragging="{ item: item, list: boxList, group: 'item' }">
      <div :is="item.type" :key="index" :deploy-toggle="deployToggle" :module-form="item.form" :module-index="index" v-on:changeDeploy="changeDeploy"></div>
      <i class="module-add module-btn" @click="clickModuleFun(index)"></i>
      <i class="module-close module-btn" @click="deleteModuleFun(index)"></i>
    </div>



  </div>
</template>

<script>
  import navModule from "../components/navModule";
  import slideModule from "../components/slideModule";
  import blankModule from "../components/blankModule";
  import titleModule from "../components/titleModule";
  import shoplistModule from "../components/shoplistModule";

  export default {
    data() {
      return {
        addModuleToggle: false,

        moduleList: [
          {
            name: '标题', id: 'nav-module'
          }, {
            name: '轮播图', id: 'slide-module'
          }, {
            name: '商品组', id: 'shoplist-module'
          }, {
            name: '空白', id: 'blank-module'
          }
        ],
        deployToggle: 0,

        boxList: [
          {
            name: '标题',
            type: 'title-module',
            form: {
              title: '',
              describe: '',
              img: [],
              bgcolorType: 0,
              bgcolor: '',
            },
          }, {
            name: '标题',
            type: 'nav-module',
            form: {
              name: '自定义标题',
              checkAll: true,
              url: null,
            },
          }, {
            name: '轮播图',
            type: 'slide-module',
            form: {
              slideType: 0,
              fillType: 0,
              img: [
                {
                  src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523284997796&di=b00cf74ce3d224c142ba409c4770e390&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F13%2F90%2F37%2F77j58PIC7WZ_1024.png',
                  shopSource: '小程序-跳转首页',
                }
              ],
            },
            listStyle: 3,
          }, {
            name: '商品组',
            type: 'shoplist-module',
            form: {
              listStyle: 1,
              fillType: 0,
              shopList: [{
                shopSource: '热销精品',
                name: '热销',
              }]
            }
          },{
            name: '商品组',
            type: 'shoplist-module',
            form: {
              listStyle: 0,
              fillType: 0,
              shopList: [{
                shopSource: '热销精品',
                name: '热销',
              }]
            }
          }, {
            name: '商品组',
            type: 'shoplist-module',
            form: {
              listStyle: 2,
              fillType: 0,
              shopList: [{
                shopSource: '热销精品',
                name: '热销',
              }]
            }
          }, {
            name: '商品组',
            type: 'shoplist-module',
            form: {
              listStyle: 3,
              fillType: 0,
              shopList: [{
                shopSource: '热销精品',
                name: '热销',
              }]
            }
          },{
            name: '空白',
            type: 'blank-module',
            form: {
              height: 30,
            }
          }
        ],
        modulePosition: 0,
      }
    },
    filters: {
    },
    created() {
    },
    methods: {
      clickModuleFun(index) {
        this.modulePosition = index + 1;
        this.deployToggle = -1;
        console.log(this.modulePosition)
      },
      deleteModuleFun(index){
        this.boxList.splice(index, 1);
      },
      addModuleFun(id) {
        let obj = {};
        switch (id) {
          case 'nav-module':
            obj = {
              name: '标题',
              type: 'nav-module',
              form: {
                name: '自定义标题',
                checkAll: true,
                url: null,
              },
            }
            break;
            case 'slide-module':
            obj = {
              name: '轮播图',
              type: 'slide-module',
              form: {
                slideType: 0,
              fillType: 0,
              img: [
                {
                  src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523284997796&di=b00cf74ce3d224c142ba409c4770e390&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F13%2F90%2F37%2F77j58PIC7WZ_1024.png',
                  shopSource: '小程序-跳转首页',
                }
              ],
              },
            }
            break;
            case 'shoplist-module':
            obj = {
              name: '商品组',
              type: 'shoplist-module',
              form: {
                listStyle: 1,
              fillType: 0,
              shopList: [{
                shopSource: '热销精品',
                name: '热销',
              }]
              },
            }
            break;
            case 'blank-module':
            obj = {
              name: '空白',
              type: 'blank-module',
              form: {
                height: 30,
              },
            }
            break;
          default:
            break;
        }
        console.log(obj)
        console.log(this.modulePosition)
        this.boxList.splice(this.modulePosition, 0, obj);

        this.deployToggle = this.boxList.length;
        console.log(this.boxList)
      },
      changeDeploy(event) {
        console.log(event)
        this.deployToggle = event;
      }
    },
    components: {
      navModule: navModule,
      slideModule: slideModule,
      blankModule: blankModule,
      titleModule: titleModule,
      shoplistModule: shoplistModule,
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/components/knowledge.less";
</style>