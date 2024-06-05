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
                        <LoginPageTab :styles.sync="config.style.login" />
                    </el-tab-pane>
                    <el-tab-pane :label="tl('admin_panel')">
                        <AdminPanelTab :styles.sync="config.style.system" />
                    </el-tab-pane>
                    <el-tab-pane :label="tl('navbar')">
                        <NavButtonTab :buttons.sync="config.navbar" />
                    </el-tab-pane>
                    <el-tab-pane :label="tl('misc')">
                        <MiscOptionTab :misc.sync="config.misc" />
                    </el-tab-pane>
                </el-tabs>

                <div class="btns">
                    <gl-button type="primary" @click="handleApply">{{ tl('apply') }}</gl-button>
                </div>
            </gl-card>
        </div>
    </keep-alive>
</template>

<script>
import LoginPageTab from './tabs/LoginPageTab.vue';
import AdminPanelTab from './tabs/AdminPanelTab.vue';
import NavButtonTab from './tabs/NavButtonTab.vue';
import MiscOptionTab from './tabs/MiscOptionTab.vue';

export default {
    name: "GlInjector",
    components: { LoginPageTab, AdminPanelTab, NavButtonTab, MiscOptionTab },
    data() {
        return {
            name: "glinjector",
            config: {
                style: {
                    login: {
                        background: {
                            url: '/img/bg_login_demo.jpg',
                            size: 'cover',
                            position: 'center',
                        },
                        box: {
                            color: 'black',
                            alpha: 30,
                            blur: 30,
                            new_look: true,
                            margin: 8,
                            width: 500,
                            position: 'left'
                        },
                        button: {
                            comb: true,
                            luci: true,
                            text: "LuCI",
                        }
                    },
                    system: {
                        wide_mode: true,

                        background: {
                            url: '',
                            size: 'cover',
                            position: 'center',
                            color: 'black',
                            alpha: 30,
                            blur: 30,
                        },
                    },
                },
                misc: {
                    fan: [30, 90],
                    unlock: true,
                },
                navbar: [
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
    provide() {
        return {
            tl: this.tl,
            rpc: this.rpc,
        }
    },
    methods: {
        tl(key) {
            return this.$t(this.name + '.' + key)
        },
        async rpc(method, param) {
            return await this.$request("call", ["sid", this.name, method, param || {}])
        },
        handleApply() {
            alert(JSON.stringify(this.config, null, 2))
            this.$message('应用成功，等待刷新页面...')
            setTimeout(() => {
                location.reload()
            }, 500);
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

        .form>ul>li,
        .form>ul>div>li {
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
