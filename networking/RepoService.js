import PrPatrolNetworking from './PrPatrolNetworking'

class RepoService extends PrPatrolNetworking {
  createPath() { return '/repos' }
  fetchPath() { return '/repos' }
}

export default new RepoService
