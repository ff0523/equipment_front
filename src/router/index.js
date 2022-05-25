import Vue from 'vue'
import Router from 'vue-router'
import MyTaskManageWeb from '@/views/MyTaskManageWeb'
import MyTaskManagePhone from '@/views/MyTaskManagePhone'
import EquipmentManage from '@/views/EquipmentManage'
import TaskManage from '@/views/TaskManage'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/MyTaskManageWeb',
      name: 'MyTaskManageWeb',
      component: MyTaskManageWeb
    },
    {
      path: '/MyTaskManagePhone',
      name: 'MyTaskManagePhone',
      component: MyTaskManagePhone
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
