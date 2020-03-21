import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import { firestorePlugin } from 'vuefire';
import App from './App.vue';
import router from './router';
import './firebase';

/** START FONTAWESOME **/
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faSearch);

Vue.component('font-awesome-icon', FontAwesomeIcon);
/** END FONTAWESOME **/

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GMAPS_API_KEY,
    libraries: 'places',
  },
});

Vue.use(firestorePlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
