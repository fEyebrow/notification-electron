import { ref } from 'vue'
import { DB } from '../utils/app'

const useLogin = () => {
  const isLogin = ref(false)

  const login = () => {
    const token = DB.get('token')
    if (token) {
      isLogin.value = true
      return true
    } else {
      if (import.meta.env.VITE_API_ENV === 'sit') {
        window.open('https://juicy-wscn-sit.xuangubao.cn/oauth/authorize?client_id=wscn-notification')
      } else {
        window.open('https://juicy-wscn.wallstcn.com/oauth/authorize?client_id=wscn-notification')
      }
    }
    return false
  }

  const loginOut = () => {
    DB.delete('token')
    isLogin.value = false
  }

  // init
  login()

  return {
    isLogin,
    login
  }
}

export default useLogin