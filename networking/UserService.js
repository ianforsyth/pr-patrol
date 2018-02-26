import PrPatrolNetworking from './PrPatrolNetworking'

class UserService extends PrPatrolNetworking {
  createPath() { return '/users' }
}

export default new UserService
