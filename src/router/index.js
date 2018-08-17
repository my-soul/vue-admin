import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import { Message } from 'element-ui';
import store from '../store';
import { constantRouterMap } from './routerMap';

NProgress.configure({ showSpinner: false });
Vue.use(Router);

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.path === '/login') {
    next();
  } else if (store.state.user.uname) {
    next();
  } else {
    store.dispatch('GetUserInfo').then((user) => {
      store.dispatch('GenerateRoutes', user.permList).then((addRouters) => {
        router.addRoutes(addRouters);
        next({ ...to, replace: true });
      });
    }).catch((err) => {
      Message.error(err.message);
      next({ path: '/login' });
    });
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
