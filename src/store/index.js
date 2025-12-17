import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const system = {
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
};
//因为分了模块所有属性调试方法都需要加上this.$store.system(system为模块名称)
const store = new Vuex.Store({
  modules: {   //分成多个模块
    system,//this.$store.state.system
  }
})

export default store;