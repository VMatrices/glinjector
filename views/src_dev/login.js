export default function hookLogin(Vue) {

    const $request = Vue.prototype.$request
    let refresherTimer = 0

    function autoRefreshToken() {
        clearInterval(refresherTimer)
        refresherTimer = setInterval(() => {
            try {
                $request("call", ["sid", "system", "get_status", {}])
            } catch (e) {
                clearInterval(refresherTimer)
            }
        }, 20000)
    }

    function checkAccessDenied(err) {
        try {
            if (JSON.parse(err).error.message == "Access denied") {
                return true
            }
        } catch (ignored) { }
        throw err
    }

    async function login(password) {
        const username = 'root'
        if (!password) {
            password = prompt("Please input password to login:")
        }
        try {
            let resp = await $request('challenge', { username })
            if (!resp || !resp.err_msg) {
                try {
                    const encrypted = Vue.prototype.$up.crypt(password, `$${resp.alg}$${resp.salt}$`)
                    await $request('login', {
                        username, hash: Vue.prototype.$md5(username + ":" + encrypted + ":" + resp.nonce)
                    })
                    autoRefreshToken()
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
        if (!$getCookie("Admin-Token")) {
            await login(import.meta.env.VITE_GL_PASSWD)
        }
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