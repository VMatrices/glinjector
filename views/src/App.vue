<template>
    <div class="plugin-wrapper">

        <gl-title :title="$t('menu_glinjector')">
            <a slot="badge" class="github" target="_blank" href="https://github.com/VMatrices">
                <i class="el-icon-link" />
                VMatrices
            </a>
        </gl-title>

        <gl-card class="card-spacing card-tabs ">
            <el-tabs class="is-card  el-tabs--card">
                <el-tab-pane :label="tl('login_page')">

                    <el-tooltip effect="dark" content="提示文字" placement="top-start">
                        <span class="iconfont icon-info" />
                    </el-tooltip>
                    <el-popover placement="top-start" width="200" trigger="hover" content="提示文字">
                        <span slot="reference" class="iconfont icon-info" />
                    </el-popover>

                </el-tab-pane>
                <el-tab-pane :label="tl('index_page')">
                </el-tab-pane>
                <el-tab-pane :label="tl('navbar')">
                </el-tab-pane>
                <el-tab-pane :label="tl('misc')">
                    <div class="form">
                        <ul>
                            <li>
                                <div>
                                    <span>宽屏模式 </span>
                                    <el-tooltip effect="dark" content="Top Left 提示文字" placement="top-start">
                                        <span class="iconfont icon-info" />
                                    </el-tooltip>
                                </div>
                                <div>
                                    <gl-switch v-model="style.wide_mode" />
                                </div>
                            </li>
                            <li>
                                <div>恢复菜单</div>
                                <div>
                                    <gl-switch v-model="unlock" />
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
            </el-tabs>

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
                        <i :class="vv" />
                    </template>
                    <el-option v-for="item in icons" :key="item" :label="item" :value="item">
                        <span style="float: left"><i :class="item" /></span>
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

    .github {
        color: white !important;
        font-size: 13px;
    }

    .card-spacing {
        margin-bottom: 20px;
    }

    .card-tabs {
        padding: 0px;

        ::v-deep {
            >.container {
                padding: 0 0 20px 0 !important
            }

            .el-tab-pane {
                padding: 20px 20px 0 20px;
            }
        }


        .is-card {
            box-shadow: none !important;
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

    .form {
        // max-width: 635px;

        li {
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 15px;

            // &:not(:first-child) {
            border-bottom: 1px solid var(--divider);
            // }

            >div:first-child {
                color: var(--text-weak);
                flex: 1;
                margin-right: 10px;
                display: flex;
                align-items: center;
            }

            >div:last-child {
                max-width: 230px;
                width: 50%;
                min-width: 160px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                color: var(--text-regular);
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

}
</style>
