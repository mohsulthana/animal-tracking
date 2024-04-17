import axios from 'axios'
import Vue from 'vue'

const devInstance = createInstance('http://localhost:8000')
const productionInstance = createInstance('http://localhost:8000') // will change later

function createInstance(baseURL) {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.token}`
    }
  })
}

export default {
  install() {
    Vue.prototype.$http = devInstance
  }
} // Check debug/build mode
