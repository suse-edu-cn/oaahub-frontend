import { createRouter, createWebHistory } from 'vue-router'
import cookies from 'js-cookie'

import setToast from '@/utils/setToast'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView },

        // 个人页面相关
        { path: '/auth', component: () => import('@/views/AuthView.vue') },
        {
            path: '/user',
            component: () => import('@/views/UserView.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/user/edit',
            component: () => import('@/views/UserEditView.vue'),
            meta: { requiresAuth: true },
        },

        // 比赛相关
        { path: '/match', component: () => import('@/views/MatchListView.vue') },
        { path: '/match/:id', component: () => import('@/views/MatchDetailView.vue') },
    ],
})

router.beforeEach((to, from, next) => {
    const isAuthed = Boolean(cookies.get('token'))
    if (to.meta.requiresAuth && !isAuthed) {
        setToast('error', '未登录', '请先登录以访问该页面')
        next('/auth')
    } else {
        next()
    }
})

export default router
