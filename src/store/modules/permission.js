import { asyncRouterMap, constantRouterMap } from "@/config/router.config"
import OrderDetail from 'src/views/order/OrderMetaDetail.vue'
import Vue from 'vue'
import { USER_NAME } from "@/store/mutation-types"

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission(permission, route) {
  if (route.meta && route.meta.permission) {
    let flag = -1
    for (let i = 0, len = permission.length; i < len; i++) {
      flag = route.meta.permission.indexOf(permission[i])
      if (flag >= 0) {
        return true
      }
    }
    return false
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.indexOf(roles.id)
  } else {
    return true
  }
}

function filterAsyncRouter(routerMap, roles) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(roles.permissionList, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}


const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, data) => {
      if (data[0].children) {
        data[0].children = data[0].children.map((o) => {
          if (o.name === 'order-orderList') {
            o.children.push({
              name: 'orderDetail',
              path: '/order/orderList/orderDetail/:id',
              meta: { title: '订单详情' },
              component: OrderDetail
            })
          }
          return o
        })
      }
      // const userName = Vue.ls.get(USER_NAME)
      //
      // if (userName === 'sz2012') {
      //   data[0].children.push({
      //     path: '/reportCheck',
      //     name: 'ReportCheck',
      //     component: () => import('@/views/report/SampleReportCheckList.vue'),
      //     meta: { title: '报告审核' },
      //   })
      //   data[0].children.push({
      //     path: '/reportCheckDetail/:id',
      //     name: 'ReportCheckDetail',
      //     component: () => import('@/views/report/sampleReportCheckDetail.vue'),
      //     meta: { title: '报告审核详情' },
      //   })
      // }
      state.addRouters = data
      state.routers = constantRouterMap.concat(data)
      //console.log('-----mutations---SET_ROUTERS----', data)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        console.log('-----mutations---data----', data)
        let accessedRouters
        accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        console.log('-----mutations---accessedRouters----', accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    // 动态添加主界面路由，需要缓存
    UpdateAppRouter({ commit }, routes) {
      return new Promise(resolve => {
        //const [ roles ] = routes.constRoutes
        let routelist = routes.constRoutes;
        commit('SET_ROUTERS', routelist)
        resolve()
      })
    }
  }
}

export default permission