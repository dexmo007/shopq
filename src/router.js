import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import firebase from 'firebase/app';

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
      path: '/login',
      name: 'login',
      component: () =>
        import(/* webpackChunkName: "login" */ './views/Login.vue'),
    },
    {
      path: '/me',
      name: 'me',
      component: () => import(/* webpackChunkName: "me" */ './views/Me.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/markt/:id',
      name: 'markt',
      props: true,
      component: () =>
        import(/* webpackChunkName: "markt" */ './views/Market.vue'),
    },
    {
      path: '/markt/:id/claim',
      name: 'MarketClaim',
      props: true,
      component: () =>
        import(/* webpackChunkName: "markt-claim" */ './views/MarketClaim.vue'),
      beforeEnter: (to, from, next) => {
        if (firebase.auth().currentUser) {
          if (firebase.auth().currentUser.isAnonymous) {
            next(`/login?strict=true&redirect=${encodeURIComponent(to.path)}`);
          } else {
            next();
          }
        } else {
          firebase.auth().onAuthStateChanged((user, error) => {
            if (!user || error) {
              next(false);
              return;
            }
            if (user.isAnonymous) {
              next(
                `/login?strict=true&redirect=${encodeURIComponent(to.path)}`
              );
            } else {
              next();
            }
          });
        }
      },
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
    {
      path: '/markt/:id/einlass',
      name: 'MarketAdmittance',
      props: true,
      component: () =>
        import(
          /* webpackChunkName: "market-admittance" */ './views/MarketAdmittance.vue'
        ),
    },
  ],
});
