export default {
    "style": {
        "login": {
            "background": {
                "url": "/img/bg_login_demo.jpg",
                "size": "cover",
                "position": "center"
            },
            "box": {
                "color": "dark",
                "alpha": 30,
                "blur": 30,
                "new_look": true,
                "margin": 8,
                "width": 500,
                "position": "left"
            },
            "button": {
                "comb": true,
                "luci": true,
                "text": "LuCI"
            }
        },
        "system": {
            "wide_mode": true,
            "background": {
                "url": "",
                "size": "cover",
                "position": "center",
                "color": "dark",
                "alpha": 30
            }
        }
    },
    "misc": {
        "fan": [
            30,
            90
        ],
        "unlock": true
    },
    "navbar": [
        {
            "name": "LuCI",
            "icon": "iconfont icon-gateway",
            "link": "/cgi-bin/luci/",
            "mode": "embed",
            "enable": true
        },
        {
            "name": "Interfaces",
            "icon": "iconfont icon-printer",
            "link": "/cgi-bin/luci/admin/network/network",
            "mode": "embed",
            "enable": true
        },
        {
            "name": "Channel Analysis",
            "icon": "iconfont icon-flash",
            "link": "/cgi-bin/luci/admin/status/channel_analysis",
            "mode": "embed",
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