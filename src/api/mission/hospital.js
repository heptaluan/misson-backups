/**
 * Created by 9I
 * @Date 2021/4/8
 * @description
 */
import { axios } from '@/utils/request'
const prefix = '/mission/hospitalInfo'

const api = {
  list: prefix + '/list',
  detail: prefix + '/queryById',
  add: prefix + '/add',
  put: prefix + '/edit',
  deleteBatch: prefix + '/deleteBatch',
  delete: prefix + '/delete',
  exportXlsUrl: prefix + '/exportXls',
  importExcelUrl: prefix + '/importExcelUrl',
  getRegions: '/system/syRegions/list'
}

export default api

export function getHospitalList(parameter) {
  return axios({
    url: api.list,
    method: 'get',
    params: parameter
  })
}

export function getHospitalById(parameter) {
  return axios({
    url: api.detail,
    method: 'get',
    params: parameter
  })
}

export function addHospital(parameter) {
  return axios({
    url: api.add,
    method: 'post',
    data: parameter
  })
}

export function putHospital(parameter) {
  return axios({
    url: api.put,
    method: 'put',
    data: parameter
  })
}

export function delHospital(parameter) {
  return axios({
    url: api.delete,
    method: 'delete',
    params: parameter
  })
}

export function delBatchHospital(parameter) {
  return axios({
    url: api.deleteBatch,
    method: 'delete',
    params: parameter
  })
}