<script setup lang="ts">
  import { computed } from 'vue'
  import { StatusType } from '../utils/constant'
  import { state } from '../hook/useUserInfo'
  import type { ReviewPayload } from './ReviewStatus'

  const roles = state.value!.roles

  const { status } = withDefaults(
    defineProps<{ status: StatusType, size?: string, loading?: boolean }>(),
    {
      status: 'draft',
      size: 'small',
      loading: false
    }
  )

  const emit = defineEmits<{
    (e: 'review', value: ReviewPayload): void
  }>()

  const hasPermission = computed(() => {
    if (status === 'draft') {
      return true
    }

    if (status === 'eic_review_l1') {
        return roles.includes('firstcheck_modify') || roles.includes('doublecheck_modify') || roles.includes('triplecheck_modify') || roles.includes('finalcheck_modify')
          || roles.includes('triplecheck__modify') || roles.includes('finalcheck__modify')
      } else if (status === 'eic_review_l2') {
        return roles.includes('doublecheck_modify') || roles.includes('triplecheck_modify') || roles.includes('finalcheck_modify')
          || roles.includes('triplecheck__modify') || roles.includes('finalcheck__modify')
      } else if (status === 'eic_review_l3') {
        return roles.includes('triplecheck_modify') || roles.includes('finalcheck_modify')
          || roles.includes('triplecheck__modify') || roles.includes('finalcheck__modify')
      } else if (status === 'eic_review_ended') {
        return roles.includes('finalcheck_modify') || roles.includes('finalcheck__modify')
      } else {
        return undefined
      }
  })

  const canReject = computed(() => {
    return status !== 'draft' && status !== 'published' && status !== 'deleted' && status.indexOf('reject') === -1
  })

  const handlePass = () => {
    const payload: ReviewPayload= {
      status: 'published',
      examine_operate:{
        from_status: 'eic_review_l3',
        to_status: 'published'
      }
    }
    if (status === 'published') {
      payload.status = 'draft'
      payload.examine_operate = {
        from_status: 'published',
        to_status: 'draft'
      }
    } else if (status === 'draft' || status.indexOf('reject') >= 0) {
      payload.status = 'eic_review_l1'
      payload.examine_operate = {
        from_status: 'draft',
        to_status: 'eic_review_l1'
      }
    } else if (status === 'eic_review_l1') {
      payload.status = 'eic_review_l2'
      payload.examine_operate = {
        from_status: 'eic_review_l1',
        to_status: 'eic_review_l2'
      }
    } else if (status === 'eic_review_l2') {
      payload.status = 'eic_review_l3'
      payload.examine_operate = {
        from_status: 'eic_review_l2',
        to_status: 'eic_review_l3'
      }
    }

    emit('review', payload)
  }

  const handleNoPass = () => {
    const payload: ReviewPayload = {
      status: 'eic_review_l3_reject',
      examine_operate: {
        from_status: 'eic_review_l3',
        to_status: 'eic_review_l3_reject'
      }
    }

    if (status === 'eic_review_l1') {
      payload.status = 'eic_review_l1_reject'
      payload.examine_operate = {
        from_status: 'eic_review_l1',
        to_status: 'eic_review_l1_reject'
      }
    } else if (status === 'eic_review_l2') {
      payload.status = 'eic_review_l2_reject'
      payload.examine_operate = {
        from_status: 'eic_review_l2',
        to_status: 'eic_review_l2_reject'
      }
    }

    emit('review', payload)
  }


  const buttonText = (status: StatusType): { key: StatusType, type: string, label: string } => {
    const map = [{ key: 'published', type: 'success', label: '已发布' },
      { key: 'deleted', type: '', label: '已删除' },
      { key: 'eic_review_l1', type: 'success', label: '一审通过' },
      { key: 'eic_review_l2', type: 'success', label: '二审通过' },
      { key: 'eic_review_l3', type: 'success', label: '三审通过' },
      { key: 'eic_review_ended', type: 'success', label: '终审通过' },
      { key: 'draft', type: 'success', label: '送审' },
      { key: 'eic_review_l1_reject', type: 'success', label: '点击重新提审' },
      { key: 'eic_review_l2_reject', type: 'success', label: '点击重新提审' },
      { key: 'eic_review_l3_reject', type: 'success', label: '点击重新提审' },
      { key: 'eic_review_ended_reject', type: 'success', label: '点击重新提审' }]
    // console.log(map.find(item => item.key === status))
    return map.find(item => item.key === status) as  { key: StatusType, type: string, label: string }
  }

  </script>

  <template>
    <span v-if="hasPermission" >
      <el-button v-if="canReject" :loading="loading" :size="size" type="danger" @click="handleNoPass">驳回</el-button>
      <el-button v-if="status.indexOf('reject') < 0" :loading="loading" :size="size" :type="buttonText(status).type" @click="handlePass">{{ buttonText(status).label }}</el-button>
    </span>
    <!-- 若被驳回状态，可重新提审 -->
    <el-button v-if="status.indexOf('reject') >= 0" :loading="loading" :size="size" :type="buttonText(status).type" @click="handlePass">{{ buttonText(status).label }}</el-button>
    <el-button v-if="status === 'published'" :loading="loading" :size="size" type="warning" @click="handlePass">草稿</el-button>

  </template>

  <style scoped>

  </style>
