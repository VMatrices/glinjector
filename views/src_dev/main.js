import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue'
import VueI18n from 'vue-i18n';
import ElementUI from 'element-ui';
import initGlScript from './gl.bundle.js';
import App from '../src/App.vue'

Vue.use(VueI18n);
Vue.use(ElementUI);

initGlScript(Vue)
const $request = window.$request

async function login() {
    const username = 'root'
    let resp = await $request('challenge', { username })
    if (!resp || !resp.err_msg) {
        const password = prompt("Please Input Password:")
        if (!password) {
            return
        }
        try {
            const encrypted = Vue.prototype.$up.crypt(password, `$${resp.alg}$${resp.salt}$`)
            await $request('login', {
                username, hash: Vue.prototype.$md5(username + ":" + encrypted + ":" + resp.nonce)
            })
            return true
        } catch (err) {
            const resp = JSON.parse(err)
            if (resp.error.message == "Access denied") {
                alert('Wrong password!')
                await login()
            } else {
                throw err
            }
        }
    }
}

window.$request = function (method, param, ...ext) {
    return new Promise(async (resolve, reject) => {
        if (!window.$getCookie("Admin-Token") && !await login()) {
            return reject('Login interrupted!')
        }
        $request(method, param, ...ext)
            .then(resolve)
            .catch(async err => {
                const resp = JSON.parse(err)
                if (resp.error.message == "Access denied") {
                    await login()
                    $request(method, param, ...ext)
                        .then(resolve)
                        .catch(reject)
                } else {
                    reject(err)
                }
            })

    })
}

new Vue({
    el: '#app',
    render: h => h(App),
    i18n: new VueI18n({
        locale: 'en',
        messages: {
            'en': await import('../i18n/en.json'),
            'zh-cn': await import('../i18n/zh-cn.json'),
        }
    })
})