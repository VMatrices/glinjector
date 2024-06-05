<template>
    <div class="form">
        <ul>
            <!-- <li>
                <div>
                    <span>宽屏模式 </span>
                    <el-tooltip effect="dark" content="Top Left 提示文字" placement="top-start">
                        <span class="iconfont icon-info ml10" />
                    </el-tooltip>
                </div>
                <div>
                    <gl-switch v-model="config.style.wide_mode" />
                </div>
            </li> -->
            <li>
                <div>恢复菜单</div>
                <div>
                    <gl-switch v-model="misc.unlock" />
                </div>
            </li>
            <li>
                <div>
                    <span>风扇区间</span>
                    <span @click="goToFanSetting" class="iconfont icon-fan-setting btn-icon ml3" style="color: var(--primary)" />
                </div>
                <div>
                    <el-slider class="w200" v-model="misc.fan" range :min="0" :max="90" show-tooltip :format-tooltip="v => v + '°C'" :marks="{ 0: '0°C', 90: '90°C' }">
                    </el-slider>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        misc: Object
    },
    inject: ["tl"],
    methods: {
        goToFanSetting() {
            this.$router.push({ name: 'overview' })
            const timer = setInterval(() => {
                const btn = document.querySelector('.fan-setting-wrapper > *')
                if (btn) {
                    btn.click()
                    clearInterval(timer)
                }
            }, 50)
        }
    }
}
</script>