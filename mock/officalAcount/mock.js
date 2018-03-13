/**
 * @note   setOnline 线上接口 配置
 * @param  name  本地接口名
 *         type  接口类型
 *         url   线上接口地址
 */
var setOnline = [
  // 图文类型列表
  {
    name: 'graphTextList',
    type: 'get',
    url: '/officalAcount/graphmsg/page'
  },
  // 编辑单一图文类型
  {
    name: 'getGraphText',
    type: 'get',
    url: '/officalAcount/getGraph'
  },
  // 编辑保存
  {
    name: 'editGraphText',
    type: 'post',
    url: '/officalAcount/edit/graph'
  },
  // 删除
  {
    name: 'editGraphText',
    type: 'get',
    url: '/officalAcount/del/graph'
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
      fs.readFile('./mock/officalAcount/' + name + '.json', function(err, data) {
        if (err) throw err;

        res.json(JSON.parse(data));
      });
    };
  })(i);
}

