import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home'
import dlvSidebar from '@/views/delivery/pages/dlvSidebar'
import theme from '@/views/delivery/pages/subscriptionTheme.vue'
import deliever from '@/views/delivery/pages/deliever.vue'
import ofasidebar from '@/views/officalAcount/pages/ofasidebar'
import officalAcount from '@/views/officalAcount/pages/officalAcountList'
import officalAcountCreate from '@/views/officalAcount/pages/officalAcountCreate'
import loadpage from '@/views/delivery/pages/loadpage'
import subLinkPage from '@/views/delivery/pages/subLinkPage'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    redirect: '/manager/dlv'
  },
  {
    path: '/manager',
    component: home,
    redirect: '/manager/dlv',
    children: [
      {
        path: 'dlv',
        component: dlvSidebar,
        children: [
          {
            path: '/',
            component: deliever
          },
          {
            path: 'loadpage',
            component: loadpage
          },
          {
            path: 'theme',
            component: theme
          },
          {
            path: 'link',
            component: subLinkPage
          },
          {
            path: 'link/:id',
            component: subLinkPage
          }
        ]
      },
      {
        path: 'officalAcount',
        component: ofasidebar,
        children: [
          {
            path: '/',
            component: officalAcount
          },
          {
            path: 'create',
            component: officalAcountCreate
          },
          {
            path: 'create/:id',
            component: officalAcountCreate
          }
        ]
      }
    ]
  }
]

export default new Router({
  routes: constantRouterMap
})
