<template>
  <div class="">
    <div class="module-content" @click="changeDeploy">
      <div class="module-content-noimg" v-show="moduleForm.listStyle == 3">
        <ul class="module-content-ul">
          <li v-for="item in shopList" class="module-content-item">
            <i class="noimg-icon"></i>
            <span v-text="item.title" class="noimg-title"></span>
            <span v-text="item.time" class="noimg-time"></span>
          </li>
        </ul>
      </div>
      <div class="module-content-three" v-show="moduleForm.listStyle == 2">
        <el-row :gutter="20" class="module-content-ul">
          <el-col :span="8" v-for="item in shopList" class="module-content-item">
            <img src="" alt="" class="three-img">
            <p class="three-title" v-text="item.title"></p>
            <p class="three-price">¥ {{item.price}}</p>
          </el-col>
        </el-row>
      </div>
      <div class="module-content-two" v-show="moduleForm.listStyle == 0">
        <ul class="module-content-ul">
          <li v-for="item in shopList" class="module-content-item">
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
      <div class="module-content-one" v-show="moduleForm.listStyle == 1">
        <ul class="module-content-ul clearfix">
          <li v-for="item in shopList" class="module-content-item">
            <img src="" alt="" class="one-img">
            <span v-text="item.title" class="one-title"></span>
            <span class="one-status">{{item.number}}人已购</span>
            <span class="one-price">¥ {{item.price}}</span>
            <a v-show="item.status == 1" class="one-btn">购买</a>
            <a v-show="item.status == 2" class="one-btn">试听</a>
            <a v-show="item.status == 3" class="one-btn">已购</a>
          </li>
        </ul>
      </div>
    </div>
    <div class=" module-deploy" v-show="deployToggle == moduleIndex">
      <h2 class="module-deploy-title">商品组</h2>
      <el-form ref="moduleForm" :model="moduleForm" label-width="80px">
        <el-form-item label="商品组">
          <div class="shop">
            <div class="shop-list" v-for="item in moduleForm.shopList">
              <el-form :model="item" label-width="80px">
                <el-form-item label="商品来源">
                  <el-input v-model="item.shopSource" size="small" disabled>
                    <el-button slot="append" icon="el-icon-edit"></el-button>
                  </el-input>
                </el-form-item>
                <el-form-item label="分组名称">
                  <el-input v-model="item.name" size="small"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="shop-add" @click="getShopData">添加商品组</div>
          </div>
        </el-form-item>
        <el-form-item label="列表样式">
          <el-radio-group v-model="moduleForm.listStyle">
            <el-radio :label="0">列表</el-radio>
            <el-radio :label="1">横向滑动</el-radio>
            <el-radio :label="2">三栏</el-radio>
            <el-radio :label="3">无图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="填充方式">
          <el-radio-group v-model="moduleForm.fillType">
            <el-radio :label="0">固定宽度x自适应高度</el-radio>
            <el-radio :label="1">自适应宽度x固定高度</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>


    <el-dialog title="添加商品组" :visible.sync="dialogTableVisible">
      <el-table :data="shopData" style="width: 100%" @selection-change="changeSelect">
        <el-table-column property="id" label="ID" width="60"></el-table-column>
        <el-table-column property="title" label="姓名"></el-table-column>
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column width="60">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked"></el-checkbox>
          </template>
          </el-table-column>
      </el-table>
      <el-pagination background layout="total, prev, pager, next" :total="tableTotal" class="table-page" :current-page="tablePage"
        @current-change="getShopData"></el-pagination>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        dialogTableVisible: false,
        shopData: [],
        tablePage: 1,
        tableTotal: null,
        shopList: [
          {
            title: '高情商根圆滑花生了等号',
            jj: '怎么样抓只他的新？',
            ygxqs: 10,
            total: 20,
            number: 120,
            price: 99,
            status: 1, // 1购买2试听3免费4已购
            time: '04:30',
            imageUrl: '',
            imageBigUrl: '',
          },{
            title: '高情商根圆滑花生了等号',
            jj: '怎么样抓只他的新？',
            ygxqs: 10,
            total: 20,
            number: 120,
            price: 99,
            status: 1, // 1购买2试听4已购
            time: '04:30',
            imageUrl: '',
            imageBigUrl: '',
          }, {
            title: '高情商根圆滑花生了等号',
            jj: '怎么样抓只他的新？',
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
      }
    },
    props: ['deployToggle', 'moduleForm', 'moduleIndex'],
    methods: {
      changeDeploy() {
        this.$emit('changeDeploy', this.moduleIndex)
      },
      changeSelect(obj){
        console.log(obj)

      },
      getShopData(page) {
        this.dialogTableVisible = true;
        if (page != 2) {
          this.shopData = [
            {
              id: 1,
              title: '商品组测试标题1',
            }, {
              id: 2,
              title: '商品组测试标题1',
            }, {
              id: 3,
              title: '商品组测试标题1',
            }, {
              id: 4,
              title: '商品组测试标题1',
            }, {
              id: 5,
              title: '商品组测试标题1',
            }
          ];
          this.tableTotal = 50;
        }else{
          this.shopData = [
            {
              id: 6,
              title: '商品组测试标题1',
              checked: false,
            }, {
              id: 7,
              title: '商品组测试标题1',
            }, {
              id: 8,
              title: '商品组测试标题1',
            }, {
              id: 9,
              title: '商品组测试标题1',
            }, {
              id: 10,
              title: '商品组测试标题1',
            }
          ]
          this.tableTotal = 50;
        }
      }
    },

  }
</script>
<style lang="less" scoped>
  @import "../../../styles/components/knowledge.less";
  .module-content {
    .module-content-noimg {
      padding: 0 15px;
      .module-content-ul {
        border-bottom: 1px solid #e5e5e5;
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
        border-bottom: 1px solid #e5e5e5;
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
          height: 95px;
          border-bottom: 1px solid #e5e5e5;
          .two-img {
            height: 95px;
            width: 75px;
            position: absolute;
            left: 0;
            top: 10px;
            background: #999;
            border-radius: 4px;
          }
          .two-title {
            line-height: 22px;
            position: absolute;
            left: 85px;
            top: 20px;
            font-size: 15px;
            color: #333;
          }
          .two-jj {
            line-height: 20px;
            position: absolute;
            left: 85px;
            top: 50px;
            font-size: 14px;
            color: #787878;
          }
          .two-status {
            line-height: 16px;
            position: absolute;
            left: 85px;
            top: 80px;
            font-size: 12px;
            color: #787878;
          }
          .two-price {
            line-height: 14px;
            position: absolute;
            right: 0;
            top: 25px;
            font-size: 12px;
            color: #ff3e44;
            text-align: right;
          }
          .two-btn {
            position: absolute;
            right: 0;
            bottom: 16px;
            width: 60px;
            height: 26px;
            line-height: 26px;
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
        padding: 15px 0;
        width: auto;
        border-bottom: 1px solid #e5e5e5;
        white-space: nowrap;
        .module-content-item {
          display: inline-block;
          margin-right: 20px;
          position: relative;
          height: 140px;
          width: 130px;
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
            left: 0px;
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
            left: 0px;
            top: 100px;
            font-size: 13px;
            color: #787878;
          }
          .one-price {
            line-height: 20px;
            position: absolute;
            left: 0px;
            top: 120px;
            font-size: 14px;
            color: #ff3e44;
          }
          .one-btn {
            position: absolute;
            right: 0px;
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

  .table-page {
    margin-top: 10px;
    text-align: right;
  }
</style>