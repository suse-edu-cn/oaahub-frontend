<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'

import { Button, IconField, InputIcon, InputText, Message } from 'primevue'
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'

import { useAuthStore } from '@/stores/auth'
import { initAuthStore } from '@/utils/initAuthStore'
import setToast from '@/utils/setToast'
import request from '@/utils/request'

const router = useRouter()
const authStore = useAuthStore()
const userInfo = authStore.userInfo

const infoSchema = z.object({
    username: z.string().min(1, { message: '请填写用户名' }),
    role: z.string().min(1, { message: '请填写职位' }),
    department: z.string().min(1, { message: '请填写部门' }),
    avatar: z.string().regex(/^https:\/\/[A-Za-z0-9.-]+(?::\d+)?(\/\S*)?$/, { message: '头像链接应为 https 协议的 URL' })
})
const resolver = zodResolver(infoSchema)
const updateData = ref({ ...userInfo })

async function onUpdateData() {
    if (!infoSchema.safeParse(updateData.value).success) {
        return
    }

    try {
        const resp = await request({
            url: '/user/update',
            method: 'POST',
            data: updateData.value
        })
        if (resp.code == 200) {
            setToast('success', '修改成功', '你的个人信息已更新！')
            await initAuthStore()
            router.push('/user')
        } else {
            setToast('error', '修改失败', resp.message)
        }
    } catch (err) {
        setToast('error', '修改失败', err.response.data.message || '未知错误，请联系负责后端的同学')
    }
}

onMounted(() => {
    // 如果因刷新等原因导致 authStore 未初始化，则先 init
    if (!authStore.isReady) {
        initAuthStore()
    }
    if (!authStore.isAuthed) {
        setToast('error', '获取用户信息失败', '当前尚未登录！')
        router.push('/auth')
    }
})
</script>

<template>
    <main>
        <h1 class="e-title">编辑个人信息</h1>

        <Form v-slot="$form" :resolver="resolver" :initial-values="userInfo" @submit="onUpdateData">
            <!-- 头像 -->
            <div class="avatar">
                <div>设置头像</div><br />
                <div class="wrapper">
                    <img :src="userInfo.avatar" alt="用户头像" />
                    <div class="overlay">
                        <span class="pi pi-upload"></span>
                    </div>
                </div>
                <div class="tip">头像支持 JPG、PNG、WEBP 格式，大小不得超过 5MB</div>
                <InputText name="avatar" v-model="updateData.avatar" type="hidden" />
            </div>

            <!-- 表单 -->
            <div class="info">
                <div class="item">
                    <label for="student_id">学号</label>
                    <IconField>
                        <InputIcon class="pi pi-id-card" />
                        <InputText name="student_id" v-model="updateData.student_id" disabled />
                    </IconField>
                    <Message severity="error" size="small" variant="simple">&nbsp;</Message>
                </div>
                <div class="item">
                    <label for="name">姓名</label>
                    <IconField>
                        <InputIcon class="pi pi-user" />
                        <InputText name="name" v-model="updateData.name" disabled />
                    </IconField>
                    <Message severity="error" size="small" variant="simple">&nbsp;</Message>
                </div>
                <div class="item">
                    <label for="username">用户名</label>
                    <IconField>
                        <InputIcon class="pi pi-users" />
                        <InputText name="username" v-model="updateData.username" />
                    </IconField>
                    <Message severity="error" size="small" variant="simple">
                        <span v-if="$form.username?.invalid">{{ $form.username.error?.message }}</span>&nbsp;
                    </Message>
                </div>
                <div class="item">
                    <label for="role">职位</label>
                    <IconField>
                        <InputIcon class="pi pi-address-book" />
                        <InputText name="role" v-model="updateData.role" />
                    </IconField>
                    <Message severity="error" size="small" variant="simple">
                        <span v-if="$form.role?.invalid">{{ $form.role.error?.message }}</span>&nbsp;
                    </Message>
                </div>
                <div class="item">
                    <label for="department">部门</label>
                    <IconField>
                        <InputIcon class="pi pi-sitemap" />
                        <InputText name="department" v-model="updateData.department" />
                    </IconField>
                    <Message severity="error" size="small" variant="simple">
                        <span v-if="$form.department?.invalid">{{ $form.department.error?.message }}</span>&nbsp;
                    </Message>
                </div>

                <Button type="submit" label="保存修改" icon="pi pi-save" class="item" />
            </div>
        </Form>
    </main>
</template>

<style lang="less" scoped>
form {
    display: flex;
    width: 100%;
    flex-direction: var(--container-direction);
    gap: var(--container-gap);

    .avatar {
        flex: 1;

        .wrapper {
            position: relative;
            width: 8rem;
            height: 8rem;
            margin-bottom: 0.5rem;

            img {
                width: 8rem;
                height: 8rem;
                border-radius: 50%;
                border: 1px solid #ddd;
            }

            .overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: rgba(0, 0, 0, 0.25);
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s;
                cursor: pointer;
            }

            &:hover .overlay {
                opacity: 1;
            }
        }

        .tip {
            margin-top: 1rem;
            font-size: 14px;
            color: #666;
        }


    }

    label {
        display: var(--label-display);
        width: 3rem;
        text-align: var(--label-align);
        margin-bottom: 0.5rem;
        margin-right: 1rem;
        font-weight: 500;
    }

    .p-iconfield {
        display: var(--label-display);
    }

    .p-inputtext {
        width: var(--label-width);
        min-width: 15rem;
        max-width: 30rem;
    }

    .p-message {
        margin: 3px 4rem;
    }

    .p-button {
        margin: 1rem var(--button-margin) 3rem;
    }

    --container-direction: row-reverse;
    --container-gap: 5vw;
    --label-align: right;
    --label-display: inline-block;
    --label-width: 25vw;
    --button-margin: 4rem;
}

@media screen and (max-width: 800px) {
    form {
        --container-direction: column;
        --container-gap: 2rem;
        --label-align: left;
        --label-display: block;
        --label-width: 90%;
        --button-margin: 0;
    }
}
</style>
