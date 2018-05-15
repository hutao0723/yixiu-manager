/**
 * @note   setOnline 线上接口 配置
 * @param  name  本地接口名
 *         type  接口类型
 *         url   线上接口地址
 */
var setOnline = [
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
  // 获取文本编辑器内容
  {
    name: 'editor',
    type: 'get',
    url: '/editor/content'
  },
  // 获取文本编辑器内容
  {
    name: 'save',
    type: 'post',
    url: '/editor/save'
  }
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

