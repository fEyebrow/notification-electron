import wscn from './wscn'
import { UserInfo } from '../hook/useUserInfo'
import { AxiosPromise } from 'axios'

export function userInfo(): AxiosPromise<UserInfo> {
  return wscn({
    url: 'apiv1/admin/user/internal/info',
    method: 'get'
  })
}


export function getArticle(id: number): AxiosPromise<any> {
  return wscn({
    url: 'apiv1/admin/content/articles/' + id,
    method: 'get'
  })
}

export function getLive(id: number): AxiosPromise<any> {
  return wscn({
    url: 'apiv1/admin/content/lives/' + id,
    method: 'get'
  })
}

export function getPush(id: number): AxiosPromise<any> {
  return wscn({
    url: 'apiv1/admin/content/pushes/' + id,
    method: 'get'
  })
}