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
                        <div class="preview-form">
                            <div class="form slim">
                                <ul>
                                    <li>
                                        <div>
                                            <span>背景</span>
                                        </div>
                                        <div>
                                            <el-select v-model="config.style.login.background_url" @change="imageLoading = 1" filterable clearable allow-create placeholder="选择或输入网址">
                                                <div class="select-upload" @click="uploadDialog.show = true"><i class="el-icon-upload mr5" />上传</div>
                                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span>模糊</span>
                                        </div>
                                        <div>
                                            <el-slider class="w200" v-model="config.style.login.background_blur" :min="0" :max="100" show-tooltip :format-tooltip="v => v + '%'" />
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span>遮罩</span>
                                        </div>
                                        <div>
                                            <el-slider class="w200" v-model="config.style.login.background_mask" :min="0" :max="100" show-tooltip :format-tooltip="v => v + '%'" />
                                        </div>
                                    </li>
                                    <li>
                                        <div>样式</div>
                                        <div>
                                            <gl-toggle v-model="config.style.login.new_style.enable">
                                                <gl-toggle-item label="紧凑" value="1" />
                                                <gl-toggle-item label="全屏" value="" />
                                            </gl-toggle>
                                            <!-- <gl-switch v-model="config.style.login.new_style.enable" /> -->
                                        </div>
                                    </li>
                                    <template v-if="config.style.login.new_style.enable">
                                        <li>
                                            <div>
                                                <span>宽度</span>
                                            </div>
                                            <div>
                                                <el-slider class="w200" v-model="config.style.login.new_style.width" :min="400" :max="1000" show-tooltip :format-tooltip="v => v + 'px'" />
                                            </div>
                                        </li>
                                        <li>
                                            <div>位置</div>
                                            <div>
                                                <gl-toggle v-model="config.style.login.new_style.position">
                                                    <gl-toggle-item label="左侧" value="left" />
                                                    <gl-toggle-item label="居中" value="center" />
                                                    <gl-toggle-item label="右侧" value="right" />
                                                </gl-toggle>
                                            </div>
                                        </li>
                                        <li v-if="config.style.login.new_style.position != 'center'">
                                            <div>
                                                <span>边距</span>
                                            </div>
                                            <div>
                                                <el-slider class="w200" v-model="config.style.login.new_style.margin" :min="0" :max="50" show-tooltip :format-tooltip="v => v + '%'" />
                                            </div>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                            <div class="preview-wrapper">
                                <GLPreview :url="config.style.login.background_url">
                                    <template v-slot:default="preview">
                                        <div class="main" :class="{ new: config.style.login.new_style.enable }" :style="{ backgroundImage: preview.image && `url(${preview.image})` }">
                                            <div class="login-box" :style="loginBoxStyle">
                                                <div class="login-fake">
                                                    <i class="iconfont icon-gateway" />
                                                    <p class="mt10">Openwrt</p>
                                                    <div class="big-title">管理员密码</div>
                                                    <el-input class="mt20 w300" readonly placeholder="请输入密码" />
                                                    <gl-button class="mt20" type="primary">登录</gl-button>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </GLPreview>
                            </div>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane :label="tl('index_page')">
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
                                        <el-slider class="w200" v-model="config.misc.fan" range :min="0" :max="90" show-tooltip :format-tooltip="v => v + '°C'" :marks="{ 0: '0°C', 90: '90°C' }">
                                        </el-slider>
                                    </div>
                                </li>
                            </ul>
                        </div>
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
                                <th style="width: 150px;">启用</th>
                                <th>按钮</th>
                                <th>{{ tl('navbar_btn.link_path') }}</th>
                                <th>打开方式</th>
                                <th>操作</th>
                            </thead>
                            <tbody>
                                <tr v-for="item, i in config.navbar">
                                    <td><gl-switch v-model="item.enable" /></td>
                                    <td><i :class="item.icon" /><span class="ml10">{{ item.name }}</span></td>
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
                                        <el-slider class="w200" v-model="config.misc.fan" range :min="0" :max="90" show-tooltip :format-tooltip="v => v + '°C'" :marks="{ 0: '0°C', 90: '90°C' }">
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

            <el-dialog title="上传图片" :visible.sync="uploadDialog.show" width="30%">
                <div class="dialog-main">
                    <gl-upload-card allowType=".jpg, .png, .gif" :maxSize="2 * 1024 * 1024" path="/tmp/firmware.img" />
                </div>
            </el-dialog>
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
import GLPreview from './GLPreview.vue';

