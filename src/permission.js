// import { getToken } from '@/utils/token'
// import { ElMessage } from 'element-plus'
import router from '@/router'
import NProgress from 'nprogress'

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/login') {
    next()
  } else {
    const hasToken = () => {
      return localStorage.getItem('loginfo')
    }
    if ((hasToken())) {
      console.log('放行')
      next()
    } else {
      console.log('不放行')
      next('/login')
    }
  }
  NProgress.done()
})
