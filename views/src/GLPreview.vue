<template>
    <div>
        <div class="preview">
            <div class="header">
                <span class="dot" @click="urlLoaded = ''"></span>
                <span class="dot" @click="refresh"></span>
                <span class="dot" @click="expand = true"></span>
            </div>
            <div class="content">
                <slot :image="urlLoaded"></slot>
            </div>
            <img class="for-loading" v-if="url" @load="handleLoaded" @error="handleError" :src="urlTest" />
            <Transition>
                <div v-if="loading" class="loading">
                    <i class="iconfont icon-loading" />
                </div>
            </Transition>
            <el-dialog :visible.sync="expand" width="960px">
                <div class="expand">
                    <div class="content">
                        <slot :image="urlLoaded"></slot>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <div class="dialog-btns">
                        <gl-button class="dialog-btn" @click="expand = false">关 闭</gl-button>
                    </div>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
let timer = null
export default {
    props: {
        url: String
    },
    data() {
        return {
            hash: Date.now(),
            urlTest: '',
            urlLoaded: '',
            expand: false,
            loading: false
        }
    },
    mounted() {
        this.urlTest = this.url
        this.loading = true
        this.startTimer()
    },
    watch: {
        url(url) {
            this.urlTest = url
            this.loading = true
            this.startTimer()
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
        refresh() {
            this.loading = true
            this.urlTest = `${this.url}${this.url.indexOf('?') > 0 ? '&' : '?'}_t${Date.now()}`
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

<style lang="scss">
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.el-dialog {
    max-width: initial !important;
}

.preview {
    position: relative;
    width: 320px;
    height: 180px;
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
        padding: 6px 3px;

        .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
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
        padding-top: 20px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: white;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;

        .iconfont {
            font-size: 40px;
        }
    }

    .expand {
        height: 540px;
        overflow: hidden;

        .content {
            transform: scale(0.5);
            transform-origin: top left;
            width: 1920px;
            height: 1080px;
            overflow: hidden;
        }
    }

    .content {
        transform: scale(0.1666);
        transform-origin: top left;
        width: 1920px;
        height: 1080px;
        overflow: hidden;

        >* {
            width: 100%;
            height: 100%;
        }
    }
}
</style>