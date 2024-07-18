<template>
    <div class="preview-form">
        <div class="form slim">
            <ul>
                <li class="title-li">
                    {{ tl("system.home_background") }}
                    <span
                        @click="
                            keepCurrentTab()
                            $router.push({ name: 'internet' })
                        "
                        class="iconfont icon-internet btn-icon ml3"
                    />
                </li>
                <BackgroundOptions :background.sync="styles.home.background" imgPrefix="bg_home" />
                <transition name="fade-down">
                    <li v-if="styles.home.background.url">
                        <div>
                            <span>{{ tl("system.mask_alpha") }}</span>
                        </div>
                        <div>
                            <el-slider
                                class="w200"
                                v-model="styles.home.background.alpha"
                                :min="0"
                                :max="100"
                                show-tooltip
                                :format-tooltip="v => v + '%'"
                            />
                        </div>
                    </li>
                </transition>
                <li class="title-li">{{ tl("system.global_option") }}</li>
                <li>
                    <div>
                        <span>{{ tl("system.wide_mode") }}</span>
                    </div>
                    <div>
                        <gl-switch v-model="styles.wide_mode" />
                    </div>
                </li>
            </ul>
        </div>
        <div class="preview-wrapper">
            <GLPreview :url="styles.home.background.url">
                <template v-slot:default="preview">
                    <div class="body">
                        <div class="wrapper" :class="{ wide: styles.wide_mode }">
                            <div class="header" @dblclick="wide = !wide">
                                <div class="title">
                                    <div class="logo-img" v-html="$store.state.logoSvg" />
                                    <div class="divide" />
                                    <div>{{ $t("core.admin_panel") }}</div>
                                </div>
                            </div>
                            <div class="main">
                                <div class="menu" />
                                <div class="main-container">
                                    <div class="router-wrapper" :style="backgroundStyle(styles.home.background, preview.image)">
                                        <div class="tree-line">
                                            <div class="block">
                                                <div class="visual-text w100" />
                                            </div>
                                            <div class="block">
                                                <div class="visual-text w100" />
                                            </div>
                                            <div class="block">
                                                <div class="visual-text w100" />
                                            </div>
                                            <div class="block">
                                                <div class="visual-text w100" />
                                            </div>
                                        </div>
                                        <div class="tree-line left">
                                            <div class="line" />
                                            <div class="line" />
                                            <div class="line" />
                                        </div>
                                        <div class="tree-line mr10">
                                            <div class="line" />
                                        </div>
                                        <div class="router-info">
                                            <div class="icon-model" v-html="$store.state.routerTypeSvg"></div>
                                            <div class="alias">{{ $store.state.hostname || "Openwrt" }}</div>
                                            <div class="app-list">
                                                <div class="visual-text w50 h50" />
                                                <div class="visual-text w50 h50" />
                                                <div class="visual-text w50 h50" />
                                                <div class="visual-text w50 h50" />
                                            </div>
                                            <div class="visual-text w160 h45" />
                                        </div>
                                        <div class="tree-line ml10">
                                            <div class="line" />
                                        </div>
                                        <div class="tree-line right">
                                            <div class="line" />
                                            <div class="line" />
                                        </div>
                                        <div class="tree-line">
                                            <div class="block">
                                                <div class="visual-text w100" />
                                            </div>
                                            <div class="block">
                                                <div class="visual-text w100" />
                                            </div>
                                            <div class="block">
                                                <div class="visual-text w100" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-container">
                                        <gl-card class="card-item" title=" ">
                                            <div class="visual-text w80" slot="title" />
                                            <div class="visual-block h220">
                                                <div>
                                                    <div class="visual-text w300" />
                                                    <div class="visual-text w400 mt15" />
                                                    <div class="visual-text w250 mt15" />
                                                    <div class="visual-text w330 mt15" />
                                                </div>
                                                <div class="icon-big" />
                                            </div>
                                            <div class="visual-text w200" slot="footer" />
                                        </gl-card>
                                        <gl-card class="card-item small-card" title=" ">
                                            <div class="visual-text w60" slot="title" />
                                            <div class="visual-block h130">
                                                <div class="icon-small" />
                                                <div class="visual-text w120" />
                                            </div>
                                        </gl-card>
                                        <gl-card class="card-item small-card" title=" ">
                                            <div class="visual-text" slot="title" />
                                            <div class="visual-block h130">
                                                <div class="icon-small" />
                                                <div class="visual-text w200" />
                                            </div>
                                        </gl-card>
                                        <gl-card class="card-item small-card" title=" ">
                                            <div class="visual-text" slot="title" />
                                            <div class="visual-block h130">
                                                <div class="icon-small" />
                                                <div class="visual-text w170" />
                                            </div>
                                        </gl-card>
                                    </div>
                                </div>
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
    inject: ["tl", "keepCurrentTab"],
    data() {
        return {}
    },
    methods: {
        backgroundStyle(styles, image) {
            if (image) {
                const style = {
                    backgroundImage: `linear-gradient(rgba(0 0 0/${styles.alpha}%),rgba(0 0 0/${styles.alpha}%)), url(${image})`,
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

        .body {
            background-color: var(--background-main);

            .wrapper {
                user-select: none;
                max-width: 1300px;
                height: 100%;
                margin: 0 auto;
                transition: all 0.3s;

                &.wide {
                    max-width: 100%;
                }

                .header {
                    z-index: 102;
                    position: fixed;
                    max-width: inherit;
                    width: 100%;
                    height: 50px;
                    background-color: var(--background-header);
                    box-shadow: rgba(0, 0, 0, 0.19) 0px 0px 10px;

                    .title {
                        height: 100%;
                        display: flex;
                        align-items: center;
                        font-size: 16px;
                        color: var(--text-header);

                        .logo-img {
                            display: flex;
                            width: 65px;
                            height: 100%;
                            margin: 0 20px;
                            align-items: center;

                            ::v-deep svg * {
                                fill: var(--logo) !important;
                            }
                        }

                        .divide {
                            width: 1px;
                            height: 18px;
                            border: 1px solid var(--icon);
                            margin-right: 18px;
                            vertical-align: middle;
                        }
                    }

                    .locale {
                        margin-top: 9px;
                        float: right;
                    }
                }

                .main {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    padding-top: 50px;

                    .menu {
                        position: relative;
                        z-index: 100;
                        width: 225px;
                        min-height: 100%;
                        background-color: var(--background-menu);
                    }

                    .main-container {
                        width: calc(100% - 225px);
                        overflow-y: overlay;
                        padding: 0 20px;
                    }
                }
            }

            .visual-text {
                display: block;
                height: 23px;
                width: 100px;
                border-radius: 3px;
                background-color: var(--text-hint);
                opacity: 0.35;
            }

            .router-wrapper {
                position: relative;
                margin: 0 -20px;
                width: calc(100% + 40px);
                height: 362px;
                background: var(--background-status-panel);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-status-panel);
                transition: background-image 0.5s;

                .visual-text {
                    opacity: 0.5;
                }

                .tree-line {
                    .block {
                        height: 55px;
                        margin: 0 20px;
                        display: flex;
                        align-items: center;
                    }

                    .line {
                        width: 55px;
                        height: 55px;
                        border-top: 2px dotted var(--text-status-panel-active);
                        opacity: 0.7;

                        &:first-child {
                            border-top: 2px solid var(--text-status-panel-active);
                        }

                        &:last-child {
                            border-bottom: 2px solid var(--text-status-panel-active);
                        }

                        &:first-child:last-child {
                            height: 1px;
                            border-style: solid;
                            border-bottom: none;
                        }
                    }

                    &.left .line {
                        border-right: 2px solid var(--text-status-panel-active);
                    }

                    &.right .line {
                        border-left: 2px solid var(--text-status-panel-active);
                    }
                }

                .router-info {
                    color: inherit;
                    padding-top: 40px;
                    padding-bottom: 30px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;

                    .icon-model {
                        width: 135px;
                        height: 135px;

                        ::v-deep svg * {
                            fill: var(--text-status-panel-active);
                        }
                    }

                    .alias {
                        margin: 0 4px 18px;
                        font-size: 14px;
                        color: var(--text-status-panel-active);
                    }

                    .app-list {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-bottom: 18px;

                        > *:not(:last-child) {
                            margin-right: 10px;
                        }
                    }

                    .wifi-list {
                        height: 45px;
                        background: var(--ssid-background);
                        border-radius: 5px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 0 5px;
                        cursor: pointer;
                    }
                }
            }

            .visual-block {
                position: relative;
                display: flex;
                align-items: center;

                .icon-small {
                    width: 78px;
                    height: 78px;
                    margin-right: 20px;
                    border-radius: 50%;
                    background-color: var(--background-subtitle);
                }

                .icon-big {
                    position: absolute;
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    background-color: var(--background-subtitle);
                    right: 30px;
                }
            }

            .card-container {
                width: 100%;
                margin-bottom: 20px;
                display: flex;
                align-items: flex-start;
                flex-wrap: wrap;

                .card-item {
                    min-width: 278px;
                    width: 100%;
                    margin-top: 20px;
                }

                @media screen and (min-width: 1200px) {
                    .small-card {
                        flex: 1;

                        &:not(:last-child) {
                            margin-right: 20px;
                        }
                    }
                }
            }
        }
    }
}
</style>
