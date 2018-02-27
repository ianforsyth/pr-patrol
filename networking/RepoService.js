import PrPatrolNetworking from './PrPatrolNetworking'

class RepoService extends PrPatrolNetworking {
  createPath() { return '/repos' }
  fetchPath() { return '/repos' }
  deletePath(id) { return `/repos/${id}` }
}

export default new RepoService
