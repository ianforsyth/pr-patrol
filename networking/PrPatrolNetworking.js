import axios from 'axios'
import cookie from 'react-cookies'

class PrPatrolNetworking {
  constructor() {
    this.networking = axios.create({
      baseURL: process.env.API_URL,
      headers: { common: {} }
    })

    this.networking.defaults.headers.common['X-Key-Inflection'] = 'camel'

    // Need this in an interceptor because sometimes it gets added/updated in login steps
    this.networking.interceptors.request.use((config) => {
      config.headers['Authorization'] = cookie.load('pr_patrol')
      return config
    })

  }

  sendRequest(request) {
    return request.then((response) => {
      return response.data
    }).catch((response) => {
      return Promise.reject(response)
    })
  }

  get() {
    return this.sendRequest(this.networking.get(this.getPath()))
  }

  fetch() {
    return this.sendRequest(this.networking.get(this.fetchPath()))
  }

  create(obj) {
    return this.sendRequest(this.networking.post(this.createPath(), obj))
  }

  update(obj) {
    return this.sendRequest(this.networking.put(this.updatePath(obj), obj))
  }

  delete(id) {
    return this.sendRequest(this.networking.delete(this.deletePath(id)))
  }
}

export default PrPatrolNetworking

