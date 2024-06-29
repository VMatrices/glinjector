import { version } from '../package.json'
import { xlog } from './xlog';
import { Popper } from './popper';
import { injectCss } from './inject-css';
import { defineProp, hookObject, watchState } from './hook-tool';
import wideModeStyle from './style/wide_mode.scss'
import navbarFrameStyle from './style/navbar_iframe.scss'

let config = GL_UI_CONFIG,
	glLogin = null,
	glPopper = null,
	glToastr = null,
	glDisableMask = null,
	luciRefreshTimer = null,
	luciURL = '/cgi-bin/luci';

let luciLogin = (callback) => fetch(luciURL + '?luci_username=' + encodeURIComponent(glLogin.vm.form.username) + '&luci_password=' + encodeURIComponent(glLogin.vm.form.password))
	.then(response => callback && callback(response))

hookObject([
	{
		name: 'Extract login method',
		from: 'vue',
		condition: vm => vm.handleLogin,
		// complete: () => glLogin.vm,
		process(vm) {
			let loginMethod = vm.login
			vm.login = token => {
				loginMethod.call(vm, token)
				luciLogin()
			}
			glLogin = { vm, method: vm.login }
		}
	},
	{
		name: 'Unlock menu (v4.2.3+)',
		from: 'array',
		enable: config.misc.unlock,
		condition: arr => arr[0].lang_hide,
		process(arr) {
			// v4.2.3
			arr.forEach(menu => menu.lang_hide = menu.parent_lang_hide = [])
		}
	},
	{
		name: 'Unlock menu (v4.2.1~2)',
		from: 'vue',
		enable: config.misc.unlock,
		condition: vm => 'menus' in vm && 'menuList' in vm && vm.$md5,
		process(vm) {
			defineProp(vm, 'menuList', {
				get() {
					var networkMode = vm.networkMode;
					return vm.menus
						.filter(menu => (!menu.show_mode || menu.show_mode.includes(networkMode)) && (!menu.parent_show_mode || menu.parent_show_mode.includes(networkMode)))
						.map(menu => (menu.h = vm.$md5(menu.view), menu))
				}
			})
		}
	},
	{
		name: 'Unlock menu (v4.2.0)',
		from: 'vue',
		enable: config.misc.unlock,
		condition: vm => 'menus' in vm && 'menuList' in vm && !vm.$md5,
		process(vm) {
			defineProp(vm, 'menuList', {
				get: _ => vm.$generateMenus(vm.menus)
			})
		}
	},
	{
		name: 'Change country code',
		from: 'object',
		enable: config.misc.unlock,
		condition: o => o.updateSystemInfo && o.updateSystemInfo.length == 2,
		process(mutations) {
			let _updateSystemInfo = mutations.updateSystemInfo
			mutations.updateSystemInfo = (state, systemInfo) => {
				if (systemInfo) {
					systemInfo.country_code = 'US'
				}
				_updateSystemInfo.call(this, state, systemInfo)
			}
		}
	},
	{
		name: 'Unlock network app list',
		from: 'vue',
		enable: config.misc.unlock,
		condition: vm => 'wanList' in vm,
		process(vm) {
			defineProp(vm, 'lang', { get: () => 'en' })
		}
	},
	{
		name: 'Extract PopperJs',
		from: 'vue',
		enable: config.navbar.buttons.length,
		condition: vm => 'popperVM' in vm,
		complete: () => glPopper,
		process(vm) {
			vm.$nextTick(_ => {
				let node = vm.$refs.popper.cloneNode()
				node.id = ''
				glPopper = new Popper(vm, node.cloneNode())
			})
		}
	},
	{
		name: 'Extract MessageBox',
		from: 'vue',
		condition: vm => '$message' in vm,
		complete: () => glToastr,
		process(vm) {
			glToastr = vm.$message
		}
	},
	{
		name: 'Extract DisableMask',
		from: 'vue',
		enable: config.navbar.length,
		condition: vm => 'changeShowDisableMask' in vm,
		complete: () => glDisableMask,
		process(vm) {
			glDisableMask = vm.changeShowDisableMask
		}
	},
	{
		name: 'Change range of fan temperature',
		from: 'vue',
		enable: config.misc.fan.enable,
		condition: vm => vm.handleInpSlider && 'tMarks' in vm,
		process(vm) {
			vm.handleInpSlider = t => vm.temperature = Math.min(Math.max(config.misc.fan.range[0], t), config.misc.fan.range[1])
			const $t = vm.$t.bind(vm)
			vm.$t = key => {
				const text = $t(key)
				if (key == 'overview.fan_setting_tips') {
					return text
						.replace('$$$$', vm.$getTemperatureUnit(config.misc.fan.range[0], vm.tUnit))
						.replace('$$$$', vm.$getTemperatureUnit(config.misc.fan.range[1], vm.tUnit))
				}
				return text
			}
			defineProp(vm, 'tMarks', {
				get() {
					let tMarks = {}
					for (let tmp = Math.ceil(config.misc.fan.range[0] / 10); tmp <= Math.floor(config.misc.fan.range[1] / 10); tmp++) {
						tMarks[tmp * 10] = vm.$getTemperatureUnit(tmp * 10, vm.tUnit)
					}
					return tMarks
				}
			})
		}
	},
	{
		name: 'Change slider of fan temperature ',
		from: 'object',
		enable: config.misc.fan.enable,
		condition: o => o.staticClass === 'main-slider',
		process(o) {
			o.attrs.min = config.misc.fan.range[0] - 1
			o.attrs.max = config.misc.fan.range[1] + 1
		}
	}
])

