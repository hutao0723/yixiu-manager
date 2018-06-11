<template>
    <div>
        <!-- <el-row> -->
          <draggable v-model="newPosterMsg" @update="datadragEnd">
            <el-col v-for="(item, index) in posterMsg" class="showCol" :span="8" :key="index">
                <el-card class="showPoster" :style="{ width: posterWidth/unitLength + 'px', height: posterHeight/unitLength + 'px', backgroundImage: 'url('+item.poster+')', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center' }" :body-style="{ padding: 0 }" @mouseout.native="onMouseOut(index)" @mouseover.native="onMouseOver(index)">
                    <div :style="{ position: 'absolute', border: '1px solid #dad2d2', width: item.portraitLength/unitLength + 'px', height: item.portraitLength/unitLength + 'px', left: item.portraitLeftMargin/unitLength + 'px', top: item.portraitTopMargin/unitLength + 'px', borderRadius: item.portraitRoundProportion + '%', display: item.portraitDisplay === 1 ? 'block' : 'none' }"></div>
                    <div :style="{ textAlign: 'center', position: 'absolute', fontSize: item.nicknameFontSize/unitLength + 'px', left: item.nicknameLeftMargin/unitLength + 'px', top: item.nicknameTopMargin/unitLength + 'px', width: item.nicknameWidth/unitLength + 'px', height: item.nicknameHeight/unitLength + 'px', color: item.nicknameFontColor, display: item.nicknameDisplay === 1 ? 'block' : 'none' }">昵称</div>
                    <div v-if="$route.path == '/manager/knowledge/distribute'" :style="{ textAlign: 'center', position: 'absolute', fontSize: item.ctitleFontSize/unitLength + 'px', left: item.ctitleLeftMargin/unitLength + 'px', top: item.ctitleTopMargin/unitLength + 'px', width: item.ctitleWidth/unitLength + 'px', height: item.ctitleHeight/unitLength + 'px', color: item.ctitleFontColor, display: item.ctitleDisplay === 1 ? 'block' : 'none' }">商品标题</div>
                    <div :style="{ position: 'absolute', border: '1px solid #dad2d2', width: item.qrcodeLength/unitLength + 'px', height: item.qrcodeLength/unitLength + 'px', left: item.qrcodeLeftMargin/unitLength + 'px', top: item.qrcodeTopMargin/unitLength + 'px' }"></div>
                    <el-button v-show="diaplayState==index" type="text" class="deletePosterBtn" @click="deletePoster(item.id)">
                        <i class="el-icon-circle-close-outline"></i>
                    </el-button>
                    <el-button type="text" class="editPosterBtn" @click="editPoster('edit', item.id, item)" v-show="diaplayState==index">修改</el-button>
                </el-card>
            </el-col>
          </draggable>
            <el-col :span="8">
              <el-card class="showPoster addCard" :style="{ width: posterWidth/unitLength + 'px', height: posterHeight/unitLength + 'px' }" v-if="posterMsg.length < 10" :body-style="{ padding: 0 }">
                <el-button class="addBtn" :style="{ lineHeight: posterHeight/unitLength + 'px' }" @click="addPoster('add')">+添加</el-button>
              </el-card>
            </el-col>
        <!-- </el-row> -->
        <el-dialog width="63%" :title="this.dialogType === 'edit' ? '编辑海报' : '添加海报'" :visible.sync="dialogPosters">
            <div class="mainDialog">
                <h5>{{ this.dialogType === 'edit' ? '编辑海报：' : '添加海报：' }}</h5>
                <div class="mainDiv">
                    <el-card class="showPoster mainPoster" :style="{ minWidth: posterWidth/unitLength + 'px',  width: posterWidth/unitLength + 'px', height: posterHeight/unitLength + 'px', float: 'left', backgroundImage: 'url(' + this.newPosterDetail.poster + ')' }" :body-style="{ padding: 0 }">
                      <div class="headImg" :style="{ fontSize: this.headFont/unitLength + 'px', minWidth: minLength1/unitLength + 'px', minHeight: minLength1/unitLength + 'px', maxWidth: maxLength1/unitLength + 'px', maxHeight: maxLength1/unitLength + 'px', border: '1px solid #dad2d2', textAlign: 'center', lineHeight: this.newPosterDetail.portraitLength/unitLength + 'px', boxSizing: 'border-box', width: this.newPosterDetail.portraitLength/unitLength + 'px', height: this.newPosterDetail.portraitLength/unitLength + 'px', left: this.newPosterDetail.portraitLeftMargin/unitLength + 'px', top: this.newPosterDetail.portraitTopMargin/unitLength + 'px', borderRadius: this.newPosterDetail.portraitRoundProportion + '%', display: this.newPosterDetail.portraitDisplay === 1 ? 'block' : 'none' }">
                        头像
                      </div>
                      <div class="nickName" :style="{ minWidth: this.newPosterDetail.nicknameWidth/unitLength + 'px', boxSizing: 'border-box', border: '1px solid #dad2d2', padding: '0', textAlign: 'center', lineHeight: this.newPosterDetail.nicknameHeight/unitLength + 'px', fontSize: this.newPosterDetail.nicknameFontSize/unitLength + 'px', left: this.newPosterDetail.nicknameLeftMargin/unitLength + 'px', top: this.newPosterDetail.nicknameTopMargin/unitLength + 'px', width: this.newPosterDetail.nicknameWidth/unitLength + 'px', height: this.newPosterDetail.nicknameHeight/unitLength + 'px', color: this.newPosterDetail.nicknameFontColor, display: this.newPosterDetail.nicknameDisplay === 1 ? 'block' : 'none' }" >昵称</div>
                      <div v-if="$route.path == '/manager/knowledge/distribute'" name="goodsName" class="goodsName" :style="{ boxSizing: 'border-box',  border: '1px solid #dad2d2', textAlign: 'center', lineHeight: this.newPosterDetail.ctitleHeight/unitLength + 'px', fontSize: this.newPosterDetail.ctitleFontSize/unitLength + 'px', left: this.newPosterDetail.ctitleLeftMargin/unitLength + 'px', top: this.newPosterDetail.ctitleTopMargin/unitLength + 'px', width: this.newPosterDetail.ctitleWidth/unitLength + 'px', height: this.newPosterDetail.ctitleHeight/unitLength + 'px', color: this.newPosterDetail.ctitleFontColor, display: this.newPosterDetail.ctitleDisplay === 1 ? 'block' : 'none' }">商品标题</div>
                      <div class="qrCode" :style="{ fontSize: this.qrCodeFont/unitLength + 'px', minWidth: maxLength1/unitLength + 'px', minHeight: maxLength1/unitLength + 'px', maxWidth: maxLength2/unitLength + 'px', maxHeight: maxLength2/unitLength + 'px', border: '1px solid #dad2d2', boxSizing: 'border-box', textAlign: 'center', lineHeight: this.newPosterDetail.qrcodeLength/unitLength + 'px', width: this.newPosterDetail.qrcodeLength/unitLength + 'px', height: this.newPosterDetail.qrcodeLength/unitLength + 'px', left: this.newPosterDetail.qrcodeLeftMargin/unitLength + 'px', top: this.newPosterDetail.qrcodeTopMargin/unitLength + 'px' }">二维码</div>
                    </el-card>
                    <div class="postDetailInfo">
                      <div>
                        <el-upload class="uploadImg" action="/upload/image" name="imageFile" :show-file-list=false :on-success="changePoster" :before-upload="beforePosterUpload">
                          <el-button size="small" class="postBtn postPoster">上传海报</el-button>
                        </el-upload>
                        <div class="prompt">尺寸750px*1206px,支持<br/>jpg/jpeg/png,最大2M</div>
                      </div>
                      <h5 :style="{ marginBottom: '10px', clear: 'both' }">头像设置：</h5>
                      <el-radio-group v-model="newPosterDetail.portraitDisplay" :change="changePortraitDisplay">
                        <el-radio :label=1>显示</el-radio>
                        <el-radio :label=0>隐藏</el-radio>
                      </el-radio-group>
                      <el-row>
                        <el-col :span="8" class="setInfo">
                          圆角
                          <el-input-number v-model="newPosterDetail.portraitRoundProportion" class="font-detail" controls-position="right" size="mini" :min="100" :max="160"></el-input-number>
                          <span>%</span>
                        </el-col>
                        <el-col :span="8" class="setInfo">
                          大小
                          <el-input-number v-model.number="newPosterDetail.portraitLength" class="font-detail" controls-position="right" size="mini" :min="0" :max="160"></el-input-number>
                          <span>px</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="setInfo">
                          Left
                          <el-input-number v-model="newPosterDetail.portraitLeftMargin" class="font-detail" controls-position="right" size="mini" :min="0" :max="410"></el-input-number>
                          <span>px</span>
                        </el-col>
                        <el-col :span="8" class="setInfo">
                          Top
                          <el-input-number v-model="newPosterDetail.portraitTopMargin" class="font-detail" controls-position="right" size="mini" :min="0" :max="720"></el-input-number>
                          <span>px</span>
                        </el-col>
                      </el-row>
                      <h5 :style="{ 'margin-bottom': '10px', 'margin-top': '10px' }">昵称设置：</h5>
                      <el-radio-group v-model="newPosterDetail.nicknameDisplay" :change="changeNicknameDisplay">
                          <el-radio :label=1>显示</el-radio>
                          <el-radio :label=0>隐藏</el-radio>
                      </el-radio-group>
                      <el-row>
                        <el-col :span="8" class="setInfo">
                          Left
                          <el-input-number v-model="newPosterDetail.nicknameLeftMargin" class="font-detail" controls-position="right" size="mini" :min="0" :max="436"></el-input-number>
                          <span>px</span>
                        </el-col>
                        <el-col :span="8" class="setInfo">
                          Top
                          <el-input-number v-model="newPosterDetail.nicknameTopMargin" class="font-detail" controls-position="right" size="mini" :min="0" :max="790"></el-input-number>
                          <span>px</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="setInfo">
                          字号
                          <el-input-number v-model="newPosterDetail.nicknameFontSize" class="font-detail" controls-position="right" size="mini" :min="0" :max="56"></el-input-number>
                          <span>px</span>
                        </el-col>
                        <el-col :span="8" class="setInfo color">
                          颜色
                          <el-input v-model="newPosterDetail.nicknameFontColor" class="font-detail" size="mini"></el-input>
                          <el-color-picker v-model="newPosterDetail.nicknameFontColor" size="mini" class="colorPicker"></el-color-picker>
                        </el-col>
                      </el-row>
                      <div  v-if="$route.path == '/manager/knowledge/distribute'">
                        <h5 :style="{ 'margin-bottom': '10px', 'margin-top': '10px' }">商品标题：</h5>
                        <el-radio-group v-model="newPosterDetail.ctitleDisplay" :change="changeTitleDisplay">
                            <el-radio :label=1>显示</el-radio>
                            <el-radio :label=0>隐藏</el-radio>
                        </el-radio-group>
                        <el-row>
                          <el-col :span="8" class="setInfo">
                            Top
                            <el-input-number v-model="newPosterDetail.ctitleTopMargin" class="font-detail" controls-position="right" size="mini" :min="0" :max="780"></el-input-number>
                            <span>px</span>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="8" class="setInfo">
                            字号
                            <el-input-number v-model="newPosterDetail.ctitleFontSize" class="font-detail" controls-position="right" size="mini" :min="20" :max="50"></el-input-number>
                            <span>px</span>
                          </el-col>
                          <el-col :span="8" class="setInfo color">
                            颜色
                            <el-input v-model="newPosterDetail.ctitleFontColor" class="font-detail" size="mini"></el-input>
                            <el-color-picker v-model="newPosterDetail.ctitleFontColor" size="mini" class="colorPicker"></el-color-picker>
                          </el-col>
                        </el-row>
                      </div>
                      <h5 :style="{ 'margin-bottom': '10px', 'margin-top': '10px' }">二维码：</h5>
                      <el-row>
                        <el-col :span="8" class="setInfo">
                          大小
                          <el-input-number v-model="newPosterDetail.qrcodeLength" class="font-detail" controls-position="right" size="mini" :min="100" :max="260"></el-input-number>
                          <span>px</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="setInfo">
                          Left
                          <el-input-number v-model="newPosterDetail.qrcodeLeftMargin" class="font-detail" controls-position="right" size="mini" :min="0" :max="750-newPosterDetail.qrcodeLength"></el-input-number>
                          <span>px</span>
                        </el-col>
                        <el-col :span="8" class="setInfo">
                          Top
                          <el-input-number v-model="newPosterDetail.qrcodeTopMargin" class="font-detail" controls-position="right" size="mini" :min="0" :max="1206-newPosterDetail.qrcodeLength"></el-input-number>
                          <span>px</span>
                        </el-col>
                      </el-row>
                  </div>
                </div>
                <h5 :style="{ 'margin-top': '15px' }">海报小图：</h5>
                <el-upload class="postSmallPoster" action="/upload/image" :on-success="changeSmall" name="imageFile" :before-upload="beforeSmallPosterUpload" :show-file-list=false>
                  <div class="smallCard" v-if="this.newPosterDetail.smallPoster" :style="{ backgroundImage: 'url( '+ this.newPosterDetail.smallPoster +' )', backgroundSize: 'cover', backgroundPosition: 'center' }"></div>
                  <div v-else class="smallCard" :style="{ border: '1px solid #ccc' }"></div>
                  <el-button class="postSmallBtn" size="small">上传小图</el-button>
                </el-upload>
                <div class="prompt" :style="{ marginLeft: '170px', marginTop: '100px' }">尺寸120px*120px,支持<br/>jpg/jpeg/png,最大1M</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialogPosters = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="submitPoster">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="删除海报" width="25%" :visible.sync="dialogDeletePoster">
            <div class="deleteMsg">确定删除该海报？</div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialogDeletePoster = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="queryDeletePoster">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import draggable from "vuedraggable";
