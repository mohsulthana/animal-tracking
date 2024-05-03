import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'

Vue.use(Router)

import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

export const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: {
          title: 'Dashboard',
          icon: 'dashboard',
          affix: true,
          requiresAuth: true
        }
      },
      {
        path: '/animal-register',
        name: 'animal-register',
        component: () => import('@/views/animalregister/index'),
        meta: {
          title: 'Animal Register',
          roles: ['admin'],
          icon: 'animalregister',
          affix: true,
          requiresAuth: true
        }
      },
      {
        path: '/animal-record-manage',
        component: () => import('@/views/animalmanagement/index'),
        name: 'manage-animal-record',
        meta: { title: 'Manage Animal Record', roles: ['admin'], icon: 'AnimalRecordManage', affix: true, requiresAuth: true }
      }
    ]
    // {
    //   path: '/UserManage',
    //   name: 'userManage',
    //   component: Layout,
    //   children: [
    //     {
    //       path: 'index',
    //       component: () => import('@/views/usermanagement/index'),
    //       name: 'UserManage',
    //       meta: { title: 'User Manage', roles: ['admin'], icon: 'UserManage', affix: true }
    //     }
    //   ]
    // }
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    name: 'login',
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true,
    meta: {
      requiresAuth: false
    }
  }
]

const router = new Router({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    if (store.getters.access_token) {
      next({ name: 'dashboard' })
    }
  }

  if (to.meta.requiresAuth) {
    if (!store.getters.access_token) {
      next({ name: 'login' })
    }
  }

  next()
})

export default router
