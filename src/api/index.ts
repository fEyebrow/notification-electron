import wscn from './wscn'
import { UserInfo } from '../hook/useUserInfo'
import { AxiosPromise } from 'axios'

export function userInfo(): AxiosPromise<UserInfo> {
  return wscn({
    url: 'apiv1/admin/user/internal/info',
    method: 'get'
  })
}