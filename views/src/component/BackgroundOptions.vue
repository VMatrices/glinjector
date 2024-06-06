<template>
    <Fragment>
        <li>
            <div>
                <span>背景图片</span>
            </div>
            <div>
                <el-select v-model="background.url" @change="imageLoading = 1" filterable clearable allow-create placeholder="选择或输入网址">
                    <div class="select-upload" @click="uploadDialog = true"><i class="el-icon-upload mr5" />上传</div>
                    <el-option v-for="item in wallpapers" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>
        </li>
        <transition name="fade-down">
            <li v-show="background.url">
                <div>背景位置</div>
                <div>
                    <el-select v-model="background.position">
                        <el-option label="居中" value="center" />
                        <el-option label="左对齐" value="left" />
                        <el-option label="右对齐" value="right" />
                        <el-option label="顶部对齐" value="top" />
                        <el-option label="底部对齐" value="bottom" />
                    </el-select>
                </div>
            </li>
        </transition>
        <transition name="fade-down">
            <li v-show="background.url">
                <div>背景大小</div>
                <div>
                    <el-select v-model="background.size">
                        <el-option label="填充" value="cover" />
                        <el-option label="适应宽高" value="contain no-repeat" />
                        <el-option label="平铺(原图)" value="auto repeat" />
                        <el-option label="平铺(适应)" value="contain repeat" />
                    </el-select>
                </div>
            </li>
        </transition>
        <el-dialog title="上传图片" :visible.sync="uploadDialog" width="30%">
            <div class="dialog-main">
                <gl-upload-card :key="uploadDialog" ref="uploadCard" allowType=".jpg, .png, .gif" :maxSize="5 * 1024 * 1024" path="/tmp/glinjector_img" @upload="handleUploaded" />
            </div>
        </el-dialog>
    </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';
import wallpapers from '../wallpapers';

export default {
    components: { Fragment },
    inject: ['tl', 'rpc'],
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
            const path = (await this.rpc('upload_image', {
                prefix: this.imgPrefix,
                ext: fileName.replace(/^.+?\./, ''),
            })).path
            this.$message.success(`上传成功：${fileName}`)
            setTimeout(() => {
                this.background.url = path
                this.uploadDialog = false
            }, 500)
        }
    }
}
</script>