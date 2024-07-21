<template>
    <div>
        <gl-tips :tips="tl('navbar.tip')">
            <gl-button slot="customAction" type="primary" @click="handleOpenBtnDialog">
                <span class="iconfont icon-plus mr6"></span>
                <span>{{ tl("navbar.add") }}</span>
            </gl-button>
        </gl-tips>
        <table class="mt10">
            <thead>
                <th style="width: 150px">{{ tl("navbar.enable") }}</th>
                <th>{{ tl("navbar.btn") }}</th>
                <th>{{ tl("navbar.path") }}</th>
                <th>{{ tl("navbar.mode") }}</th>
                <th>{{ tl("navbar.operate") }}</th>
            </thead>
            <transition-group tag="tbody" name="table-fade">
                <tr v-for="(item, i) in navbar.buttons" :key="item.id" class="table-fade-item">
                    <td><gl-switch v-model="item.enable" /></td>
                    <td>
                        <i :class="item.icon" />
                        <span class="ml10">{{ item.name }}</span>
                    </td>
                    <td>{{ item.link }}</td>
                    <td>
                        <template v-if="item.link?.startsWith('#/')">
                            <span>{{ tl("navbar.mode_option.embed") }}</span>
                        </template>
                        <template v-else>
                            <span v-if="item.mode == 'embed'">{{ tl("navbar.mode_option.embed") }}</span>
                            <span v-if="item.mode == 'blank'">{{ tl("navbar.mode_option.blank") }}</span>
                            <span v-if="item.mode == 'replace'">{{ tl("navbar.mode_option.replace") }}</span>
                        </template>
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
                        <gl-button class="gl-icon-btn" type="error" @click="navbar.buttons.splice(i, 1)">
                            <i class="el-icon-delete" />
                        </gl-button>
                    </td>
                </tr>
            </transition-group>
        </table>

        <el-dialog :title="tl(btnDialog.edit ? 'navbar.edit_btn' : 'navbar.add_btn')" :visible.sync="btnDialog.show" width="30%">
            <div class="dialog-main">
                <el-form class="form" :model="btnDialog.data" ref="btnForm">
                    <ul>
                        <li>
                            <div>{{ tl("navbar.icon") }}</div>
                            <div>
                                <el-form-item prop="icon" :rules="rules.required">
                                    <el-select v-model="btnDialog.data.icon" filterable :placeholder="tl('navbar.icon_placeholder')">
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
                            <div>{{ tl("navbar.name") }}</div>
                            <div>
                                <el-form-item prop="name" :rules="rules.required">
                                    <el-input v-model="btnDialog.data.name" :placeholder="tl('navbar.name_placeholder')"></el-input>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>{{ tl("navbar.path") }}</span>
                                <el-tooltip effect="dark" :content="tl('navbar.path_tip')" placement="top-start">
                                    <span class="iconfont icon-info ml10" />
                                </el-tooltip>
                            </div>
                            <div>
                                <el-form-item prop="link" :rules="[rules.required, rules.link]">
                                    <el-input v-model="btnDialog.data.link" :placeholder="tl('navbar.path_placeholder')"></el-input>
                                </el-form-item>
                            </div>
                        </li>
                        <transition name="fade-down">
                            <li v-if="!btnDialog.data.link?.startsWith('#/')">
                                <div>{{ tl("navbar.mode") }}</div>
                                <div>
                                    <el-select v-model="btnDialog.data.mode" filterable>
                                        <el-option :label="tl('navbar.mode_option.embed')" value="embed" />
                                        <el-option :label="tl('navbar.mode_option.blank')" value="blank" />
                                        <el-option :label="tl('navbar.mode_option.replace')" value="replace" />
                                    </el-select>
                                </div>
                            </li>
                        </transition>
                        <li>
                            <div>
                                <span>{{ tl("navbar.enable") }}</span>
                            </div>
                            <div><gl-switch v-model="btnDialog.data.enable" /></div>
                        </li>
                    </ul>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <div class="dialog-btns">
                    <gl-button class="dialog-btn" @click="handleCloseBtnDialog">{{ $t("core.cancel") }}</gl-button>
                    <gl-button class="dialog-btn" type="primary" @click="handleSaveBtn">{{ $t(btnDialog.edit ? "core.edit" : "core.add") }}</gl-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import uuid from "short-uuid"
import icons from "../js/icons"

export default {
    props: {
        navbar: Object
    },
    inject: ["tl"],
    data() {
        return {
            icons,
            rules: {
                required: { required: true, message: this.tl("navbar.not_empty") },
                link: {
                    message: this.tl("navbar.format_incorrect"),
                    pattern: /^(#?\/[\w\/]+|https?:\/\/.+)/i
                }
            },
            btnDialog: {
                show: false,
                edit: false,
                index: -1,
                data: {}
            }
        }
    },
    watch: {
        "navbar.buttons"() {
            this.checkButtonsID()
        }
    },
    created() {
        this.checkButtonsID()
    },
    methods: {
        checkButtonsID() {
            for (const item of this.navbar.buttons) {
                if (!item.id) {
                    item.id = uuid.generate()
                }
            }
        },
        handleSwapBtn(i, d) {
            if (0 <= i + d && i + d < this.navbar.buttons.length) {
                const tmp = this.navbar.buttons[i]
                this.$set(this.navbar.buttons, i, this.navbar.buttons[i + d])
                this.$set(this.navbar.buttons, i + d, tmp)
            }
        },
        handleOpenBtnDialog(index = -1) {
            if ((this.btnDialog.edit = index > -1)) {
                this.btnDialog.index = index
                this.btnDialog.data = { ...this.navbar.buttons[index] }
            } else {
                this.btnDialog.data = {
                    id: uuid.generate(),
                    name: "",
                    icon: "",
                    link: "",
                    mode: "embed",
                    enable: true
                }
            }
            this.btnDialog.show = true
        },
        handleSaveBtn() {
            this.$refs.btnForm.validate(valid => {
                if (valid) {
                    if (this.btnDialog.edit) {
                        this.$set(this.navbar.buttons, this.btnDialog.index, this.btnDialog.data)
                    } else {
                        this.navbar.buttons.push(this.btnDialog.data)
                    }
                    this.btnDialog.show = false
                }
            })
        },
        handleCloseBtnDialog() {
            this.btnDialog.show = false
            this.$refs.btnForm.resetFields()
        }
    }
}
</script>
<style lang="scss" scoped>
.table-fade-item {
    transition: transform 0.3s;
    transform-origin: top;
}

.table-fade-enter,
.table-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scaleY(0.1);
}

.table-fade-leave-active {
    // FIXME v-move bug
    position: absolute;
    visibility: hidden;
}

td {
    max-width: 100px;
    text-overflow: ellipsis;
    overflow: hidden;
    word-wrap: normal;
    white-space: nowrap;
    color: var(--text-weak);

    [class*=" el-icon-"],
    [class^="el-icon-"] {
        font-size: 16px;
        width: inherit;
        height: inherit;
        line-height: inherit;
    }
}
</style>
