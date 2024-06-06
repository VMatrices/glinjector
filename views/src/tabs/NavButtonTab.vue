<template>
    <div>

        <gl-tips tips="Woc">
            <gl-button slot="customAction" type="primary" @click="handleOpenBtnDialog">
                <span class="iconfont icon-plus mr6"></span>
                <span>添加</span>
            </gl-button>
        </gl-tips>
        <table class="mt10">
            <thead>
                <th style="width: 150px;">启用</th>
                <th>按钮</th>
                <th>{{ tl('navbar_btn.link_path') }}</th>
                <th>打开方式</th>
                <th>操作</th>
            </thead>
            <tbody>
                <tr v-for="item, i in buttons">
                    <td><gl-switch v-model="item.enable" /></td>
                    <td><i :class="item.icon" /><span class="ml10">{{ item.name }}</span></td>
                    <td>{{ item.link }}</td>
                    <td>
                        <span v-if="item.mode == 'embed'">嵌入当前页</span>
                        <span v-if="item.mode == 'blank'">打开新页面</span>
                        <span v-if="item.mode == 'replace'">替换当前页面</span>
                    </td>
                    <td>
                        <gl-button class="gl-icon-btn" type="default" @click="handleSwapBtn(i, -1)">
                            <i class="el-icon-arrow-up" />
                        </gl-button>
                        <gl-button class="gl-icon-btn" type="default" @click="handleSwapBtn(i, +1)">
                            <i class="el-icon-arrow-down" />
                        </gl-button>
                        <gl-button class="gl-icon-btn" type="success" @click="handleOpenBtnDialog(i)">
                            <i class="el-icon-edit" />
                        </gl-button>
                        <gl-button class="gl-icon-btn" type="error" @click="buttons.splice(i, 1)">
                            <i class="el-icon-delete" />
                        </gl-button>
                    </td>
                </tr>
            </tbody>
        </table>

        <el-dialog :title="(btnDialog.edit ? '修改' : '新增') + '按钮'" :visible.sync="btnDialog.show" width="30%">
            <div class="dialog-main">
                <el-form class="form" :model="btnDialog.data" ref="btnForm">
                    <ul>
                        <li>
                            <div>按钮图标</div>
                            <div>
                                <el-form-item prop="icon" :rules="rules.required">
                                    <el-select v-model="btnDialog.data.icon" filterable placeholder="请选择图标">
                                        <template slot="prefix">
                                            <i :class="btnDialog.data.icon || 'el-icon-full-screen'" />
                                        </template>
                                        <el-option v-for="item in icons" :key="item" :label="item" :value="item">
                                            <span style="float: left"><i :class="item" /></span>
                                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div><span>按钮名称</span></div>
                            <div>
                                <el-form-item prop="name" :rules="rules.required">
                                    <el-input v-model="btnDialog.data.name" placeholder="请输入名称"></el-input>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div><span>{{ tl('navbar_btn.link_path') }}</span></div>
                            <div>
                                <el-form-item prop="link" :rules="[rules.required, rules.link]">
                                    <el-input v-model="btnDialog.data.link" placeholder="请输入链接"></el-input>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div><span>打开方式</span></div>
                            <div>
                                <el-select v-model="btnDialog.data.mode" filterable>
                                    <el-option label="嵌入当前页" value="embed" />
                                    <el-option label="打开新页面" value="blank" />
                                    <el-option label="替换当前页面" value="replace" />
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div><span>是否启用</span></div>
                            <div><gl-switch v-model="btnDialog.data.enable" /></div>
                        </li>
                    </ul>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <div class="dialog-btns">
                    <gl-button class="dialog-btn" @click="handleCloseBtnDialog">取 消</gl-button>
                    <gl-button class="dialog-btn" type="primary" @click="handleSaveBtn">确 定</gl-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import icons from '../js/icons';
export default {
    props: {
        buttons: Array
    },
    inject: ["tl"],
    data() {
        return {
            icons,
            rules: {
                required: { required: true, message: '不能为空' },
                link: {
                    message: '格式不正确',
                    pattern: /^(#?\/[\w\/]+|https?:\/\/.+)/i
                }
            },
            btnDialog: {
                show: false,
                edit: false,
                index: -1,
                data: {}
            },
        }
    },
    methods: {
        followMe() {
            this.$message('Follow Me 💕 with https://github.com/VMatrices')
            setTimeout(() => open('https://github.com/VMatrices'), 1000)
        },
        handleSwapBtn(i, d) {
            if (0 <= i + d && i + d < this.buttons.length) {
                const tmp = this.buttons[i]
                this.$set(this.buttons, i, this.buttons[i + d])
                this.$set(this.buttons, i + d, tmp)
            }
        },
        handleOpenBtnDialog(index = -1) {
            if (this.btnDialog.edit = index > -1) {
                this.btnDialog.index = index
                this.btnDialog.data = { ...this.buttons[index] }
            } else {
                this.btnDialog.data = {
                    name: "",
                    icon: "",
                    link: "",
                    mode: 'embed',
                    enable: true,
                }
            }
            this.btnDialog.show = true

        },
        handleSaveBtn() {
            this.$refs.btnForm.validate(valid => {
                if (valid) {
                    if (this.btnDialog.edit) {
                        this.$set(this.buttons, this.btnDialog.index, this.btnDialog.data)
                    } else {
                        this.buttons.push(this.btnDialog.data)
                    }
                    this.btnDialog.show = false
                }
            })
        },
        handleCloseBtnDialog() {
            this.btnDialog.show = false
            this.$refs.btnForm.resetFields()
        },
    }
}
</script>
<style lang="scss" scoped>
td {
    max-width: 100px;
    text-overflow: ellipsis;
    overflow: hidden;
    word-wrap: normal;
    white-space: nowrap;
}

[class*=" el-icon-"],
[class^=el-icon-] {
    font-size: 16px;
    width: inherit;
    height: inherit;
    line-height: inherit;
}
</style>