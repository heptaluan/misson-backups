/**
 * Created by 9I
 * @Date 2021/4/8
 * @description
 */
import { getAction, postAction, putAction, uploadAction} from '@/api/manage'
const prefix = '/mission/projectInfo'

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

export const queryOwnershipType = (params) => getAction('/mission/fileInfo/list', params)
export const queryGroup = (params) => getAction('/mission/projectGroup/list', params)
export const queryChargePeople = (params) => getAction('/mission/contactManage/list', params)
export const queryCooperationAgency = (params) => getAction('/mission/cooperationAgency/list', params)
export const queryProjectCooperationAgency = (params) => postAction('/mission/cooperationAgency/queryProject', params)
// export const queryProjectCooperationAgency = (params) => getAction('/sys/sysDepart/listCooperationUnit', params)
export const queryFileList = (params) => getAction('/mission/fileInfo/list', params)
export const queryByIdStockIn = (params) => getAction('/mission/materialManagement/stock/applyDetail/list', params)

// 文件上传
export const uploadFile = (params) => uploadAction('/mission/fileInfo/add', params)

// ================================================= 新建项目

// 项目合作关系添加
export const addProjectCooperation = (params) => postAction('/mission/cooperationAgency/project', params)

// 新建项目保存
export const putProjectStep = (step, params) => putAction(`/mission/projectInfo/${step}/info`, params)

// 项目基本信息管理-通过id查询
export const queryById = (params) => getAction('/mission/projectInfo/queryById', params)

// 项目-分页列表查询
export const querypProjectInfo = (params) => getAction('/mission/projectInfo/list', params)

// 项目样本管理-通过项目id查询
export const getProjectSample = (params) => getAction('/mission/projectSample/project', params)

// 项目样本管理-添加
export const addProjectSample = (params) => postAction('/mission/projectSample/add', params)

// 项目合作单位查询
export const queryProject = (params) => postAction('/mission/cooperationAgency/queryProject', params)

// 项目耗材管理-分页列表查询
export const getProjectMaterialList = (params) => getAction('/mission/projectMaterial/list', params)

// 项目每人份耗材管理-分页查询
export const getProjectMaterialPlanList = (params) => getAction('/mission/projectMaterial/plan/list', params)

// ================================================= 耗材管理

// 耗材出入库-申请出库
export const leaveApply = (params) => postAction('/mission/materialManagement/stock/leaveApply', params)

// 耗材出入库-查看出入库申请单详情
export const applyDetail = (params) => getAction('/mission/materialManagement/stock/applyDetail/list', params)

// 耗材出入库-申请入库
export const stockComeApply = (params) => postAction('/mission/materialManagement/stock/comeApply', params)

// 耗材出入库-出入库申请表审批
export const approve = (params) => postAction('/mission/materialManagement/stock/apply/approve', params)

// 审核
export const submit = (params) => postAction('/mission/materialManagement/stock/apply/submit', params)

// ================================================= 样本管理

// 文件管理-分页列表查询
export const getFileInfoList = (params) => getAction('/mission/fileInfo/list', params)

// 病例样本入库-新增样本入库（文件上传）
export const addStockApply = (params) => postAction('/tailai-system/mission/caseSample/stockApply/add', params)

// 病例样本检测-上传检测报告（文件上传）
export const caseSampleDetect = (params) => postAction('/mission/caseSample/detect', params)

// 样本入库单对应的审计报告-通过入库单id查询
export const getStockApplyQc = (params) => getAction('/mission/caseSample/stockApply/qc', params)

// 病例单个样本-qc
export const caseSampleQc = (params) => postAction('/mission/caseSample/qc', params)

// 病例单个样本-qc
export const putStockApplyQc = (params) => putAction(`/mission/caseSample/stockApply/qc`, params)

// 样本QC-质检结束
export const finishStockApplyQc = (params) => getAction(`/mission/caseSample/stockApply/qc/finish`, params)

// 病例样本信息-分页列表查询
export const getCaseSampleList = (params) => getAction('/mission/caseSample/list', params)

// 病例样本入库-入库单分页列表查询
export const getStockApplyList = (params) => getAction('/mission/caseSample/stockApply/list', params)

// 病例样本信息-查询原始数据
export const getCaseSampleOrigin = (params) => getAction('/mission/caseSample/origin', params)

// 病例样本信息-查询原始数据
export const putCaseSampleEdit = (params) => putAction('/mission/caseSample/edit', params)


// ======================= 新增

// 样本管理-查看质控报告
export const qcBrief = (params) => getAction(`/tailai-system/mission/caseSample/stockApply/qcBrief/${params}`)

// 病例样本信息-分页列表查询
export const getCaseSampleListById = (params) => getAction(`/tailai-system/mission/caseSample/list`, params)

// 反馈质控结果
export const stockApplyFeedback = (params) => putAction('/tailai-system/mission/caseSample/stockApply/feedback', params)

// ================================================= 编号管理

// 样本编号详情管理-分页列表查询
export const getSampleBarcodeList = (params) => getAction('/mission/codeManagement/sampleBarcode/list', params)

// 历史编号导入
export const getCaseBarcodeList = (params) => getAction('/mission/codeManagement/caseBarcode/list', params)

// 文件管理-通过id下载
export const downloadFileInfo = (params) => getAction('/mission/fileInfo/download', params)

// ================================================= 用户列表

// 获取用户列表数据
export const getUserList = (params) => postAction('/sys/user/listByTailai', params)

// 获取合作单位列表
export const getCooperationUnitList = (params) => getAction('/sys/sysDepart/listCooperationUnit', params)

// 根据部门id查询用户信息
export const queryUserByDepId = (params) => getAction('/sys/user/queryUserByDepId', params)

// 质检
export const getAuthForQc = () => getAction('/sys/sysDepart/isQCHead')
// 入库审核权限
export const getAuthForTest = ()=> getAction('/sys/sysDepart/isTestingHead')


export default api