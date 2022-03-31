import { getAction, postAction, putAction, deleteAction } from '@/api/manage'

// 新增出库模版
export const addMaterialList = params => postAction('/mission/customMaterialPlan/add', params)

// 通过 id 查询
export const queryMaterialPlan = params => getAction('mission/customMaterialPlan/queryById', params)

// 通过 id 删除
export const delMaterialPlan = params => deleteAction('mission/customMaterialPlan/delete', params)

// 编辑/更新
export const updateMaterialPlan = params => putAction('mission/customMaterialPlan/edit', params)

// 获取模版列表
export const getMaterialPlanList = params => getAction('mission/customMaterialPlan/list', params)

// 获取地址列表
export const getAddressList = params => getAction('tailai-system/mission/addressInfo/list', params)

// 查询销售人员列表
export const queryRoleUsers = params => getAction('/tailai-system/sys/user/queryRoleUsers', params)

// 查询病例编号
export const queryCaseCode = params => getAction('/tailai-system/mission/caseCode/list', params)

// export const getCatalogDepart = params => getAction('/sys/sysDepart/getCatalogDepart', params)
// export const queryByOrgCodeForAddressList = params => getAction('/sys/user/queryByOrgCodeForAddressList', params)
// export const getOrderStepInfo = params => getAction('/multiomics/productOrder/orderStepInfo', params)
// export const filishOrder = params => postAction('/multiomics/productOrder/createOrderInstance', params)
// export const addOrderMedicalCase = (params, orderId) =>
//   postAction('/multiomics/productOrder/orderMedicalCase/' + orderId, params)
// export const addProductOrder = params => postAction('/multiomics/productOrder/add', params)
// export const putProductOrder = params => putAction('/multiomics/productOrder/edit', params)
