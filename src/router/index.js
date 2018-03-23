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
            path: 'theme',
            component: function (resolve) {
              require(['../views/delivery/pages/subscriptionTheme'], resolve)
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
          }
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
            path: 'graphType',
            component: function (resolve) {
              require(['../views/officalAcount/pages/graphType'], resolve)
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
            path: 'contentType/:id',
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
      }
    ]
  }
]

export default new Router({
  routes: constantRouterMap
})
