<template>
    <div class="preview-form">
        <div class="form slim">
            <ul>
                <li class="title-li">{{ tl("background.title") }}</li>
                <BackgroundOptions :background.sync="styles.background" imgPrefix="bg_login" />
                <li class="title-li">{{ tl("login.box.title") }}</li>
                <li>
                    <div>{{ tl("login.box.anime") }}</div>
                    <div>
                        <el-select v-model="styles.box.anime">
                            <el-option :label="tl('login.box.anime_none')" value="" />
                            <el-option :label="tl('login.box.anime_fade')" value="fade" />
                            <el-option :label="tl('login.box.anime_zoomin')" value="zoomin" />
                            <el-option :label="tl('login.box.anime_zoomout')" value="zoomout" />
                            <el-option :label="tl('login.box.anime_scalex')" value="scalex" />
                            <el-option :label="tl('login.box.anime_scaley')" value="scaley" />
                            <el-option :label="tl('login.box.anime_left')" value="left" />
                            <el-option :label="tl('login.box.anime_right')" value="right" />
                            <el-option :label="tl('login.box.anime_top')" value="top" />
                            <el-option :label="tl('login.box.anime_bottom')" value="bottom" />
                        </el-select>
                    </div>
                </li>
                <li>
                    <div>
                        <span>{{ tl("login.box.theme") }}</span>
                    </div>
                    <div>
                        <el-select v-model="styles.box.theme">
                            <el-option :label="tl('login.box.theme_dark')" value="dark" />
                            <el-option :label="tl('login.box.theme_light')" value="light" />
                        </el-select>
                    </div>
                </li>
                <li>
                    <div>
                        <span>{{ tl("login.box.blur") }}</span>
                    </div>
                    <div>
                        <el-slider class="w200" v-model="styles.box.blur" :min="0" :max="100" show-tooltip :format-tooltip="v => v + '%'" />
                    </div>
                </li>
                <li>
                    <div>
                        <span>{{ tl("login.box.alpha") }}</span>
                    </div>
                    <div>
                        <el-slider class="w200" v-model="styles.box.alpha" :min="0" :max="100" show-tooltip :format-tooltip="v => v + '%'" />
                    </div>
                </li>
                <li>
                    <div>{{ tl("login.box.style") }}</div>
                    <div>
                        <gl-toggle v-model="styles.box.style">
                            <gl-toggle-item :label="tl('login.box.style_max')" value="max" />
                            <gl-toggle-item :label="tl('login.box.style_bar')" value="horizon" />
                            <gl-toggle-item :label="tl('login.box.style_float')" value="float" />
                        </gl-toggle>
                    </div>
                </li>
                <transition name="fade-down">
                    <li v-if="styles.box.style != 'max'">
                        <div>
                            <span>{{ tl("login.box.width") }}</span>
                        </div>
                        <div>
                            <el-slider class="w200" v-model="styles.box.width" :min="400" :max="1000" show-tooltip :format-tooltip="v => v + 'px'" />
                        </div>
                    </li>
                </transition>
                <transition name="fade-down">
                    <li v-if="styles.box.style == 'float'">
                        <div>
                            <span>{{ tl("login.box.height") }}</span>
                        </div>
                        <div>
                            <el-slider class="w200" v-model="styles.box.height" :min="400" :max="800" show-tooltip :format-tooltip="v => v + 'px'" />
                        </div>
                    </li>
                </transition>
                <transition name="fade-down">
                    <li v-if="styles.box.style == 'float'">
                        <div>
                            <span>{{ tl("login.box.radius") }}</span>
                        </div>
                        <div>
                            <el-slider class="w200" v-model="styles.box.radius" :min="0" :max="100" show-tooltip :format-tooltip="v => v + 'px'" />
                        </div>
                    </li>
                </transition>
                <transition name="fade-down">
                    <li v-if="styles.box.style != 'max'">
                        <div>
                            <span>{{ tl("login.box.position") }}</span>
                        </div>
                        <div>
                            <gl-toggle v-model="styles.box.position">
                                <gl-toggle-item :label="tl('login.box.position_left')" value="left" />
                                <gl-toggle-item :label="tl('login.box.position_center')" value="center" />
                                <gl-toggle-item :label="tl('login.box.position_right')" value="right" />
                            </gl-toggle>
                        </div>
                    </li>
                </transition>
                <transition name="fade-down">
                    <li v-if="styles.box.style != 'max' && styles.box.position != 'center'">
                        <div>
                            <span>{{ tl("login.box.margin") }}</span>
                        </div>
                        <div>
                            <el-slider class="w200" v-model="styles.box.margin" :min="0" :max="50" show-tooltip :format-tooltip="v => v + '%'" />
                        </div>
                    </li>
                </transition>
                <li class="title-li">{{ tl("login.button.title") }}</li>
                <li>
                    <span>{{ tl("login.button.add_luci") }}</span>
                    <div>
                        <gl-switch v-model="styles.button.luci" />
                    </div>
                </li>
                <transition name="fade-down">
                    <li v-if="styles.button.luci">
                        <span>{{ tl("login.button.comb_mode") }}</span>
                        <div>
                            <gl-switch v-model="styles.button.comb" />
                        </div>
                    </li>
                </transition>
                <transition name="fade-down">
                    <li v-if="styles.button.luci">
                        <span>{{ tl("login.button.luci_text") }}</span>
                        <div>
                            <el-input v-model="styles.button.luci_text" />
                        </div>
                    </li>
                </transition>
            </ul>
        </div>
        <div class="preview-wrapper">
            <GLPreview :url="styles.background.url">
                <template v-slot:default="preview">
                    <div class="main" :class="styles.box.style" :style="backgroundStyle(styles.background, preview.image)">
                        <div class="login-box" :class="[styles.box.position, styles.box.theme]" :style="loginBoxStyle">
                            <div class="icon-vender" v-html="$store.state.logoSvg"></div>
                            <div class="icon-model" v-html="$store.state.routerTypeSvg"></div>
                            <p class="mt10">{{ $store.state.hostname || "Openwrt" }}</p>
                            <div class="big-title">{{ $t("login.admin_password") }}</div>
                            <el-input type="password" class="mt20 w300" v-model="password" :placeholder="$t('login.password_hint.placeholder')" />
                            <div class="login-btn mt20" :class="{ comb: styles.button.luci && styles.button.comb }">
                                <gl-button type="primary" @click="followMe">{{ $t("login.login") }}</gl-button>
                                <gl-button v-if="styles.button.luci" type="primary" @click="followMe">{{ styles.button.luci_text }}</gl-button>
                            </div>
                        </div>
                    </div>
                </template>
            </GLPreview>
        </div>
    </div>
