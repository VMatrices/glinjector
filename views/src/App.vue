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
                                    <li class="title-li"> 背景 </li>
                                    <li>
                                        <div>
                                            <span>背景图片</span>
                                        </div>
                                        <div>
                                            <el-select v-model="config.style.login.background.url" @change="imageLoading = 1" filterable clearable allow-create placeholder="选择或输入网址">
                                                <div class="select-upload" @click="uploadDialog.show = true"><i class="el-icon-upload mr5" />上传</div>
                                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                                            </el-select>
                                        </div>
                                    </li>
                                    <template v-if="config.style.login.background.url">
                                        <li>
                                            <div>背景位置</div>
                                            <div>
                                                <el-select v-model="config.style.login.background.position">
                                                    <el-option label="居中" value="center" />
                                                    <el-option label="左对齐" value="left" />
                                                    <el-option label="右对齐" value="right" />
                                                    <el-option label="顶部对齐" value="top" />
                                                    <el-option label="底部对齐" value="bottom" />
                                                </el-select>
                                            </div>
                                        </li>
                                        <li>
                                            <div>背景大小</div>
                                            <div>
                                                <el-select v-model="config.style.login.background.size">
                                                    <el-option label="填充" value="cover" />
                                                    <el-option label="适应宽高" value="contain no-repeat" />
                                                    <el-option label="平铺(原图)" value="auto repeat" />
                                                    <el-option label="平铺(放大)" value="contain repeat" />
                                                </el-select>
                                            </div>
                                        </li>
                                    </template>
                                    <li class="title-li"> 登录框 </li>
                                    <li>
                                        <div>
                                            <span>模糊</span>
                                        </div>
                                        <div>
                                            <el-slider class="w200" v-model="config.style.login.box.blur" :min="0" :max="100" show-tooltip :format-tooltip="v => v + '%'" />
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span>遮罩浓度</span>
                                        </div>
                                        <div>
                                            <el-slider class="w200" v-model="config.style.login.box.alpha" :min="0" :max="100" show-tooltip :format-tooltip="v => v + '%'" />
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span>遮罩颜色</span>
                                        </div>
                                        <div>
                                            <el-select v-model="config.style.login.box.color">
                                                <el-option label="黑色" value="black" />
                                                <el-option label="白色" value="white" />
                                            </el-select>
                                        </div>
                                    </li>
                                    <li>
                                        <div>新风格</div>
                                        <div>
                                            <!-- <gl-toggle v-model="config.style.login.box.new_look">
                                                <gl-toggle-item label="原生" value="" />
                                                <gl-toggle-item label="紧凑" value="1" />
                                            </gl-toggle> -->
                                            <gl-switch v-model="config.style.login.box.new_look" />
                                        </div>
                                    </li>
                                    <template v-if="config.style.login.box.new_look">
                                        <li>
                                            <div>
                                                <span>宽度</span>
                                            </div>
                                            <div>
                                                <el-slider class="w200" v-model="config.style.login.box.width" :min="400" :max="1000" show-tooltip :format-tooltip="v => v + 'px'" />
                                            </div>
                                        </li>
                                        <li>
                                            <div>位置</div>
                                            <div>
                                                <gl-toggle v-model="config.style.login.box.position">
                                                    <gl-toggle-item label="左侧" value="left" />
                                                    <gl-toggle-item label="居中" value="center" />
                                                    <gl-toggle-item label="右侧" value="right" />
                                                </gl-toggle>
                                            </div>
                                        </li>
                                        <li v-if="config.style.login.box.position != 'center'">
                                            <div>
                                                <span>边距</span>
                                            </div>
                                            <div>
                                                <el-slider class="w200" v-model="config.style.login.box.margin" :min="0" :max="50" show-tooltip :format-tooltip="v => v + '%'" />
                                            </div>
                                        </li>
                                    </template>
                                    <li class="title-li"> 登录按钮 </li>
                                    <li>
                                        <div>添加Luci按钮</div>
                                        <div>
                                            <gl-switch v-model="config.style.login.button.luci" />
                                        </div>
                                    </li>
                                    <template v-if="config.style.login.button.luci">
                                        <li>
                                            <div>组合按钮</div>
                                            <div>
                                                <gl-switch v-model="config.style.login.button.comb" />
                                            </div>
                                        </li>
                                        <li>
                                            <div>Luci文字</div>
                                            <div>
                                                <el-input v-model="config.style.login.button.text" placeholder="请输入密码" />
                                            </div>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                            <div class="preview-wrapper">
                                <GLPreview :url="config.style.login.background.url">
                                    <template v-slot:default="preview">
                                        <div class="main" :class="{ new: config.style.login.box.new_look }"
                                            :style="{ background: preview.image && ` ${config.style.login.background.position} / ${config.style.login.background.size} url(${preview.image}), var(--background-login)` }">
                                            <div class="login-box" :style="loginBoxStyle">
                                                <div class="login-fake">
                                                    <i class="iconfont icon-gateway" />
                                                    <p class="mt10">Openwrt</p>
                                                    <div class="big-title">管理员密码</div>
                                                    <el-input class="mt20 w300" readonly placeholder="请输入密码" />
                                                    <gl-button class="mt20" type="primary" @click="followMe">登录</gl-button>
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
                        background: {
                            url: 'https://api.timecdn.cn/libs/wallpaper/v1',
                            size: 'cover',
                            position: 'center',
                        },
                        box: {
                            color: 'black',
                            alpha: 50,
                            blur: 50,
                            new_look: true,
                            margin: 10,
                            width: 550,
                            position: 'left'
                        },
                        button: {
                            comb: true,
                            luci: true,
                            text: "LuCI",
                        }
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
            const cfg = this.config.style.login;
            const style = {
                backdropFilter: `blur(${cfg.box.blur / 100 * 100}px)`,
                background: `rgba(${cfg.box.color == 'black' ? '0,0,0' : '255,255,255'}, ${cfg.box.alpha / 100})`
            }

            if (cfg.box.color == 'white') {
                style.color = '#333'
            }

            if (cfg.box.new_look) {
                style.width = cfg.box.width + 'px'
                switch (cfg.box.position) {
                    case 'center':
                        style.marginLeft = `calc( 50% - ${cfg.box.width / 2}px )`
                        break
                    case 'left':
                        style.float = 'left'
                        style.marginLeft = cfg.box.margin + '%'
                        break
                    case 'right':
                        style.float = 'right'
                        style.marginRight = cfg.box.margin + '%'
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
        followMe() {
            this.$message('Follow Me 💕 with https://github.com/VMatrices')
            setTimeout(() => open('https://github.com/VMatrices'), 1000)
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

::v-deep {
    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.5s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
}

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
                padding: 0 !important
            }

            .el-tab-pane {
                padding: 20px 20px 0 20px;
            }
        }

        .is-card {
            box-shadow: none !important;
        }

        // 解决sticky失效问题
        & {
            overflow: visible !important;

            ::v-deep {

                .container {
                    border-radius: 5px;
                    background: transparent;
                }

                .el-tabs__content {
                    overflow: visible !important;
                }
            }

            .btns {
                border-radius: 0 0 5px 5px;
                padding: 20px;
                background-color: var(--background-card);
                display: flex;
                justify-content: center;
                align-items: center;
            }
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

            +li {
                border-top: 1px solid var(--divider);
            }

            &:last-child {
                border-bottom: 1px solid var(--divider);
            }

            &.title-li {
                padding: 0 10px;
                height: 40px;
                min-height: auto;
                font-size: 14px;
                font-weight: 700;
                border-radius: 5px;
                color: var(--text-subtitle);
                background-color: var(--background-subtitle);

                &:not(:first-child) {
                    margin-top: 5px;
                }
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

            ::v-deep .preview {
                position: sticky !important;
                top: 40px;
            }

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

                        ::v-deep .el-input__inner {
                            border-radius: 99px;
                        }
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
