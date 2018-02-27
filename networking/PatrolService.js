import PrPatrolNetworking from './PrPatrolNetworking'

class PatrolService extends PrPatrolNetworking {
  createPath() { return '/patrols' }
  deletePath(id) { return `/patrols/${id}` }
  updatePath(obj) { return `/patrols/${obj.id}` }
}

export default new PatrolService
