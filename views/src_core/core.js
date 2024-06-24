(()=>{
// GL_UI_CONFIG = {
// 	style: {
// 		login: {
// 			background_url: 'https://api.timecdn.cn/libs/wallpaper/v1',
// 			background_mask: 50,
// 			background_blur: 20,
// 			comb_button: true,
// 			luci_text: "LuCI",
// 			new_style: {
// 				enable: true,
// 				margin: '133px',
// 				position: 'left'
// 			},
// 		},
// 		wide_mode: true,
// 	},
// 	fan: { // 无风扇型号可移除此项
// 		min: 30,
// 		max: 90
// 	},
// 	unlock: true,
// 	navbar: {
// 		embed: true,
// 		buttons: [    //自定义按钮
// 			{
// 				name: "LuCI",
// 				icon: "iconfont icon-gateway",
// 				link: "/cgi-bin/luci/"
// 			},
// 			{
// 				name: "打印机",
// 				icon: "iconfont icon-printer",
// 				link: "/cgi-bin/luci/admin/nas/usb_printer"
// 			},
// 			{
// 				name: "文件管理",
// 				icon: "iconfont icon-flash",
// 				link: "/cgi-bin/luci/admin/nas/fileassistant"
// 			},
// 			{
// 				name: "客户端列表",
// 				icon: "iconfont icon-clients",
// 				link: "#/clients"
// 			},
// 			{
// 				name: "系统概览",
// 				icon: "iconfont icon-info",
// 				link: "#/overview"
// 			}
// 		]
// 	}
// }

// 各位更新系统后，一点要重新修改最新新的gl_home.html，不要用自己备份的文件

let version = '2.2 (beta)',
	config = GL_UI_CONFIG,
	_defineProperty = Object.defineProperty,
	_pushState = history.pushState,
	_replaceState = history.replaceState,
	_forEach = Array.prototype.forEach,
	_isArray = Array.isArray,
	_objectKeys = Object.keys,
	_loginMethod = null,
	loginApp = null,
	popper = null,
	toastr = null,
	showDisableMask = null,
	luciRefreshTimer = null,
	luciURL = '/cgi-bin/luci';

let clog = (level, title, msg) => {
	setTimeout(console[level].bind(console,
		'%cGlInjector %c<' + title + '> %c' + msg,
		'color:grey;font-weight:bold',
		'font-weight:bold',
		'color:darkblue',
	));
}

let injectCss = (id, css, doc) => {
	doc = doc || document
	let style = doc.createElement('style')
	style.innerText = css
	style.id = id
	doc.head.append(style)
}

// 初始化PopJS
function Popper(vm, template) {
	let rawPopperElm = vm.popperElm,
		rawReferenceElm = vm.referenceElm

	this.bind = (elm, content) => {
		let tooltipElm = template.cloneNode()

		tooltipElm.style.display = ''
		tooltipElm.style.pointerEvents = 'none'
		tooltipElm.classList.add('el-fade-in-leave-active')
		tooltipElm.innerHTML = content
		document.body.append(tooltipElm)

		vm.popperElm = tooltipElm
		vm.referenceElm = elm
		vm.createPopper()
		let pjs = vm.popperJS
		vm.popperElm = rawPopperElm
		vm.referenceElm = rawReferenceElm
		vm.popperJS = null

		elm.onmouseenter = _ => {
			pjs.update()
			tooltipElm.classList.remove('el-fade-in-leave-active')
			tooltipElm.classList.add('el-fade-in-enter-active')
		}

		elm.onmouseleave = _ => {
			tooltipElm.classList.remove('el-fade-in-enter-active')
			tooltipElm.classList.add('el-fade-in-leave-active')
		}
	}
}

// LuCI登录接口
let luciLogin = (callback) => fetch(luciURL + '?luci_username=' + encodeURIComponent(loginApp.form.username) + '&luci_password=' + encodeURIComponent(loginApp.form.password))
	.then(response => callback && callback(response))

let createNavBtn = (template, link, icon) => {
	let button = template.cloneNode()
	button.classList.add('_navBtn_')
	button.href = link
	button.style = 'margin-left:20px'
	button.innerHTML = '<span class="' + icon + '">'
	return button
}

let hooks = [
	{
		name: 'Extract login method',
		from: 'vue',
		condition: vm => vm.handleLogin,
		// complete: () => loginApp,
		process(vm) {
			loginApp = vm
			let loginMethod = vm.login
			_loginMethod = vm.login = token => {
				loginMethod.call(vm, token)
				luciLogin()
			}
		}
	},
	{
		name: 'Unlock menu (v4.2.3+)',
		from: 'array',
		enable: config.unlock,
		condition: arr => arr[0].lang_hide,
		process(arr) {
			// v4.2.3
			arr.forEach(menu => menu.lang_hide = menu.parent_lang_hide = [])
		}
	},
	{
		name: 'Unlock menu (v4.2.0~4.2.2)',
		from: 'vue',
		enable: config.unlock,
		condition: vm => 'menus' in vm && 'menuList' in vm,
		process(vm) {
			if (vm.$md5) {
				// v4.2.1~2
				_defineProperty(vm, 'menuList', {
					get() {
						var networkMode = vm.networkMode;
						return vm.menus
							.filter(menu => (!menu.show_mode || menu.show_mode.includes(networkMode)) && (!menu.parent_show_mode || menu.parent_show_mode.includes(networkMode)))
							.map(menu => (menu.h = vm.$md5(menu.view), menu))
					}
				})
			} else {
				// v4.2.0
				Object.defineProperty(vm, 'menuList', {
					get: _ => vm.$generateMenus(vm.menus)
				})
			}

		}
	},
	{
		name: 'Change country code',
		from: 'object',
		enable: config.unlock,
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
		enable: config.unlock,
		condition: vm => 'wanList' in vm,
		process(vm) {
			_defineProperty(vm, 'lang', { get: () => 'en' })
		}
	},
	{
		name: 'Extract PopperJs',
		from: 'vue',
		condition: vm => 'popperVM' in vm,
		complete: () => popper,
		process(vm) {
			vm.$nextTick(_ => {
				let node = vm.$refs.popper.cloneNode()
				node.id = ''
				popper = new Popper(vm, node.cloneNode())
			})
		}
	},
	{
		name: 'Extract MessageBox',
		from: 'vue',
		condition: vm => '$message' in vm,
		complete: () => toastr,
		process(vm) {
			toastr = vm.$message
		}
	},
	{
		name: 'Extract DisableMask',
		from: 'vue',
		condition: vm => 'changeShowDisableMask' in vm,
		complete: () => showDisableMask,
		process(vm) {
			showDisableMask = vm.changeShowDisableMask
		}
	},
	{
		name: 'Change fan temperature range',
		from: 'vue',
		enable: config.fan,
		condition: vm => vm.handleInpSlider && 'tMarks' in vm,
		process(vm) {
			vm.handleInpSlider = t => vm.temperature = Math.min(Math.max(config.fan.min, t), config.fan.max)
			const $t = vm.$t.bind(vm)
			vm.$t = key => {
				const text = $t(key)
				if (key == 'overview.fan_setting_tips') {
					return text
						.replace('$$$$', vm.$getTemperatureUnit(config.fan.min, vm.tUnit))
						.replace('$$$$', vm.$getTemperatureUnit(config.fan.max, vm.tUnit))
				}
				return text
			}
			_defineProperty(vm, 'tMarks', {
				get() {
					let tMarks = {}
					for (let tmp = Math.ceil(config.fan.min / 10); tmp <= Math.floor(config.fan.max / 10); tmp++) {
						tMarks[tmp * 10] = vm.$getTemperatureUnit(tmp * 10, vm.tUnit)
					}
					return tMarks
				}
			})
		}
	},
	{
		from: 'object',
		condition: o => o.staticClass === 'main-slider',
		process(o) {
			o.attrs.min = config.fan.min - 1
			o.attrs.max = config.fan.max + 1
		}
	}
]

let processors = [
	{
		name: 'Change style of login page ',
		condition: () => config.style.login.new_style || config.style.login.background_url,
		complete: () => document.getElementById('_login_'),
		process(param) {
			let cfg = config.style.login, css = '.aside-wrapper{height:calc(100vh - 50px)}';
			if (cfg.background_url) {
				css += 'body{background:url(' + cfg.background_url + ')center/cover}.login-wrapper{background:rgba(0,0,0,' + cfg.background_mask / 100 + ')!important;-webkit-backdrop-filter: blur(' + cfg.background_blur + 'px);backdrop-filter: blur(' + cfg.background_blur + 'px)}' +
					'.login-wrapper::after{content:"GlInjector v"' + version + ';position:absolute;bottom:10px;left:50%;font-size:12px;transform:translateX(-50%);color:gray;}.login-form .el-input__inner{border-radius:99px}'
			}
			if (cfg.new_style) {
				css += '@media screen and (min-width:1000px){.login-wrapper{width:544px !important;margin-left:134px;box-shadow:0 0 15px #00000080;animation:op 1s ease .3s both;}.form-container{width:initial !important}@keyframes op{0%{margin-left:100px;opacity:0;}100%{opacity:1;}}}'
			}
			injectCss('_login_', css)
		}
	},
	{
		name: 'Reset body background',
		condition: () => config.style.login.background_url && location.hash.match('login'),
		process(param) {
			document.body.style.background = ''
		}
	},
	{
		name: 'Clean body background',
		condition: () => config.style.login.background_url && !location.hash.match('login'),
		delayCondition: () => document.querySelector('.home-wrapper'),
		process(param) {
			document.body.style.background = 'var(--background-main)'
		}
	},
	{
		name: 'Modify login buttons',
		condition: () => location.hash.match('login'),
		complete: () => document.querySelector('._luciBtn_'),
		requires: {
			loginApp: () => loginApp,
			wrapper: () => document.querySelector('.login-btn'),
		},
		process(param) {
			let wrapper = param.wrapper,
				app = param.loginApp,
				loginBtn = wrapper.firstChild,
				luciBtn = loginBtn.cloneNode()

			luciBtn.innerText = config.style.login.luci_text
			luciBtn.classList.add('_luciBtn_')

			if (config.style.login.comb_button) {
				luciBtn.style.borderRadius = "0 99px 99px 0"
				luciBtn.style.marginLeft = "1px"
				loginBtn.style.borderRadius = "99px 0 0 99px"
				loginBtn.style.marginRight = "1px"
			}

			wrapper.appendChild(luciBtn)

			luciBtn.onclick = _ => {
				setTimeout(_ => app.login = _loginMethod, 1000)
				app.login = _ => luciLogin(response => {
					app.isLoading = false
					if (response.status == 200) {
						location.href = luciURL + '/'
					} else {
						app.$message.closeAll()
						app.$message.error(app.$t('login.err_msg'))
					}
				})
				app.handleLogin()
			}
		}
	}, {
		name: 'Enable wide screen mode',
		condition: () => config.style.wide_mode,
		complete: () => document.getElementById('_wide_'),
		process() {
			injectCss('_wide_', '.home-wrapper{max-width:initial !important;}.home-wrapper .header-container{max-width:initial !important;}.router-visual-wrapper{max-width:initial !important;}')
		}
	}, {
		name: 'Auto refresh LuCI cookies',
		condition: () => !location.hash.match('login'),
		delayCondition: () => document.querySelector('.home-wrapper'),
		complete: () => luciRefreshTimer,
		process() {
			luciRefreshTimer = setInterval(() => fetch(luciURL + '/'), 100000)
		}
	}, {
		name: 'Inject navbar buttons',
		condition: () => !location.hash.match('login'),
		delayCondition: () => document.querySelector('.home-wrapper'),
		complete: () => document.querySelector('._navBtn_'),
		requires: {
			popper: () => popper,
			toastr: () => toastr,
			switchElm: () => document.querySelector('.switch')
		},
		process(param) {
			let switchElm = param.switchElm
			let template = switchElm.firstChild.cloneNode()
			let divideElm = switchElm.querySelector('.divide-right')
			let iframe = null
			let closeButton = null
			let showIframe = flag => {
				closeButton.style.display = closeButton.nextElementSibling.style.display = flag ? '' : 'none'
				iframe.style.visibility = flag ? '' : 'hidden'
				iframe.style.opacity = flag ? 1 : 0
			}

			switchElm.prepend(divideElm.cloneNode())

			if (config.navbar.embed) {
				iframe = document.createElement('iframe')
				iframe.name = '_gl_iframe_'
				iframe.style.position = 'absolute'
				iframe.style.width = '100%'
				iframe.style.height = 'calc(100% - 50px)'
				iframe.style.zIndex = 9999
				iframe.style.border = 'none'
				iframe.style.background = 'white'
				iframe.style.visibility = 'hidden'
				iframe.style.transition = 'all .2s'

				let header = document.querySelector('.header-container')
				header.style.zIndex = 102
				header.style.boxShadow = '0 0 10px #00000030'

				let container = document.querySelector('.home-wrapper>.container')
				container.style.position = 'relative'
				container.append(iframe)
			}

			for (let btnInfo of config.navbar.buttons) {
				let button = createNavBtn(template, btnInfo.link, btnInfo.icon)
				switchElm.prepend(button)
				popper.bind(button, btnInfo.name)
				if (btnInfo.link.startsWith("#/")) {
					button.removeAttribute('target')
					button.onclick = () => showIframe(false)
				} else if (config.navbar.embed) {
					button.target = '_gl_iframe_'
					button.onclick = e => {
						showIframe(false)
						iframe.onload = () => {
							iframe.onload = () => injectCss('', '[href="/cgi-bin/luci/admin/logout"]{display:none !important}', iframe.contentDocument)
							iframe.onload()
							setTimeout(() => {
								toastr.closeAll()
								showDisableMask && showDisableMask(false)
								showIframe(true)
							}, 300)
						}
						toastr.closeAll()
						showDisableMask && showDisableMask(true)
						toastr({
							message: "Loading...",
							iconClass: "iconfont icon-loading",
							duration: 0
						})
					}
				}
			}

			if (config.navbar.embed) {
				closeButton = createNavBtn(template, null, 'iconfont icon-eject')
				closeButton.removeAttribute('href')
				closeButton.onclick = () => showIframe(false)
				let divide = divideElm.cloneNode()
				divide.style.marginRight = 0
				switchElm.prepend(divide)
				switchElm.prepend(closeButton)
				popper.bind(closeButton, 'Back')
				closeButton.style.display = 'none'
				divide.style.display = 'none'
			}
		}
	}
]

let runProcessor = processor => {
	if (processor.condition()) {
		if (!processor.time) {
			processor.time = Date.now()
		}
		if ((processor.complete && processor.complete()) || Date.now() - processor.time > 10000) return
		if (!processor.delayCondition || processor.delayCondition()) {
			let param = {}
			if (processor.requires) {
				for (let key in processor.requires) {
					if (!(param[key] = processor.requires[key]())) {
						setTimeout(() => runProcessor(processor), 32)
						return
					}
				}
			}
			try {
				processor.name && clog('debug', 'Normal', processor.name)
				processor.process(param)
			} catch (e) {
				clog('info', 'Error', e)
			}
		} else {
			setTimeout(() => runProcessor(processor), 32)
		}
	}
}

let processor = () => {
	for (let processor of processors) {
		processor.time = null
		runProcessor(processor)
	}
}

let hookObject = (obj, from) => {
	if (!obj.___) {
		try {
			for (let hook of hooks) {
				if ((!('enable' in hook) || hook.enable) && hook.from == from && (!hook.complete || !hook.complete(obj)) && hook.condition(obj)) {
					obj.___ = 1
					hook.name && clog('debug', 'Hook', hook.name)
					hook.process(obj)
					break
				}
			}
		} catch (e) {
			clog('info', 'Error', e)
		}
	}
}

// 拦截对象
Object.defineProperty = (a, b, c) => {
	a._isVue && hookObject(a, 'vue')
	return _defineProperty(a, b, c)
}

Array.prototype.forEach = function (a, b) {
	this.length && hookObject(this, 'array')
	_forEach.call(this, a, b)
}

Array.isArray = o => {
	o && hookObject(o, 'object')
	return _isArray(o)
}

Object.keys = o => {
	o && hookObject(o, 'object')
	return _objectKeys(o)
}

// 状态变化
history.pushState = (a, b, c) => {
	_pushState.call(history, a, b, c)
	processor()
}

history.replaceState = (a, b, c) => {
	_replaceState.call(history, a, b, c)
	processor()
}

clog('info', 'Welcome', 'GlInjector v' + version)

addEventListener('load', processor)

processor()


})()