import qs from "qs";

export default {
  name: "poster",
  props: ["posterMsg"],
  components: {
    draggable
  },
  data() {
    return {
      qrCodeFont: Math.ceil(750/510*16),
      headFont: Math.ceil(750/510*12),
      minLength1: Math.ceil(750/510*62),
      maxLength1: Math.ceil(750/510*100),
      maxLength2: Math.ceil(750/510*160),
      posterWidth: Math.ceil(750/510*510),
      posterHeight: Math.ceil(750/510*820),
      unitLength: '',
      newPosterMsg: [],
      editId: "",
      deleteId: "",
      diaplayState: -1,
      dialogPosters: false,
      dialogDeletePoster: false,
      dialogType: "",
      radio: "1",
      posterDetail: {
        poster: "",
        smallPoster: "",
        portraitLength: 100,
        portraitLeftMargin: 329,
        portraitTopMargin: 80,
        portraitRoundProportion: 0,
        portraitDisplay: 1,
        nicknameFontSize: Math.ceil(750/510*22),
        nicknameWidth: Math.ceil(750/510*124),
        nicknameHeight: Math.ceil(750/510*50),
        nicknameLeftMargin: 288,
        nicknameTopMargin: 201,
        nicknameFontColor: "#000",
        nicknameDisplay: 1,
        ctitleWidth: Math.ceil(750/510*392),
        ctitleHeight: Math.ceil(750/510*40),
        ctitleLeftMargin: Math.ceil(750/510*59),
        ctitleTopMargin: Math.ceil(750/510*427),
        ctitleFontSize: Math.ceil(750/510*28),
        ctitleFontColor: "#000",
        ctitleDisplay: 1,
        qrcodeLength: 200,
        qrcodeLeftMargin: 275,
        qrcodeTopMargin: 935
      },
      newPosterDetail: {
        poster: "",
        smallPoster: "",
        portraitLength: 100,
        portraitLeftMargin: 329,
        portraitTopMargin: 80,
        portraitRoundProportion: 0,
        portraitDisplay: 1,
        nicknameFontSize: Math.ceil(750/510*22),
        nicknameWidth: Math.ceil(750/510*124),
        nicknameHeight: Math.ceil(750/510*50),
        nicknameLeftMargin: 288,
        nicknameTopMargin: 201,
        nicknameFontColor: "#000",
        nicknameDisplay: 1,
        ctitleWidth: Math.ceil(750/510*392),
        ctitleHeight: Math.ceil(750/510*40),
        ctitleLeftMargin: Math.ceil(750/510*59),
        ctitleTopMargin: Math.ceil(750/510*427),
        ctitleFontSize: Math.ceil(750/510*28),
        ctitleFontColor: "#000",
        ctitleDisplay: 1,
        qrcodeLength: 200,
        qrcodeLeftMargin: 275,
        qrcodeTopMargin: 935
      }
    };
  },
  watch: {
    posterMsg() {
      this.newPosterMsg = this.posterMsg;
    }
  },
  filters:{
    transition(v){
      return Math.ceil(750/510*v)
    }
  },
  mounted() {
    let unitPercent = document.documentElement.clientWidth ||document.body.clientWidth;
    if (unitPercent < 1000) {
      this.unitLength = 3.5;
    } else if (unitPercent >= 1000 && unitPercent < 1500) {
      this.unitLength = 2.5;
    } else if (unitPercent >= 1500) {
      this.unitLength = 2;
    }

    // console.log(this.unitLength)
  },
  methods: {
    datadragEnd(e) {
      let posterId = +this.newPosterMsg[e.newIndex].id;
      let start = +this.newPosterMsg[e.newIndex].sort;
      let end =
        e.newIndex > e.oldIndex
          ? +this.newPosterMsg[e.newIndex - 1].sort
          : +this.newPosterMsg[e.newIndex + 1].sort;
      let params = { start, end, posterId };
      // 移动海报的位置 start - 移动前的位置 end - 移动后的位置 posterId - 海报的ID
      this.$http.post("/poster/sortPosters", qs.stringify(params)).then(res => {
        let resp = res.data;
        if (resp.success) {
          this.$message.success("排序成功");
          this.$emit("get-poster-list");
        } else {
          let msg = resp.desc || "请求失败";
          this.$message.error(msg);
          this.$emit("get-poster-list");
        }
      });
    },
    changeTitleDisplay(value) {
      if (value === 1) {
        this.ctitleDisplay = 0;
      }
      this.ctitleDisplay = 1;
    },
    changePortraitDisplay(value) {
      if (value === 1) {
        this.portraitDisplay = 0;
      }
      this.portraitDisplay = 1;
    },
    changeNicknameDisplay() {
      if (value === 1) {
        this.nicknameDisplay = 0;
      }
      this.nicknameDisplay = 1;
    },
    addPoster(type) {
      const obj = JSON.parse(JSON.stringify(this.posterDetail));
      this.newPosterDetail = obj;
      this.dialogPosters = true;
      this.dialogType = type;
    },
    deletePoster(id) {
      this.deleteId = id;
      this.dialogDeletePoster = true;
    },
    queryDeletePoster() {
      let params = {
        id: this.deleteId
      };
      this.$http.post("/poster/delete?id=" + this.deleteId).then(
        res => {
          let resp = res.data;
          if (resp.success === true) {
            let msg = resp.desc || "删除海报成功";
            this.dialogDeletePoster = false;
            this.$message.success(msg);
            this.$emit("queryPoster");
          } else {
            let msg = resp.desc || "请求失败";
            this.$message.error(msg);
          }
        },
        () => {
          this.$message.error("网络错误");
        }
      );
      this.dialogDeletePoster = false;
    },
    editPoster(type, id, detail) {
      this.newPosterDetail = null;
      this.dialogPosters = true;
      this.dialogType = type;
      this.editId = id;
      this.newPosterDetail = detail;
      
    },
    onMouseOver(index) {
      this.diaplayState = index;
    },
    onMouseOut(index) {
      this.diaplayState = -1;
    },
    changeSmall(res, file) {
      const self = this;
      const image = new Image();
      image.src = "https:" + res.data.fileUrl;
      image.onload = function() {
        const width = image.width;
        const height = image.height;
        if (width == 120 && height == 120) {
          self.newPosterDetail.smallPoster = "https:" + res.data.fileUrl;
        } else {
          self.$message.error("上传图片的尺寸必须为 120*120!");
        }
      };
    },
    beforeSmallPosterUpload(file) {
      const isType = file.type === 'image/jpg' || file.type === 'image/png' || file.type ==='image/jpeg';
      const isSize = file.size / 1024 / 1024 < 1;
      if (!isType) {
        this.$message.error("上传小图只能是 JPG/JPEG/PNG 格式!");
      }
      if (!isSize) {
        this.$message.error("上传小图大小不能超过 1MB!");
      }
      return isType && isSize;
    },
    changePoster(res, file) {
      const self = this;
      const image = new Image();
      image.src = "https:" + res.data.fileUrl;
      image.onload = function() {
        const width = image.width;
        const height = image.height;
        if (width == 750 && height == 1206) {
          self.newPosterDetail.poster = "https:" + res.data.fileUrl;
        } else {
          self.$message.error("上传图片的尺寸必须为 750*1206!");
        }
      };
    },
    beforePosterUpload(file) {
      const isType =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      const isSize = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error("上传海报图片只能是 JPG/JPEG/PNG 格式!");
      }
      if (!isSize) {
        this.$message.error("上传海报图片大小不能超过 2MB!");
      }
      return isType && isSize;
    },
    submitPoster() {
      let conversion = function (number) {
        return Math.round(number /(750/510))
      };
      if (this.dialogType === "edit") {
        let updatePosterParams = JSON.parse(
          JSON.stringify(this.newPosterDetail)
        );
        let posterType = this.$route.path;
        if (posterType === "/manager/knowledge/distribute") {
          updatePosterParams["itemId"] = 0;
          updatePosterParams["itemType"] = 0;
          updatePosterParams["id"] = this.editId;
        } else if (posterType === "/manager/knowledge/readPoster") {
          updatePosterParams["itemId"] = 0;
          updatePosterParams["itemType"] = 3;
          updatePosterParams["id"] = this.editId;
          updatePosterParams["ctitleDisplay"] = 0;
        }

        // 更新海报参数
        updatePosterParams.portraitLength = conversion(updatePosterParams.portraitLength)
        updatePosterParams.portraitLeftMargin = conversion(updatePosterParams.portraitLeftMargin)
        updatePosterParams.portraitTopMargin = conversion(updatePosterParams.portraitTopMargin)
        updatePosterParams.nicknameFontSize = conversion(updatePosterParams.nicknameFontSize)
        updatePosterParams.nicknameWidth = conversion(updatePosterParams.nicknameWidth)
        updatePosterParams.nicknameHeight = conversion(updatePosterParams.nicknameHeight)
        updatePosterParams.nicknameLeftMargin = conversion(updatePosterParams.nicknameLeftMargin)
        updatePosterParams.nicknameTopMargin = conversion(updatePosterParams.nicknameTopMargin)
        updatePosterParams.ctitleWidth = conversion(updatePosterParams.ctitleWidth)
        updatePosterParams.ctitleHeight = conversion(updatePosterParams.ctitleHeight)
        updatePosterParams.ctitleLeftMargin = conversion(updatePosterParams.ctitleLeftMargin)
        updatePosterParams.ctitleTopMargin = conversion(updatePosterParams.ctitleTopMargin)
        updatePosterParams.ctitleFontSize = conversion(updatePosterParams.ctitleFontSize)
        updatePosterParams.qrcodeLength = conversion(updatePosterParams.qrcodeLength)
        updatePosterParams.qrcodeLeftMargin = conversion(updatePosterParams.qrcodeLeftMargin)
        updatePosterParams.qrcodeTopMargin = conversion(updatePosterParams.qrcodeTopMargin)

        console.log(updatePosterParams)
        this.$http.post("/poster/update", updatePosterParams).then(
          res => {
            let resp = res.data;
            if (resp.success === true) {
              let msg = resp.desc || "修改海报成功";
              this.dialogPosters = false;
              this.$message.success(msg);
              this.$emit("queryPoster");
            } else {
              let msg = resp.desc || "修改海报失败";
              // this.dialogPosters = false;
              this.$message.error(msg);
            }
          },
          () => {
            this.$message.error("网络错误");
          }
        );
      } else {
        let addPosterParams = JSON.parse(JSON.stringify(this.newPosterDetail));
        let posterType = this.$route.path;
        if (posterType === "/manager/knowledge/distribute") {
          addPosterParams["itemId"] = 0;
          addPosterParams["itemType"] = 0;
        } else if (posterType === "/manager/knowledge/readPoster") {
          addPosterParams["itemId"] = 0;
          addPosterParams["itemType"] = 3;
          addPosterParams["ctitleDisplay"] = 0;
        }

        // 在这里进行将海报的750下的所有参数适配成510的参数

        addPosterParams.portraitLength = conversion(addPosterParams.portraitLength)
        addPosterParams.portraitLeftMargin = conversion(addPosterParams.portraitLeftMargin)
        addPosterParams.portraitTopMargin = conversion(addPosterParams.portraitTopMargin)
        addPosterParams.nicknameFontSize = conversion(addPosterParams.nicknameFontSize)
        addPosterParams.nicknameWidth = conversion(addPosterParams.nicknameWidth)
        addPosterParams.nicknameHeight = conversion(addPosterParams.nicknameHeight)
        addPosterParams.nicknameLeftMargin = conversion(addPosterParams.nicknameLeftMargin)
        addPosterParams.nicknameTopMargin = conversion(addPosterParams.nicknameTopMargin)
        addPosterParams.ctitleWidth = conversion(addPosterParams.ctitleWidth)
        addPosterParams.ctitleHeight = conversion(addPosterParams.ctitleHeight)
        addPosterParams.ctitleLeftMargin = conversion(addPosterParams.ctitleLeftMargin)
        addPosterParams.ctitleTopMargin = conversion(addPosterParams.ctitleTopMargin)
        addPosterParams.ctitleFontSize = conversion(addPosterParams.ctitleFontSize)
        addPosterParams.qrcodeLength = conversion(addPosterParams.qrcodeLength)
        addPosterParams.qrcodeLeftMargin = conversion(addPosterParams.qrcodeLeftMargin)
        addPosterParams.qrcodeTopMargin = conversion(addPosterParams.qrcodeTopMargin)

        // console.log(addPosterParams)
        this.$http.post("/poster/add", addPosterParams).then(
          res => {
            let resp = res.data;
            if (resp.success === true) {
              let msg = resp.desc || "新建海报成功";
              this.dialogPosters = false;
              this.$message.success(msg);
              this.$emit("queryPoster");
            } else {
              let msg = resp.desc || "新建海报失败";
              // this.dialogPosters = false;
              this.$message.error(msg);
            }
          },
          () => {
            this.$message.error("网络错误");
          }
        );
      }
    }
  }
};
</script>
<style lang="less" scoped>
.showPoster {
   width: 750px;
  height: 1206px;
  margin: 0;
  padding: 0;
  margin-right: 0px;
  display: inline-block;
  box-sizing: content-box;
  position: relative;
}
.mainPoster {
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center;
}
.addCard {
  background-color: white;
}
.addBtn {
  width: 100%;
  height: 100%;
  text-align: center;
  // line-height: 820px;
  border: 0;
  background-color: white;
}
.editPosterBtn {
  width: 100%;
  height: 35px;
  background-color: gray;
  color: white;
  margin-left: 0;
  position: absolute;
  bottom: 0;
  border-radius: 0;
}
.deletePosterBtn {
  color: black;
  position: absolute;
  top: -13px;
  right: -1px;
}
.showTag {
  display: block;
}
.mainDiv {
  display: flex;
  overflow: hidden;
  margin-top: 20px;
  margin-left: 35px;
}
.smallImg {
  height: 50px;
  line-height: 50px;
  margin-top: 20px;
  margin-left: 40px;
}
.smallCard {
  float: left;
  width: 120px;
  height: 120px;
}
// .postSmall {
//   float: left;
//   margin-top: 6px;
//   margin-left: 40px;
// }
.mainDialog {
  margin-left: 30px;
}
.headImg {
  position: absolute;
    min-width: 62px;
  min-height: 62px;
  max-width: 100px;
  max-height: 100px;

}
.nickName {
  font-family: PingFangSC-Semibold, sans-serif;
  text-align: center;
  width: 200px;
  position: absolute;
  width: 62px;
  background-color: transparent;
  border: 0;
}
.goodsName {
  border: 0;
  position: absolute;
  text-align: center;
  background-color: transparent;
  overflow: hidden;
  padding: 0;
}
.qrCode {
  min-width: 100px;
  min-height: 100px;
  max-width: 160px;
  max-height: 160px;
  position: absolute;
  text-align: center;
}
.postDetailInfo {
  min-width: 360px;
  float: left;
  padding-top: 0;
  text-align: center;
  flex: 1;
  text-align: left;
  padding-left: 30px;
}
.postPoster {
  margin-bottom: 10px;
}
.font-detail {
  width: 100px;
}
.setInfo {
  margin-bottom: 10px;
  min-width: 170px;
}
.postSmallPoster {
  position: relative;
  margin-left: 70px;
  margin-top: 20px;
  float: left;
}
.postSmallBtn {
  position: absolute;
  top: 80%;
  transform: translateY(-50%);
  left: 190px;
}
.deleteMsg {
  padding-left: 50px;
}
.color {
  position: relative;
}
.colorPicker {
  vertical-align: middle;
}
.prompt {
  float: left;
  margin-left: 10px;
  color: black;
}
.uploadImg {
  float: left;
}
// .showCol {
//   margin-bottom: 20px;
// }
</style>
<style>
.el-dialog__wrapper .el-dialog {
  min-width: 800px;
}
</style>
