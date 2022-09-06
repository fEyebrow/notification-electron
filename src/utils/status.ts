// status
export const statusOptions = {
  default: [
    { key: 'published', type: 'success', label: '已发布' },
    { key: 'deleted', type: 'danger', label: '已删除' },
    { key: 'draft', type: '', class: 'gray-tag', label: '草稿中' }
  ],
  article: [
    { key: 'published', type: 'success', label: '已发布' },
    { key: 'deleted', type: 'danger', label: '已删除' },
    { key: '0610', type: '', label: '已封存' },
    { key: 'draft', type: '', class: 'gray-tag', label: '草稿中' },
    { key: 'eic_review_l1', type: '', class: 'warning-tag-l1', label: '一级审核中' },
    { key: 'eic_review_l2', type: '', class: 'warning-tag-l2', label: '二级审核中' },
    { key: 'eic_review_l3', type: '', class: 'warning-tag-l3', label: '三级审核中' },
    { key: 'eic_review_ended', type: '', class: 'warning-tag-l4', label: '终极审核中' },
    { key: 'eic_review_l1_reject', type: '', class: 'danger-tag-l1', label: '一级审核驳回' },
    { key: 'eic_review_l2_reject', type: '', class: 'danger-tag-l1', label: '二级审核驳回' },
    { key: 'eic_review_l3_reject', type: '', class: 'danger-tag-l1', label: '三级审核驳回' },
    { key: 'eic_review_ended_reject', type: '', class: 'danger-tag-l1', label: '终极审核驳回' }
  ],
  comment: [
    { key: 'default', type: 'success', label: '正常' },
    { key: 'deleted_admin', type: 'danger', label: '已删除(admin)' },
    { key: 'deleted_user', type: 'danger', label: '已删除(user)' },
    { key: 'pending', type: '', class: 'dark-tag', label: '待审核' },
    { key: 'pending_reviewed', type: '', class: 'blue-tag', label: '待定' }
  ]
}

const statusMap: Record<string, any> = {}
type statusOptionsType = keyof typeof statusOptions
Object.keys(statusOptions).forEach((type) => {
  statusOptions[type as statusOptionsType].forEach(item => {
    statusMap[item.key] = item
  })
})

export function statusFilter(status: string) {
  if (!status) return ''
  const s = status.toLocaleLowerCase()
  if (s && statusMap[s]) {
    return statusMap[s]
  }
  return { type: 'warning', label: '未知' }
}
