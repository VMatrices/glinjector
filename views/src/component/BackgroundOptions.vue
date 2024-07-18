<template>
    <Fragment>
        <li>
            <div>
                <span>{{ tl("background.image") }}</span>
                <el-tooltip effect="dark" :content="tl('background.image_tip')" placement="top-start">
                    <span class="iconfont icon-info ml10" />
                </el-tooltip>
            </div>
            <div>
                <el-select
                    v-model="background.url"
                    @change="imageLoading = 1"
                    filterable
                    clearable
                    allow-create
                    :placeholder="tl('background.image_placeholder')"
                >
                    <div class="select-upload" @click="uploadDialog = true">
                        <i class="el-icon-upload mr5" />
                        {{ tl("background.upload_btn") }}
                    </div>
                    <el-option v-for="item in wallpapers" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>
        </li>
        <transition name="fade-down">
            <li v-show="background.url">
                <div>{{ tl("background.size") }}</div>
                <div>
                    <el-select v-model="background.size">
                        <el-option :label="tl('background.size_option.fill')" value="fill" />
                        <el-option :label="tl('background.size_option.fit')" value="fit" />
                        <el-option :label="tl('background.size_option.stratch')" value="stratch" />
                        <el-option :label="tl('background.size_option.tile')" value="tile" />
                    </el-select>
                </div>
            </li>
        </transition>
        <transition name="fade-down">
            <li v-show="background.url && background.size != 'stratch'">
                <div>{{ tl("background.postion") }}</div>
                <div>
                    <el-select v-model="background.position">
                        <el-option :label="tl('background.postion_option.center')" value="center" />
                        <el-option :label="tl('background.postion_option.left')" value="left" />
                        <el-option :label="tl('background.postion_option.right')" value="right" />
                        <el-option :label="tl('background.postion_option.top')" value="top" />
                        <el-option :label="tl('background.postion_option.bottom')" value="bottom" />
                    </el-select>
                </div>
            </li>
        </transition>
        <el-dialog :title="tl('background.upload_title')" :show-close="true" :visible.sync="uploadDialog" width="30%">
            <div class="dialog-main">
                <gl-upload-card
                    :key="uploadDialog"
                    ref="uploadCard"
                    allowType=".jpg, .png, .apng, .gif"
                    :maxSize="5 * 1024 * 1024"
                    path="/tmp/glinjector_upload"
                    @upload="handleUploaded"
                />
            </div>
        </el-dialog>
    </Fragment>
</template>

<script>
import { Fragment } from "vue-fragment"
import wallpapers from "../js/wallpapers"

export default {
    components: { Fragment },
    inject: ["tl", "rpc"],
    props: {
        imgPrefix: String,
        background: Object
    },
    data() {
        return {
            wallpapers,
            uploadDialog: false
        }
    },
    methods: {
        async handleUploaded(fileName) {
            const path = (
                await this.rpc("upload_image", {
                    prefix: this.imgPrefix,
                    ext: fileName.replace(/^.+?\./, "")
                })
            ).path
            this.$message.success(this.tl("background.upload_success", { fileName }))
            setTimeout(() => {
                this.background.url = path
                this.uploadDialog = false
            }, 500)
        }
    }
}
</script>
