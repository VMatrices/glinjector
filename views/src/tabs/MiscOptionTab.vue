<template>
    <div class="form">
        <ul>
            <li>
                <div>解除区域限制</div>
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
                this.$glConfirm('请确保您当前在大陆以外的区域，并遵守当地法律, 是否继续?').catch(() => this.misc.unlock = false);
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