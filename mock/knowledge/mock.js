/**
 * @note   setOnline 线上接口 配置
 * @param  name  本地接口名
 *         type  接口类型
 *         url   线上接口地址
 */
var setOnline = [
  // 计划课程列表
  {
    name: 'planList',
    type: 'get',
    url: '/planList/list'
  },
  // 商品组列表
  {
    name: 'groupList',
    type: 'get',
    url: '/goodsGroup/list'
  },
  // 商品组删除
  {
    name: 'delete',
    type: 'post',
    url: '/goodsGroup/delete'
  },
  // 商品组添加
  {
    name: 'save',
    type: 'post',
    url: '/goodsGroup/insert'
  },
  // 商品组修改
  {
    name: 'save',
    type: 'post',
    url: '/goodsGroup/insert'
  },
  // 商品组复制
  {
    name: 'save',
    type: 'post',
    url: '/goodsGroup/copy'
  },
  // 商品数列表
  {
    name: 'goodsNumber',
    type: 'get',
    url: '/goodsGroup/goods/list'
  },
  // 移除
  {
    name: 'remove',
    type: 'post',
    url: '/goodsGroup/goods/delete'
  },
  // 商品数排序
  {
    name: 'save',
    type: 'post',
    url: '/goodsGroup/goods/sort'
  },
  // 讲师列表
  {
    name: 'lecturer',
    type: 'get',
    url: '/lecturer/pageList'
  },
  // 讲师添加
  {
    name: 'save',
    type: 'post',
    url: '/lecturer/add'
  },
  // 讲师修改
  {
    name: 'save',
    type: 'post',
    url: '/lecturer/update'
  },
  // 讲师删除
  {
    name: 'delete',
    type: 'post',
    url: '/lecturer/delete'
  },
  // 讲师列表
  {
    name: 'teacherList',
    type: 'get',
    url: '/lecturer/list'
  },
  // 关联课程列表
  {
    name: 'courseList',
    type: 'get',
    url: '/goodsGroup/course/list'
  },
  // 关联专栏列表
  {
    name: 'columnList',
    type: 'get',
    url: '/goodsGroup/column/list'
  },
  // 添加关联成功
  {
    name: 'save',
    type: 'post',
    url: '/goodsGroup/goods/add'
  },
  // 订单列表
  {
    name: 'ordersList',
    type: 'get',
    url: '/knowledge/order/page'
  },
  //订单详情
  {
    name: 'ordersDetail',
      type: 'get',
    url: '/knowledge/order/detail'
  },
  //订单导出
  {
    name: 'export',
    type: 'get',
    url: '/knowledge/order/export'
  },
  // 导出成功
  {
    name: 'successExport',
    type: 'get',
    url: '/knowledge/order/checkExport'
  },
  // 分销人员列表
  {
    name: 'distributor',
    type: 'get',
    url: '/knowledge/distributor/getList'
  },
  //分页查询课程列表
  {
    name: 'coursePageList',
    type: 'get',
    url: '/course/pageList'
  },
  //分页查询专栏列表
  {
    name: 'columnPageList',
    type: 'get',
    url: '/column/pageList'
  },
  //查询分销商品组信息
  {
    name: 'getDistributionGoodsGroup',
    type: 'get',
    url: '/goodsGroup/getDistributionGoodsGroup'
  },
  //更换分销商品组
  {
    name: 'setDistributionGoodsGroup',
    type: 'post',
    url: '/goodsGroup/setDistributionGoodsGroup'
  },
  //查询海报列表
  {
    name: 'getPublicPosters',
    type: 'get',
    url: '/poster/findItemPosters'
  },
  //根据id删除海报
  {
    name: 'deletePoster',
    type: 'post',
    url: '/poster/delete'
  },
  //新增海报
  {
    name: 'addPoster',
    type: 'post',
    url: '/poster/add'
  },
  //修改海报
  {
    name: 'updatePoster',
    type: 'post',
    url: '/poster/update'
  },
  //分页查询分销详情
  {
    name: 'getUserDistribution',
    type: 'get',
    url: '/distributor/userDistribution/pageList'
  },
  // 课程
  {
    name: 'course',
    type: 'get',
    url: '/course/pageList'
  },
  // 上传图片
  {
    name: 'upload',
    type: 'post',
    url: '/upload/image'
  },
  // 新增文本编辑器内容
  {
    name: 'save',
    type: 'post',
    url: '/course/createSketch'
  },
  {
    name: 'save',
    type: 'post',
    url: '/course/updateSketch'
  },
  // 新增文本编辑器内容
  {
    name: 'editor',
    type: 'get',
    url: '/course/getSketch'
  },
  // 获取权重值列表
  {
    name: 'weightList',
    type: 'get',
    url: '/comment/topList'
  },
  // 修改权重
  {
    name: 'save',
    type: 'post',
    url: '/comment/changeSorted'
  },
  // 获取观点列表
  {
    name: 'optionList',
    type: 'get',
    url: '/comment/page'
  },
  // 通过观点审核
  {
    name: 'save',
    type: 'post',
    url: '/pass/option'
  },
  // 隐藏观点
  {
    name: 'save',
    type: 'post',
    url: '/hide/option'
  },
  // 观点状态变更
  {
    name: 'save',
    type: 'post',
    url: '/comment/changeStatus'
  },
  //母版列表
  {
    name: 'parentEditionList',
    type: 'get',
    url: '/coupon/template/page'
  },
  //复制优惠券母版
  {
    name: 'copyTemplate',
    type: 'post',
    url: '/coupon/template/copy'
  },
  //复制活动
  {
    name: 'copyActivity',
    type: 'post',
    url: '/activity/copy'
  },
  //修改优惠券母版状态
  {
    name: 'updateStatusTemplate',
    type: 'post',
    url: '/coupon/template/updateStatus'
  },
  //修改活动状态
  {
    name: 'updateStatusActivity',
    type: 'post',
    url: '/activity/updateStatus'
  },
  //删除优惠券母版
  {
    name: 'deleteTemplate',
    type: 'post',
    url: '/coupon/template/delete'
  },
  //删除活动
  {
    name: 'deleteActivity',
    type: 'post',
    url: '/activity/delete'
  },
  //已发券列表
  {
    name: 'voucherList',
    type: 'get',
    url: '/coupon/info/page'
  },
  //发券活动列表
  {
    name: 'voucherActivitiesList',
    type: 'get',
    url: '/activity/pageList'
  },
  //获取奖励优惠券列表
  {
    name: 'couponSimpleList',
    type: 'get',
    url: '/coupon/template/simple/list'
  },
  // 获取活动详情
  {
    name: 'activitySingle',
    type: 'get',
    url: '/activity/get'
  },
  // 保存活动
  {
    name: 'save',
    type: 'post',
    url: '/activity/save'
  },
  {
    name: 'exportVoucher',
    type: 'post',
    url: '/coupon/export/order'
  },
];
var fs = require('fs');

// 输出配置项
exports.setOnline = setOnline;

// 遍历输出json数据
for (var i = 0, len = setOnline.length; i < len; i++) {
  (function() {
    var name = setOnline[i].name;

    exports[name] = function(req, res) {
      fs.readFile('./mock/knowledge/' + name + '.json', function(err, data) {
        if (err) throw err;

        res.json(JSON.parse(data));
      });
    };
  })(i);
}

