<template>
    <div class="preview-form">
        <div class="form slim">
            <ul>
                <li class="title-li"> 首页背景 </li>
                <BackgroundOptions :background.sync="styles.background" imgPrefix="bg_login" />
                <li>
                    <div>
                        <span>模糊</span>
                    </div>
                    <div>
                        <el-slider class="w200" v-model="styles.background.blur" :min="0" :max="100" show-tooltip :format-tooltip="v => v + '%'" />
                    </div>
                </li>
                <li>
                    <div>
                        <span>遮罩浓度</span>
                    </div>
                    <div>
                        <el-slider class="w200" v-model="styles.background.alpha" :min="0" :max="100" show-tooltip :format-tooltip="v => v + '%'" />
                    </div>
                </li>
                <li>
                    <div>
                        <span>遮罩颜色</span>
                    </div>
                    <div>
                        <el-select v-model="styles.background.color">
                            <el-option label="黑色" value="black" />
                            <el-option label="白色" value="white" />
                        </el-select>
                    </div>
                </li>
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
                                <div class="menu"> </div>
                                <div class="main-container">
                                    <App />
                                    <div class="footer">
                                        <a class="github" target="_blank" href="https://github.com/VMatrices">
                                            <i class="el-icon-link"></i> Github
                                        </a>
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

                &.wide {
                    max-width: initial
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

                        .footer {
                            font-size: 12px;
                            font-weight: 500;
                            color: var(--text-weak);
                            background-color: var(--background-content);
                            display: flex;
                            align-items: center;
                            justify-content: flex-end;
                            margin-right: 20px;
                            margin-bottom: 20px;
                        }
                    }
                }
            }
        }

    }
}
</style>