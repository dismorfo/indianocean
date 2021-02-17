import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: route => ({
      searchTerm: '*',
      currentPage: (route.query.page ? Number(route.query.page) : 1),
      sortByOption: (route.query.sort ? route.query.sort : 'ss_longlabel asc')
    })
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: 'about' */ '../views/About.vue')
  },
  {
    path: '/browse',
    name: 'Browse',
    component: () => import(/* webpackChunkName: 'browse' */ '../views/Browse.vue'),
    props: route => ({
      searchTerm: '*',
      currentPage: (route.query.page ? Number(route.query.page) : 1),
      sortByOption: (route.query.sort ? route.query.sort : 'ss_longlabel asc')
    })
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: 'search' */ '../views/Search.vue'),
    props: route => ({
      searchTerm: route.query.q,
      currentPage: (route.query.page ? Number(route.query.page) : 1),
      sortByOption: (route.query.sort ? route.query.sort : 'ss_longlabel asc')
    })
  },
  {
    path: '/books/:identifier/:sequence',
    name: 'Book',
    component: () => import(/* webpackChunkName: 'book' */ '../views/Book.vue'),
    props: route => ({
      identifier: route.params.identifier,
      sequence: route.params.sequence
    })
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
