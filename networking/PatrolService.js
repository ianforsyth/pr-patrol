import PrPatrolNetworking from './PrPatrolNetworking'

class PatrolService extends PrPatrolNetworking {
  createPath() { return '/patrols' }
}

export default new PatrolService
