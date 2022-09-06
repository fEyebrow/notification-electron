import { reactive, nextTick, toRefs } from 'vue'
import { state as userInfo } from './useUserInfo'
import { ElMessage } from 'element-plus'

import {
  roleWeightMap,
  roleToStatusMap,
  examineRoles,
  roleNameMap,
  StatusType
} from '../utils/constant'

let socket: WebSocket | null = null

export interface ExamineNotice {
  resource_type: string
  resource_id: number
  display_user_id: number
  examine_user_id: number
  from_status: StatusType
  message_type: string
  title: string
  to_status: StatusType
  received_at: number
}

const initState: {
  newExamineMessage: ExamineNotice | null,
  examineMessages: ExamineNotice[]
} = {
  newExamineMessage: null,
  examineMessages: []
}

const state = reactive(initState)

const setExamineMessage = (message: ExamineNotice) => {
  state.newExamineMessage = message
  state.examineMessages.unshift(message)
}

// ------------------------------
export const genEditUrl = (row: ExamineNotice) => {
  const { resource_type, resource_id } = row
  const host = import.meta.env.VITE_API_ENV === 'sit' ?
  'https://juicy-wscn-sit.xuangubao.cn':
  'https://juicy-wscn.wallstcn.com'

  if (resource_type === 'article') {
    return host + '/article/edit/' + resource_id
  }

  if (resource_type === 'live') {
    return host +  `/livenews/edit/${resource_id}`
  }

  if (resource_type === 'push') {
    return host + '/push/examine'
  }

  if (resource_type === 'live_reading') {
    return host + `/livenews/live-comment-edit/${resource_id}`
  }

  return host
}

const currentExamineRole = (roles: string[]) => {
  return roles.filter(role => examineRoles.indexOf(role) >= 0)
}

const couldSendExamineMessage = (to_status: StatusType, display_user_id: number) => {
  let shouldSendMessageToCheck = false
    let shouldSendMessageToAuthor = false
    // 给审核人员
    const roleToSendMessage = roleToStatusMap[to_status]
    if (typeof roleToSendMessage === 'string') {
      shouldSendMessageToCheck = currentExamineRole(userInfo.value!.roles).indexOf(roleToSendMessage) >= 0
    } else {
      shouldSendMessageToCheck = (roleToSendMessage || []).some(role => currentExamineRole(userInfo.value!.roles).indexOf(role) >= 0)
    }
    // 作者
    if (['eic_review_l1_reject', 'eic_review_l2_reject', 'eic_review_l3_reject', 'eic_review_ended_reject'].indexOf(to_status) < 0) {
      shouldSendMessageToAuthor = false
    } else {
      if (display_user_id === userInfo.value!.uid) {
        shouldSendMessageToAuthor = true
      }
    }
    return shouldSendMessageToCheck || shouldSendMessageToAuthor
}

const checkPermission = (value: any, options = { excludeAdmin: false }) => {
  if (value && value instanceof Array && value.length > 0) {
    const permissionRoles = value
    const roles = userInfo.value!.roles
    // admin 拥有所有权限
    if (roles.includes('admin') && !options.excludeAdmin) {
      return true
    }
    const hasPermission = roles.some(role => permissionRoles.includes(role))
    return hasPermission
  } else {
    throw new Error('need roles! checkPermission([\'admin\', \'user_manager\']')
  }
}

function shouldExamineNotice_MIXIN() {
  return checkPermission(
    [
      'firstcheck_modify',
      'doublecheck_modify',
      'triplecheck_modify',
      'finalcheck_modify',
      'wscn_editor',
      'live_editor'
    ],
    { excludeAdmin: true }
  )
}

// ------------------------------

const useEximineRealTimeNotice = () => {


  const createExamineNotice = () => {
    if (socket) {
      return
    }

    socket = new WebSocket(import.meta.env.VITE_NEW_REALTIME_WS + 'examine_notice')
    socket.addEventListener('message', event => {
        const message = JSON.parse(event.data).content
        message.received_at = new Date().getTime()

        const { message_type, to_status, display_user_id } = message

        const could = message_type === 'auto_write_live' ||
          couldSendExamineMessage(
            to_status,
            display_user_id
          )

        if (could) {
          setExamineMessage(message)
        }
      })

    socket.addEventListener('close', async () => {
      // 重连
      console.log('Close WebSocket')
      ElMessage.error('审核消息通知断开，请刷新浏览器')
      socket!.close()
      socket = null

      await nextTick()

      if (shouldExamineNotice_MIXIN()) {
        createExamineNotice()
      }
    })
  }

  const initEximineRealTimeNotice = () => {
    if (shouldExamineNotice_MIXIN()) {
      createExamineNotice()
    }
  }

  return {
    initEximineRealTimeNotice,
    ...toRefs(state)
  }
}

export default useEximineRealTimeNotice