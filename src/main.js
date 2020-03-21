import Vue from 'vue'
import App from './App.vue'
import router from './router'

/** START FONTAWESOME **/
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSearch);

Vue.component('font-awesome-icon', FontAwesomeIcon);
/** END FONTAWESOME **/


Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
