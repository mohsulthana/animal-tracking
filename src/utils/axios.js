import axios from 'axios'
import Vue from 'vue'
import { MessageBox, Message } from 'element-ui'

const devInstance = createInstance('http://localhost:8000')
const productionInstance = createInstance('http://localhost:8000') // will change later

function createInstance(baseURL) {
  const service = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.token}`
    }
  })

  service.interceptors.response.use(
    response => {
      const { status } = response

      if (status === 200) {
        return response
      }
      // if (status !== 200) {
      //   Message({
      //     message: data.message || 'Error',
      //     type: 'error',
      //     duration: 5 * 1000
      //   })

      //   if (data === 50008 || data === 50012 || data === 50014) {
      //     // to re-login
      //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //       confirmButtonText: 'Re-Login',
      //       cancelButtonText: 'Cancel',
      //       type: 'warning'
      //     }).then(() => {
      //       console.log('reset token')
      //     })
      //   }
      //   return Promise.reject(new Error(res || 'Error'))
      // } else {
      //   return res
      // }
    },
    error => {
      Message({
        message: error?.response?.data.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error.response)
    }
  )

  return service
}

export default {
  install() {
    Vue.prototype.$http = devInstance
  }
}
