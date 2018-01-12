import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home'
import dlvSidebar from '@/views/delivery/pages/dlvSidebar'
import subject from '@/views/delivery/pages/subject.vue'
import deliever from '@/views/delivery/pages/deliever.vue'
import ofasidebar from '../views/officalAcount/pages/ofasidebar'
import officalAcount from '../views/officalAcount/pages/officalAcountList'
import officalAcountCreate from '../views/officalAcount/pages/officalAcountCreate'
import loadpage from '../views/delivery/pages/loadpage'

Vue.use(Router)

export const constantRouterMap = [
  // {   // 登录
  //     //TODO
  // },
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
