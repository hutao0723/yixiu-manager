import Vue from 'vue'
import Vuex from 'vuex'
import getter from './getter'
import delivery from './modules/delivery'
Vue.use(Vuex)

export default new Vuex.Store({
  getter,
  modules: {
    delivery
  }
})
