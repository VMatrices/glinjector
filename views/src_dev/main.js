import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue'
import VueI18n from 'vue-i18n';
import ElementUI from 'element-ui';
import initGlLogin from './login.js';
import messages from './messages.js'
import Index from './Index.vue'
import { initGlSdk, loadGlStore } from './bundle.js';
import { mapState, mapMutations } from 'vuex'

Vue.use(VueI18n);
Vue.use(ElementUI);

const locale = localStorage.getItem('locale', 'zh-cn')
const i18n = new VueI18n({
    messages,
    fallbackLocale: "en",
    silentTranslationWarn: true,
    locale: (locale || navigator.language || navigator.browserLanguage).toLowerCase(),
})

initGlSdk(Vue, i18n)
initGlLogin(Vue)

new Vue({
    el: '#app',
    render: h => h(Index),
    store: loadGlStore(),
    i18n: i18n,
    data() {
        return { maskMsgAlert: null }
    },
    computed: { ...mapState(["showDisableMask", "model"]) },
    watch: {
        showDisableMask(t) {
            if (t || this.maskMsgAlert) {
                this.maskMsgAlert.close()
            }
        }
    },
    created() {
        this.getLogoSvg()
        this.getRouterTypeSvg()
    },
    mounted() {
        window.addEventListener('resize', () => this.updateScreenWidth(window.document.body.clientWidth))
    },
    methods: {
        ...mapMutations([
            "updateScreenWidth",
            "updateRouterTypeSvg",
            "updateSecurityRule",
            "updateLogoSvg",
        ]),
        handleMask() {
            if (this.maskMsgAlert) {
                this.maskMsgAlert.close()
            }
            this.maskMsgAlert = this.$message.warning(this.$t("msg.operation_not_finished"))
        },
        getLogoSvg() {
            this.$axios.get("/logo.svg", { responseType: "arraybuffer" }).then((resp => {
                const text = new Uint8Array(resp.data).reduce(((t, e) => t + String.fromCharCode(e)), "");
                if (text.indexOf("<svg") >= 0) {
                    this.updateLogoSvg(text)
                } else {
                    this.updateLogoSvg(`<img style="width:65px;height:50px" src="${"data:image/png;base64," + btoa(text)}">`)
                }
            }))
        },
        getRouterTypeSvg() {
            this.$axios.get("/model.svg").then((resp => this.updateRouterTypeSvg(resp.data)))
        }
    }
})