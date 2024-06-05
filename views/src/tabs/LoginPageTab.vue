<template>
    <div class="preview-form">
        <div class="form slim">
            <ul>
                <li class="title-li"> 背景 </li>
                <BackgroundOptions :background.sync="styles.background" />
                <li class="title-li"> 登录框 </li>
                <li>
                    <div>
                        <span>模糊</span>
                    </div>
                    <div>
                        <el-slider class="w200" v-model="styles.box.blur" :min="0" :max="100" show-tooltip :format-tooltip="v => v + '%'" />
                    </div>
                </li>
                <li>
                    <div>
                        <span>遮罩浓度</span>
                    </div>
                    <div>
                        <el-slider class="w200" v-model="styles.box.alpha" :min="0" :max="100" show-tooltip :format-tooltip="v => v + '%'" />
                    </div>
                </li>
                <li>
                    <div>
                        <span>遮罩颜色</span>
                    </div>
                    <div>
                        <el-select v-model="styles.box.color">
                            <el-option label="黑色" value="black" />
                            <el-option label="白色" value="white" />
                        </el-select>
                    </div>
                </li>
                <li>
                    <div>新风格</div>
                    <div>
                        <gl-switch v-model="styles.box.new_look" />
                    </div>
                </li>
                <template v-if="styles.box.new_look">
                    <li>
                        <div>
                            <span>宽度</span>
                        </div>
                        <div>
                            <el-slider class="w200" v-model="styles.box.width" :min="400" :max="1000" show-tooltip :format-tooltip="v => v + 'px'" />
                        </div>
                    </li>
                    <li>
                        <div>位置</div>
                        <div>
                            <gl-toggle v-model="styles.box.position">
                                <gl-toggle-item label="左侧" value="left" />
                                <gl-toggle-item label="居中" value="center" />
                                <gl-toggle-item label="右侧" value="right" />
                            </gl-toggle>
                        </div>
                    </li>
                    <li v-if="styles.box.position != 'center'">
                        <div>
                            <span>边距</span>
                        </div>
                        <div>
                            <el-slider class="w200" v-model="styles.box.margin" :min="0" :max="50" show-tooltip :format-tooltip="v => v + '%'" />
                        </div>
                    </li>
                </template>
                <li class="title-li"> 登录按钮 </li>
                <li>
                    <div>添加Luci按钮</div>
                    <div>
                        <gl-switch v-model="styles.button.luci" />
                    </div>
                </li>
                <template v-if="styles.button.luci">
                    <li>
                        <div>组合按钮</div>
                        <div>
                            <gl-switch v-model="styles.button.comb" />
                        </div>
                    </li>
                    <li>
                        <div>Luci文字</div>
                        <div>
                            <el-input v-model="styles.button.text" placeholder="请输入密码" />
                        </div>
                    </li>
                </template>
            </ul>
        </div>
        <div class="preview-wrapper">
            <GLPreview :url="styles.background.url">
                <template v-slot:default="preview">
                    <div class="main" :class="{ new: styles.box.new_look }" :style="{ background: preview.image && ` ${styles.background.position} / ${styles.background.size} url(${preview.image}), var(--background-login)` }">
                        <div class="login-box" :style="loginBoxStyle">
                            <div class="login-fake">
                                <i class="iconfont icon-gateway" />
                                <p class="mt10">Openwrt</p>
                                <div class="big-title">管理员密码</div>
                                <el-input class="mt20 w300" readonly placeholder="请输入密码" />
                                <div class="login-btn mt20" :class="{ comb: styles.button.luci && styles.button.comb }">
                                    <gl-button type="primary" @click="followMe">{{ $t('login.login') }}</gl-button>
                                    <gl-button v-if="styles.button.luci" type="primary" @click="followMe">{{ styles.button.text }}</gl-button>
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
</style>