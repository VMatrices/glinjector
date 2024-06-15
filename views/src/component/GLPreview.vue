<template>
    <Fragment>
        <Transition name="scale-left">
            <div class="preview" v-show="show">
                <div class="header" @click="dialog = true">
                    <!-- todo 全屏动画 -->
                    <span class="dot" @click.stop="close"></span>
                    <span class="dot" @click.stop="refresh"></span>
                    <span class="dot" @click.stop="fullscreen = true"></span>
                </div>
                <div class="content" ref="content">
                    <slot :image="urlLoaded"></slot>
                    <div class="preview-close" v-if="fullscreen" @click="fullscreen = false">
                        <i class="el-icon-close" />
                    </div>
                </div>
                <img class="for-loading" v-if="urlTest" @load="handleLoaded" @error="handleError" :src="urlTest" />
                <Transition>
                    <div v-if="loading" class="loading">
                        <i class="icon el-icon-loading" />
                    </div>
                </Transition>
            </div>
        </Transition>
        <Transition name="fade-scale">
            <div class="preview-fullscreen" v-show="fullscreen">
                <div class="content">
                    <slot :image="urlLoaded"></slot>
                </div>
                <div class="preview-close" @click="fullscreen = false">
                    <i class="el-icon-close" />
                </div>
            </div>
        </Transition>
        <el-dialog :visible.sync="dialog" width="960px">
            <div class="preview-dialog">
                <div class="content">
                    <slot :image="urlLoaded"></slot>
                </div>
                <div class="preview-close" @click="dialog = false">
                    <i class="el-icon-close" />
                </div>
            </div>
        </el-dialog>
    </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';

let timer = null
export default {
    components: { Fragment },
    props: {
        url: String
    },
    data() {
        return {
            hash: Date.now(),
            show: true,
            urlTest: '',
            urlLoaded: '',
            fullscreen: false,
            dialog: false,
            loading: false
        }
    },
    mounted() {
        if (this.urlTest = this.url) {
            this.loading = true
            this.startTimer()
        }
    },
    watch: {
        url(url) {
            if (this.urlTest = url) {
                this.loading = true
                this.startTimer()
            } else {
                this.loading = false
                this.urlLoaded = ''
                clearTimeout(timer)
            }
        }
    },
    methods: {
        tl(key) {
            return this.$t('glinjector.' + key)
        },
        startTimer() {
            clearTimeout(timer)
            timer = setTimeout(() => {
                this.$message('图片加载过长，可能影响体验，建议切换其他图源')
            }, 2000)
        },
        close() {
            this.show = false
            setTimeout(() => {
                this.show = true
                this.$message.success("Haha, I'm back!")
            }, 1200)
        },
        refresh() {
            if (this.url) {
                this.loading = true
                this.startTimer()
                this.urlTest = `${this.url}${this.url.indexOf('?') > 0 ? '&' : '?'}_t${Date.now()}`
            }
        },
        handleLoaded() {
            clearTimeout(timer)
            this.loading = false
            this.urlLoaded = this.urlTest
        },
        handleError() {
            clearTimeout(timer)
            this.loading = false
            this.urlLoaded = ''
            this.$message('图片加载失败')
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
    max-width: initial !important;

    &,
    .el-dialog__body {
        background: none !important;
    }


    .el-dialog__header {
        display: none !important;
    }

}

.scale-left-enter-active,
.scale-left-leave-active {
    transition: all .3s;
    transform-origin: left top;
}

.scale-left-enter,
.scale-left-leave-to {
    opacity: 0;
    transform: scaleX(0.9) scaleY(0.6);
}

.preview {
    position: relative;
    width: 320px;
    height: 200px;
    overflow: hidden;
    border-radius: 5px;
    box-shadow: 2px 6px 16px 6px var(--shadow);

    .for-loading {
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
        z-index: -1;
        position: absolute;
    }

    .header {
        background-color: #DDDDDD;
        line-height: 20px;

        .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            margin-left: 5px;
            border-radius: 50%;
            cursor: pointer;

            &:hover {
                opacity: 0.7;
            }

            &:nth-child(1) {
                background-color: #FF6058;
            }

            &:nth-child(2) {
                background-color: #FFBD2D;
            }

            &:nth-child(3) {
                background-color: #18C635;
            }
        }
    }

    .loading {
        margin-top: 20px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(100% - 20px);
        color: rgb(134, 134, 134);
        background-color: rgba(255, 255, 255, 0.692);
        display: flex;
        align-items: center;
        justify-content: center;

        .icon {
            font-size: 40px;
        }
    }
}

.preview-dialog {
    height: 540px;
    overflow: hidden;
    position: relative;

    .content {
        transform: scale(0.5);
        transform-origin: top left;
        width: 1920px;
        height: 1080px;
        overflow: hidden;
    }
}

.preview-fullscreen {
    overflow: hidden;
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;

    .content {
        transform: scale(1);
        overflow: hidden;
        width: 100vw;
        height: 100vh;
    }
}

.preview-close {
    cursor: pointer;
    z-index: 9999;
    position: absolute;
    top: 0;
    right: 0;
    height: 50px;
    width: 50px;
    opacity: 0.5;
    border: 25px solid rgb(103, 103, 103);
    border-left-color: transparent;
    border-bottom-color: transparent;

    >i {
        position: absolute;
        top: -22px;
        left: 2px;
        width: 16px;
        height: 16px;
        font-size: 16px;
        color: white;

        &:hover {
            color: white !important;
            background-color: initial !important
        }
    }

    &:hover {
        opacity: 1;
    }

}

.content {
    transform: scale(0.1666);
    transform-origin: top left;
    width: 1920px;
    height: 1080px;
    overflow: hidden;

    ::v-deep>*:not(.preview-close) {
        width: 100%;
        height: 100%;
    }
}
</style>