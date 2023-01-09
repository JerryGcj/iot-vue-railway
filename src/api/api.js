import { getAction,deleteAction,putAction,postAction} from '@/api/manage'

////根路径
// const doMian = "/jeecg-boot/";
////图片预览请求地址
// const imgView = "http://localhost:8080/jeecg-boot/sys/common/view/";

//角色管理
const addRole = (params)=>postAction("/sys/role/add",params);
const editRole = (params)=>putAction("/sys/role/edit",params);
// const getRoleList = (params)=>getAction("/sys/role/list",params);
// const deleteRole = (params)=>deleteAction("/sys/role/delete",params);
// const deleteRoleList = (params)=>deleteAction("/sys/role/deleteBatch",params);
const checkRoleCode = (params)=>getAction("/sys/role/checkRoleCode",params);
const queryall = (params)=>getAction("/sys/role/queryall",params);

//用户管理
const addUser = (params)=>postAction("/sys/user/add",params);
const editUser = (params)=>putAction("/sys/user/edit",params);
const queryUserRole = (params)=>getAction("/sys/user/queryUserRole",params);
const queryUserRoleQy = (params)=>getAction("/sys/user/queryUserRoleQy",params);
const getUserList = (params)=>getAction("/sys/user/list",params);
// const deleteUser = (params)=>deleteAction("/sys/user/delete",params);
// const deleteUserList = (params)=>deleteAction("/sys/user/deleteBatch",params);
const frozenBatch = (params)=>putAction("/sys/user/frozenBatch",params);

//验证用户是否存在
const checkOnlyUser = (params)=>getAction("/sys/user/checkOnlyUser",params);
//改变密码
const changPassword = (params)=>putAction("/sys/user/changPassword",params);

//权限管理
const addPermission= (params)=>postAction("/sys/permission/add",params);
const editPermission= (params)=>putAction("/sys/permission/edit",params);
const getPermissionList = (params)=>getAction("/sys/permission/list",params);
/*update_begin author:wuxianquan date:20190908 for:添加查询一级菜单和子菜单查询api */
const getSystemMenuList = (params)=>getAction("/sys/permission/getSystemMenuList",params);
const getSystemSubmenu = (params)=>getAction("/sys/permission/getSystemSubmenu",params);
/*update_end author:wuxianquan date:20190908 for:添加查询一级菜单和子菜单查询api */

// const deletePermission = (params)=>deleteAction("/sys/permission/delete",params);
// const deletePermissionList = (params)=>deleteAction("/sys/permission/deleteBatch",params);
const queryTreeList = (params)=>getAction("/sys/permission/queryTreeList",params);
const queryTreeListForRole = (params)=>getAction("/sys/role/queryTreeList",params);
const queryListAsync = (params)=>getAction("/sys/permission/queryListAsync",params);
const queryRolePermission = (params)=>getAction("/sys/permission/queryRolePermission",params);
const saveRolePermission = (params)=>postAction("/sys/permission/saveRolePermission",params);
//const queryPermissionsByUser = (params)=>getAction("/sys/permission/queryByUser",params);
const queryPermissionsByUser = (params)=>getAction("/sys/permission/getUserPermissionByToken",params);
const loadAllRoleIds = (params)=>getAction("/sys/permission/loadAllRoleIds",params);
const getPermissionRuleList = (params)=>getAction("/sys/permission/getPermRuleListByPermId",params);
const queryPermissionRule = (params)=>getAction("/sys/permission/queryPermissionRule",params);

// 部门管理
const queryDepartTreeList = (params)=>getAction("/sys/sysDepart/queryTreeList",params);
const queryIdTree = (params)=>getAction("/sys/sysDepart/queryIdTree",params);
const queryParentName   = (params)=>getAction("/sys/sysDepart/queryParentName",params);
const searchByKeywords   = (params)=>getAction("/sys/sysDepart/searchBy",params);
const deleteByDepartId   = (params)=>deleteAction("/sys/sysDepart/delete",params);

//日志管理
//const getLogList = (params)=>getAction("/sys/log/list",params);
const deleteLog = (params)=>deleteAction("/sys/log/delete",params);
const deleteLogList = (params)=>deleteAction("/sys/log/deleteBatch",params);

//数据字典
const addDict = (params)=>postAction("/sys/dict/add",params);
const editDict = (params)=>putAction("/sys/dict/edit",params);
//const getDictList = (params)=>getAction("/sys/dict/list",params);
const treeList = (params)=>getAction("/sys/dict/treeList",params);
// const delDict = (params)=>deleteAction("/sys/dict/delete",params);
//const getDictItemList = (params)=>getAction("/sys/dictItem/list",params);
const addDictItem = (params)=>postAction("/sys/dictItem/add",params);
const editDictItem = (params)=>putAction("/sys/dictItem/edit",params);
//const delDictItem = (params)=>deleteAction("/sys/dictItem/delete",params);
//const delDictItemList = (params)=>deleteAction("/sys/dictItem/deleteBatch",params);

//字典标签专用（通过code获取字典数组）
export const ajaxGetDictItems = (code, params)=>getAction(`/sys/dict/getDictItems/${code}`,params);

//系统通告
const doReleaseData = (params)=>getAction("/sys/annountCement/doReleaseData",params);
const doReovkeData = (params)=>getAction("/sys/annountCement/doReovkeData",params);
//获取系统访问量
const getLoginfo = (params)=>getAction("/sys/loginfo",params);
const getVisitInfo = (params)=>getAction("/sys/visitInfo",params);
//数据日志访问
// const getDataLogList = (params)=>getAction("/sys/dataLog/list",params);

// 根据部门主键查询用户信息
const queryUserByDepId = (params)=>getAction("/sys/user/queryUserByDepId",params);

