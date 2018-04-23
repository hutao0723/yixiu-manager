<template>
  <div class="">
    <div class="module-content" @click="changeDeploy">
      <el-carousel trigger="click" height="150px">
        <el-carousel-item v-for="item in 4" :key="item">
          <h3>{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="module-deploy" v-show="deployToggle == moduleIndex">
      <h2 class="module-deploy-title">轮播</h2>
      <el-form ref="moduleForm" :model="moduleForm" label-width="80px">
        <el-form-item label="轮播类型">
          <el-radio-group v-model="moduleForm.layout">
            <el-radio label="MAX">左右轮播</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="填充方式">
          <el-radio-group v-model="moduleForm.fillType">
            <el-radio label="widthFix">固定宽度x自适应高度</el-radio>
            <el-radio label="aspectFit">自适应宽度x固定高度</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图片链接" v-show="moduleForm.tabs.length>0">
          <div class="shop">
            <div class="shop-list" v-for="(item,index) in moduleForm.tabs" :key="index" v-dragging="{ item: item, list: moduleForm.subEntry, group: 'item' }">
              <el-form :model="item" label-width="100px">
                <el-form-item label="图片">
                  <img :src="item.pictureUrl" alt="" width="50" height="50">
                  <el-upload class="shop-list-upload" action="/upload/image" :on-success="(res) => changeImage(res, index)" name="imageFile" :before-upload="beforeImage" :show-file-list="false">
                    <i class="el-icon-edit"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="跳转类型">
                  <el-select v-model="item.linkType" placeholder="请选择" size="small" @change="(v) => changeLinkType(v,index)">
                    <el-option label="无跳转" :value="0"></el-option>
                    <el-option label="商品" :value="1"></el-option>
                    <el-option label="外链" :value="2"></el-option>
                    <el-option label="小程序路径" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="商品名称" v-if="item.linkType==1">
                  <el-input v-model="item.linkDataJson.title" size="small" disabled>
                    <el-button slot="append" icon="el-icon-edit" @click="showDialogGoods(index)"></el-button>
                  </el-input>
                </el-form-item>
                <el-form-item label="外链地址" v-if="item.linkType==2">
                  <el-input v-model="item.linkDataJson.linkUrl" size="small" disabled>
                    <el-button slot="append" icon="el-icon-edit" @click="showDialogHref(index)"></el-button>
                  </el-input>
                </el-form-item>
                <el-form-item label="小程序地址" v-if="item.linkType==3">
                  <el-input v-model="item.linkDataJson.linkUrl" size="small" disabled>
                    <el-button slot="append" icon="el-icon-edit" @click="showDialogWechat(index)"></el-button>
                  </el-input>
                </el-form-item>
              </el-form>
              <i class="el-icon-close shop-close" @click="delImage(index)"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="图片上传">
          <el-upload class="upload-demo" action="/upload/image" :on-success="submitImage" name="imageFile" :before-upload="beforeImage" :show-file-list="false">
            <el-button size="small" type="primary" v-show="moduleForm.tabs<10">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议尺寸：750px * 340px，只能上传jpeg/jpg/png文件，且不超过2m。</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>



    <el-dialog title="商品" :visible.sync="dialogGoods" v-if="selectValue">
      <el-tabs v-model="goodsActiveName" @tab-click="getAppList">
        <el-tab-pane label="课程" name="0"></el-tab-pane>
        <el-tab-pane label="专栏" name="1"></el-tab-pane>
      </el-tabs>
      <div class="tar">
        <el-input placeholder="商品标题" size="small" class="w150 vam" v-model="goodsTitle"></el-input>
        <el-button size="small" type="primary" @click="getAppList">查询</el-button>
      </div>
      <el-table :data="appList" highlight-current-row style="width: 100%" @current-change="handleCurrentChange">
        <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
        <el-table-column label="商品信息">
          <template slot-scope="scope">
            <div class="list-goods otw">
              <img :src="scope.row.frontCover" alt="">
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
        </el-form-item>
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
        selectIndex: 0, // 选择index暂存
        appList: [
        ],
        pageOption: {
          pageNum: 1,
          pageSize: 5
        },
        totalSize: 0,
        goodsTitle: '',

      }
    },
    props: ['deployToggle', 'moduleForm', 'moduleIndex'],
    created() {
    },
    methods: {
      delImage(index) {
        this.moduleForm.tabs.splice(index, 1)
      },
      beforeImage(file) {
        console.log(file)
        const isJPG = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif';
        const isLt2M = file.size / 1024 < 2048;
        const isIMGLENGTH = this.moduleForm.tabs.length < 10;
        if (!isJPG) {
          this.$message.error('上传图片只能是 jpeg/jpg/png/gif 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2M!');
        }
        if(!isIMGLENGTH){
          this.$message.error('最多上传10张图片!');
        }
        return isJPG && isLt2M && isIMGLENGTH;
      },
      // 上传图片
      submitImage(res, file, fileList) {
        if (res.success) {
          let obj = {
            "pictureUrl": res.data.fileUrl,
            "linkType": 0,
            "linkDataJson": {}
          };
          this.moduleForm.tabs.push(obj)
        }
      },
      changeImage(res,index){
        this.moduleForm.tabs[index]['pictureUrl'] = res.data.fileUrl
        this.$set(this.moduleForm.tabs, index, this.moduleForm.tabs[index])
      },
      selectOver() {
        this.moduleForm.tabs[this.selectIndex].linkDataJson = this.selectValue;
        this.$set(this.moduleForm.tabs, this.selectIndex, this.moduleForm.tabs[this.selectIndex])
        console.log(this.moduleForm.tabs)
        this.dialogGoods = false;
        this.dialogHref = false;
        this.dialogWechat = false;
      },
      handleCurrentChange(row) {
        console.log(row)
        this.selectValue = row;
      },
      getAppList(v) {
        if(v){
          this.goodsTitle = "";
        }
        console.log(1)
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
        this.getAppList();
      },
      changeDeploy() {
        this.$emit('changeDeploy', this.moduleIndex)
      },
      showDialogGoods(index) {
        this.selectValue = {};
        this.goodsTitle = "";
        this.selectIndex = index;
        this.getAppList();
        this.dialogGoods = true;
      },
      showDialogHref(index) {
        this.dialogHref = true;
        this.selectValue = {
          linkUrl: this.selectValue.linkUrl?this.selectValue.linkUrl:"https://",
        }
        this.selectIndex = index;
      },
      showDialogWechat(index) {
        this.dialogWechat = true;
        this.selectValue = {
          appId: this.selectValue.appId ? this.selectValue.appId: "",
          linkUrl: this.selectValue.linkUrl ? this.selectValue.linkUrl: "",
          courseType: this.selectValue.courseType ? this.selectValue.courseType: 1,
        };
        this.selectIndex = index;
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

  }
</script>
<style lang="less" scoped>
  @import "../../../styles/components/knowledge.less";
  .module-content {
    padding: 15px;
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

  .shop-list-upload{
    display: inline-block;
    margin-left: 10px;
  }

  .page-control {
    float: right;
    margin-top: 20px;
    &:after {
      clear: both;
    }
  }
</style>