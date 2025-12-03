import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const isReady = ref(false)
    const isAuthed = ref(false)
    const token = ref<string>('')
    const userInfo = ref<any>(null)

    return {
        isReady,
        isAuthed,
        token,
        userInfo,
    }
})
