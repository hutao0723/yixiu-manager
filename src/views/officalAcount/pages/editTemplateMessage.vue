<template>
    <section class="ofa-main-wrap">
        <div class="title-wrap">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <span>
                        <button class="goToDistribute" :style="{ 'border': 0, 'backgroundColor': 'white', 'font-size': '100%', 'margin': 0, 'padding': 0, 'color': '#606266', 'cursor': 'pointer' }" @click="goToOfficalList">公众号&nbsp;>&nbsp;</button>
                        <button class="goToDistribute" :style="{ 'border': 0, 'backgroundColor': 'white', 'font-size': '100%', 'margin': 0, 'padding': 0, 'color': '#606266', 'cursor': 'pointer' }" @click="goToTemplateList">模板消息&nbsp;>&nbsp;</button>
                        编辑
                    </span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="content">
            <div class="weChatMsg">
                <div class="weChatId">微信模板ID：</div>
                <el-input size="mini" class="weChatInput" v-model="templateDetail.templateId"></el-input>
                <el-tooltip class="item" effect="light"
                placement="right">
                  <div slot="content">请填写微信公众号生成的ID，<br/>选择的模板需要与之对应</div>
                  <i class="el-icon-question" :style="{ marginLeft: '10px' }"></i>
                </el-tooltip>
                <span v-if="!templateDetail.templateId" :style="{ color: 'red', fontSize: '10px' }">微信ID不能为空</span>
            </div>
            <div class="configMsg">
                <div class="showConfig">
                    <div class="configTitle">{{ templateTitle }}</div>
                    <div v-if="templateDetail.templateType == 1" class="configContent">
                        <p :style="{ color: this.templateDetail.colorContent.first }">{{ templateDetail.firstData }}</p>
                        <p>
                          <span>商品信息:</span>
                          <span :style="{ color: this.templateDetail.colorContent.keyword1 }">{{ title }}</span>
                        </p>
                        <!--<p>-->
                          <!--<span>订单商品:</span>-->
                          <!--<span :style="{ color: this.templateDetail.colorContent.keyword1 }">{{ goodsName }}</span>-->
                        <!--</p>-->
                        <!--<p>-->
                          <!--<span>订单编号:</span>-->
                          <!--<span :style="{ color: this.templateDetail.colorContent.keyword2 }">{{ goodsId }}</span>-->
                        <!--</p>-->
                        <!--<p>-->
                          <!--<span>订单金额:</span>-->
                          <!--<span :style="{ color: this.templateDetail.colorContent.keyword3 }">{{ goodsMoney }}</span>-->
                        <!--</p>-->
                        <!--<p>-->
                          <!--<span>支付时间:</span>-->
                          <!--<span :style="{ color: this.templateDetail.colorContent.keyword4 }">{{ goodsTime }}</span>-->
                        <!--</p>-->
                        <p :style="{ color: this.templateDetail.colorContent.remark }">
                          <span>remark:</span>
                          <span>{{ templateDetail.remarkData }}</span>
                        </p>
                    </div>
                    <div v-if="templateDetail.templateType == 3" class="configContent">
                        <p :style="{ color: this.templateDetail.colorContent.first }">{{ templateDetail.firstData }}</p>
                        <p>

                          <span>用户昵称:</span>
                          <span :style="{ color: this.templateDetail.colorContent.keyword1 }">{{ nickName }}</span>
                        </p>
                        <p>
                          <span>绑定时间:</span>
                          <span :style="{ color: this.templateDetail.colorContent.keyword2 }">{{ bindTime }}</span>
                        </p>
                        <p>
                          <span>备注:</span>
                          <span :style="{ color: this.templateDetail.colorContent.keyword3 }">{{ remarkData }}</span>
                        </p>
                        <p :style="{ color: this.templateDetail.colorContent.remark }">
                          <span>remark:</span>
                          <span>{{ templateDetail.remarkData }}</span>
                        </p>
                    </div>
                    <div v-if="templateDetail.templateType == 4" class="configContent">
                        <p :style="{ color: this.templateDetail.colorContent.first }">{{ templateDetail.firstData }}</p>
                        <p>
                          <span>收益金额:</span>
                          <span :style="{ color: this.templateDetail.colorContent.keyword1 }">{{ getCommission }}</span>
                        </p>
                        <p>

                          <span>收益来源:</span>
                          <span :style="{ color: this.templateDetail.colorContent.keyword2 }">{{ moneyFrom }}</span>
                        </p>
                        <p>
                          <span>到账时间:</span>
                          <span :style="{ color: this.templateDetail.colorContent.keyword3 }">{{ bindTime }}</span>
                        </p>
                        <p :style="{ color: this.templateDetail.colorContent.remark }">
                          <span>remark:</span>
                          <span>{{ templateDetail.remarkData }}</span>
                        </p>
                    </div>
                    <div v-if="templateDetail.templateType == 5" class="configContent">
                        <p :style="{ color: this.templateDetail.colorContent.first }">{{ templateDetail.firstData }}</p>
                        <p>

                          <span>提现金额:</span>
                          <span :style="{ color: this.templateDetail.colorContent.keyword1 }">{{ putMoney }}</span>
                        </p>
                        <p>
                          <span>提现时间:</span>
                          <span :style="{ color: this.templateDetail.colorContent.keyword2 }">{{ putTime }}</span>
                        </p>
                        <p>
                          <span>理由:</span>
                          <span :style="{ color: this.templateDetail.colorContent.keyword3 }">{{ reason }}</span>
                        </p>
                        <p :style="{ color: this.templateDetail.colorContent.remark }">
                          <span>remark:</span>
                          <span>{{ templateDetail.remarkData }}</span>
                        </p>
                    </div>
                    <div v-if="templateDetail.templateType == 6" class="configContent">
                      <p :style="{ color: this.templateDetail.colorContent.first }">{{ templateDetail.firstData }}</p>
                      <p>

                        <span>订购内容:</span>
                        <span :style="{ color: this.templateDetail.colorContent.keyword1 }">{{ itemName }}</span>
                      </p>
                      <p>
                        <span>过期时间:</span>
                        <span :style="{ color: this.templateDetail.colorContent.keyword2 }">{{ gmtCreate }}</span>
                      </p>
                      <p>
                        <span>订单金额:</span>
                        <span :style="{ color: this.templateDetail.colorContent.keyword3 }">{{ amount }}</span>
                      </p>
                      <p :style="{ color: this.templateDetail.colorContent.remark }">
                        <span>remark:</span>
                        <span>{{ templateDetail.remarkData }}</span>
                      </p>
                    </div>
                    <div v-if="templateDetail.templateType == 7" class="configContent">
                    <p :style="{ color: this.templateDetail.colorContent.first }">{{ templateDetail.firstData }}</p>
                    <p>

                      <span> 用户昵称:</span>
                      <span :style="{ color: this.templateDetail.colorContent.keyword1 }">{{ nickname }}</span>
                    </p>
                    <p>
                      <span>活动开始时间:</span>
                      <span :style="{ color: this.templateDetail.colorContent.keyword2 }">{{ beginDate }}</span>
                    </p>
                    <p :style="{ color: this.templateDetail.colorContent.remark }">
                      <span>remark:</span>
                      <span>{{ templateDetail.remarkData }}</span>
                    </p>
                  </div>
                    <div v-if="templateDetail.templateType == 8" class="configContent">  <!--每日学习-->
                      <p :style="{ color: this.templateDetail.colorContent.first }">{{ templateDetail.firstData }}</p>
                      <p>

                        <span> 课程名称:</span>
                        <span :style="{ color: this.templateDetail.colorContent.keyword1 }">{{ title }}</span>
                      </p>
                      <p>
                        <span>开始时间:</span>
                        <span :style="{ color: this.templateDetail.colorContent.keyword2 }">{{ today }}</span>
                      </p>
                      <p :style="{ color: this.templateDetail.colorContent.remark }">
                        <span>remark:</span>
                        <span>{{ templateDetail.remarkData }}</span>
                      </p>
                    </div>
                    <div v-if="templateDetail.templateType == 9" class="configContent">  <!--每日打卡-->
                      <p :style="{ color: this.templateDetail.colorContent.first }">{{ templateDetail.firstData }}</p>
                      <p>

                        <span>课程:</span>
                        <span :style="{ color: this.templateDetail.colorContent.keyword1 }">{{ title }}</span>
                      </p>
                      <p>
                        <span>时间:</span>
                        <span :style="{ color: this.templateDetail.colorContent.keyword2 }">{{ today }}</span>
                      </p>
                      <p :style="{ color: this.templateDetail.colorContent.remark }">
                        <span>remark:</span>
                        <span>{{ templateDetail.remarkData }}</span>
                      </p>
                    </div>
                    <div v-if="templateDetail.templateType == 10" class="configContent">  <!--领券成功通知-->
                      <p :style="{ color: this.templateDetail.colorContent.first }">{{ templateDetail.firstData }}</p>
                      <p>

                        <span>领取人:</span>
                        <span :style="{ color: this.templateDetail.colorContent.keyword1 }">{{ nickname }}</span>
                      </p>
                      <p>
                        <span>礼品:</span>
                        <span :style="{ color: this.templateDetail.colorContent.keyword2 }">{{ couponPrice }}元优惠券</span>
                      </p>
                      <p>
                        <span>领取时间:</span>
                        <span :style="{ color: this.templateDetail.colorContent.keyword2 }">{{ gmtCreate }}</span>
                      </p>
                      <p :style="{ color: this.templateDetail.colorContent.remark }">
                        <span>remark:</span>
                        <span>{{ templateDetail.remarkData }}</span>
                      </p>
                    </div>
                    <div v-if="templateDetail.templateType == 11" class="configContent">  <!--优惠券过期提醒-->
                        <p :style="{ color: this.templateDetail.colorContent.first }">{{ templateDetail.firstData }}</p>
                        <p>

                          <span>店铺名称:</span>
                          <span :style="{ color: this.templateDetail.colorContent.keyword1 }">一修读书</span>
                        </p>
                        <p>
                          <span>服务时间:</span>
                          <span :style="{ color: this.templateDetail.colorContent.keyword2 }">至{{ couponEnd_Time }}</span>
                        </p>
                        <p :style="{ color: this.templateDetail.colorContent.remark }">
                          <span>remark:</span>
                          <span>{{ templateDetail.remarkData }}</span>
                        </p>
                      </div>
                    </div>
                <div class="configDetail">
                    <div class="editTitle">配置模板内容：</div>
                    <div class="editContent">
                        <div class="attributePage">
                            <div class="attribute">first</div>
                            <el-input v-model="templateDetail.firstData" size="mini" class="attributeContent" :maxlength="100"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.first" class="colorPicker" size="mini"></el-color-picker>
                        </div>
                        <div v-if="templateDetail.templateType == 1">
                          <div class="attributePage">
                            <div class="attribute">
                              <i class="el-icon-star-on star"></i>
                              商品信息</div>
                            <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{title}"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.keyword1" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                            <!--<div class="attribute">-->
                                <!--<i class="el-icon-star-on star"></i>-->
                                <!--订单商品</div>-->
                            <!--<el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{itemId}"></el-input>-->
                            <!--<el-color-picker v-model="templateDetail.colorContent.keyword1" class="colorPicker" size="mini"></el-color-picker>-->
                          <!--</div>-->
                          <!--<div class="attributePage">-->
                              <!--<div class="attribute">-->
                                  <!--<i class="el-icon-star-on  star"></i>-->
                                  <!--订单编号</div>-->
                              <!--<el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{orderId}"></el-input>-->
                              <!--<el-color-picker v-model="templateDetail.colorContent.keyword2" class="colorPicker" size="mini"></el-color-picker>-->
                          <!--</div>-->
                          <!--<div class="attributePage">-->
                              <!--<div class="attribute">-->
                                  <!--<i class="el-icon-star-on  star"></i>-->
                                  <!--订单金额</div>-->
                              <!--<el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{amount}"></el-input>-->
                              <!--<el-color-picker v-model="templateDetail.colorContent.keyword3" class="colorPicker" size="mini"></el-color-picker>-->
                          <!--</div>-->
                          <!--<div class="attributePage">-->
                              <!--<div class="attribute">-->
                                  <!--<i class="el-icon-star-on  star"></i>-->
                                  <!--支付时间</div>-->
                              <!--<el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{finishTime}"></el-input>-->
                              <!--<el-color-picker v-model="templateDetail.colorContent.keyword4" class="colorPicker" size="mini"></el-color-picker>-->
                          <!--</div>-->
                        </div>
                        <div v-if="templateDetail.templateType == 3">
                          <div class="attributePage">
                            <div class="attribute">
                                <i class="el-icon-star-on star"></i>
                                用户昵称</div>
                            <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{nickname}"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.keyword1" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                          <div class="attributePage">
                              <div class="attribute">
                                  <i class="el-icon-star-on  star"></i>
                                  绑定时间</div>
                              <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{bindTime}"></el-input>
                              <el-color-picker v-model="templateDetail.colorContent.keyword2" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                          <div class="attributePage">
                              <div class="attribute">
                                  <i class="el-icon-star-on  star"></i>
                                  备注</div>
                              <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="绑定成功"></el-input>
                              <el-color-picker v-model="templateDetail.colorContent.keyword3" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                        </div>
                        <div v-if="templateDetail.templateType == 4">
                          <div class="attributePage">
                            <div class="attribute">
                                <i class="el-icon-star-on star"></i>
                              收益金额</div>
                            <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{amount*distributeRate}"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.keyword1" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                          <div class="attributePage">
                            <div class="attribute">
                                <i class="el-icon-star-on star"></i>
                                收益来源</div>
                            <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="分销商品"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.keyword2" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                          <div class="attributePage">
                              <div class="attribute">
                                  <i class="el-icon-star-on  star"></i>
                                  到账时间</div>
                              <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{gmtCreate}"></el-input>
                              <el-color-picker v-model="templateDetail.colorContent.keyword3" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                        </div>
                        <div v-if="templateDetail.templateType == 5">
                          <div class="attributePage">
                            <div class="attribute">
                                <i class="el-icon-star-on star"></i>
                                提现金额</div>
                            <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{withdrawAmount}"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.keyword1" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                          <div class="attributePage">
                              <div class="attribute">
                                  <i class="el-icon-star-on  star"></i>
                                  提现时间</div>
                              <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{gmtCreate}"></el-input>
                              <el-color-picker v-model="templateDetail.colorContent.keyword2" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                          <div class="attributePage">
                              <div class="attribute">
                                  <i class="el-icon-star-on  star"></i>
                                  理由</div>
                              <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{err_code_des}"></el-input>
                              <el-color-picker v-model="templateDetail.colorContent.keyword3" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                        </div>
                        <div v-if="templateDetail.templateType == 6">
                          <div class="attributePage">
                            <div class="attribute">
                              <i class="el-icon-star-on star"></i>
                              订购内容</div>
                            <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{itemName}"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.keyword1" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                          <div class="attributePage">
                            <div class="attribute">
                              <i class="el-icon-star-on  star"></i>
                              过期时间</div>
                            <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{gmtCreate}"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.keyword2" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                          <div class="attributePage">
                            <div class="attribute">
                              <i class="el-icon-star-on  star"></i>
                              订单金额</div>
                            <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{amount}"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.keyword3" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                        </div>
                      <div v-if="templateDetail.templateType == 7">
                        <div class="attributePage">
                          <div class="attribute">
                            <i class="el-icon-star-on star"></i>
                            用户昵称</div>
                          <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{nickname}"></el-input>
                          <el-color-picker v-model="templateDetail.colorContent.keyword1" class="colorPicker" size="mini"></el-color-picker>
                        </div>
                        <div class="attributePage">
                          <div class="attribute">
                            <i class="el-icon-star-on  star"></i>
                            活动开始时间</div>
                          <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{beginDate}"></el-input>
                          <el-color-picker v-model="templateDetail.colorContent.keyword2" class="colorPicker" size="mini"></el-color-picker>
                        </div>
                      </div>
                        <div v-if="templateDetail.templateType == 8"> <!--每日学习-->
                          <div class="attributePage">
                            <div class="attribute">
                              <i class="el-icon-star-on star"></i>
                              课程名称</div>
                            <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{title}"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.keyword1" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                          <div class="attributePage">
                            <div class="attribute">
                              <i class="el-icon-star-on  star"></i>
                              开始时间</div>
                            <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{today}"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.keyword2" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                        </div>
                        <div v-if="templateDetail.templateType ==9"> <!--每日打卡-->
                          <div class="attributePage">
                            <div class="attribute">
                              <i class="el-icon-star-on star"></i>
                              课程</div>
                            <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{title}"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.keyword1" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                          <div class="attributePage">
                            <div class="attribute">
                              <i class="el-icon-star-on  star"></i>
                              时间</div>
                            <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{today}"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.keyword2" class="colorPicker" size="mini"></el-color-picker>
                          </div>

                        </div>
                        <div v-if="templateDetail.templateType == 10"> <!--领券成功通知-->
                        <div class="attributePage">
                          <div class="attribute">
                            <i class="el-icon-star-on star"></i>
                            领取人</div>
                          <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{nickName}"></el-input>
                          <el-color-picker v-model="templateDetail.colorContent.keyword1" class="colorPicker" size="mini"></el-color-picker>
                        </div>
                        <div class="attributePage">
                          <div class="attribute">
                            <i class="el-icon-star-on  star"></i>
                            礼品</div>
                          <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{couponPrice}"></el-input>
                          <el-color-picker v-model="templateDetail.colorContent.keyword2" class="colorPicker" size="mini"></el-color-picker>
                        </div>
                        <div class="attributePage">
                          <div class="attribute">
                            <i class="el-icon-star-on  star"></i>
                            领取时间</div>
                          <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{gmtCreate}"></el-input>
                          <el-color-picker v-model="templateDetail.colorContent.keyword2" class="colorPicker" size="mini"></el-color-picker>
                        </div>
                      </div>
                        <div v-if="templateDetail.templateType == 11">
                          <div class="attributePage">
                            <div class="attribute">
                              <i class="el-icon-star-on star"></i>
                              店铺名称</div>
                            <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="一修读书"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.keyword1" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                          <div class="attributePage">
                            <div class="attribute">
                              <i class="el-icon-star-on  star"></i>
                              服务时间</div>
                            <el-input size="mini" class="attributeContent" disabled="disabled" placeholder="{couponEnd_Time}"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.keyword2" class="colorPicker" size="mini"></el-color-picker>
                          </div>
                        </div>
                        <div class="attributePage">
                            <div class="attribute">remark</div>
                            <el-input v-model="templateDetail.remarkData" size="mini" class="attributeContent" :maxlength="100"></el-input>
                            <el-color-picker v-model="templateDetail.colorContent.remark" class="colorPicker" size="mini"></el-color-picker>
                        </div>
                    </div>
                    <div class="pushStatus">配置跳转路径：</div>
                    <el-radio-group v-model="templateDetail.linkType">
                      <el-radio :label=0>H5链接</el-radio>
                      <el-radio :label=1>小程序路径 </el-radio>
                    </el-radio-group>
                    <div :style="{ marginTop: '10px'}">
                      <el-input v-if="this.templateDetail.linkType === 0" :style="{ width: '373px' }" placeholder="跳转的链接" v-model="templateDetail.linkAddress" :maxlength="1000"></el-input>
                      <div v-else-if="this.templateDetail.linkType === 1">
                        <el-input :style="{ width: '160px' }" placeholder="小程序Appid" v-model="templateDetail.miniappId" :maxlength="100"></el-input>
                        <el-input :style="{ width: '207px' }" placeholder="小程序路径" v-model="templateDetail.pagePath" :maxlength="1000"></el-input>
                      </div>
                    </div>
                </div>
            </div>
            <div class="pushStatus">推送状态：</div>
            <el-radio-group v-model="templateDetail.pushStatus" @change="dialogPushStatus = true">
              <el-radio :label=1>启用</el-radio>
              <el-radio :label=0>停用</el-radio>
            </el-radio-group>
            <el-dialog title="推送状态" width="25%" :visible.sync="dialogPushStatus">
              <div class="deleteMsg">确定启用/停用系统推送？</div>
              <span slot="footer" class="dialog-footer">
                  <el-button size="mini" @click="cancelPushStatus">取 消</el-button>
                  <el-button size="mini" type="primary" @click="queryPushStatus">确 定</el-button>
              </span>
            </el-dialog>
        </div>
        <div class="footer">
          <el-button size="mini" type="primary" @click="saveTemplate">保存</el-button>
          <el-button size="mini" @click="cancelTemplate">取消</el-button>
        </div>
    </section>
