import { getAction, postAction, putAction, uploadAction } from '@/api/manage'

// 分配医生
export const setDoctor = params => postAction(`/tailai-report/report/image/setDoctor`, params)

// 一键分配
export const setDoctorUpdate = params => postAction(`/tailai-report/report/image/update`, params)

// 获取角色
export const getDoctorList = params => getAction(`/tailai-system/sys/user/queryRoleUsers`, params)

// 获取影像校验列表
export const getDnResultList = (type, params) => getAction(`/report/image/${type}`, params)

// 新增影像校验包
export const addDoctorTask = params => postAction(`/report/doctorTask/add`, params)

// 获取包详情
export const getPackageDetail = params => getAction(`/report/doctorTask/packageDetail`, params)

// 获取包列表
export const getReportDoctorList = params => getAction(`/report/doctorTask/list`, params)

// 医生已检阅未检阅列表
export const getDoctorTaskList = params => getAction(`/report/doctorTask/taskList`, params)

// 已检阅列表
export const getTaskCheckList = params => getAction(`/report/doctorTask/taskCheckList`, params)

// 未检阅列表
export const getTaskUnCheckList = params => getAction(`/report/doctorTask/taskUnCheckList`, params)

