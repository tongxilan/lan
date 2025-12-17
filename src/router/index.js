import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      redirect: '/im'
    },
    {
      path: '/hr',
      name: 'hr',
      component: () => import('@/views/hr/hr.vue'),
      meta: {
        title: '北京市卓凡代办管理有限公司'
      }
    },
    {
      path: '/im',
      name: 'im',
      component: () => import('@/views/im/im.vue'),
      meta: {
        title: '集团三重一大驾驶舱'
      }
    },
    {
      path: '/ad',
      name: 'ad',
      component: () => import('@/views/ad/ad.vue'),
      meta: {
        title: '集团审计驾驶舱'
      }
    },{
      path: '/app',
      name: 'app',
      component: () => import('@/views/app/app.vue'),
      meta: {
        title: '集团移动驾驶舱'
      }
    }
  ]
})
