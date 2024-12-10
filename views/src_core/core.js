import { version } from '../package.json'
import { xlog } from './xlog';
import { Popper } from './popper';
import { createCss, injectCss } from './css-tool';
import { defineProp, hookObject, watchState } from './hook-tool';
import baseStyle from './style/base-style.scss'
import wideModeStyle from './style/wide-mode.scss'
import lightLoginStyle from './style/light-login.scss'

let config = GL_UI_CONFIG,
	glLogin = null,
	glPopper = null,
	glToastr = null,
	glDisableMask = null,
	luciRefreshTimer = null,
	luciURL = '/cgi-bin/luci';

let luciLogin = (callback) => fetch(luciURL + '?luci_username=' + encodeURIComponent(glLogin.vm.form.username) + '&luci_password=' + encodeURIComponent(glLogin.vm.form.password))
	.then(response => callback && callback(response))

xlog('info', 'Welcome', 'GlInjector v' + version)

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
			arr.forEach(menu => menu.lang_hide = menu.parent_lang_hide = [])
		}
	},
	// {
	// 	name: 'Unlock menu (v4.2.1~2) (deprecated)',
	// 	from: 'vue',
	// 	enable: false,
	// 	condition: vm => ('menus' in vm && 'menuList' in vm) && vm.$md5,
	// 	process(vm) {
	// 		defineProp(vm, 'menuList', {
	// 			get() {
	// 				var networkMode = vm.networkMode;
	// 				return vm.menus
	// 					.filter(menu => (!menu.show_mode || menu.show_mode.includes(networkMode)) && (!menu.parent_show_mode || menu.parent_show_mode.includes(networkMode)))
	// 					.map(menu => (menu.h = vm.$md5(menu.view), menu))
	// 			}
	// 		})
	// 	}
	// },
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
		// enable: config.misc.fan.enable,
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
		// enable: config.misc.fan.enable,
		condition: o => o.model?.expression === "temperature" && o.staticClass === 'main-slider',
		process(o) {
			o.attrs.min = config.misc.fan.range[0] - 1
			o.attrs.max = config.misc.fan.range[1] + 1
		}
	}
])

