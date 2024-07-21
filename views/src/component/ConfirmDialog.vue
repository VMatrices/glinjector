<template>
    <el-dialog :title="title || $t('core.confirm')" :visible.sync="dialog" @close="close" @closed="closed" width="420px">
        <div class="dialog-main">
            {{ message }}
            <div class="dialog-btns">
                <gl-button class="dialog-btn" @click="dialog = false">{{ $t("core.no") }}</gl-button>
                <gl-button class="dialog-btn" type="primary" @click="confirm">{{ $t("core.yes") }}</gl-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: "ConfirmDialog",
    data() {
        return {
            dialog: false,
            confirmed: false,
            title: "",
            message: ""
        }
    },
    created() {
        document.body.appendChild(this.$mount().$el)
    },
    methods: {
        show(message, title = "") {
            this.dialog = true
            this.title = title
            this.message = message
            return new Promise((resolve, reject) => {
                this.reject = reject
                this.resolve = resolve
            })
        },
        confirm() {
            this.resolve()
            this.dialog = false
            this.confirmed = true
        },
        close() {
            if (!this.confirmed) {
                this.reject()
            }
        },
        closed() {
            document.body.removeChild(this.$el)
            this.$destroy()
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
    text-align: center;
}

.dialog-btns {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;

    .gl-btn {
        min-width: 124px;
    }
}
</style>
