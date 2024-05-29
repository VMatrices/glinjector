<template>
    <div class="plugin-wrapper">

        <gl-title :title="$t('menu_glinjector')" badge="asd">
            <template slot="badge">
                <a class="github" target="_blank" href="https://github.com/VMatrices">
                    <i class="el-icon-link"></i>
                    VMatrices
                </a>
            </template>
        </gl-title>

        <gl-card class="card-spacing card-tabs ">
            <el-tabs class="is-card  el-tabs--card">
                <el-tab-pane label="用户管理">
                    <div class="container">
                        asdasd
                    </div>
                </el-tab-pane>
                <el-tab-pane label="配置管理"></el-tab-pane>
                <el-tab-pane label="角色管理"></el-tab-pane>
                <el-tab-pane label="定时任务补偿"></el-tab-pane>
            </el-tabs>

            <div class="btns">
                <gl-button type="primary" @click="dialogVisible = true">{{ tl('apply') }}</gl-button>
            </div>

        </gl-card>

        <gl-card class="card-spacing" title="首页">
            <gl-tips tips="Woc" />
            <div class="btns">
                <gl-button type="primary" @click="dialogVisible = true">{{ tl('apply') }}</gl-button>
            </div>
        </gl-card>

        <gl-card class="card-spacing" title="导航栏">
            <gl-tips tips="Woc" />
            <div class="btns">
                <gl-button type="primary" @click="dialogVisible = true">{{ tl('apply') }}</gl-button>
            </div>
        </gl-card>

        <gl-card class="card-spacing" title="其他">
            <gl-tips tips="Woc" />
        </gl-card>

        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <div class="dialog-main">
                <gl-radio-group>
                    <gl-radio label="aaa">ACGD</gl-radio>
                    <gl-radio label="bbb">dfgdfcd</gl-radio>
                </gl-radio-group>
                <el-select v-model="vv" filterable placeholder="请选择图标">
                    <template slot="prefix">
                        <i :class="vv"></i>
                    </template>
                    <el-option v-for="item in icons" :key="item" :label="item" :value="item">
                        <span style="float: left"><i :class="item"></i></span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
                    </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <div class="dialog-btns">
                    <gl-button class="dialog-btn" @click="dialogVisible = false">取 消</gl-button>
                    <gl-button class="dialog-btn" type="primary" @click="hhh">确 定</gl-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import icons from './icons';
export default {
    name: "luci",
    data() {
        return {
            icons,
            vv: '',
            dialogVisible: false,
            style: {
                login: {
                    background_url: 'https://api.timecdn.cn/libs/wallpaper/v1',
                    background_mask: 50,
                    background_blur: 20,
                    comb_button: true,
                    luci_text: "LuCI",
                    new_style: {
                        enable: true,
                        margin: '133px',
                        position: 'left'
                    },
                },
                index: {

                },
                wide_mode: true,
            },
            fan: { // 无风扇型号可移除此项
                enable: false,
                min: 30,
                max: 90
            },
            unlock: true,
            navbar: {
                embed: true,
                buttons: [    //自定义按钮
                    {
                        name: "LuCI",
                        icon: "iconfont icon-gateway",
                        link: "/cgi-bin/luci/"
                    },
                    {
                        name: "打印机",
                        icon: "iconfont icon-printer",
                        link: "/cgi-bin/luci/admin/nas/usb_printer"
                    },
                    {
                        name: "文件管理",
                        icon: "iconfont icon-flash",
                        link: "/cgi-bin/luci/admin/nas/fileassistant"
                    },
                    {
                        name: "客户端列表",
                        icon: "iconfont icon-clients",
                        link: "#/clients"
                    },
                    {
                        name: "系统概览",
                        icon: "iconfont icon-info",
                        link: "#/overview"
                    }
                ]
            }
        }
    },
    methods: {
        tl(key) {
            return this.$t('glinjector.' + key)
        },
        hhh() {
            console.log(this)
        }
    }
}
</script>

<style lang="scss" scoped>
.github {
    color: white !important;
    font-size: 13px;
}

.card-spacing {
    margin-bottom: 20px;
}

.card-tabs {
    padding: 0px;

    ::v-deep .container {
        padding: 0px !important
    }
}

.plugin-wrapper {
    padding: 20px 0;

    .btns {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;

        .gl-btn {
            min-width: 124px;
        }
    }

}

.el-dialog {
    max-width: 600px;

    .dialog-btns {
        display: flex;
        align-items: center;
        justify-content: center;

        .dialog-btn {
            width: 124px;
            height: 36px
        }
    }

}

[class*=" el-icon-"],
[class^=el-icon-] {
    font-size: 16px;
    width: inherit;
    height: inherit;
    line-height: inherit;
}
</style>
