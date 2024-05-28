<template>
    <div class="wrapper">
        <gl-title :title="$t('menu_glinjector')" />

        <div class="card">
            <div class="content">
                <gl-tips tips="Woc" />
                <gl-button type="primary" @click="dialogVisible = true">{{ tl('apply') }}</gl-button>
            </div>
        </div>

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
.wrapper {
    padding: 20px 0;

    .card {
        width: 100%;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 2px 6px 16px 6px var(--shadow);
        background-color: var(--background-card);

        .content {
            max-width: 635px;
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
