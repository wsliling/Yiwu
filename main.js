import Vue from 'vue'
import App from './App'
import store from './store'
Vue.config.productionTip = false
import playerMin from './components/playermin.vue'
Vue.component('playerMin', playerMin)
App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
