import PrPatrolNetworking from './PrPatrolNetworking'

class GithubRepoService extends PrPatrolNetworking {
  fetchPath() { return '/github_repos' }
}

export default new GithubRepoService
