
import { extendObject } from "./uitls"

const config = {
    "style": {
        "login": {
            "background": {
                "url": "/upload/bg_example.jpg",
                "size": "fill",
                "position": "center"
            },
            "box": {
                "theme": "dark",
                "alpha": 30,
                "blur": 30,
                "style": "horizon",
                "margin": 8,
                "width": 500,
                "height": 550,
                "radius": 10,
                "position": "left",
                "anime": "left"
            },
            "button": {
                "comb": true,
                "luci": true,
                "luci_text": "LuCI"
            }
        },
        "system": {
            "wide_mode": true,
            "home": {
                "background": {
                    "url": "",
                    "size": "fill",
                    "position": "center",
                    "alpha": 50
                }
            }
        }
    },
    "misc": {
        "fan": {
            "enable": true,
            "range": [30, 90]
        },
        "unlock": false
    },
    "navbar": {
        "buttons": [
            {
                "name": "LuCI",
                "icon": "iconfont icon-gateway",
                "link": "/cgi-bin/luci/",
                "mode": "blank",
                "wait": true,
                "enable": true
            },
            {
                "name": "Interfaces",
                "icon": "iconfont icon-printer",
                "link": "/cgi-bin/luci/admin/network/network",
                "mode": "embed",
                "wait": true,
                "enable": true
            },
            {
                "name": "Channel Analysis",
                "icon": "iconfont icon-flash",
                "link": "/cgi-bin/luci/admin/status/channel_analysis",
                "mode": "embed",
                "wait": true,
                "enable": true
            },
            {
                "name": "Clients",
                "icon": "iconfont icon-clients",
                "link": "#/clients",
                "mode": "embed",
                "enable": true
            },
            {
                "name": "Overview",
                "icon": "iconfont icon-info",
                "link": "#/overview",
                "mode": "embed",
                "enable": true
            }
        ]
    }
}

export function defaultConfig() {
    return JSON.parse(JSON.stringify(config))
}


export function mergeConfig(old) {
    const cfg = extendObject(defaultConfig(), old)
    cfg.navbar.buttons.forEach(btn => {
        if (!('wait' in btn)) {
            btn.wait = true
        }
    })
    return cfg
}
