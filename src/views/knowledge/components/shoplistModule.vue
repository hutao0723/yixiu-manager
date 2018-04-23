<template>
  <div class="">
    <div class="module-content" @click="changeDeploy">
      <ul class="module-tabs clearfix" v-show="moduleForm.tabs.length > 1">
        <li v-for="(item,index) in moduleForm.tabs" :class="{item_three: moduleForm.tabs.length == 3,item_two: moduleForm.tabs.length == 2}">
          <span :class="{active: index==0}">{{item.groupName}}</span>
        </li>
      </ul>
      <div class="module-content-noimg" v-show="moduleForm.layout == 'NOPIC'">
        <ul class="module-content-ul">
          <li v-for="(item,index) in shopList" class="module-content-item" :key="index">
            <i class="noimg-icon"></i>
            <span v-text="item.title" class="noimg-title"></span>
            <span v-text="item.time" class="noimg-time"></span>
          </li>
        </ul>
      </div>

      <div class="module-content-two" v-show="moduleForm.layout == 'ROW'">
        <ul class="module-content-ul">
          <li v-for="(item,index) in shopList" class="module-content-item" :key="index">
            <img src="" alt="" class="two-img">
            <span v-text="item.title" class="two-title"></span>
            <span v-text="item.jj" class="two-jj"></span>
            <span class="two-status">已更新{{item.ygxqs}}期 | {{item.number}}人开通</span>
            <span class="two-price">¥ {{item.price}}</span>
            <a v-show="item.status == 1" class="two-btn">购买</a>
            <a v-show="item.status == 2" class="two-btn">试听</a>
            <a v-show="item.status == 3" class="two-btn">已购</a>
          </li>
        </ul>
      </div>
      <div class="module-content-three" v-show="moduleForm.layout == 'GRID_3'">
        <el-row :gutter="20" class="module-content-ul">
          <el-col :span="8" v-for="(item,index) in shopList" class="module-content-item" :key="index">
            <img src="" alt="" class="three-img">
            <p class="three-title" v-text="item.title"></p>
            <p class="three-price">¥ {{item.price}}</p>
          </el-col>
        </el-row>
      </div>
      <div class="module-content-one" v-show="moduleForm.layout == 'GRID_2'">

        <el-row :gutter="20" class="module-content-ul">
          <el-col :span="12" v-for="(item,index) in shopList" class="module-content-item" :key="index">
            <img src="" alt="" class="one-img">
            <span v-text="item.title" class="one-title"></span>
            <span class="one-status">{{item.number}}人已购</span>
            <span class="one-price">¥ {{item.price}}</span>
            <a v-show="item.status == 1" class="one-btn">购买</a>
            <a v-show="item.status == 2" class="one-btn">试听</a>
            <a v-show="item.status == 3" class="one-btn">已购</a>
          </el-col>
        </el-row>
        <!-- <ul class="module-content-ul clearfix">
          <li v-for="item in shopList" class="module-content-item">
            <img src="" alt="" class="one-img">
            <span v-text="item.title" class="one-title"></span>
            <span class="one-status">{{item.number}}人已购</span>
            <span class="one-price">¥ {{item.price}}</span>
            <a v-show="item.status == 1" class="one-btn">购买</a>
            <a v-show="item.status == 2" class="one-btn">试听</a>
            <a v-show="item.status == 3" class="one-btn">已购</a>
          </li>
        </ul> -->
      </div>
    </div>
    <div class=" module-deploy" v-show="deployToggle == moduleIndex">
      <h2 class="module-deploy-title">商品组</h2>
      <el-form ref="moduleForm" :model="moduleForm" label-width="80px">
        <el-form-item label="商品组">
          <div class="shop">
            <div class="shop-list" v-for="(item,index) in moduleForm.tabs">
              <el-form :model="item" label-width="80px" :rules="rulesForm" ref="moduleForm">
                <el-form-item label="商品来源">
                  <el-input v-model="item.linkDataJson.goodsGroupName" size="small" disabled class="w200">
                    <el-button slot="append" icon="el-icon-edit" @click="showDialogGoods(index)"></el-button>
                  </el-input>
                </el-form-item>
                <el-form-item label="分组名称" prop="groupName">
                  <el-input v-model="item.groupName" size="small" class="w200"></el-input>
                </el-form-item>
                <el-form-item label="显示个数">
                  <el-radio-group v-model="item.linkType">
                    <el-radio :label="1">
                      <el-input v-model="item.showLimitNumber" size="small" class="w50"></el-input>
                    </el-radio>
                    <el-radio :label="2">显示全部</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <i class="el-icon-close shop-close" @click="delImage(index)"></i>
            </div>
            <div class="shop-add" @click="getShopData">添加商品组</div>
          </div>
        </el-form-item>
        <el-form-item label="列表样式">
          <el-radio-group v-model="moduleForm.layout">
            <el-radio label="ROW">列表</el-radio>
            <el-radio label="GRID_2">两栏</el-radio>
            <el-radio label="GRID_3">三栏</el-radio>
            <el-radio label="NOPIC">无图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="填充方式">
          <el-radio-group v-model="moduleForm.fillType">
            <el-radio label="widthFix">固定宽度x自适应高度</el-radio>
            <el-radio label="aspectFit">自适应宽度x固定高度</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>


    <el-dialog title="商品组" :visible.sync="dialogGoods">
      <div class="tar">
        <el-input placeholder="商品标题" size="small" class="w150 vam" v-model="goodsTitle"></el-input>
        <el-button size="small" type="primary" @click="getAppList">查询</el-button>
      </div>
      <el-table :data="appList" style="width: 100%" highlight-current-row @current-change="handleCurrentChange">
        <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
        <el-table-column prop="goodsGroupName" label="商品信息">
        </el-table-column>
      </el-table>
      <div class="page-control">
        <el-pagination background :page-size="5" :current-page.sync="pageOption.pageNum" @current-change="changePageAppList" layout="total, prev, pager, next"
          :total="totalSize"></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogGoods = false" size="small">取 消</el-button>
        <el-button type="primary" @click="selectOver" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  let api = {
    list: '/goodsGroup/list',
  }
  export default {
    data() {
      return {
        activeName: 0,
        shopList: [
          {
            title: '测试标题',
            jj: '这是一段测试简介',
            ygxqs: 10,
            total: 20,
            number: 120,
            price: 99,
            status: 1, // 1购买2试听3免费4已购
            time: '04:30',
            imageUrl: '',
            imageBigUrl: '',
          }, {
            title: '测试标题',
            jj: '这是一段测试简介',
            ygxqs: 10,
            total: 20,
            number: 120,
            price: 99,
            status: 1, // 1购买2试听4已购
            time: '04:30',
            imageUrl: '',
            imageBigUrl: '',
          }, {
            title: '测试标题',
            jj: '这是一段测试简介',
            ygxqs: 10,
            total: 20,
            number: 120,
            price: 99,
            status: 1, // 1购买2试听3免费4已购
            time: '04:30',
            imageUrl: '',
            imageBigUrl: '',
          }
        ],

        dialogGoods: false,
        selectValue: {}, // 内容值
        selectIndex: 0, // 选择index暂存
        appList: [],
        pageOption: {
          pageNum: 1,
          pageSize: 5
        },
        totalSize: 0,
        goodsTitle: '',
        rulesForm: {
          groupName: [
            { required: true, message: '请输入分组名称', trigger: 'change' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
          ],
        }
      }
    },
    props: ['deployToggle', 'moduleForm', 'moduleIndex'],
    created() {
    },
    methods: {
      delImage(index) {
        console.log(this.moduleForm.tabs, index)
        this.moduleForm.tabs.splice(index, 1)
      },
      selectOver() {
        console.log(this.selectIndex)
        if (this.selectIndex> -1) {
          this.moduleForm.tabs[this.selectIndex].linkDataJson = this.selectValue;
          this.moduleForm.tabs[this.selectIndex].goodsGroupId = this.selectValue.id;
          this.moduleForm.tabs[this.selectIndex].groupName = this.selectValue.goodsGroupName;
          this.$set(this.moduleForm.tabs, this.selectIndex, this.moduleForm.tabs[this.selectIndex])
        } else {
          let obj = {
            "goodsGroupId": this.moduleForm.tabs.length + 1,
            "groupName": this.selectValue.goodsGroupName,
            "showLimitNumber": 3,
            "linkType": 1,
            "linkDataJson": this.selectValue,
          };
          this.moduleForm.tabs.push(obj)
        }
        this.dialogGoods = false;
      },
      handleCurrentChange(row) {
        console.log(row)
        this.selectValue = row;
      },
      getAppList() {
        let params = {
          goodsGroupName: this.goodsTitle ? this.goodsTitle : '',
          pageNum: this.pageOption.pageNum,
          pageSize: this.pageOption.pageSize,
        }
        this.$http.get(api.list, { params: params }).then(res => {
          let resp = res.data
          if (resp.success) {
            this.appList = resp.data.lists
            console.log(this.selectIndex)
            this.totalSize = resp.data.totalSize
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      changePageAppList(page) {
        this.pageOption.pageNum = page;
        this.getAppList();
      },
      changeDeploy() {
        this.$emit('changeDeploy', this.moduleIndex)
      },
      getShopData() {
        this.selectValue = {};
        this.selectIndex = -1;
      this.getAppList();
      this.dialogGoods = true;
      
      },
      showDialogGoods(index) {
        this.selectValue = {};
        this.selectIndex = index;
      this.getAppList();
      this.dialogGoods = true;

        console.log(index)
      },
    },

  }
</script>
<style lang="less" scoped>
  @import "../../../styles/components/knowledge.less";
  .module-content {
    background: #fff;
    
    .module-tabs {
      height: 50px;
      overflow: auto;
      li {
        box-sizing: border-box;
        min-width: 25%;
        float: left;
        text-align: center;
        span {
          font-size: 15px;
          line-height: 50px;
          height: 47px;
          color: #333;
          display: block;
        }
        span.active {
          color: #FF3E44;
          border-bottom: 2px solid #FF3E44;
          font-size: 18px;
        }
      }
      li.item_three {
        width: 33%;
      }
      li.item_two {
        width: 50%;
      }
    }
    .module-content-noimg {
      padding: 0 15px;
      .module-content-ul {
        /* border-bottom: 1px solid #e5e5e5; */
        padding: 10px 0;
        margin: 0;
        .module-content-item {
          line-height: 30px;
          height: 30px;
          .noimg-icon {
            display: inline-block;
            height: 20px;
            width: 20px;
            background: #999;
            margin-right: 8px;
            vertical-align: -5px;
          }
          .noimg-title {
            font-size: 14px;
            color: #333;
          }
          .noimg-time {
            font-size: 12px;
            color: #999;
            float: right;
          }
        }
      }
    }
    .module-content-three {
      padding: 0 15px;
      .module-content-ul {
        /* border-bottom: 1px solid #e5e5e5; */
        padding: 10px 0;
        .module-content-item {
          .three-img {
            display: inline-block;
            height: 140px;
            background: #999;
            margin: 10px 0;
            width: 100%;
            border-radius: 4px;
          }
          .three-title {
            line-height: 18px;
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #333;
          }
          .three-price {
            color: #ff3e44;
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }
    .module-content-two {
      padding: 0 15px;
      .module-content-ul {
        .module-content-item {
          position: relative;
          padding: 10px 0;
          height: 113px;
          /* border-bottom: 1px solid #e5e5e5; */
          .two-img {
            height: 82px;
            width: 112px;
            position: absolute;
            left: 0px;
            top: 10px;
            background: #999;
            border-radius: 4px;
          }
          .two-title {
            line-height: 20px;
            position: absolute;
            left: 125px;
            top: 16px;
            font-size: 14px;
            color: #333;
          }
          .two-jj {
            line-height: 16px;
            position: absolute;
            left: 125px;
            top: 56px;
            font-size: 12px;
            color: #787878;
          }
          .two-status {
            line-height: 15px;
            position: absolute;
            left: 125px;
            top: 80px;
            font-size: 11px;
            color: #999999;
          }
          .two-price {
            line-height: 18px;
            position: absolute;
            right: 0;
            top: 15px;
            font-size: 13px;
            color: #ff3e44;
            text-align: right;
          }
          .two-btn {
            position: absolute;
            right: 0;
            top: 76px;
            width: 55px;
            height: 23px;
            line-height: 23px;
            text-align: center;
            font-size: 14px;
            color: #fff;
            background: linear-gradient(90deg, rgba(255, 62, 68, 1), rgba(255, 99, 77, 1));
            box-shadow: 0px 5px 7px 0px rgba(255, 217, 217, 1);
            border-radius: 20px;
          }
        }
      }
    }
    .module-content-one {
      padding: 0 15px;
      overflow: hidden;
      .module-content-ul {
        padding-top: 15px;
        width: auto;
        /* border-bottom: 1px solid #e5e5e5; */
        white-space: nowrap;
        .module-content-item {
          display: inline-block;
          position: relative;
          height: 140px;
          margin-bottom: 15px;
          .one-img {
            display: inline-block;
            height: 90px;
            width: 100%;
            background: #999;
            border-radius: 4px;
          }
          .one-title {
            line-height: 20px;
            position: absolute;
            left: 10px;
            top: 70px;
            font-size: 14px;
            color: #fff;
            width: 100%;
            padding: 0 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .one-status {
            line-height: 20px;
            position: absolute;
            left: 10px;
            top: 100px;
            font-size: 13px;
            color: #787878;
          }
          .one-price {
            line-height: 20px;
            position: absolute;
            left: 10px;
            top: 120px;
            font-size: 14px;
            color: #ff3e44;
          }
          .one-btn {
            position: absolute;
            right: 10px;
            bottom: 0px;
            width: 50px;
            height: 22px;
            line-height: 22px;
            text-align: center;
            font-size: 13px;
            color: #fff;
            background: linear-gradient(90deg, rgba(255, 62, 68, 1), rgba(255, 99, 77, 1));
            box-shadow: 0px 5px 7px 0px rgba(255, 217, 217, 1);
            border-radius: 20px;
          }
        }
      }
    }
  }

  .list-goods {
    position: relative;
    padding-left: 60px;
    padding-right: 10px;
    height: 50px;
    img {
      vertical-align: middle;
      height: 50px;
      width: 50px;
      display: inline-block;
      position: absolute;
      left: 0;
    }
    span {
      line-height: 50px;
    }
  }

  .el-radio__label {
    padding: 0;
  }

  .page-control {
    float: right;
    margin-top: 20px;
    &:after {
      clear: both;
    }
  }

  .table-page {
    margin-top: 10px;
    text-align: right;
  }
</style>