export default {
    name: "GlInjector",
    components: { GLPreview },
    data() {
        return {
            icons,
            imageLoading: false,
            loginImage: {
                loading: true,
                url: '',
            },

            options: [{
                label: 'Bing - Today',
                value: 'https://api.timecdn.cn/libs/wallpaper/v1',
            }, {
                label: 'Bing - Radom',
                value: 'https://bing.img.run/rand.php',
            }, {
                label: '360',
                value: 'https://www.yumus.cn/api/?target=img&brand=360&type=0',
            }, {
                label: 'Unsplash',
                value: 'https://source.unsplash.com/1920x1080/daily?wallpapers',
            }, {
                label: 'Lorem Picsum',
                value: 'https://picsum.photos/1920/1080',
            }, {
                label: '栗次元',
                value: 'https://t.alcy.cc/pc',
            }, {
                label: '樱花二次元',
                value: 'https://www.dmoe.cc/random.php',
            }, {
                label: '岁月小筑 - 自然',
                value: 'https://img.xjh.me/random_img.php?type=bg&ctype=nature&return=302',
            }, {
                label: '岁月小筑 - 人物',
                value: 'https://img.xjh.me/random_img.php?type=bg&ctype=acg&return=302',
            }, {
                label: '后宫漫图',
                value: 'https://acg.sx/images',
            }],


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
            uploadDialog: {
                show: false
            },
            config: {
                style: {
                    login: {
                        background_url: 'https://api.timecdn.cn/libs/wallpaper/v1',
                        background_mask: 50,
                        background_blur: 50,
                        comb_button: true,
                        luci_text: "LuCI",
                        new_style: {
                            enable: "1",
                            margin: 10,
                            width: 550,
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
                        name: "Interfaces",
                        icon: "iconfont icon-printer",
                        link: "/cgi-bin/luci/admin/network/network",
                        mode: 'embed',
                        enable: true,
                    },
                    {
                        name: "Channel Analysis",
                        icon: "iconfont icon-flash",
                        link: "/cgi-bin/luci/admin/status/channel_analysis",
                        mode: 'embed',
                        enable: true,
                    },
                    {
                        name: "Clients",
                        icon: "iconfont icon-clients",
                        link: "#/clients",
                        mode: 'embed',
                        enable: true,
                    },
                    {
                        name: "Overview",
                        icon: "iconfont icon-info",
                        link: "#/overview",
                        mode: 'embed',
                        enable: true,
                    }
                ]
            }
        }
    },
    computed: {
        loginBoxStyle() {
            const style = {
                backdropFilter: `blur(${this.config.style.login.background_blur / 100 * 100}px)`,
                background: `rgba(0, 0, 0, ${this.config.style.login.background_mask / 100})`
            }
            if (this.config.style.login.new_style.enable) {
                style.width = this.config.style.login.new_style.width + 'px'
                switch (this.config.style.login.new_style.position) {
                    case 'center':
                        style.marginLeft = `calc( 50% - ${this.config.style.login.new_style.width / 2}px )`
                        break
                    case 'left':
                        style.float = 'left'
                        style.marginLeft = this.config.style.login.new_style.margin + '%'
                        break
                    case 'right':
                        style.float = 'right'
                        style.marginRight = this.config.style.login.new_style.margin + '%'
                        break
                }
            }
            return style
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


.select-upload {
    cursor: pointer;
    user-select: none;
    text-align: center;
    color: var(--text-weak);
    padding: 5px;
    border: 1px solid var(--text-weak);
    border-radius: 3px;
    margin: 3px 7px;

    &:hover {
        background-color: #F5F7FA
    }

    &:active {
        opacity: 0.7
    }
}

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

        >ul>li {
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


    .preview-form {
        display: flex;

        .form {
            flex: 1;
        }

        .preview-wrapper {
            flex: 0;
            padding: 30px;

            .main {
                background-image: var(--background-login);
                background-position: center;
                background-size: cover;
                transition: background-image .5s;
                color: white;

                .login-box {
                    height: 100%;
                    transition: all .3s;

                    .login-fake {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        padding-top: 200px;

                        .iconfont {
                            opacity: 0.7;
                            font-size: 80px;
                        }

                        >p {
                            color: var(--text-status-panel-active);
                        }

                        .big-title {
                            margin-top: 10px;
                            font-size: 24px;
                            font-weight: 500;
                        }
                    }
                }

                &.new {
                    .login-box {
                        width: 544px;
                        box-shadow: 0 0 15px #00000080;
                    }
                }
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
