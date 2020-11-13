import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import myPlugins from './plugins/myPlugins';
import VueHtmlToPaper from 'vue-html-to-paper';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.use(VueHtmlToPaper);
Vue.use(myPlugins)
Vue.use(Antd);

Vue.config.productionTip = false
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
