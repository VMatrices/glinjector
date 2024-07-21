<template>
    <div class="form">
        <ul>
            <li>
                <span>{{ tl("misc.unlock") }}</span>
                <div>
                    <gl-switch v-model="misc.unlock" />
                </div>
            </li>
            <li>
                <div>
                    <span>{{ tl("misc.fan_temp_range") }}</span>
                    <span @click="goToFanSetting" class="iconfont icon-fan-setting btn-icon ml3" style="color: var(--primary)" />
                </div>
                <div>
                    <el-slider
                        class="w200"
                        v-model="misc.fan.range"
                        range
                        :min="0"
                        :max="99"
                        show-tooltip
                        :format-tooltip="v => v + '°C'"
                        :marks="{ 0: '0°C', 99: '99°C' }"
                    />
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
    inject: ["tl", "keepCurrentTab"],
    watch: {
        "misc.unlock"(unlock) {
            if (unlock) {
                this.$glConfirm(this.tl("misc.unlock_confirm"), this.$t("core.caution")).catch(() => (this.misc.unlock = false))
            }
        }
    },
    methods: {
        goToFanSetting() {
            this.keepCurrentTab()
            this.$router.push({ name: "overview" })
            const timer = setInterval(() => {
                const btn = document.querySelector(".icon-fan-setting") 
                if (btn) {
                    btn.click()
                    clearInterval(timer)
                }
            }, 50)
        }
    }
}
</script>
