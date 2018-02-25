import axios from 'axios'

class PrPatrolNetworking {
  constructor() {
    this.networking = axios.create({
      baseURL: process.env.API_URL,
      headers: { common: {} }
    })
  }

  sendRequest(request) {
    return request.then((response) => {
      return this.unwrapResponse(response)
    }).catch((response) => {
      Promise.reject(response.data)
    })
  }

  unwrapResonse(response) {
    return response.data
  }

  create(obj) {
    return this.request(this.networking.post(this.createPath(), obj))
  }
}

export default PrPatrolNetworking

