<template>
    <keep-alive>
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
                        <!-- <el-popover placement="top-start" width="200" trigger="hover" content="提示文字">
                        <span slot="reference" class="iconfont icon-info" />
                    </el-popover> -->


                    </el-tab-pane>
                    <el-tab-pane :label="tl('index_page')">
                    </el-tab-pane>
                    <el-tab-pane :label="tl('navbar')">
                        <gl-tips tips="Woc">
                            <gl-button slot="customAction" type="primary" @click="handleOpenBtnDialog">
                                <span class="iconfont icon-plus mr6"></span>
                                <span>添加</span>
                            </gl-button>
                        </gl-tips>
                        <table class="mt10">
                            <thead>
                                <th style="width: 150px;">状态</th>
                                <th>按钮</th>
                                <th>链接 / 路径</th>
                                <th>打开方式</th>
                                <th>操作</th>
                            </thead>
                            <tbody>
                                <tr v-for="item, i in config.navbar">
                                    <td><gl-switch v-model="item.enable" /></td>
                                    <td><i :class="item.icon" /><span>&nbsp;{{ item.name }}</span></td>
                                    <td>{{ item.link }}</td>
                                    <td>
                                        <span v-if="item.mode == 'embed'">嵌入当前页</span>
                                        <span v-if="item.mode == 'blank'">打开新页面</span>
                                        <span v-if="item.mode == 'replace'">替换当前页面</span>
                                    </td>
                                    <td>
                                        <gl-button class="gl-icon-btn" type="default" @click="handleSwapBtn(i, -1)">
                                            <i class="el-icon-arrow-up" />
                                        </gl-button>
                                        <gl-button class="gl-icon-btn" type="default" @click="handleSwapBtn(i, +1)">
                                            <i class="el-icon-arrow-down" />
                                        </gl-button>
                                        <gl-button class="gl-icon-btn" type="success" @click="handleOpenBtnDialog(i)">
                                            <i class="el-icon-edit" />
                                        </gl-button>
                                        <gl-button class="gl-icon-btn" type="error" @click="config.navbar.splice(i, 1)">
                                            <i class="el-icon-delete" />
                                        </gl-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </el-tab-pane>
                    <el-tab-pane :label="tl('misc')">
                        <div class="form">
                            <ul>
                                <li>
                                    <div>
                                        <span>宽屏模式 </span>
                                        <el-tooltip effect="dark" content="Top Left 提示文字" placement="top-start">
                                            <span class="iconfont icon-info ml10" />
                                        </el-tooltip>
                                    </div>
                                    <div>
                                        <gl-switch v-model="config.style.wide_mode" />
                                    </div>
                                </li>
                                <li>
                                    <div>恢复菜单</div>
                                    <div>
                                        <gl-switch v-model="config.misc.unlock" />
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>风扇区间</span>
                                        <span @click="goToFanSetting" class="iconfont icon-fan-setting btn-icon ml3" style="color: var(--primary)" />
                                    </div>
                                    <div>
                                        <el-slider class="w200" v-model="config.misc.fan" range :min="10" :max="90" show-tooltip :format-tooltip="v => v + '°C'" :marks="{ 10: '10', 90: '10°C' }">
                                        </el-slider>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </el-tab-pane>
                </el-tabs>

                <div class="btns">
                    <gl-button type="primary" @click="handleApply">{{ tl('apply') }}</gl-button>
                </div>

            </gl-card>

            <!-- <gl-card class="card-spacing" title="其他">
            <gl-tips tips="Woc" />
        </gl-card> -->

            <el-dialog :title="(btnDialog.edit ? '修改' : '新增') + '按钮'" :visible.sync="btnDialog.show" width="30%">
                <div class="dialog-main">
                    <el-form class="form" :model="btnDialog.data" ref="btnForm">
                        <ul>
                            <li>
                                <div>按钮图标</div>
                                <div>
                                    <el-form-item prop="icon" :rules="rules.required">
                                        <el-select v-model="btnDialog.data.icon" filterable placeholder="请选择图标">
                                            <template slot="prefix">
                                                <i :class="btnDialog.data.icon || 'el-icon-full-screen'" />
                                            </template>
                                            <el-option v-for="item in icons" :key="item" :label="item" :value="item">
                                                <span style="float: left"><i :class="item" /></span>
                                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </li>
                            <li>
                                <div><span>按钮名称</span></div>
                                <div>
                                    <el-form-item prop="name" :rules="rules.required">
                                        <el-input v-model="btnDialog.data.name" placeholder="请输入名称"></el-input>
                                    </el-form-item>
                                </div>
                            </li>
                            <li>
                                <div><span>链接/路径</span></div>
                                <div>
                                    <el-form-item prop="link" :rules="[rules.required, rules.link]">
                                        <el-input v-model="btnDialog.data.link" placeholder="请输入链接"></el-input>
                                    </el-form-item>
                                </div>
                            </li>
                            <li>
                                <div><span>打开方式</span></div>
                                <div>
                                    <el-select v-model="btnDialog.data.mode" filterable>
                                        <el-option label="嵌入当前页" value="embed" />
                                        <el-option label="打开新页面" value="blank" />
                                        <el-option label="替换当前页面" value="replace" />
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div><span>是否启用</span></div>
                                <div><gl-switch v-model="btnDialog.data.enable" /></div>
                            </li>
                        </ul>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <div class="dialog-btns">
                        <gl-button class="dialog-btn" @click="handleCloseBtnDialog">取 消</gl-button>
                        <gl-button class="dialog-btn" type="primary" @click="handleSaveBtn">确 定</gl-button>
                    </div>
                </span>
            </el-dialog>
        </div>
    </keep-alive>
