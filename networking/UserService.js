import PrPatrolNetworking from './PrPatrolNetworking'

class UserService extends PrPatrolNetworking {
  getPath() { return '/user' }
  createPath() { return '/user' }
  updatePath() { return '/user' }

}

export default new UserService
