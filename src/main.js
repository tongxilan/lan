import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

// axios
import axios from './http/request'
Vue.prototype.$http = axios

// px2rem 自适应
import 'lib-flexible'

// 数据展示组件库
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

// 按需加载element
import { Tree } from 'element-ui';
Vue.component(Tree.name, Tree);

import VueClickOutSide from '../src/plugins/clickedOutside.js';
Vue.directive('click-outside', VueClickOutSide)

router.beforeEach((to, from, next) => {
  // 路由发生变化修改页面Title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
