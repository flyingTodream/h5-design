import Vue from 'vue'
import Router from 'vue-router'
import Mall from '@/page/mall'
import User from '@/user'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    component: () => import('../page/homePage')
  },
  {

    path: '/mall',
    component: Mall,
    children: [

      {
        path: 'homePage',
        name: 'vx-homePage',
        component: () => import('../page/homePage')
      },
      {
        path: 'modelCenter',
        name: 'vx-modelCenter',
        component: () => import('../page/modelCenter')
      },
      {
        path: 'preview/:id',
        name: 'vx-preview',
        component: () => import('../page/preview')
      }
    ]
  }, {
    path: '/design/:id',
    name: 'design',
    component: () => import('../design')
  }, {
    path: '/user',
    component: User,
    redirect: 'user/myworks',
    children: [{
      path: 'myworks',
      name: 'myWorks',
      icon: 'opus',
      meta: {
        auth: true,
        title: '我的作品',
      },
      component: () => import('../user/pages/myWorks')

    },
    {
      path: 'myCollect',
      name: 'myCollect',
      icon: 'collection',
      meta: {
        auth: true,
        title: '我的收藏',
      },
      component: () => import('../user/pages/myCollect')

    },
    {
      path: 'myBuy',
      name: 'myBuy',
      icon: 'order',
      meta: {
        auth: true,
        title: '订单中心',
      },
      component: () => import('../user/pages/myBuy')

    }
    ]
  },
  {
    path: '/design-h5/:id',
    name: 'design-h5',
    component: () => import('../design-h5')
  },
  {
    path: '/share/:id',
    name: 'share',
    component: () => import('../page/share')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../page/404')
  },
  {
    path: '*',
    redirect: '/404'
  }
  ]
})
