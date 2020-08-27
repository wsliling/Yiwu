import Vue from 'vue'
import App from './App'
import store from './store'
Vue.config.productionTip = false
import playerMin from './components/playermin.vue'
import G_show_modal from './components/G_show_modal/g_show_modal.js'
Vue.use(G_show_modal)
Vue.component('playerMin', playerMin)
App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
