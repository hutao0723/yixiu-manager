
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

