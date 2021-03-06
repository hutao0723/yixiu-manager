/**
 * @note   setOnline 线上接口 配置
 * @param  name  本地接口名
 *         type  接口类型
 *         url   线上接口地址
 */
var setOnline = [
  //投放落地页列表
  {
    name: 'loadPage',
    type: 'get',
    url: '/loadpage/list'
  },
  //落地页编辑
  {
    name: 'updateloadPage',
    type: 'get',
    url: '/loadpage/update'
  },
  // 推啊广告计划
  {
    name: 'tuiaPlanList',
    type: 'get',
    url: '/advplan/tuia'
  },
  //公众号主题
  {
    name: 'subscriptionTheme',
    type: 'get',
    url: '/subscriptionTheme/list'
  },
  {
    name: 'themeName',
    type: 'get',
    url: '/subscriptionTheme/all'
  },
   //公众号待选公众号
  {
    name: 'subscriptionname',
    type: 'get',
    url: '/subscriptionInfo/list'
  },
  {
    name: 'themeLoadPage',
    type: 'get',
    url: '/subscriptionTheme/getLoadPage'
  },
  //根据公众号id查询模板数据列表
  {
    name: 'templateList',
    type: 'get',
    url: '/authorizerMpTemplate/list'
  },
  //根据模板id查询模板数据详情
  {
    name: 'templateDetail',
    type: 'get',
    url: '/authorizerMpTemplate/details'
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
      fs.readFile('./mock/delivery/' + name + '.json', function(err, data) {
        if (err) throw err;

        res.json(JSON.parse(data));
      });
    };
  })(i);
}

