<template>
    <Fragment>
        <div class="preview" :class="{ 'preview-fullscreen': fullscreen }">
            <div class="header">
                <span class="dot" @click="fullscreen = true"></span>
                <span class="dot" @click="refresh"></span>
                <span class="dot" @click="expand = true"></span>
            </div>
            <div class="content">
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
        <el-dialog :visible.sync="expand" width="960px">
            <div class="preview-expand">
                <div class="content">
                    <slot :image="urlLoaded"></slot>
                </div>
                <div class="preview-close" @click="expand = false">
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
            urlTest: '',
            urlLoaded: '',
            fullscreen: false,
            expand: false,
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

    .el-dialog__header {
        display: none !important;
    }

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

.preview-expand {
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
    position: relative !important;

    .content {
        z-index: 9999;
        transform: scale(1);
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
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
    // filter: drop-shadow(2px 6px 16px 6px var(--shadow));

    >i {
        width: 16px;
        height: 16px;
        font-size: 16px;
        margin-top: -22px;
        margin-left: 2px;
        color: white;

        &:hover {
            color: initial !important;
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