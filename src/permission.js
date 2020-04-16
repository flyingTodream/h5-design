import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from 'src/utils/get-page-title'
import { userCenterList } from 'src/api/api'
import Router from 'vue-router'
NProgress.configure({
  showSpinner: false
})



router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.matched.some(m => m.meta.auth)) {
    //
    userCenterList().then(res => {
      if (res) {
        next()
      } else {
        next(false)
      }
    })
  } else {
    next()
  }


  const originalPush = Router.prototype.push
  Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
  }
  document.title = getPageTitle(to.meta.title)
  NProgress.done()

})


router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
