/**
 * Created by 9I
 * @Date 2021/9/16
 * @description
 */

import { getAction, postAction, putAction, uploadAction } from '@/api/manage'
import { axios } from '@/utils/request'

export const queryProductOrderList = (params) => getAction('/multiomics/productOrder/list', params)
export const getCatalogDepart = (params) => getAction('/sys/sysDepart/getCatalogDepart', params)
export const queryByOrgCodeForAddressList = (params) => getAction('/sys/user/queryByOrgCodeForAddressList', params)
export const getOrderStepInfo = (params) => getAction('/multiomics/productOrder/orderStepInfo', params)
export const getOrderInfoById = (params) => getAction('/multiomics/productOrder/queryById', params)
export const filishOrder = (params) => postAction('/multiomics/productOrder/createOrderInstance', params)
export const addOrderMedicalCase = (params, orderId) =>
  postAction('/multiomics/productOrder/orderMedicalCase/' + orderId, params)
export const addProductOrder = (params) => postAction('/multiomics/productOrder/add', params)
export const putProductOrder = (params) => putAction('/multiomics/productOrder/edit', params)
export const putOrderClinicalInfo = (orderId, params) =>
  postAction('multiomics/productOrder/orderClinicalInfo/' + orderId, params)

// 通过身份证号去寻找或者创建用户
export const lookUpMedicalCase = (params) =>
  getAction('/tailai-multiomics/multiomics/medicalCase/lookUpMedicalCase', params)

// 添加申请人信息
export const createOrderApplyInfo = (params) => postAction('/multiomics/productOrder/createOrder/applyInfo', params)

// 创建订单-添加检测项目
export const createOrderDetectInfo = (params) => postAction('multiomics/productOrder/createOrder/detectInfo', params)

// 创建订单-添加临床信息
export const createOrderClinicalInfo = (params) =>
  postAction('/tailai-multiomics/multiomics/productOrder/createOrder/clinicalInfo', params)

// 产品分组查询
export const getProductInfoList = (params) => getAction('/tailai-system/mission/productInfo/listByGroup', params)

// 订单实例创建（完成）
export const createOrderInstance = (orderId) =>
  postAction(`/tailai-multiomics/multiomics/productOrder/createOrderInstance/${orderId}`)

// 查询订单进度和子订单
export const getProductOrderInstance = (id) =>
  getAction(`/tailai-multiomics/multiomics/productOrderInstance/info/${id}`)

// 查询订单进度和子订单
export function deleteTempleOrder(orderId) {
  return axios({
    url: `/tailai-multiomics/multiomics/productOrder/deleteTempleOrder/${orderId}`,
    method: 'delete',
  })
}

// 订单样本物流信息
export const getOrderSampleInfo = (id) => getAction(`/tailai-multiomics/multiomics/productOrder/orderSampleInfo/${id}`)

// 文件上传
export const CommonSingleUpload = (params) => uploadAction('mission/fileInfo/commonSingleUpload', params)

// 执行批量任务
export const startOrderImportTask = (params) => postAction('multiomics/orderImportTask/add', params)

// 订单列表查询
export const getproductOrderOorderUserView = (params) => getAction('multiomics/productOrder/orderUserView', params)

// 历史编号导入
export const uploadHistoryCaseBarcode = (params) =>
  postAction('/mission/codeManagement/uploadHistoryCaseBarcode', params)
