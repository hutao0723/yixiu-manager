/**
 * @note   setOnline 线上接口 配置
 * @param  name  本地接口名
 *         type  接口类型
 *         url   线上接口地址
 */
var setOnline = [
  //小程序列表
  {
    name: 'miniapplist',
    type: 'get',
    url: '/miniapp/list'
  },
  //小程序详情
  {
    name: 'appdetail',
    type: 'get',
    url: '/miniapp/detail'
  },
  //小程序删除
  {
    name: 'delete',
    type: 'get',
    url: '/miniapp/delete'
  },
  //查询域名配置
  {
    name: 'getDomain',
    type: 'get',
    url: '/miniapp/getDomain'
  },
  //代码管理
  {
    name: 'codemng',
    type: 'get',
    url: '/miniapp/codemng'
  },
  //小程序代码模版列表
  {
    name: 'getAllTemplate',
    type: 'get',
    url: '/miniapp/getAllTemplate'
  },
  {
    name: 'appdetail',
    type: 'get',
    url: '/miniapp/detail'
  },
  {
    name: '/templatePushList',
    type: 'get',
    url: '/miniapp/templatePushList'
  },
  {
    name: 'templatePushDetail',
    type: 'get',
    url: '/miniapp/templatePushGet'
  },
  {
    name: 'msgTemplateList',
    type: 'get',
    url: '/miniapp/msgTemplateList'
  },
  {
    name: 'msgTemplateDetail',
    type: 'get',
    url: '/miniapp/msgTemplateDetail'
  },
  {
    name: 'findMsgTemplate',
    type: 'get',
    url: '/miniapp/templateLibraryGet' 
  },
  {
    name: 'tplmsgPage',
    type: 'get',
    url: '/miniapp/tplmsg/page'
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
      fs.readFile('./mock/miniApp/' + name + '.json', function(err, data) {
        if (err) throw err;

        res.json(JSON.parse(data));
      });
    };
  })(i);
}

