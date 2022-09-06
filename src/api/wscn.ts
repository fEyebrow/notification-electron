import axios from 'axios'
import { DB } from '../utils/app'
import { ElMessage, ElMessageBox } from 'element-plus'

const api = axios.create({
  baseURL: import.meta.env.VITE_API,
  timeout: 30 * 1000
})

api.interceptors.request.use(
  config => {
    const token = DB.get('token')
    let tokenHeader: any = {}
    if (token) {
      tokenHeader['x-ivanka-token'] = token
    }
    const conf = {
      ...config,
      headers: {
        ...config.headers,
        ...tokenHeader,
        'x-appgo-platform': 'device=desktop'
      }
    }
    return conf
  },
  error => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  response => {
    const { code, data, message } = response.data || {}
    if (code === 60441 || code === 50025 || code === 50026 || code === 50027) {
      // 内容命中敏感词
      return Promise.reject(data)
    } else if (code !== 20000) {
      ElMessage({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (code === 50008 || code === 50012 || code === 50014 || code === 60237) {
        DB.delete('token')
        ElMessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          location.reload()
        })
      } else {
        // 排除登出的请求错误
        // Raven.captureException(requestErrorFormat(response))
        console.log('err:' + requestErrorFormat(response))// for debug
      }
      return Promise.reject(data)
    } else {
      return response.data
    }
  },
  error => {
    return Promise.reject(error.toJSON())
  }
)

function requestErrorFormat(res: any) {
  const o = {
    url: res.request && res.request.responseURL,
    res: res.request && res.request.response
  }
  return JSON.stringify(o)
}

export default api