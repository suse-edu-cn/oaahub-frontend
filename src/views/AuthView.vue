<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import cookies from 'js-cookie'

import { Button, Checkbox, FloatLabel, InputText, Message } from 'primevue'
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'

import { useAuthStore } from '@/stores/auth'
import { initAuthStore } from '@/utils/initAuthStore'
import setToast from '@/utils/setToast'
import request from '@/utils/request'

const router = useRouter()
const authStore = useAuthStore()
const imgSet = [
    'https://img.alicdn.com/O1CN01IBboqk1ILG3pdXfvg_!!2212930340876-0-ampmedia.jpg',
    'https://img.alicdn.com/O1CN01zvyC7r1ILG3pymwEb_!!2212930340876-2-ampmedia.png',
    'https://img.alicdn.com/O1CN01MviGBa1ILG3pHXMoq_!!2212930340876-2-ampmedia.png',
    'https://img.alicdn.com/O1CN01s8aLFO1ILG3qF6k0V_!!2212930340876-2-ampmedia.png',
    'https://img.alicdn.com/O1CN01vxZ1KT1ILG3juISKN_!!2212930340876-0-ampmedia.jpg'
]

// 登录表单验证
const initialValues = ref({
    studentid: '',
    username: '',
    name: '',
    password: '',
    isAccepted: false
})
const resolver = ref(zodResolver(
    z.object({
        studentid: z.string().min(1, { message: '请填写学号' }).regex(/^\d+$/, { message: '学号必须为数字' }),
        username: z.string().min(1, { message: '请填写用户名' }),
        name: z.string().min(1, { message: '请填写姓名' }),
        password: z.string().min(1, { message: '请填写密码' }),
        isAccepted: z.literal(true)
    })
))
// portal 模式，0 为登录，1 为注册
const mode = ref(0)

// 提交登录请求
const loginData = ref({
    username: '',
    password: ''
})
async function onLogin() {
    try {
        const resp = await request({
            url: '/user/login',
            method: 'POST',
            data: loginData.value
        })
        if (resp.code == 200) {
            cookies.set('token', resp.data.token, { expires: 31, secure: true, sameSite: 'Lax', path: '/' })
            authStore.isAuthed = true
            authStore.token = resp.data.token
            router.push('/user')
        } else {
            setToast('error', '登录失败', resp.message)
        }
    } catch (err) {
        setToast('error', '登录失败', err.response?.data?.message || '未知错误，请联系负责后端的同学')
    }
}

// 提交注册请求
const registerData = ref({
    studentid: '',
    username: '',
    name: '',
    password: '',
    role: '会员'
})
async function onRegister() {
    try {
        const resp = await request({
            url: '/user/register',
            method: 'POST',
            data: registerData.value
        })
        if (resp.code == 200) {
            setToast('success', '注册成功', '使用你的通行证登录吧！')
            mode.value = 0
        } else {
            setToast('error', '注册失败', resp.message)
        }
    } catch (err) {
        setToast('error', '注册失败', err.response?.data?.message || '未知错误，请联系负责后端的同学')
    }
}

onMounted(() => {
    // 如果因刷新等原因导致 authStore 未初始化，则先 init
    if (!authStore.isReady) {
        initAuthStore()
    }
    if (authStore.isAuthed) {
        setToast('success', '用户已登录', '欢迎回来，正在跳转至主页')
        router.push('/user')
    }
})
</script>

<template>
    <main>
        <div class="left">
            <img v-once :src="imgSet[Math.floor(Math.random() * imgSet.length)]" alt="" srcset="">
        </div>

        <!-- 登录 -->
        <Form v-slot="$form" :resolver="resolver" :initial-values="initialValues" class="right" v-if="mode == 0"
            @submit="onLogin">
            <h2>登录青蟹通行证</h2>

            <div class="input-box">
                <FloatLabel variant="on">
                    <InputText v-model="loginData.username" name="username" size="large" class="input-box" />
                    <label for="on_label">用户名</label>
                </FloatLabel>
                <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.username.error?.message }}</Message>
            </div>

            <div class="input-box">
                <FloatLabel variant="on">
                    <InputText v-model="loginData.password" name="password" type="password" size="large"
                        class="input-box" />
                    <label for="on_label">密码</label>
                </FloatLabel>
                <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.password.error?.message }}</Message>
            </div>

            <br>
            <Button type="submit" label="登录" class="input-box" />

            <p class="link" @click="mode = 1">没有通行证？前往注册</p>
        </Form>

        <!-- 注册 -->
        <Form v-slot="$form" :resolver="resolver" :initial-values="initialValues" class="right" v-if="mode == 1"
            @submit="onRegister">
            <h2>注册青蟹通行证</h2>

            <div class="input-box">
                <FloatLabel variant="on">
                    <InputText v-model="registerData.studentid" name="studentid" size="large" class="input-box" />
                    <label for="on_label">学号</label>
                </FloatLabel>
                <Message v-if="$form.studentid?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.studentid.error?.message }}</Message>
            </div>

            <div class="input-box">
                <FloatLabel variant="on">
                    <InputText v-model="registerData.username" name="username" size="large" class="input-box" />
                    <label for="on_label">用户名</label>
                </FloatLabel>
                <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.username.error?.message }}</Message>
            </div>

            <div class="input-box">
                <FloatLabel variant="on">
                    <InputText v-model="registerData.name" name="name" size="large" class="input-box" />
                    <label for="on_label">姓名</label>
                </FloatLabel>
                <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.name.error?.message }}</Message>
            </div>

            <div class="input-box">
                <FloatLabel variant="on">
                    <InputText v-model="registerData.password" name="password" type="password" size="large"
                        class="input-box" />
                    <label for="on_label">密码</label>
                </FloatLabel>
                <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.password.error?.message }}</Message>
            </div>
            <div class="input-box">
                <Checkbox input-id="isAccepted" name="isAccepted" binary />
                <label for="isAccepted">&nbsp;&nbsp;我已阅读并同意<a href="#" target="_blank">《用户协议》</a></label>
            </div>
            <br>
            <Button type="submit" label="注册" class="input-box" />

            <p class="link" @click="mode = 0">已经拥有通行证？前往登录</p>
        </Form>

    </main>
</template>

<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;

    .left {
        display: var(--e-display);
        flex: 1;
        justify-content: center;
        align-items: center;
        padding: 3rem;

        img {
            width: 19vw;
            height: auto;
        }
    }

    .right {
        display: flex;
        width: 60%;
        flex: 1;
        flex-direction: column;
        gap: 1.5rem;
        justify-content: center;
        align-items: center;

        .input-box {
            width: var(--input-width);
            max-width: 500px;
        }

        .link {
            color: var(--e-color-theme);
            cursor: pointer;
        }
    }

    --input-width: 20vw;
}

@media screen and (max-width: 800px) {
    main {
        --input-width: 95%;
    }
}
</style>
