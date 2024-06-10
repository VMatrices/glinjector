import ConfirmDialogVue from '../component/ConfirmDialog.vue';

let ConfirmDialog = null

export default function initConfirmDialog(vm) {
    if (!ConfirmDialog) {
        // 使用框架提供的Vue，避免打包时引入多余的js 
        const Vue = vm.__proto__.constructor.super
        ConfirmDialog = Vue.extend({ ...ConfirmDialogVue, i18n: vm.$i18n });
        Vue.prototype.$glConfirm = (msg, title) => (new ConfirmDialog()).show(msg, title)
    }
}