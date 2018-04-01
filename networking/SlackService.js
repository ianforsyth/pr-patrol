import PrPatrolNetworking from './PrPatrolNetworking'

class SlackService extends PrPatrolNetworking {
  createPath() { return '/slack' }
}

export default new SlackService
