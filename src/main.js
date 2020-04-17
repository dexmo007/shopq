import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import { firestorePlugin } from 'vuefire';
import VueToasted from 'vue-toasted';
import App from './App.vue';
import router from './router';
import './firebase';
import './polyfills';

/** START FONTAWESOME **/
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faSearch,
  faMapMarkedAlt,
  faTimesCircle,
  faQuestion,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faSearch, faMapMarkedAlt, faTimesCircle, faQuestion, faEdit);
dom.watch();

Vue.component('font-awesome-icon', FontAwesomeIcon);
/** END FONTAWESOME **/

Vue.use(VueToasted, {
  iconPack: 'fontawesome',
});

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_API_KEY,
    libraries: 'places',
  },
});

Vue.use(firestorePlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
