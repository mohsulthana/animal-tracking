import axios from 'axios'
import Vue from 'vue'
import { Message } from 'element-ui'
import store from '../store/index'
import router from '@/router'

const host = process.env.VUE_APP_API_URL
const devInstance = createInstance(host)

function createInstance(baseURL) {
  const service = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.getters.access_token}`
    }
  })

  service.interceptors.request.use(function(config) {
    const token = store.getters.access_token
    config.headers.Authorization = token ? `Bearer ${token}` : ''
    return config
  })

  service.interceptors.response.use(
    response => {
      return response
    },
    error => {
      if (error?.response?.status === 401) {
        router.push({ name: 'login' })
      }
      Message({
        message: error?.response?.data.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(error.response))
    }
  )

  return service
}

export default {
  install() {
    Vue.prototype.$http = devInstance
  }
}
