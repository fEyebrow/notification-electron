export const roleWeightMap = {
  firstcheck_modify: 0,
  doublecheck_modify: 1,
  triplecheck_modify: 2,
  finalcheck_modify: 3
}

export const roleNameMap = {
  firstcheck_modify: '一审',
  doublecheck_modify: '二审',
  triplecheck_modify: '三审',
  finalcheck_modify: '终审'
}

export const roleToStatusMap = {
  eic_review_l1: 'firstcheck_modify',
  eic_review_l2: 'doublecheck_modify',
  eic_review_l3: 'triplecheck_modify',
  eic_review_ended: 'finalcheck_modify',
  eic_review_l2_reject: ['firstcheck_modify'],
  eic_review_l3_reject: ['firstcheck_modify', 'doublecheck_modify'],
  eic_review_ended_reject: ['firstcheck_modify', 'doublecheck_modify', 'triplecheck_modify']
}

export type StatusType = keyof (typeof roleToStatusMap)

export const examineRoles = ['firstcheck_modify', 'doublecheck_modify', 'triplecheck_modify', 'finalcheck_modify']

export const resouceMap = {
  article: '文章',
  live: '快讯',
  push: '推送',
}

export type ResourceType = keyof (typeof resouceMap)
