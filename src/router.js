import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/markt/:id',
      name: 'markt',
      props: true,
      component: () =>
        import(/* webpackChunkName: "markt" */ './views/Market.vue'),
    },
    {
      path: '/markt/:id/control',
      name: 'MarketControl',
      props: true,
      component: () =>
        import(
          /* webpackChunkName: "markt-control" */ './views/MarketControl.vue'
        ),
    },
  ],
});
