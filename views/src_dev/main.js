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

initGlSdk(Vue)
initGlLogin(Vue)

const locale = localStorage.getItem('locale', 'zh-cn')
document.body.setAttribute("lang", locale)

new Vue({
    el: '#app',
    render: h => h(Index),
    store: loadGlStore(),
    i18n: new VueI18n({ messages, locale }),
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
            this.$axios.get("/logo.svg").then((resp => {
                const text = new Uint8Array(resp.data).reduce(((t, e) => t + String.fromCharCode(e)), "");
                if (text.indexOf("<svg") < text.indexOf("</svg>")) {
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