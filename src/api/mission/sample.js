/**
 * Created by 9I
 * @Date 2021/4/8
 * @description
 */
const prefix = '/mission/codeManagement'

const api = {
  list: prefix + '/list',
  detail: prefix + '/queryById',
  add: prefix + '/add',
  put: prefix + '/edit',
  deleteBatch: prefix + '/deleteBatch',
  delete: prefix + '/delete',
  exportXlsUrl: prefix + '/exportXls',
  importExcelUrl: prefix + '/importExcelUrl'
}

export default api