</template>

<script>
import icons from './icons';
export default {
    name: "GlInjector",
    data() {
        return {
            icons,

            rules: {
                required: { required: true, message: '不能为空' },
                link: {
                    message: '格式不正确',
                    pattern: /^(#?\/[\w\/]+|https?:\/\/.+)/i
                }
            },
            btnDialog: {
                show: false,
                edit: false,
                index: -1,
                data: {}
            },
            config: {
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
                misc: {
                    fan: [30, 90],
                    unlock: true,
                },
                navbar: [    //自定义按钮
                    {
                        name: "LuCI",
                        icon: "iconfont icon-gateway",
                        link: "/cgi-bin/luci/",
                        mode: 'embed',
                        enable: true,
                    },
                    {
                        name: "打印机",
                        icon: "iconfont icon-printer",
                        link: "/cgi-bin/luci/admin/nas/usb_printer",
                        mode: 'embed',
                        enable: true,
                    },
                    {
                        name: "文件管理",
                        icon: "iconfont icon-flash",
                        link: "/cgi-bin/luci/admin/nas/fileassistant",
                        mode: 'embed',
                        enable: true,
                    },
                    {
                        name: "客户端列表",
                        icon: "iconfont icon-clients",
                        link: "#/clients",
                        mode: 'embed',
                        enable: true,
                    },
                    {
                        name: "系统概览",
                        icon: "iconfont icon-info",
                        link: "#/overview",
                        mode: 'embed',
                        enable: true,
                    }
                ]
            }
        }
    },
    methods: {
        tl(key) {
            return this.$t('glinjector.' + key)
        },
        handleApply() {
            this.$message('应用成功，等待刷新页面...')
            setTimeout(() => {
                location.reload()
            }, 500);
        },
        handleSwapBtn(i, d) {
            if (0 <= i + d && i + d < this.config.navbar.length) {
                const tmp = this.config.navbar[i]
                this.$set(this.config.navbar, i, this.config.navbar[i + d])
                this.$set(this.config.navbar, i + d, tmp)
            }
        },
        handleOpenBtnDialog(index = -1) {
            if (this.btnDialog.edit = index > -1) {
                this.btnDialog.index = index
                this.btnDialog.data = { ...this.config.navbar[index] }
            } else {
                this.btnDialog.data = {
                    name: "",
                    icon: "",
                    link: "",
                    mode: 'embed',
                    enable: true,
                }
            }
            this.btnDialog.show = true

        },
        handleSaveBtn() {
            this.$refs.btnForm.validate(valid => {
                if (valid) {
                    if (this.btnDialog.edit) {
                        this.$set(this.config.navbar, this.btnDialog.index, this.btnDialog.data)
                    } else {
                        this.config.navbar.push(this.btnDialog.data)
                    }
                    this.btnDialog.show = false
                }
            })
        },
        handleCloseBtnDialog() {
            this.btnDialog.show = false
            this.$refs.btnForm.resetFields()
        },
        goToFanSetting() {
            this.$router.push({ name: 'overview' })
            const timer = setInterval(() => {
                const btn = document.querySelector('.fan-setting-wrapper > *')
                if (btn) {
                    btn.click()
                    clearInterval(timer)
                }
            }, 50)
        }
    }
}
</script>

<style lang="scss" scoped>
@import url(base.scss);

.plugin-wrapper {
    padding: 20px 0;

    .btns {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .gl-btn {
        &:not(.gl-icon-btn) {
            min-width: 124px;
        }

        &.gl-icon-btn {
            display: inline-block;
            border-radius: 50%;
            padding: 12px;
            line-height: 1;
            border-width: 1px !important;
            margin: 0 !important;

            i {
                font-size: 14px;
            }
        }

        &.gl-icon-btn+.gl-icon-btn {
            margin-left: 10px !important;
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

            &:not(:last-child) {
                border-bottom: 1px solid var(--divider);
            }

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

    td {
        max-width: 100px;
        text-overflow: ellipsis;
        overflow: hidden;
        word-wrap: normal;
        white-space: nowrap;
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
