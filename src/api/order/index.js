/**
 * Created by 9I
 * @Date 2021/9/16
 * @description
 */

import { getAction, postAction, putAction, uploadAction } from '@/api/manage'
import { axios } from '@/utils/request'

export const queryProductOrderList = params => getAction('/multiomics/productOrder/list', params)
export const getCatalogDepart = params => getAction('/sys/sysDepart/getCatalogDepart', params)
export const queryByOrgCodeForAddressList = params => getAction('/sys/user/queryByOrgCodeForAddressList', params)
export const getOrderStepInfo = params => getAction('/multiomics/productOrder/orderStepInfo', params)
export const getOrderInfoById = params => getAction('/multiomics/productOrder/queryById', params)
export const filishOrder = params => postAction('/multiomics/productOrder/createOrderInstance', params)
export const addOrderMedicalCase = (params, orderId) =>
  postAction('/multiomics/productOrder/orderMedicalCase/' + orderId, params)
export const addProductOrder = params => postAction('/multiomics/productOrder/add', params)
export const putProductOrder = params => putAction('/multiomics/productOrder/edit', params)
export const putOrderClinicalInfo = (orderId, params) =>
  postAction('multiomics/productOrder/orderClinicalInfo/' + orderId, params)

// 通过身份证号去寻找或者创建用户
export const lookUpMedicalCase = params =>
  getAction('/tailai-multiomics/multiomics/medicalCase/lookUpMedicalCase', params)

// 添加申请人信息
export const createOrderApplyInfo = params => postAction('/multiomics/productOrder/createOrder/applyInfo', params)

// 创建订单-添加检测项目
export const createOrderDetectInfo = params => postAction('multiomics/productOrder/createOrder/detectInfo', params)

// 创建订单-添加临床信息
export const createOrderClinicalInfo = params =>
  postAction('/tailai-multiomics/multiomics/productOrder/createOrder/clinicalInfo', params)

// 产品分组查询
export const getProductInfoList = params => getAction('/tailai-system/mission/productInfo/listByGroup', params)

// 订单实例创建（完成）
export const createOrderInstance = orderId =>
  postAction(`/tailai-multiomics/multiomics/productOrder/createOrderInstance/${orderId}`)

// 查询订单所有实例
export const getProductOrderInstanceList = id => getAction(`/tailai-multiomics/multiomics/productOrderInstance/history/${id}`)

// 查询订单进度和子订单
// export const getProductOrderInstance = id => getAction(`/tailai-multiomics/multiomics/productOrderInstance/info/${id}`)
export const getProductOrderInstance = params => getAction(`/tailai-multiomics/multiomics/productOrderInstance/info`, params)

// 订单实例重检
export const reDetectInstance = params => postAction('/tailai-multiomics/multiomics/productOrder/reDetectInstance', params)

// 查询订单进度和子订单
export function deleteTempleOrder(orderId) {
  return axios({
    url: `/tailai-multiomics/multiomics/productOrder/deleteTempleOrder/${orderId}`,
    method: 'delete'
  })
}

// 订单样本物流信息
export const getOrderSampleInfo = id => getAction(`/tailai-multiomics/multiomics/productOrder/orderSampleInfo/${id}`)

// 文件上传
export const CommonSingleUpload = params => uploadAction('mission/fileInfo/commonSingleUpload', params)

// 执行批量任务
export const startOrderImportTask = params => postAction('multiomics/orderImportTask/add', params)

// 批量任务查询
export const getOrderImportTask = params => getAction('multiomics/orderImportTask/list', params)

// 订单列表查询
export const getproductOrderOrderUserView = params => getAction('multiomics/productOrder/orderUserView', params)

// 历史编号导入
export const uploadHistoryCaseBarcode = params => postAction('/mission/codeManagement/uploadHistoryCaseBarcode', params)

// 病例列表
export const getMedicalCaseList = params => getAction('multiomics/medicalCase/list', params)


// 快速订单
// export function getUserInfo(params) {
//   return axios({
//     url: `multiomics/medicalCase/lookUpMedicalCase`,
//     method: 'get',
//     params
//   })
// }
export const getUserInfo = params => getAction('multiomics/medicalCase/lookUpMedicalCase', params)

export function getDistributor(params) {
  return axios({
    url: `mission/businessAccess/mobileFuzzyAccess`,
    method: 'get',
    params
  })
}

export function getHospital(params) {
  return axios({
    url: `mission/businessAccess/mobileFuzzyHospital`,
    method: 'get',
    params
  })
}

export function getSeller(params) {
  return axios({
    url: `sys/user/mobileFuzzySeller`,
    method: 'get',
    params
  })
}

export const checkBarcode = params => getAction('/mission/caseCode/mobileValidBarcode', params)
export const addOrder = params => postAction('multiomics/productOrder/mBookingOrder', params)
export const getOrderSingleInfo = params => getAction('/multiomics/productOrder/mOrderBookingInfo', params)
export const editSingleOrder = (orderId, params) => putAction(`/multiomics/productOrder/editOrderBookingInfo/${orderId}`, params)
export const auditOrder = params => postAction('/multiomics/productOrder/auditOrder', params)

// 获取 Template
export const getTemplate = params => postAction('/report/sampleReportResult/getTemplate', params)