</template>

<script>
import GLPreview from "../component/GLPreview.vue"
import BackgroundOptions from "../component/BackgroundOptions.vue"

export default {
    components: { GLPreview, BackgroundOptions },
    props: {
        styles: Object
    },
    inject: ["tl"],
    data() {
        return {
            password: ""
        }
    },
    computed: {
        loginBoxStyle() {
            const style = {
                backdropFilter: `blur(${(this.styles.box.blur / 100) * 100}px)`,
                background: `rgba(${this.styles.box.theme == "dark" ? "0,0,0" : "255,255,255"}, ${this.styles.box.alpha / 100})`
            }

            if (this.styles.box.anime) {
                style.animation = `gli-anime-${this.styles.box.anime} 1s ease 0.3s both`
            }

            if (this.styles.box.style == "float") {
                style.height = this.styles.box.height + "px"
                style.borderRadius = this.styles.box.radius + "px"
            }

            if (this.styles.box.style != "max") {
                style.width = this.styles.box.width + "px"
                switch (this.styles.box.position) {
                    case "left":
                        style.marginLeft = this.styles.box.margin + "%"
                        break
                    case "right":
                        style.marginRight = this.styles.box.margin + "%"
                        break
                }
            }
            return style
        }
    },
    methods: {
        backgroundStyle(styles, image) {
            if (image) {
                const style = {
                    backgroundImage: `url(${image}), var(--background-login)`,
                    backgroundSize: {
                        fill: "cover",
                        fit: "contain",
                        stratch: "100% 100%",
                        tile: "auto"
                    }[styles.size]
                }
                if (styles.size == "fit") {
                    style.backgroundRepeat = "no-repeat"
                }
                if (styles.size == "tile") {
                    style.backgroundRepeat = "repeat"
                }
                if (styles.size != "stratch") {
                    style.backgroundPosition = styles.position
                }
                return style
            }
        },
        followMe() {
            this.$message("Follow Me 💕 with https://github.com/VMatrices")
            setTimeout(() => open("https://github.com/VMatrices"), 1000)
        }
    }
}
</script>

<style>
@import url(../style/login-anime.scss);
</style>

<style lang="scss" scoped>
.preview-form {
    display: flex;

    .form {
        flex: 1;
    }

    .preview-wrapper {
        flex: 0;
        padding: 30px;

        ::v-deep .preview {
            position: sticky;
            top: 40px;
        }

        .main {
            background-image: var(--background-login);
            background-position: center;
            background-size: cover;
            transition: background-image 0.5s;

            &.float,
            &.horizon {
                display: flex;
                flex-direction: column;
                justify-content: center;

                .login-box {
                    box-shadow: 0 0 15px #00000080;

                    ::v-deep .el-input__inner {
                        border-radius: 99px;
                    }

                    .icon-vender {
                        left: 20px;
                    }

                    &.left {
                        align-self: flex-start;
                    }

                    &.center {
                        align-self: center;
                    }

                    &.right {
                        align-self: flex-end;
                    }
                }
            }

            &.float .login-box {
                justify-content: center;
                padding-bottom: 50px;

                .icon-model {
                    margin-top: 0;
                }
            }

            .login-box {
                position: relative;
                height: 100%;
                transition: all 0.3s;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                color: #4bd9cc;

                .icon-vender {
                    width: 94px;
                    height: 50px;
                    padding: 15px;
                    position: absolute;
                    top: 0;
                    left: 225px;

                    ::v-deep svg * {
                        fill: white;
                    }
                }

                .icon-model {
                    margin-top: 70px;
                    width: 200px;
                    height: 200px;

                    ::v-deep svg * {
                        fill: #4bd9cc;
                    }
                }

                &.light {
                    --dart-text: #172b4d;
                    color: var(--dart-text);

                    .icon-vender ::v-deep svg * {
                        fill: #000000;
                    }

                    .icon-model ::v-deep svg * {
                        fill: #47475f;
                    }

                    ::v-deep .el-input__inner {
                        background-color: transparent;
                        border-color: var(--dart-text);
                        color: var(--dart-text);

                        &::placeholder {
                            color: var(--dart-text);
                        }
                    }
                }

                .big-title {
                    margin-top: 10px;
                    font-size: 24px;
                    font-weight: 500;
                }

                .login-btn {
                    display: flex;

                    &.comb ::v-deep {
                        .gl-btn:first-child {
                            border-radius: 99px 0px 0px 99px;
                            margin-right: 1px;
                        }

                        .gl-btn:last-child {
                            border-radius: 0px 99px 99px 0px;
                            margin-left: 1px;
                        }
                    }
                }
            }
        }
    }
}
</style>
