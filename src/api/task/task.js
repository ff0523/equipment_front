import request from '@/utils/request'

/**
 * 获取任务数据
 * @param {页码} page 
 * @param {查询参数} equipmentID 设备id
 */
 export function getTasks(page,pageSize,equipmentID) {
    return request({
      url: '/task/info?page='+(page-1)+"&size="+pageSize+"&equipmentID="+equipmentID+"&equipmentID-op=in",
      method: 'get'
    })
  }

 /**
 * 获取排序好的数据
 * @param {页码} page 
 * @param {查询参数} equipmentID 设备id
 */
  export function getSortedTasks(equipmentID) {
    return request({
      url: '/task/sortedtask?machineId='+equipmentID,
      method: 'get'
    })
  } 


   /**
 * 置顶一个任务
 * @param {设备id} equipmentID 
 * @param {任务id} taskID
 */
    export function topestTask(equipmentID,taskID) {
        return request({
          url: '/task/topest?machineId='+equipmentID+"&id="+taskID,
          method: 'get'
        })
      } 



         /**
 * 上移一个任务
 * @param {设备id} equipmentID 
 * @param {任务id} taskID
 */
    export function upTask(equipmentID,taskID) {
        return request({
          url: '/task/uptask?machineId='+equipmentID+"&id="+taskID,
          method: 'get'
        })
      } 
               /**
 * 下移一个任务
 * @param {设备id} equipmentID 
 * @param {任务id} taskID
 */
    export function downTask(equipmentID,taskID) {
        return request({
          url: '/task/downtask?machineId='+equipmentID+"&id="+taskID,
          method: 'get'
        })
      } 
/**
 *新增一个任务
 * @param {设备id} equipmentID 
 * @param {委托编号} sampleNo
 * @param {beforeid} beforeid
 */
    export function addTask(equipmentID,beforeid,info) {
        return request({
          url: '/task/addtask?equipmentID='+equipmentID+"&beforeid="+beforeid+"&info="+info,
          method: 'get'
        })
      } 
/**
 *删除一个任务
 * @param {任务id} id 
 */
 export function deleteTask(taskid) {
    return request({
      url: '/task/deletetask?taskid='+taskid,
      method: 'get'
    })
  } 

/**
 *修改一个任务
 * @param {任务id} id 
 */
 export function updateTask(taskid,planTime) {
  return request({
    url: '/task/updateTask?taskid='+taskid + '&planTime='+planTime,
    method: 'get'
  })
} 
   /**
   * 获取首页展示的任务数据
   * @param {页码} page 
   * @param {查询参数} equipmentID 设备id
   */
    export function getIndexSortedTasks(select,searchString) {
      return request({
        url: '/task/indexsortedtasks?select='+select+'&searchString='+searchString,
        method: 'get'
      })
    } 

/**
 * 获取我的委托展示的数据
 * @param {查询参数} sampleNo 委托编号
 * @param {查询参数} equipmentID 设备id
 * @param {查询参数} client 委托人
 * @param {查询参数} tester 试验人
 */
export function getMyIndexSortedTasks(sampleNo,equipmentID,client,tester) {
  return request({
    url: '/task/myIndexsortedtasks?sampleNo='+sampleNo+'&equipmentID='+equipmentID+'&client='+client+'&tester='+tester,
    method: 'get'
  })
} 

/**
 * 获取我的委托设备列表
 */
 export function getEquipmentIds() {
  return request({
    url: '/task/getEquipmentIds',
    method: 'get'
  })
} 
      
/**
 * 删除用户设备
 * @param {当前登录用户} userName 
 * @param {查询参数} equipmentID 设备id
 */
 export function deleteEquipments(userName,equipmentIDs) {
  return request({
    url: '/task/deleteEquipments?userName='+userName+"&equipmentIDs="+equipmentIDs,
    method: 'get'
  })
} 

/**
 * 添加用户设备
 * @param {当前登录用户} userName 
 * @param {查询参数} equipmentID 设备id
 */
 export function addEquipments(userName,equipmentIDs) {
  return request({
    url: '/task/addEquipments?userName='+userName+"&equipmentIDs="+equipmentIDs,
    method: 'get'
  })
} 

/**
 * 查询用户权限
 * @param {当前登录用户} userName 
 */
 export function getRole(userName) {
  return request({
    url: '/task/getRole?userName='+userName,
    method: 'get'
  })
} 