// 查询用户角色表里的所有信息
const queryUserRoleMap = (params)=>getAction("/sys/user/queryUserRoleMap",params);
// 重复校验
const duplicateCheck = (params)=>getAction("/sys/duplicate/check",params);
// 加载分类字典
const loadCategoryData = (params)=>getAction("/sys/category/loadAllData",params);


//获取可用的代理商
const queryAgent = (params)=>getAction("/agent/agent/getAgentList",params);

//获取可用的合伙人
const queryPartner = (params)=>getAction("/sys/user/queryPartner",params);

//套餐批量上下架
const hanleOnBatch = (params)=>putAction("/standardcost/standardCost/hanleOnBatch",params);

//获取可用的运营商
const queryOperator = (params)=>getAction("/iotoperator/iotOperator/queryOperator",params);

//获取标准资费列表
const queryStandardcost = (params)=>getAction("/discountpackage/discountPackage/queryStandardcost",params);

//根据id获取标准资费列表
const queryStandardcostById = (params)=>getAction("/discountpackage/discountPackage/queryStandardcostById",params);

//获取下级代理列表
const queryLowerAgent = (params)=>getAction("/sys/user/queryLowerAgent",params);

//根据运营商获取折扣套餐
const queryDiscountPackageByOperator = (params)=>getAction("/customersalesdiscount/customerSalesDiscount/queryDiscountPackageByOperator",params);

//根据运营商获取套餐
const queryPackage = (params)=>getAction("/flowpool/flowPool/queryPackage",params);
//实名制详情查看
const queryDetails = (params)=>getAction("/realname/realNameSystem/queryDetails",params);
//补卡订单失败处理操作
const hanleOnFail = (params)=>putAction("/repaircardorder/repairCardOrder/hanleFail",params);

const cardDistribution = (params)=>getAction("/cardinformation/cardInformation/cardDistribution",params);
//卡状态变更
const stateUpdate = (params)=>getAction("/cardinformation/cardInformation/stateUpdate",params);
//卡同步变更
const cardSynchronization = (params)=>getAction("/cardinformation/cardInformation/cardSynchronization",params);
//代理是否可复机
const agentStopMachine = (params)=>getAction("/cardinformation/cardInformation/agentStopMachine",params);

//设置流量使用比例
const customPackageUse = (params)=>postAction("/cardinformation/cardInformation/customPackageUse",params);

const customUnicomPackageUse = (params)=>postAction("/unicomcardinformation/unicomCardInformation/customPackageUse",params);

const customTelecomPackageUse = (params)=>postAction("/telecomcardinformation/telecomCardInformation/customPackageUse",params);

//设置自动停复机
const automaticStopResetMachine = (params)=>getAction("/cardinformation/cardInformation/automaticStopResetMachine",params);

//设置是否需要实名认证
const isRealNameAuthentication = (params)=>getAction("/cardinformation/cardInformation/isRealNameAuthentication",params);

//卡导入
const cardImportExcel = (params)=>getAction("/cardinformation/cardInformation/cardImportExcel",params);

//获取标准资费列表
const queryDiscountPackage = (params)=>getAction("/discountpackage/discountPackage/queryDiscountPackage",params);
//获取联通标准资费列表
const queryUnicomPackage = (params)=>getAction("/discountpackage/discountPackage/queryUnicomPackage",params);

//刷新卡信息
const cardDataUpdate= (params)=>getAction("/cardinformation/cardInformation/cardDataUpdate",params);
const unicomCardDataUpdate= (params)=>getAction("/unicomcardinformation/unicomCardInformation/cardDataUpdate",params);

//根据条件配置的套餐
const getRefCardCostByCardId= (params)=>getAction("/refcardcost/refCardCost/getRefCardCostByCardId",params);

const getUnicomRefCardCostByCardId= (params)=>getAction("/unicomrefcardcost/unicomRefCardCost/getRefCardCostByCardId",params);
export {
  // imgView,
  // doMian,
  addRole,
  editRole,
  checkRoleCode,
  addUser,
  editUser,
  queryUserRole,
  getUserList,
  queryall,
  frozenBatch,
  checkOnlyUser,
  changPassword,
  getPermissionList,
  addPermission,
  editPermission,
  queryTreeList,
  queryListAsync,
  queryRolePermission,
  saveRolePermission,
  queryPermissionsByUser,
  loadAllRoleIds,
  getPermissionRuleList,
  queryPermissionRule,
  queryDepartTreeList,
  queryIdTree,
  queryParentName,
  searchByKeywords,
  deleteByDepartId,
  deleteLog,
  deleteLogList,
  addDict,
  editDict,
  treeList,
  addDictItem,
  editDictItem,
  doReleaseData,
  doReovkeData,
  getLoginfo,
  getVisitInfo,
  queryUserByDepId,
  queryUserRoleMap,
  duplicateCheck,
  queryTreeListForRole,
  getSystemMenuList,
  getSystemSubmenu,
  loadCategoryData,
  queryAgent,
  queryPartner,
  hanleOnBatch,
  queryOperator,
  queryStandardcost,
  queryLowerAgent,
  queryDiscountPackageByOperator,
  queryPackage,
  queryDetails,
  hanleOnFail,
  cardDistribution,
  stateUpdate,
  cardSynchronization,
  agentStopMachine,
  customPackageUse,
  automaticStopResetMachine,
  isRealNameAuthentication,
  cardImportExcel,
  queryDiscountPackage,
  cardDataUpdate,
  queryStandardcostById,
  getRefCardCostByCardId,
  getUnicomRefCardCostByCardId,
  customUnicomPackageUse,
  unicomCardDataUpdate,
  queryUnicomPackage,
  queryUserRoleQy,
  customTelecomPackageUse
}



