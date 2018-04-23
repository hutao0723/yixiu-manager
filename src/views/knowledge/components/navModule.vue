<template>
  <div class="">
    <div class="module-content" @click="changeDeploy">
      <h2 class="module-title" v-show="moduleForm.layout=='BASE'">{{moduleForm.titleName}}
        <a href="javascript:void(0);" v-show="moduleForm.showTitle" class="module-title-right">{{moduleForm.subTitle}}</a>
      </h2>
      <h2 class="module-title tac" v-show="moduleForm.layout=='CENTER'">
          <a href="javascript:void(0);" v-show="moduleForm.showTitle" class="module-title-center">{{moduleForm.subTitle}}</a>
        </h2>
    </div>
    <div class="module-deploy" v-show="deployToggle == moduleIndex">
      <h2 class="module-deploy-title">标题</h2>
      <el-form ref="moduleForm" :rules="rulesForm" :model="moduleForm" label-width="100px">
          <el-form-item label="外链地址" prop="layout">
              <el-radio-group v-model="moduleForm.layout">
                <el-radio label="BASE">左右</el-radio>
                <el-radio label="CENTER">居中</el-radio>
              </el-radio-group>
            </el-form-item>
        <el-form-item label="标题名称" prop="titleName">
          <el-input v-model="moduleForm.titleName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="查看更多" prop="subTitle">
            <el-input v-model="moduleForm.subTitle" size="small"></el-input>
        </el-form-item>
        <el-form-item label="跳转类型">
          <el-select v-model="moduleForm.linkType" placeholder="请选择" size="small" @change="changeLinkType">
            <el-option label="无跳转" :value="0"></el-option>
            <el-option label="商品" :value="1"></el-option>
            <el-option label="外链" :value="2"></el-option>
            <el-option label="小程序路径" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" v-if="moduleForm.linkType==1">
          <el-input v-model="moduleForm.linkDataJson.title" size="small" disabled>
            <el-button slot="append" icon="el-icon-edit" @click="showDialogGoods"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="外链地址" v-if="moduleForm.linkType==2">
          <el-input v-model="moduleForm.linkDataJson.linkUrl" size="small" disabled>
            <el-button slot="append" icon="el-icon-edit" @click="showDialogHref"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="小程序地址" v-if="moduleForm.linkType==3">
          <el-input v-model="moduleForm.linkDataJson.linkUrl" size="small" disabled>
            <el-button slot="append" icon="el-icon-edit" @click="showDialogWechat"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="商品" :visible.sync="dialogGoods">
      <el-tabs v-model="goodsActiveName" @tab-click="getShopList">
        <el-tab-pane label="课程" name="0"></el-tab-pane>
        <el-tab-pane label="专栏" name="1"></el-tab-pane>
      </el-tabs>
      <div class="tar">
        <el-input placeholder="商品标题" size="small" class="w150 vam" v-model="goodsTitle"></el-input>
        <el-button size="small" type="primary" @click="getShopList">查询</el-button>
      </div>
      <el-table :data="appList" highlight-current-row style="width: 100%" @current-change="handleCurrentChange">
        <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
        <el-table-column label="商品信息">
          <template slot-scope="scope">
            <div class="list-goods otw">
              <img :src="scope.row.lateralCover" alt="" v-if="scope.row.lateralCover">
              <img :src="scope.row.verticalCover" alt="" v-if="scope.row.verticalCover && !scope.row.lateralCover">
              <img src="" alt="" v-if="!scope.row.verticalCover && !scope.row.lateralCover">
              <span>{{scope.row.title}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.courseType == 1">课程 - 音频</span>
            <span v-if="goodsActiveName == 1">专栏</span>
          </template>
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

    <el-dialog title="外链" :visible.sync="dialogHref" v-if="selectValue">
      <el-form>
        <el-form-item label="外链地址" label-width="100px">
          <el-input v-model="selectValue.linkUrl"></el-input>
        </el-form-item>
      </el-form>
      <el-alert title="注意" type="warning" description="小程序环境下，外链域名添加到小程序的业务域名中才能实现跳转。" show-icon class="mt20" :closable="false">
      </el-alert>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHref = false" size="small">取 消</el-button>
        <el-button type="primary" @click="selectOver" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="小程序" :visible.sync="dialogWechat" v-if="selectValue">
      <el-form>
        <el-form-item label="外链地址" label-width="100px">
          <el-radio-group v-model="selectValue.courseType" @change="changeSelectValue">
            <el-radio :label="1">我的小程序</el-radio>
            <el-radio :label="2">外部小程序</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="AppId" label-width="100px" v-show="selectValue.courseType == 2">
          <el-input v-model="selectValue.appId"></el-input>
        </el-form-item v-if="selectValue.linkUrl">
        <el-form-item label="路径" label-width="100px">
          <el-input v-model="selectValue.linkUrl"></el-input>
        </el-form-item>
      </el-form>
      <el-alert title="注意" type="warning" description="关联在同一公众号下的小程序才能实现互跳。" show-icon class="mt20" :closable="false">
      </el-alert>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogWechat = false" size="small">取 消</el-button>
        <el-button type="primary" @click="selectOver" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  let api = {
    courseList: '/course/pageList',
    columnList: '/column/pageList',
  }
  export default {
    data() {
      return {
        dialogGoods: false,
        dialogHref: false,
        dialogWechat: false,
        goodsActiveName: 0, // 专栏商品科幻
        selectValue: {}, // 内容值
        appList: [],
        pageOption: {
          pageNum: 1,
          pageSize: 5
        },
        totalSize: 0,
        goodsTitle: '',
        rulesForm: {
          titleName: [
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
          ],
          subTitle: [
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
          ],
        },
      }
    },
    
    props: ['deployToggle', 'moduleForm', 'moduleIndex'],
    created() {
    },
    methods: {
      changeDeploy() {
        this.$emit('changeDeploy', this.moduleIndex)
      },
      selectOver() {
        this.moduleForm.linkDataJson = this.selectValue;
        this.dialogGoods = false;
        this.dialogHref = false;
        this.dialogWechat = false;
      },
      handleCurrentChange(row) {
        this.selectValue = row;
      },
      getShopList(v) {
        if(v){
          this.goodsTitle = "";
        }
        let url = this.goodsActiveName == 0 ? api.courseList : api.columnList;
        let params = {
          title: this.goodsTitle ? this.goodsTitle : '',
          pageNum: this.pageOption.pageNum,
          pageSize: this.pageOption.pageSize,
        }
        this.$http.get(url, { params: params }).then(res => {
          let resp = res.data
          if (resp.success) {
            this.appList = resp.data.content
            this.totalSize = resp.data.totalElements
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      changePageAppList(page) {
        this.pageOption.pageNum = page;
        this.getShopList();
      },
      showDialogGoods() {
        this.selectValue = {};
        this.goodsTitle = "";
        this.getShopList();
        this.dialogGoods = true;
      },
      showDialogHref() {
        this.dialogHref = true;
        this.selectValue = {
          linkUrl: this.selectValue.linkUrl?this.selectValue.linkUrl:"https://",
        }
      },
      showDialogWechat() {
        this.dialogWechat = true;
        this.selectValue = {
          appId: this.selectValue.appId ? this.selectValue.appId: "",
          linkUrl: this.selectValue.linkUrl ? this.selectValue.linkUrl: "",
          courseType: this.selectValue.courseType ? this.selectValue.courseType: 1,
        };
      },
      changeSelectValue(){
        this.selectValue.appId =  "";
        this.selectValue.linkUrl =  "";
      },
      changeLinkType(v){
        switch (v) {
          case 1:
            this.moduleForm.linkDataJson.title = "";
            break;
            case 2:
            this.moduleForm.linkDataJson.linkUrl = "";
            break;
            case 3:
            this.moduleForm.linkDataJson.linkUrl = "";
            break;
          default:
            break;
        }
      }
    },
    created() {
      console.log(this.$refs)
    },

  }
</script>
<style lang="less" scoped>
  @import "../../../styles/components/knowledge.less";
  .module-content {
    padding: 0 15px;
    background: #fff;
  }

  .module-title {
    padding: 15px 0;
    line-height: 28px;
    height: 28px;
    font-size: 20px;
    font-weight: bold;
    color: #222;
    position: relative;
    
  }
  .module-title-right {
      line-height: 28px;
      height: 28px;
      font-size: 13px;
      color: #666;
      float: right;
    }
    .module-title-center {
      line-height: 28px;
      height: 28px;
      font-size: 13px;
      color: #666;
      text-align: center;
    }

  .list-goods {
    position: relative;
    // padding-left: 60px;
    // padding-right: 10px;
    height: 50px;
    img {
      vertical-align: middle;
      height: 50px;
      display: inline-block;
     
    }
    span {
      line-height: 50px;

    }
  }
  .page-control {
    float: right;
    margin-top: 20px;
    &:after {
      clear: both;
    }
  }
</style>