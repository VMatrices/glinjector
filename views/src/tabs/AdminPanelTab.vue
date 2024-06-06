<template>
    <div class="preview-form">
        <div class="form slim">
            <ul>
                <li class="title-li"> 首页背景 </li>
                <BackgroundOptions :background.sync="styles.background" imgPrefix="bg_login" />
                <transition name="fade-down">
                    <li v-if="styles.background.url">
                        <div>
                            <span>遮罩浓度</span>
                        </div>
                        <div>
                            <el-slider class="w200" v-model="styles.background.alpha" :min="0" :max="100" show-tooltip :format-tooltip="v => v + '%'" />
                        </div>
                    </li>
                </transition>
                <li class="title-li"> 全局配置 </li>
                <li>
                    <div>
                        <span>宽屏模式 </span>
                        <el-tooltip effect="dark" content="Top Left 提示文字" placement="top-start">
                            <span class="iconfont icon-info ml10" />
                        </el-tooltip>
                    </div>
                    <div>
                        <gl-switch v-model="styles.wide_mode" />
                    </div>
                </li>
            </ul>
        </div>
        <div class="preview-wrapper">
            <GLPreview :url="styles.background.url">
                <template v-slot:default="preview">
                    <div class="body">
                        <div class="wrapper" :class="{ wide: styles.wide_mode }">
                            <div class="header" @dblclick="wide = !wide">
                                <div class="title">
                                    <i class="iconfont icon-gateway"></i>
                                    <span class="divide"></span>
                                    <span>{{ $t('core.admin_panel') }}</span>
                                </div>
                            </div>
                            <div class="main">
                                <div class="menu" />
                                <div class="main-container">
                                    <div class="router-visual-wrapper" :style="{
                                        background: preview.image && `linear-gradient(rgba(0 0 0/${styles.background.alpha}%),rgba(0 0 0/${styles.background.alpha}%)), ${styles.background.position} / ${styles.background.size} url(${preview.image})`
                                    }"></div>
                                    <div class="card-container">
                                        <gl-card class="card-item" title=" ">
                                            <div class="visual-text w80" slot="title" />
                                            <div class="visual-block h220">
                                                <div>
                                                    <div class="visual-text w300" />
                                                    <div class="visual-text w350 mt15" />
                                                    <div class="visual-text w250 mt15" />
                                                    <div class="visual-text w400 mt15" />
                                                </div>
                                                <div class="icon-big" />
                                            </div>
                                            <div class="visual-text w200" slot="footer" />
                                        </gl-card>
                                        <gl-card class="card-item small-card" title=" ">
                                            <div class="visual-text w60" slot="title" />
                                            <div class="visual-block h130">
                                                <div class="icon-small" />
                                                <div class="visual-text w150" />
                                            </div>
                                        </gl-card>
                                        <gl-card class="card-item small-card" title=" ">
                                            <div class="visual-text" slot="title" />
                                            <div class="visual-block h130">
                                                <div class="icon-small" />
                                                <div class="visual-text w300" />
                                            </div>
                                        </gl-card>
                                        <gl-card class="card-item small-card" title=" ">
                                            <div class="visual-text" slot="title" />
                                            <div class="visual-block h130">
                                                <div class="icon-small" />
                                                <div class="visual-text w200" />
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
import GLPreview from '../component/GLPreview.vue';
import BackgroundOptions from '../component/BackgroundOptions.vue';

export default {
    components: { GLPreview, BackgroundOptions },
    props: {
        styles: Object
    },
    inject: ["tl"],
    data() {
        return {
        }
    },
    computed: {
        loginBoxStyle() {
            const style = {
                backdropFilter: `blur(${this.styles.box.blur / 100 * 100}px)`,
                background: `rgba(${this.styles.box.color == 'black' ? '0,0,0' : '255,255,255'}, ${this.styles.box.alpha / 100})`
            }

            if (this.styles.box.color == 'white') {
                style.color = '#333'
            }

            if (this.styles.box.new_look) {
                style.width = this.styles.box.width + 'px'
                switch (this.styles.box.position) {
                    case 'center':
                        style.marginLeft = `calc( 50% - ${this.styles.box.width / 2}px )`
                        break
                    case 'left':
                        style.float = 'left'
                        style.marginLeft = this.styles.box.margin + '%'
                        break
                    case 'right':
                        style.float = 'right'
                        style.marginRight = this.styles.box.margin + '%'
                        break
                }
            }
            return style
        }
    },
    methods: {
        followMe() {
            this.$message('Follow Me 💕 with https://github.com/VMatrices')
            setTimeout(() => open('https://github.com/VMatrices'), 1000)
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
                margin: 0 auto;
                transition: all .3s;

                &.wide {
                    max-width: 100%
                }

                .header {
                    z-index: 102;
                    position: fixed;
                    max-width: inherit;
                    width: 100%;
                    height: 50px;
                    line-height: 50px;
                    padding: 0 20px;
                    background-color: var(--background-header);
                    box-shadow: rgba(0, 0, 0, 0.19) 0px 0px 10px;

                    .title {
                        display: inline-block;
                        font-size: 16px;
                        margin-left: 10px;
                        color: var(--text-header);

                        .divide {
                            display: inline-block;
                            width: 1px;
                            height: 18px;
                            border: 1px solid var(--icon);
                            margin: 0 22px;
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

            .router-visual-wrapper {
                position: relative;
                margin: 0 -20px;
                width: calc(100% + 40px);
                height: 362px;
                background: var(--background-status-panel);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-status-panel);
                transition: background-image .5s;
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