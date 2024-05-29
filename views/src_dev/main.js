import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue'
import VueI18n from 'vue-i18n';
import ElementUI from 'element-ui';
import initGlScript from './bundle.js';
import initGlLogin from './login.js';
import messages from './messages.js'
import Index from './Index.vue'

Vue.use(VueI18n);
Vue.use(ElementUI);

initGlScript(Vue)
initGlLogin(Vue)

// localStorage.setItem('language',lang);

new Vue({
    el: '#app',
    render: h => h(Index),
    i18n: new VueI18n({
        messages, locale: localStorage.getItem('locale', 'zh-cn')
    })
})