watchState([
	// {
	// 	name: 'Change style of login page ',
	// 	condition: () => config.style.login.new_style || config.style.login.background_url,
	// 	complete: () => document.getElementById('_login_'),
	// 	process(param) {
	// 		let cfg = config.style.login, css = '.aside-wrapper{height:calc(100vh - 50px)}';
	// 		if (cfg.background_url) {
	// 			css += 'body{background:url(' + cfg.background_url + ')center/cover}.login-wrapper{background:rgba(0,0,0,' + cfg.background_mask / 100 + ')!important;-webkit-backdrop-filter: blur(' + cfg.background_blur + 'px);backdrop-filter: blur(' + cfg.background_blur + 'px)}' +
	// 				'.login-wrapper::after{content:"GlInjector v"' + version + ';position:absolute;bottom:10px;left:50%;font-size:12px;transform:translateX(-50%);color:gray;}.login-form .el-input__inner{border-radius:99px}'
	// 		}
	// 		if (cfg.new_style) {
	// 			css += '@media screen and (min-width:1000px){.login-wrapper{width:544px !important;margin-left:134px;box-shadow:0 0 15px #00000080;animation:op 1s ease .3s both;}.form-container{width:initial !important}@keyframes op{0%{margin-left:100px;opacity:0;}100%{opacity:1;}}}'
	// 		}
	// 		injectCss('_login_', css)
	// 	}
	// },
	// {
	// 	name: 'Reset body background',
	// 	condition: () => config.style.login.background_url && location.hash.match('login'),
	// 	process(param) {
	// 		document.body.style.background = ''
	// 	}
	// },
	// {
	// 	name: 'Clean body background',
	// 	condition: () => config.style.login.background_url && !location.hash.match('login'),
	// 	delayCondition: () => document.querySelector('.home-wrapper'),
	// 	process(param) {
	// 		document.body.style.background = 'var(--background-main)'
	// 	}
	// },
	// {
	// 	name: 'Modify login buttons',
	// 	condition: () => location.hash.match('login'),
	// 	complete: () => document.querySelector('._luciBtn_'),
	// 	requires: {
	// 		glLogin: () => glLogin,
	// 		wrapper: () => document.querySelector('.login-btn'),
	// 	},
	// 	process(param) {
	// 		let wrapper = param.wrapper,
	// 			loginVm = param.glLogin.vm,
	// 			loginBtn = wrapper.firstChild,
	// 			luciBtn = loginBtn.cloneNode()

	// 		luciBtn.innerText = config.style.login.button.luci_text
	// 		luciBtn.classList.add('_luciBtn_')

	// 		if (config.style.login.button.comb) {
	// 			luciBtn.style.borderRadius = "0 99px 99px 0"
	// 			luciBtn.style.marginLeft = "1px"
	// 			loginBtn.style.borderRadius = "99px 0 0 99px"
	// 			loginBtn.style.marginRight = "1px"
	// 		}

	// 		wrapper.appendChild(luciBtn)

	// 		luciBtn.onclick = _ => {
	// 			setTimeout(_ => loginVm.login = param.glLogin.method, 1000)
	// 			loginVm.login = _ => luciLogin(response => {
	// 				loginVm.isLoading = false
	// 				if (response.status == 200) {
	// 					location.href = luciURL + '/'
	// 				} else {
	// 					loginVm.$message.closeAll()
	// 					loginVm.$message.error(loginVm.$t('login.err_msg'))
	// 				}
	// 			})
	// 			loginVm.handleLogin()
	// 		}
	// 	}
	// }, 
	{
		name: 'Enable wide screen mode',
		condition: () => config.style.system.wide_mode,
		complete: () => document.getElementById('_gli_wide_'),
		process() {
			injectCss('_gli_wide_', wideModeStyle)
		}
	}, {
		name: 'Auto refresh LuCI cookies',
		condition: () => !location.hash.match('login'),
		delayCondition: () => document.querySelector('.home-wrapper'),
		complete: () => luciRefreshTimer,
		process() {
			luciRefreshTimer = setInterval(() => fetch(luciURL + '/'), 100000)
		}
	},
	{
		name: 'Inject navbar buttons',
		condition: () => config.navbar.buttons.length && !location.hash.match('login'),
		delayCondition: () => document.querySelector('.home-wrapper'),
		complete: () => document.querySelector('.gli-navbtn'),
		requires: {
			popper: () => glPopper,
			toastr: () => glToastr,
			switchElm: () => document.querySelector('.switch')
		},
		process(param) {
			const divideElm = param.switchElm.querySelector('.switch .divide-right')
			let iframe = null
			let closeButton = null
			let showIframe = flag => {
				closeButton.style.display = closeButton.nextElementSibling.style.display = flag ? '' : 'none'
				if (flag) {
					iframe.classList.add('gli-show')
				} else {
					iframe.classList.remove('gli-show')
				}
			}
			let createNavBtn = (link, icon) => {
				let button = document.createElement('a')
				button.classList.add('gli-navbtn')
				button.href = link
				button.innerHTML = '<span class="' + icon + '">'
				return button
			}

			param.switchElm.prepend(divideElm.cloneNode())
			const hasEmbed = config.navbar.buttons.find(o => o.mode == 'embed')

			if (hasEmbed) {
				injectCss('', navbarFrameStyle)
				iframe = document.createElement('iframe')
				iframe.className = 'gli-iframe'
				iframe.name = '_gli_iframe'
				document.querySelector('.home-wrapper>.container').append(iframe)
			}

			for (let btnInfo of config.navbar.buttons) {
				let button = createNavBtn(btnInfo.link, btnInfo.icon)
				param.switchElm.prepend(button)
				glPopper.bind(button, btnInfo.name)

				if (btnInfo.link.startsWith("#/")) {
					button.removeAttribute('target')
					button.onclick = () => showIframe(false)
				} else if (btnInfo.mode == 'replace') {
					button.target = '_self'
				} else if (btnInfo.mode == 'blank') {
					button.target = '_blank'
				} else if (btnInfo.mode == 'embed') {
					button.target = '_gli_iframe'
					button.onclick = e => {
						showIframe(false)
						iframe.onload = () => {
							iframe.onload = () => injectCss('', '[href="/cgi-bin/luci/admin/logout"]{display:none !important}', iframe.contentDocument)
							iframe.onload()
							setTimeout(() => {
								glToastr.closeAll()
								glDisableMask && glDisableMask(false)
								showIframe(true)
							}, 300)
						}
						glToastr.closeAll()
						glDisableMask && glDisableMask(true)
						glToastr({
							message: "Loading...",
							iconClass: "iconfont icon-loading",
							duration: 0
						})
					}
				}
			}

			if (hasEmbed) {
				closeButton = createNavBtn(null, 'iconfont icon-eject')
				closeButton.removeAttribute('href')
				closeButton.onclick = () => showIframe(false)
				let divide = divideElm.cloneNode()
				param.switchElm.prepend(divide)
				param.switchElm.prepend(closeButton)
				glPopper.bind(closeButton, 'Back')
				closeButton.style.display = 'none'
				divide.style.display = 'none'
			}
		}
	}
])

xlog('info', 'Welcome', 'GlInjector v' + version)