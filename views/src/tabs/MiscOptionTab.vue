<template>
    <div class="form">
        <ul>
            <li>
                <div>移除区域限制</div>
                <div>
                    <gl-switch v-model="misc.unlock" />
                </div>
            </li>
            <li>
                <div>
                    <span>风扇温度区间</span>
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
    inject: ['tl', 'keepCurrentTab'],
    watch: {
        'misc.unlock'(unlock) {
            if (unlock) {
                this.$glConfirm('该功能仅用于学习研究为目的，请您务必遵守您当地的法律法规，并于学习研究结束后自觉关闭, 是否同意?', this.$t('core.caution')).catch(() => this.misc.unlock = false);
            }
        }
    },
    methods: {
        goToFanSetting() {
            this.keepCurrentTab()
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