watchState([
	{
		name: 'Auto refresh LuCI cookies',
		condition: () => !location.hash.match('login'),
		delayCondition: () => document.querySelector('.home-wrapper'),
		complete: () => luciRefreshTimer,
		process() {
			luciRefreshTimer = setInterval(() => fetch(luciURL + '/'), 100000)
		}
	},
	{
		name: 'Inject base style',
		condition: () => true,
		complete: () => document.getElementById('_gli_style_'),
		process: () => injectCss('_gli_style_', baseStyle)
	},
	{
		name: 'Change style of login page ',
		condition: () => true,
		complete: () => document.getElementById('_gli_login_'),
		process() {
			const bgCfg = config.style.login.background, boxCfg = config.style.login.box
			let css = '';

			if (bgCfg.url) {
				const bgStyle = {
					backgroundImage: `url(${bgCfg.url}), var(--background-login)`,
					backgroundSize: {
						"fill": "cover",
						"fit": "contain",
						"stratch": "100% 100%",
						"tile": "auto",
					}[bgCfg.size],
				}
				if (bgCfg.size == 'fit') {
					bgStyle.backgroundRepeat = 'no-repeat'
				}
				if (bgCfg.size == 'tile') {
					bgStyle.backgroundRepeat = 'repeat'
				}
				if (bgCfg.size != 'stratch') {
					bgStyle.backgroundPosition = bgCfg.position
				}
				css += createCss('body', bgStyle)
			}

			if (boxCfg.theme == 'light') {
				css += lightLoginStyle
			}

			css += createCss('.login-wrapper', {
				overflow: 'hidden',
				position: 'relative',
				backdropFilter: `blur(${boxCfg.blur / 100 * 100}px)`,
				background: `rgba(${boxCfg.theme == 'dark' ? '0,0,0' : '255,255,255'}, ${boxCfg.alpha / 100})`
			})

			const boxStyle = {}
			let screenMinWith = 0
			if (boxCfg.style != 'max') {
				boxStyle.boxShadow = '0 0 15px #00000080';
				boxStyle.width = boxCfg.width + 'px'
				screenMinWith = boxCfg.width
				if (boxCfg.style == 'float') {
					boxStyle.display = 'flex'
					boxStyle.flexDirection = 'column'
					boxStyle.justifyContent = 'center'
					boxStyle.paddingBottom = '50px'
					boxStyle.height = boxCfg.height + 'px'
					boxStyle.borderRadius = boxCfg.radius + 'px'
					boxStyle.marginTop = `calc(50vh - ${boxCfg.height / 2}px)`
					css += createCss('.login-wrapper .typeof-router ', {
						marginTop: '0'
					})
				}

				switch (boxCfg.position) {
					case 'left':
						screenMinWith += boxCfg.margin
						boxStyle.marginLeft = boxCfg.margin + '%'
						break
					case 'right':
						screenMinWith += boxCfg.margin
						boxStyle.float = 'right'
						boxStyle.marginRight = boxCfg.margin + '%'
						break
					case 'center':
						boxStyle.marginLeft = `calc(50vw - ${boxCfg.width / 2}px)`
						break
				}

				if (boxCfg.anime) {
					boxStyle.animation = `gli-anime-${boxCfg.anime} 1s ease 0.3s both`
				}

				css += createCss('.login-wrapper .el-input__inner', {
					borderRadius: '99px'
				}) + createCss('.login-wrapper .gl-logo', {
					position: 'absolute',
					top: 0,
					left: '20px',
					marginLeft: 0,
				})
			}
			css += `@media screen and (min-width:${screenMinWith + 200}px) {${createCss('.login-wrapper', boxStyle)}}`

			injectCss('_gli_login_', css)
		}
	},
	{
		name: 'Reset app background',
		condition: () => config.style.login.background.url && location.hash.match('login'),
		requires: {
			app: () => document.getElementById('app')
		},
		process(param) {
			param.app.style.background = ''
		}
	},
	{
		name: 'Clean app background',
		condition: () => config.style.login.background.url && !location.hash.match('login'),
		requires: {
			app: () => document.getElementById('app')
		},
		process(param) {
			param.app.style.background = 'var(--background-main)'
		}
	},
	{
		name: 'Change style of index page',
		condition: () => config.style.system.home.background.url,
		complete: () => document.getElementById('_gli_index_'),
		process() {
			const cfg = config.style.system.home.background;
			const style = {
				backgroundImage: `linear-gradient(rgba(0 0 0/${cfg.alpha}%),rgba(0 0 0/${cfg.alpha}%)), url(${cfg.url})`,
				backgroundSize: {
					"tile": "auto",
					"fill": "cover",
					"fit": "contain",
					"stratch": "100% 100%",
				}[cfg.size],
			}
			if (cfg.size == 'fit') {
				style.backgroundRepeat = 'no-repeat'
			}
			if (cfg.size == 'tile') {
				style.backgroundRepeat = 'repeat'
			}
			if (cfg.size != 'stratch') {
				style.backgroundPosition = cfg.position
			}
			injectCss('_gli_index_', createCss('.router-visual-wrapper', style))
		}
	},
	{
		name: 'Modify login buttons',
		condition: () => config.style.login.button.luci && location.hash.match('login'),
		complete: () => document.querySelector('.gli-luci-btn'),
		requires: {
			glLogin: () => glLogin,
			wrapper: () => document.querySelector('.login-btn'),
		},
		process(param) {
			let wrapper = param.wrapper,
				loginVm = param.glLogin.vm,
				loginBtn = wrapper.firstChild,
				luciBtn = loginBtn.cloneNode()

			luciBtn.innerText = config.style.login.button.luci_text
			luciBtn.classList.add('gli-luci-btn')

			if (config.style.login.button.comb) {
				luciBtn.style.borderRadius = "0 99px 99px 0"
				luciBtn.style.marginLeft = "1px"
				loginBtn.style.borderRadius = "99px 0 0 99px"
				loginBtn.style.marginRight = "1px"
			}

			wrapper.appendChild(luciBtn)

			luciBtn.onclick = _ => {
				setTimeout(_ => loginVm.login = param.glLogin.method, 1000)
				loginVm.login = _ => luciLogin(response => {
					loginVm.isLoading = false
					if (response.status == 200) {
						location.href = luciURL + '/'
					} else {
						loginVm.$message.closeAll()
						loginVm.$message.error(loginVm.$t('login.err_msg'))
					}
				})
				loginVm.handleLogin()
			}
		}
	},
	{
		name: 'Enable wide screen mode',
		condition: () => config.style.system.wide_mode,
		complete: () => document.getElementById('_gli_wide_'),
		process() {
			injectCss('_gli_wide_', wideModeStyle)
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
			switchElm: () => document.querySelector('.hd-right'),
			headerElm: () => document.querySelector('.header-container'),
		},
		process(param) {
			const divideElm = param.switchElm.querySelector('.switch .divide-right')
			let iframe = null
			let closeButton = null
			let showIframe = flag => {
				closeButton.style.display = closeButton.nextElementSibling.style.display = flag ? '' : 'none'
				if (flag) {
					param.headerElm.style.zIndex = 2000
					iframe.classList.add('gli-show')
				} else {
					param.headerElm.style.zIndex = ''
					iframe.classList.remove('gli-show')
				}
			}
			let createNavBtn = (link, icon) => {
				let button = document.createElement('a')
				button.classList.add('gli-navbtn')
				button.href = link
				button.innerHTML = '<span class="gli-btn-icon ' + icon + '">'
				return button
			}

			param.switchElm.prepend(divideElm.cloneNode())
			const hasEmbed = config.navbar.buttons.find(o => o.mode == 'embed')

			if (hasEmbed) {
				iframe = document.createElement('iframe')
				iframe.className = 'gli-iframe'
				iframe.name = '_gli_iframe'
				document.querySelector('.home-wrapper>.container').append(iframe)
			}

			for (let btnInfo of config.navbar.buttons.filter(o => o.enable).reverse()) {
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
