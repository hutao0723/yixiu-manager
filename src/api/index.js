
import { get, post } from './config';

/**
 * 课程相关接口
 */
//新增课程
export const addCourse = params => post('course/add', params);
//依据id删除课程
export const deleteCourse = params => post('course/delete', params);
//修改课程基本信息
export const updateCourse = params => post('course/update', params);
//依据id查询课程信息
export const getCourse = params => get('course/get', params);
//分页查询课程信息
export const pageListCourse = params => get('course/pageList', params);
//修改课程状态
export const updateStatusCourse = params => post('course/updateStatus', params);


/**
 * 专栏相关接口
 */

//查询专栏对应的课程
export const getLinkCourse = params => get('column/getCoursesById', params);
//修改专栏状态
export const updateStatusColumn = params => post('column/updateStatus', params);
//分页查询专栏信息
export const pageListColumn = params => get('column/pageList', params);
//依据id查询专栏信息
export const getColumn = params => get('column/get', params);
//修改专栏基本信息
export const updateColumn = params => post('column/update', params);
//依据id删除专栏
export const deleteColumn = params => post('column/delete', params);
//新增专栏
export const addColumn = params => post('column/add', params);
//移除课程
export const removeColumn = params => post('column/course/remove', params);
//设为试看
export const updateWatchStatus = params => post('column/course/updateWatchStatus', params);
//关联课程
export const relateCourse = params => post('column/course/relate', params);
//分页查询课程信息
export const coursePageList = params => get('column/course/pageList', params);
//排序
export const courseSort = params => post('column/course/sort', params);


/**
 * 讲师相关接口
 */
//讲师列表
export const lecturerList = params => get('lecturer/getList', params);

/**
 * 公共接口
 */
//获取文件上传的签名信息
export const getDirectTransmissionSign = params => get('upload/getDirectTransmissionSign', params);
export const getCdnFileUrl = params => get('upload/getCdnFileUrl', params);

/**
 * 海报相关接口
 */

//根据id删除海报
export const removePoster = params => post('poster/delete', params);
//新增海报
export const addPoster = params => post('poster/add', params);

/*
*模板相关接口
*/

//根据公众号id查询模板数据列表
export const templateList = params => get('authorizerMpTemplate/list', params);
//根据模板id查询模板数据详情
export const templateDetail = params => get('authorizerMpTemplate/details', params);

/*
*分销人员相关接口
*/
//分页查询分销详情
export const getUserDistributionList = params => get('distributor/userDistribution/pageList', params);

/*
*优惠券相关接口
*/
//获取母版列表
export const parentEditionList = params => get('coupon/template/page', params);
//查询阅读计划集合,适用于阅读计划下拉框
export const readList = params => get('read/list', params);
//复制优惠券母版
export const copyTemplate = params => post('coupon/template/copy', params);
//保存优惠券母版
export const saveTemplate = params => post('coupon/template/save', params);
//修改优惠券母版状态
export const updateStatusTemplate = params => post('coupon/template/updateStatus', params);
//删除优惠券母版
export const deleteTemplate = params => post('coupon/template/delete', params);
//获取已发券列表
export const voucherList = params => get('coupon/info/page', params);
//导出优惠券
export const exportVoucher = params => get('coupon/export', params);
//获取母版详情
export const couponTemplateDetail = params => get('coupon/template/get', params);

/*
*发券活动相关接口
*/
//获取活动列表
export const voucherActivitiesList = params => get('activity/pageList', params);
//修改活动状态
export const updateStatusActivity = params => post('activity/updateStatus', params);
//删除活动
export const deleteActivity = params => post('activity/delete', params);
//复制活动
export const copyActivity = params => post('activity/copy', params);