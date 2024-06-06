<template>
    <div class="wrapper" :class="{ wide }">
        <div class="header" @dblclick="wide = !wide">
            <div class="title">
                <i class="iconfont icon-gateway"></i>
                <span class="divide"></span>
                <span>Preview</span>
            </div>
            <div class="locale">
                <el-select v-model="$i18n.locale" size="small" class="pull-right" style="width:90px">
                    <el-option v-for="(_, key) in $i18n.messages" :key="key" :label="key.toLocaleUpperCase()" :value="key" />
                </el-select>
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
</template>

<script>
import App from '../src/App.vue';
export default {
    components: { App },
    data() {
        return {
            wide: false
        }
    },
    watch: {
        '$i18n.locale'(locale) {
            localStorage.setItem('locale', locale)
            document.body.setAttribute("lang", locale)
        }
    }
}
</script>

<style lang="scss" scoped>
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
        min-height: 100vh;
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
            max-height: calc(100vh - 50px);
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
</style>
