<template>
    <div>
        <!-- <el-row> -->
          <draggable v-model="newPosterMsg" @update="datadragEnd">
            <el-col v-for="(item, index) in posterMsg" class="showCol" :span="8" :key="index">
                <el-card class="showPoster" :style="{ backgroundImage: 'url('+item.poster+')', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center' }" :body-style="{ padding: 0 }" @mouseout.native="onMouseOut(index)" @mouseover.native="onMouseOver(index)">
                    <div class="headImg" :style="{ border: '1px solid #dad2d2', width: item.portraitLength + 'px', height: item.portraitLength + 'px', left: item.portraitLeftMargin + 'px', top: item.portraitTopMargin + 'px', borderRadius: item.portraitRoundProportion + '%', display: item.portraitDisplay === 1 ? 'block' : 'none' }"></div>
                    <div class="nickName" :style="{ fontSize: item.nicknameFontSize + 'px', left: item.nicknameLeftMargin + 'px', top: item.nicknameTopMargin + 'px', width: item.nicknameWidth + 'px', height: item.nicknameHeight + 'px', color: item.nicknameFontColor, display: item.nicknameDisplay === 1 ? 'block' : 'none' }">昵称</div>
                    <div class="goodsName" :style="{ fontSize: item.ctitleFontSize + 'px', left: item.ctitleLeftMargin + 'px', top: item.ctitleTopMargin + 'px', width: item.ctitleWidth + 'px', height: item.ctitleHeight + 'px', color: item.ctitleFontColor, display: item.ctitleDisplay === 1 ? 'block' : 'none' }">商品标题</div>
                    <div class="qrCode" :style="{ border: '1px solid #dad2d2', width: item.qrcodeLength + 'px', height: item.qrcodeLength + 'px', left: item.qrcodeLeftMargin + 'px', top: item.qrcodeTopMargin + 'px' }"></div>
                    <el-button v-show="diaplayState==index" type="text" class="deletePosterBtn" @click="deletePoster(item.id)">
                        <i class="el-icon-circle-close-outline"></i>
                    </el-button>
                    <el-button type="text" class="editPosterBtn" @click="editPoster('edit', item.id, item)" v-show="diaplayState==index">修改</el-button>
                </el-card>
            </el-col>
          </draggable>
            <el-card class="showPoster addCard" v-if="posterMsg.length < 10" :body-style="{ padding: 0 }">
                <el-button class="addBtn" @click="addPoster('add')">+添加</el-button>
            </el-card>
        <!-- </el-row> -->
        <el-dialog :title="this.dialogType === 'edit' ? '编辑海报' : '添加海报'" :visible.sync="dialogPosters">
            <div class="mainDialog">
                <h5>{{ this.dialogType === 'edit' ? '编辑海报：' : '添加海报：' }}</h5>
                <div class="mainDiv">
                    <el-card class="showPoster mainPoster" :style="{ float: 'left', backgroundImage: 'url(' + this.newPosterDetail.poster + ')' }" :body-style="{ padding: 0 }">
                      <div class="headImg" :style="{ border: '1px solid #dad2d2', textAlign: 'center', lineHeight: this.newPosterDetail.portraitLength + 'px', boxSizing: 'border-box', width: this.newPosterDetail.portraitLength + 'px', height: this.newPosterDetail.portraitLength + 'px', left: this.newPosterDetail.portraitLeftMargin + 'px', top: this.newPosterDetail.portraitTopMargin + 'px', borderRadius: this.newPosterDetail.portraitRoundProportion + '%', display: this.newPosterDetail.portraitDisplay === 1 ? 'block' : 'none' }">
                        头像
                      </div>
                      <div class="nickName" :style="{ boxSizing: 'border-box', border: '1px solid #dad2d2', padding: '0', textAlign: 'center', lineHeight: this.newPosterDetail.nicknameHeight + 'px', fontSize: this.newPosterDetail.nicknameFontSize + 'px', left: this.newPosterDetail.nicknameLeftMargin + 'px', top: this.newPosterDetail.nicknameTopMargin + 'px', width: this.newPosterDetail.nicknameWidth + 'px', height: this.newPosterDetail.nicknameHeight + 'px', color: this.newPosterDetail.nicknameFontColor, display: this.newPosterDetail.nicknameDisplay === 1 ? 'block' : 'none' }" >昵称</div>
                      <div name="goodsName" class="goodsName" :style="{ boxSizing: 'border-box',  border: '1px solid #dad2d2', textAlign: 'center', lineHeight: this.newPosterDetail.ctitleHeight + 'px', fontSize: this.newPosterDetail.ctitleFontSize + 'px', left: this.newPosterDetail.ctitleLeftMargin + 'px', top: this.newPosterDetail.ctitleTopMargin + 'px', width: this.newPosterDetail.ctitleWidth + 'px', height: this.newPosterDetail.ctitleHeight + 'px', color: this.newPosterDetail.ctitleFontColor, display: this.newPosterDetail.ctitleDisplay === 1 ? 'block' : 'none' }">商品标题</div>
                      <div class="qrCode" :style="{ border: '1px solid #dad2d2', boxSizing: 'border-box', textAlign: 'center', lineHeight: this.newPosterDetail.qrcodeLength + 'px', width: this.newPosterDetail.qrcodeLength + 'px', height: this.newPosterDetail.qrcodeLength + 'px', left: this.newPosterDetail.qrcodeLeftMargin + 'px', top: this.newPosterDetail.qrcodeTopMargin + 'px' }">二维码</div>
                    </el-card>
                    <div class="postDetailInfo">
                      <el-upload action="/upload/image" name="imageFile" :show-file-list=false :on-success="changePoster" :before-upload="beforePosterUpload">
                        <el-button size="small" class="postBtn postPoster">上传海报</el-button>
                      </el-upload>
                      <h5 :style="{ 'margin-bottom': '10px' }">头像设置：</h5>
                      <el-radio-group v-model="newPosterDetail.portraitDisplay" :change="changePortraitDisplay">
                        <el-radio :label=1>显示</el-radio>
                        <el-radio :label=0>隐藏</el-radio>
                      </el-radio-group>
                      <el-row>
                        <el-col :span="12" class="setInfo">
                          圆角
                          <el-input-number v-model="newPosterDetail.portraitRoundProportion" class="font-detail" controls-position="right" size="mini" :min="0" :max="50"></el-input-number>
                          <span>%</span>
                        </el-col>
                        <el-col :span="12" class="setInfo">
                          大小
                          <el-input-number v-model.number="newPosterDetail.portraitLength" class="font-detail" controls-position="right" size="mini" :min="62" :max="100"></el-input-number>
                          <span>px</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12" class="setInfo">
                          Left
                          <el-input-number v-model="newPosterDetail.portraitLeftMargin" class="font-detail" controls-position="right" size="mini" :min="0" :max="410"></el-input-number>
                          <span>px</span>
                        </el-col>
                        <el-col :span="12" class="setInfo">
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
                        <el-col :span="12" class="setInfo">
                          Left
                          <el-input-number v-model="newPosterDetail.nicknameLeftMargin" class="font-detail" controls-position="right" size="mini" :min="0" :max="436"></el-input-number>
                          <span>px</span>
                        </el-col>
                        <el-col :span="12" class="setInfo">
                          Top
                          <el-input-number v-model="newPosterDetail.nicknameTopMargin" class="font-detail" controls-position="right" size="mini" :min="0" :max="790"></el-input-number>
                          <span>px</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12" class="setInfo">
                          字号
                          <el-input-number v-model="newPosterDetail.nicknameFontSize" class="font-detail" controls-position="right" size="mini" :min="26" :max="56"></el-input-number>
                          <span>px</span>
                        </el-col>
                        <el-col :span="12" class="setInfo color">
                          颜色
                          <el-input v-model="newPosterDetail.nicknameFontColor" class="font-detail" size="mini"></el-input>
                          <el-color-picker v-model="newPosterDetail.nicknameFontColor" size="mini" class="colorPicker"></el-color-picker>
                        </el-col>
                      </el-row>
                      <h5 :style="{ 'margin-bottom': '10px', 'margin-top': '10px' }">商品标题：</h5>
                      <el-radio-group v-model="newPosterDetail.ctitleDisplay" :change="changeTitleDisplay">
                          <el-radio :label=1>显示</el-radio>
                          <el-radio :label=0>隐藏</el-radio>
                      </el-radio-group>
                      <el-row>
                        <el-col :span="12" class="setInfo">
                          Top
                          <el-input-number v-model="newPosterDetail.ctitleTopMargin" class="font-detail" controls-position="right" size="mini" :min="0" :max="780"></el-input-number>
                          <span>px</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12" class="setInfo">
                          字号
                          <el-input-number v-model="newPosterDetail.ctitleFontSize" class="font-detail" controls-position="right" size="mini" :min="20" :max="50"></el-input-number>
                          <span>px</span>
                        </el-col>
                        <el-col :span="12" class="setInfo color">
                          颜色
                          <el-input v-model="newPosterDetail.ctitleFontColor" class="font-detail" size="mini"></el-input>
                          <el-color-picker v-model="newPosterDetail.ctitleFontColor" size="mini" class="colorPicker"></el-color-picker>
                        </el-col>
                      </el-row>
                      <h5 :style="{ 'margin-bottom': '10px', 'margin-top': '10px' }">二维码：</h5>
                      <el-row>
                        <el-col :span="12" class="setInfo">
                          大小
                          <el-input-number v-model="newPosterDetail.qrcodeLength" class="font-detail" controls-position="right" size="mini" :min="100" :max="160"></el-input-number>
                          <span>px</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12" class="setInfo">
                          Left
                          <el-input-number v-model="newPosterDetail.qrcodeLeftMargin" class="font-detail" controls-position="right" size="mini" :min="0" :max="350"></el-input-number>
                          <span>px</span>
                        </el-col>
                        <el-col :span="12" class="setInfo">
                          Top
                          <el-input-number v-model="newPosterDetail.qrcodeTopMargin" class="font-detail" controls-position="right" size="mini" :min="0" :max="660"></el-input-number>
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
        portraitLength: 62,
        portraitLeftMargin: 224,
        portraitTopMargin: 54,
        portraitRoundProportion: 0,
        portraitDisplay: 1,
        nicknameFontSize: 22,
        nicknameWidth: 74,
        nicknameHeight: 30,
        nicknameLeftMargin: 218,
        nicknameTopMargin: 120,
        nicknameFontColor: "#000",
        nicknameDisplay: 1,
        ctitleWidth: 392,
        ctitleHeight: 40,
        ctitleLeftMargin: 59,
        ctitleTopMargin: 427,
        ctitleFontSize: 28,
        ctitleFontColor: "#000",
        ctitleDisplay: 1,
        qrcodeLength: 100,
        qrcodeLeftMargin: 205,
        qrcodeTopMargin: 631
      },
      newPosterDetail: {
        poster: "",
        smallPoster: "",
        portraitLength: 62,
        portraitLeftMargin: 224,
        portraitTopMargin: 54,
        portraitRoundProportion: 0,
        portraitDisplay: 1,
        nicknameFontSize: 22,
        nicknameWidth: 74,
        nicknameHeight: 30,
        nicknameLeftMargin: 218,
        nicknameTopMargin: 120,
        nicknameFontColor: "#000",
        nicknameDisplay: 1,
        ctitleWidth: 392,
        ctitleHeight: 40,
        ctitleLeftMargin: 59,
        ctitleTopMargin: 427,
        ctitleFontSize: 28,
        ctitleFontColor: "#000",
        ctitleDisplay: 1,
        qrcodeLength: 100,
        qrcodeLeftMargin: 205,
        qrcodeTopMargin: 631
      }
    };
  },
  watch: {
    posterMsg() {
      this.newPosterMsg = this.posterMsg;
    }
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
        if (width == 510 && height == 820) {
          self.newPosterDetail.poster = "https:" + res.data.fileUrl;
        } else {
          self.$message.error("上传图片的尺寸必须为 510*820!");
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
        }
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
        }
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
  width: 510px;
  height: 820px;
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
  line-height: 820px;
  border: 0;
  background-color: white;
}
.editPosterBtn {
  width: 100%;
  height: 50px;
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
  min-width: 62px;
  min-height: 62px;
  max-width: 100px;
  max-height: 100px;
  position: absolute;
}
.nickName {
  font-family: PingFangSC-Semibold, sans-serif;
  text-align: center;
  width: 200px;
  position: absolute;
  min-width: 62px;
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
  float: left;
  padding-top: 50px;
  text-align: center;
  flex: 1;
  text-align: left;
  padding-left: 20px;
}
.postPoster {
  margin-bottom: 40px;
}
.font-detail {
  width: 100px;
}
.setInfo {
  margin-bottom: 10px;
}
.postSmallPoster {
  position: relative;
  margin-left: 70px;
  margin-top: 20px;
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
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}
</style>
