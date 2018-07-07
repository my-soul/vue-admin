// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import ElementUI from 'element-ui';
import './styles/element-variables.scss';

import App from './App';
import store from './store';
import router from './router';
import request from './utils/plugins/request';
import autoHeight from './utils/directive/auto-height';

import './styles/base.css';
import './styles/index.scss';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(request);

Vue.directive('auto-height', autoHeight);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});
