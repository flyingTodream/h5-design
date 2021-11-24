import Vue from 'vue'
import Router from 'vue-router'
import Mall from '@/page/mall'
import User from '@/user'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    component: () => import('../page/dashBoard')
  },
  {
    path: '/miniProgram',
    component: () => import('../page/mobile')
  },
  {
    path: '/mall',
    component: Mall,
    children: [
      {
        path: 'modelCenter',
        name: 'vx-modelCenter',
        component: () => import('../page/modelCenter')
      },
      {
        path: 'preview/:id',
        name: 'vx-preview',
        component: () => import('../page/preview')
      },
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
    path: '/share/:id',
    name: 'share',
    component: () => import('../page/share')
  },
  {
    path: '/notsupport',
    name: 'notsupport',
    component: () => import('../page/notsupport')
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
