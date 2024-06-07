<template>
    <el-dialog title="提示" :visible.sync="dialog" @close="close" @closed="closed" width="400px">
        <div class="dialog-main">
            {{ message }}
            <div class="dialog-btns">
                <gl-button class="dialog-btn" @click="dialog = false">关 闭</gl-button>
                <gl-button class="dialog-btn" type="primary" @click="confirm">{{ $t('core.confirm') }}</gl-button>
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
            message: ''
        };
    },
    created() {
        document.body.appendChild(this.$mount().$el)
    },
    methods: {
        show(message) {
            this.dialog = true
            this.message = message
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        confirm() {
            this.resolve();
            this.dialog = false
            this.confirmed = true
        },
        close() {
            if (!this.confirmed) {
                this.reject();
            }
        },
        closed() {
            document.body.removeChild(this.$el);
            this.$destroy();
        }
    }
};
</script>

<style lang="scss" scoped>
.el-dialog {
    .dialog-btns {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 20px;
    }
}
</style>