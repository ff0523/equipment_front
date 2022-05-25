import Vue from 'vue'
import Router from 'vue-router'
import MyTaskManage from '@/views/MyTaskManage'
import MyTaskManageDing from '@/views/MyTaskManageDing'
import EquipmentManage from '@/views/EquipmentManage'
import TaskManage from '@/views/TaskManage'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/MyTaskManage',
      name: 'MyTaskManage',
      component: MyTaskManage
    },
    {
      path: '/MyTaskManageDing',
      name: 'MyTaskManageDing',
      component: MyTaskManageDing
    },
    {
      path: '/EquipmentManage',
      name: 'EquipmentManage',
      component: EquipmentManage
    },
    {
      path: '/TaskManage',
      name: 'TaskManage',
      component: TaskManage
    }
  ]
})