</template>
<script>
export default {
  data() {
    return {
      //付款超时
      itemName:'订购内容',
      amount:'订单金额',
      //即将开课
      nickname:'用户昵称',
      beginDate:'2018年6月15日 20:30',
      //每日学习
      title:'课程标题',
      today:' 2018年6月15日 20:30',
      //每日打卡
      couponPrice:'5',
      gmtCreate:' 2018年6月15日 20:30',
      couponEnd_Time:'2018年6月15日 20:30',
      dialogPushStatus: false,
      templateTitle: "",
      goodsName: "10招修炼成狐狸精女人",
      goodsId: "xxxxxxxxxxxxxx",
      goodsMoney: "99.9元",
      goodsTime: "2018年4月17日 19:25",
      nickName: "哎呀呀",
      bindTime: "2018年4月17日 19:25",
      getCommission: "9.9元",
      putMoney: "9.9元",
      putTime: "2018年4月17日 19:25",
      reason: "未实名认证",
      remarkData: "快来邀请小伙伴一起读书吧～",
      moneyFrom: "分销商品",
      templateDetail: {
        id: null,
        authorizerId: null,
        templateId: "",
        templateType: null,
        pushStatus: 1,
        firstData: "",
        remarkData: "",
        colorContent: {
          keyword1: "#000",
          keyword2: "#000",
          keyword3: "#000",
          keyword4: "#000",
          first: "#000",
          remark: "#000"
        },
        linkType: 0,
        miniappId: "",
        linkAddress: "",
        pagePath: "",
        gmtCreate: null,
        gmtModified: null
      }
    };
  },
  methods: {
    init() {
      let authorizerId = this.$route.params.id;
      console.log(authorizerId)
      this.$http.get("/authorizerMpTemplate/details?id=" + authorizerId).then(
        res => {
          let resp = res.data;
          if (resp.success === true) {
            if (resp.data) {
              this.templateDetail = resp.data;
              this.templateDetail.colorContent = JSON.parse(
              this.templateDetail.colorContent
            );
            }
            this.templateTitle = sessionStorage.getItem("title");
            this.templateDetail.templateType = sessionStorage.getItem("type");
            console.log(this.templateDetail.templateType)
            this.templateDetail.authorizerId = sessionStorage.getItem("postId");
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
    saveTemplate() {
      let {
        id,
        authorizerId,
        templateId,
        templateType,
        pushStatus,
        colorContent,
        linkType,
        miniappId,
        pagePath,
        linkAddress,
        firstData,
        remarkData
      } = this.templateDetail;
      for (let key in colorContent) {
        if ((templateType == 3 || templateType == 4) && (key === "keyword3" || key === "keyword4")) {
          delete colorContent[key];
        } else if (templateType == 5 && key == "keyword4") {
          delete colorContent[key];
        }
      }
      if (linkType === 0) {
        (miniappId = ""), (pagePath = "");
      } else if (linkType === 1) {
        linkAddress = "";
      }
      let params = {
        id: id,
        authorizerId: authorizerId,
        templateId: templateId,
        templateType: templateType,
        pushStatus: pushStatus,
        colorContent: JSON.stringify(colorContent),
        linkType: linkType,
        miniappId: miniappId,
        pagePath: pagePath,
        linkAddress: linkAddress,
        firstData: firstData,
        remarkData: remarkData
      };
      console.log(params)
      this.$http.post("/authorizerMpTemplate/add", params).then(
        res => {
          let resp = res.data;
          if (resp.success === true) {
            let msg = resp.desc || "模板编辑成功";
            this.$message.success(msg);
            this.$router.go(-1);
          } else {
            let msg = resp.desc || "模板编辑失败";
            this.$message.error(msg);
          }
        },
        () => {
          this.$message.error("网络错误");
        }
      );
    },
    goToOfficalList() {
      this.$router.go(-2);
    },
    goToTemplateList() {
      this.$router.go(-1);
    },
    queryPushStatus(val) {
      this.dialogPushStatus = false;
    },
    cancelTemplate() {
      this.$router.go(-1);
    },
    cancelPushStatus() {
      if (this.templateDetail.pushStatus == 0) {
        this.templateDetail.pushStatus = 1
      } else {
        this.templateDetail.pushStatus = 0
      }
      this.dialogPushStatus = false;
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
  .content {
    margin: 10px 15px 20px 30px;
    .weChatMsg {
      height: 30px;
      line-height: 30px;
      .weChatId {
        float: left;
      }
      .weChatInput {
        float: left;
        width: 360px;
      }
    }
    .configMsg {
      margin-top: 20px;
      margin-bottom: 20px;
      display: flex;
      .showConfig {
        display: inline-block;
        width: 395px;
        height: 395px;
        padding: 30px;
        border: 1px solid #ccc;
        .configTitle {
          font-size: 18px;
          font-weight: bold;
        }
        .configContent {
          margin-top: 50px;
          margin-left: 30px;
          p {
            margin-bottom: 20px;
            line-height: 1.2;
          }
        }
        .configContent span:nth-of-type(1){
          width:30%;
          text-align: right;
          display: inline-block;
        }
        .configContent span:nth-of-type(2){
          margin-left: 10px;
          display: inline-block;
        }
      }
      .configDetail {
        display: inline-block;
        flex: 1;
        margin-left: 30px;
        padding: 0 20px;
        .editTitle {
          font-size: 16px;
          font-weight: bold;
        }
        .editContent {
          padding: 10px;
          padding-top:55px;
          margin-top: 20px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          width: 400px;
          height:280px;
          .attributePage {
            position: relative;
            margin-bottom: 10px;
            .attribute {
              width: 140px;
              text-align: right;
              display: inline-block;
            }
            .attributeContent {
              display: inline-block;
              width: 210px;
            }
            .colorPicker {
              display: inline-block;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 10px;
            }
          }
        }
      }
    }
  }
  .footer {
    border-top: 1px dotted #ccc;
    padding-left: 50px;
    padding-top: 15px;
  }
}
.star {
  color: red;
  font-size: 12px;
}
.pushStatus {
  float: left;
}
</style>
<style>
.weChatMsg .weChatInput .el-input__inner {
  background-color: #f5f7fa;
}
</style>
