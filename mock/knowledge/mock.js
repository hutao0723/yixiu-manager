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
    url: '/goods/group/copy'
  },
  // 商品数列表
  {
    name: 'goodsNumber',
    type: 'get',
    url: '/goods/number/list'
  },
  // 商品数列表
  {
    name: 'remove',
    type: 'get',
    url: '/goods/number/remove'
  },
  // 商品数排序
  {
    name: 'save',
    type: 'post',
    url: '/goods/number/sort'
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
  // 讲师删除
  {
    name: 'teacherList',
    type: 'get',
    url: '/lecturer/list'
  },
  // 讲师删除
  {
    name: 'goodsList',
    type: 'get',
    url: '/associate/goods'
  },
  // 关联商品/associate/goods
  {
    name: 'save',
    type: 'post',
    url: '/associate/goods'
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

