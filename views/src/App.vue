<template>
    <div class="plugin-wrapper">
        <gl-title :title="$t('menu_glinjector')">
            <a slot="badge" class="github" target="_blank" href="https://github.com/VMatrices">
                <i class="el-icon-link" />
                VMatrices
            </a>
        </gl-title>
        <Transition>
            <gl-card class="card-spacing card-tabs" v-if="config">
                <el-tooltip effect="dark" :content="tl('reset_default')">
                    <span class="reset-config iconfont icon-redo-alt" @click="resetDefault" />
                </el-tooltip>
                <el-tabs v-model="tabName" class="is-card  el-tabs--card">
                    <el-tab-pane name="login" :label="tl('login.tab_title')">
                        <LoginPageTab :styles.sync="config.style.login" />
                    </el-tab-pane>
                    <el-tab-pane name="system" :label="tl('system.tab_title')">
                        <AdminPanelTab :styles.sync="config.style.system" />
                    </el-tab-pane>
                    <el-tab-pane name="navbar" :label="tl('navbar.tab_title')">
                        <NavbarTab :navbar.sync="config.navbar" />
                    </el-tab-pane>
                    <el-tab-pane name="misc" :label="tl('misc.tab_title')">
                        <MiscOptionTab :misc.sync="config.misc" />
                    </el-tab-pane>
                </el-tabs>
                <div class="btns">
                    <gl-button type="primary" @click="handleApply">{{ tl('apply') }}</gl-button>
                </div>
            </gl-card>
        </Transition>
    </div>
</template>

<script>
import LoginPageTab from './tabs/LoginPageTab.vue';
import AdminPanelTab from './tabs/AdminPanelTab.vue';
import NavbarTab from './tabs/NavbarTab.vue';
import MiscOptionTab from './tabs/MiscOptionTab.vue';
import defaultConfig from './js/default-config';
import initConfirmDialog from './js/confirm-dialog';
import { extendObject } from './js/uitls';

const
    SKEY_TAB_NAME = 'gli.tabName',
    SKEY_APPLY_TIP = 'gli.applyTip'

export default {
    name: "GlInjector",
    components: { LoginPageTab, AdminPanelTab, NavbarTab, MiscOptionTab },
    data() {
        return {
            name: "glinjector",
            config: null,
            tabName: localStorage.getItem(SKEY_TAB_NAME) || 'login',
        }
    },
    provide() {
        return {
            tl: this.tl,
            rpc: this.rpc,
            keepCurrentTab: this.keepCurrentTab,
        }
    },
    beforeCreate() {
        initConfirmDialog(this)
    },
    async created() {
        try {
            this.config = extendObject(defaultConfig(), JSON.parse((await this.rpc("get_config")).json))
        } catch (ignored) {
            this.config = defaultConfig()
        }
        if (localStorage.getItem(SKEY_APPLY_TIP)) {
            localStorage.removeItem(SKEY_APPLY_TIP)
            this.$message(this.tl('apply_success'))
        }
        localStorage.removeItem(SKEY_TAB_NAME)
    },
    methods: {
        tl(key, param) {
            return this.$t(this.name + '.' + key, param)
        },
        async resetDefault() {
            await this.$glConfirm(this.tl('reset_confirm'))
            this.config = defaultConfig()
            this.$message.success(this.tl('reset_done'))
        },
        keepCurrentTab() {
            localStorage.setItem(SKEY_TAB_NAME, this.tabName)
        },
        async rpc(method, param) {
            return await this.$request("call", ["sid", this.name, method, param || {}])
        },
        async handleApply() {
            this.$message(this.tl('applying'))
            await this.rpc("set_config", { json: JSON.stringify(this.config) })
            setTimeout(() => {
                this.keepCurrentTab()
                localStorage.setItem(SKEY_APPLY_TIP, true)
                location.reload()
            }, 200);
        },
    }
}
</script>

<style lang="scss">
@import url(./style/base.scss);
</style>

<style lang="scss" scoped>
.plugin-wrapper {
    padding: 20px 0;

    .github {
        color: white !important;
        font-size: 13px;
    }

    .reset-config {
        z-index: 2;
        cursor: pointer;
        position: absolute;
        right: 25px;
        top: 22px;
        color: var(--text-hint);

        &:hover {
            opacity: 0.6;
        }
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

                >.container {
                    position: relative;
                    border-radius: 5px;
                    background: transparent;
                }

                .el-tabs__content {
                    overflow: visible !important;
                }
            }

            .container>.btns {
                border-radius: 0 0 5px 5px;
                padding: 20px;
                background-color: var(--background-card);
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

    }

    ::v-deep {

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

        .el-dialog {
            .dialog-btns {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .form>ul>li {
            height: 64px;
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

            >div {
                &:first-child {
                    color: var(--text-weak);
                    flex: 1;
                    margin-right: 10px;
                    display: flex;
                    align-items: center;
                }

                &:last-child {
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
    }
}
</style>
