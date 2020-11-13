import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/t_Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/sales',
    name: 'sales',
    component: () => import('../views/t_Sales.vue')
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('../views/t_Products.vue')
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('../views/t_Reports.vue')
  },
  {
    path: '/master',
    name: 'master',
    component: () => import('../views/t_Master.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
