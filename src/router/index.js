import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    redirect: '/manager/dlv'
  },
  {
    path: '/authorization',
    // redirect: '/manager/dlv'
    component: function (resolve) {
      require(['../views/login/login'], resolve)
    }
  },
  {
    path: '/successPage',
    component: function (resolve) {
      require(['../views/login/successPage'], resolve)
    }
  },
  {
    path: '/manager',
    component: function (resolve) {
      require(['../views/home'], resolve)
    },
    redirect: '/manager/dlv',
    children: [
      {
        path: 'dlv',
        component: function (resolve) {
          require(['../views/delivery/pages/sidebar'], resolve)
        },
        children: [
          {
            path: '/',
            component: function (resolve) {
              require(['../views/delivery/pages/deliever'], resolve)
            }
          },
          {
            path: 'loadpage',
            component: function (resolve) {
              require(['../views/delivery/pages/loadpage'], resolve)
            }
          },
          {
            path: 'skinMarket',
            component: function (resolve) {
              require(['../views/delivery/pages/skinMarket'], resolve)
            }
          },
          {
            path: 'editSkin',
            component: function (resolve) {
              require(['../views/delivery/pages/editSkin'], resolve)
            }
          },
          {
            path: 'theme',
            component: function (resolve) {
              require(['../views/delivery/pages/subscriptionTheme'], resolve)
            }
          },
          {
            path: 'putcontent',
            component: function (resolve) {
              require(['../views/delivery/pages/putcontent'], resolve)
            }
          },
          {
            path: 'link',
            component: function (resolve) {
              require(['../views/delivery/pages/subLinkPage'], resolve)
            }
          },
          {
            path: 'link/:id',
            component: function (resolve) {
              require(['../views/delivery/pages/subLinkPage'], resolve)
            }
          },
          {
            path: 'monitor',
            component: function (resolve) {
              require(['../views/delivery/pages/monitor'], resolve)
            }
          },
        ]
      },
      {
        path: 'officalAcount',
        component: function (resolve) {
          require(['../views/officalAcount/pages/sidebar'], resolve)
        },
        children: [
          {
            path: '/',
            component: function (resolve) {
              require(['../views/officalAcount/pages/officalAcountList'], resolve)
            }
          },
          {
            path: 'templateMessage/:type/:id',
            name: 'templateMessage',
            component: function (resolve) {
              require(['../views/officalAcount/pages/templateMessage'], resolve)
            }
          },
          {
            path: 'templateDetail/:id',
            name: 'templateDetail',
            component: function (resolve) {
              require(['../views/officalAcount/pages/editTemplateMessage'], resolve)
            }
          },
          {
            path: 'graphType',
            component: function (resolve) {
              require(['../views/officalAcount/pages/graphType'], resolve)
            }
          },
          {
            path: 'publicType',
            component: function (resolve) {
              require(['../views/officalAcount/pages/publicType'], resolve)
            }
          },
          {
            path: 'editGraphType/:id',
            component: function (resolve) {
              require(['../views/officalAcount/pages/editGraphType'], resolve)
            }
          },
          {
            path: 'create',
            component: function (resolve) {
              require(['../views/officalAcount/pages/officalAcountCreate'], resolve)
            }
          },
          {
            path: 'create/:id',
            component: function (resolve) {
              require(['../views/officalAcount/pages/officalAcountCreate'], resolve)
            }
          }
        ]
      },
      {
        path: 'miniApp',
        component: function (resolve) {
          require(['../views/miniApp/pages/sidebar'], resolve)
        },
        children: [
          {
            path: '/',
            component: function (resolve) {
              require(['../views/miniApp/pages/appList'], resolve)
            }
          },
          {
            path: 'codeMng/:id',
            component: function (resolve) {
              require(['../views/miniApp/pages/codeMng'], resolve)
            }
          },
          {
            path: 'templateMsg/:id',
            component: function (resolve) {
              require(['../views/miniApp/pages/templateMsg'], resolve)
            }
          },
          {
            path: 'codeStock/:id',
            component: function (resolve) {
              require(['../views/miniApp/pages/codeStock'], resolve)
            }
          },
          {
            path: 'pushMsg/:id',
            component: function (resolve) {
              require(['../views/miniApp/pages/pushMsg'], resolve)
            }
          },
          {
            path: 'addEditPushMsg/:appId/:odpsId/:expireDate',
            component: function (resolve) {
              require(['../views/miniApp/pages/addEditPushMsg'], resolve)
            }
          },
          {
            path: 'addEditPushMsg/:appId/:odpsId/:expireDate/:id',
            component: function (resolve) {
              require(['../views/miniApp/pages/addEditPushMsg'], resolve)
            }
          },
          {
            path: 'templateStock/:id',
            component: function (resolve) {
              require(['../views/miniApp/pages/templateStock'], resolve)
            }
          },
          {
            path: 'addWxTemplate/:id',
            component: function (resolve) {
              require(['../views/miniApp/pages/addWxTemplate'], resolve)
            }
          },
          {
            path: 'contentManage',
            component: function (resolve) {
              require(['../views/miniApp/pages/contentManage'], resolve)
            }
          },
          {
            path: 'typeManage',
            component: function (resolve) {
              require(['../views/miniApp/pages/typeManage'], resolve)
            }
          },
          {
            path: 'miniType',
            component: function (resolve) {
              require(['../views/miniApp/pages/miniType'], resolve)
            }
          },
          {
            path: 'contentType/:id/:appId',
            component: function (resolve) {
              require(['../views/miniApp/pages/contentType'], resolve)
            }
          },
          {
            path: 'editContent/:parentId/:id',
            component: function (resolve) {
              require(['../views/miniApp/pages/editContent'], resolve)
            }
          }
        ]
      },
      {
        path: 'knowledge',
        component: function (resolve) {
          require(['../views/knowledge/pages/sidebar'], resolve)
        },
        children: [
          {
            path: '/',
            component: function (resolve) {
              require(['../views/knowledge/pages/page'], resolve)
            }
          },
          {
            path: 'readPoster',
            component: function (resolve) {
              require(['../views/knowledge/pages/readPoster'], resolve)
            }
          },
          {
            path: 'add',
            component: function (resolve) {
              require(['../views/knowledge/pages/addpage'], resolve)
            }
          },
          {
            path: 'channel',
            component: function (resolve) {
              require(['../views/knowledge/pages/channel'], resolve)
            }
          },
          {
            path: 'extend',
            component: function (resolve) {
              require(['../views/knowledge/pages/extend'], resolve)
            }
          },
          {
            path: 'curriculum',
            component: function (resolve) {
              require(['../views/knowledge/pages/curriculum'], resolve)
            }
          },
          {
            path: 'specialColumn',
            component: function (resolve) {
              require(['../views/knowledge/pages/specialColumn'], resolve)
            }
          },
          {
            path: 'goodsNumber/:id',
            component: function (resolve) {
              require(['../views/knowledge/pages/goodsNumber'], resolve)
            }
          },
          {
            path: 'editDraft/:id',
            component: function (resolve) {
              require(['../views/knowledge/pages/editDraft'], resolve)
            }
          },
          {
            path: 'goodsGroup',
            component: function (resolve) {
              require(['../views/knowledge/pages/goodsGroup'], resolve)
            }
          },
          {
            path: 'read',
            component: function (resolve) {
              require(['../views/knowledge/pages/read'], resolve)
            }
          },
          {
            path: 'readPlan',
            component: function (resolve) {
              require(['../views/knowledge/pages/readPlan'], resolve)
            }
          },
          {
            path: 'coursePlan',
            component: function (resolve) {
              require(['../views/knowledge/pages/coursePlan'], resolve)
            }
          },
          {
            path: 'courseGroup',
            component: function (resolve) {
              require(['../views/knowledge/pages/courseGroup'], resolve)
            }
          },
          {
            path: 'numberEdit',
            component: function (resolve) {
              require(['../views/knowledge/pages/numberEdit'], resolve)
            }
          },
          {
            path: 'order',
            component: function (resolve) {
              require(['../views/knowledge/pages/order'], resolve)
            }
          },
          {
            name: 'distribute',
            path: 'distribute',
            component: function (resolve) {
              require(['../views/knowledge/pages/distribute'], resolve)
            }
          },
          {
            path: 'editdistributor/:userId',
            component: function (resolve) {
              require(['../views/knowledge/pages/editdistributor'], resolve)
            }
          },
          {
            path: 'ordersDetail/:id',
            component: function (resolve) {
              require(['../views/knowledge/pages/ordersDetail'], resolve)
            }
          },
          {
            path: 'option',
            component: function (resolve) {
              require(['../views/knowledge/pages/option'], resolve)
            }
          },
          {
            path: 'optionOrder',
            component: function (resolve) {
              require(['../views/knowledge/pages/optionOrder'], resolve)
            }
          },
          {
            path: 'lecturer',
            component: function (resolve) {
              require(['../views/knowledge/pages/lecturer'], resolve)
            }
          },
          {
            name: 'coupon',
            path: 'coupon',
            component: function (resolve) {
              require(['../views/knowledge/pages/coupon'], resolve)
            }
          },
          {
            name: 'voucherActivities',
            path: 'voucherActivities',
            component: function (resolve) {
              require(['../views/knowledge/pages/voucherActivities'], resolve)
            }
          },
          {
            path: 'editMaster/:id',
            component: function (resolve) {
              require(['../views/knowledge/pages/editMaster'], resolve)
            }
          },
          {
            path: 'addActivity/:id',
            component: function (resolve) {
              require(['../views/knowledge/pages/addActivity'], resolve)
            }
          }
        ]
      }
    ]
  }
]

export default new Router({
  routes: constantRouterMap
})
