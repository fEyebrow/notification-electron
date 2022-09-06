import { ref, Ref } from 'vue'
import { userInfo } from '../api/index'

export interface UserInfo {
  display_name: string
  email: string
  follower_count: number
  gender: string
  image: string
  inner: boolean
  introduction: string
  mobile: string
  qqbind: false
  roles: string[]
  setting: string
  uid: number
  uri: string
  weixinbind: number
}

let state: Ref<UserInfo| null> = ref(null)


const useUserInfo = () => {

  const getInfo = async () => {
    let data = await userInfo()
    state.value = data.data
  }

  return {
    getInfo,
    state
  }
}

export {
  state
}

export default useUserInfo