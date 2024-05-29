export default function hookLogin(Vue) {

    const $request = window.$request

    function checkAccessDenied(err) {
        try {
            if (JSON.parse(err).error.message != "Access denied") {
                throw err
            }
        } catch (ignored) { }
        return true
    }

    async function login() {
        const username = 'root', password = prompt("Please input password to login:")
        if (!password) {
            throw 'Login interrupted!'
        }
        try {
            let resp = await $request('challenge', { username })
            if (!resp || !resp.err_msg) {
                try {
                    const encrypted = Vue.prototype.$up.crypt(password, `$${resp.alg}$${resp.salt}$`)
                    await $request('login', {
                        username, hash: Vue.prototype.$md5(username + ":" + encrypted + ":" + resp.nonce)
                    })
                } catch (err) {
                    if (checkAccessDenied(err)) {
                        alert('Wrong password!')
                        await login()
                    }
                }
            }
        } catch (err) {
            throw err
        }
    }

    Vue.prototype.$request = window.$request = async function (method, param, ...ext) {
        try {
            return await $request(method, param, ...ext)
        } catch (err) {
            if (checkAccessDenied(err)) {
                await login()
                return await $request(method, param, ...ext)
            }
        }
    }
}