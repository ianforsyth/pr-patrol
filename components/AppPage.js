import React from 'react'
import RepoService from '../networking/RepoService'
import GithubRepoService from '../networking/GithubRepoService'

import Repo from './Repo'

import cookie from 'react-cookies'
import _ from 'lodash'

class AppPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      repoOptions: [],
      repos: [],
    }

    this.fetchGithubRepos = this.fetchGithubRepos.bind(this)
    this.handleCancelRepoClick = this.handleCancelRepoClick.bind(this)
  }

  componentWillMount() {
    this.fetchReposAndPatrols()
  }

  fetchReposAndPatrols() {
    RepoService.fetch().then((data) => {
      data.length ? this.setState({ repos: data }) : this.fetchGithubRepos()
    })
  }

  fetchGithubRepos() {
    GithubRepoService.fetch().then((data) => {
      let existingRepoGithubIds = _.map(this.state.repos, 'githubId')
      this.setState({ repoOptions: _.filter(data, (repo) => !_.includes(existingRepoGithubIds, repo.id)) })
    })
  }

  handleCancelRepoClick() {
    this.setState({ repoOptions: [] })
  }

  handleCreateRepo(id, name) {
    RepoService.create({
      github_id: id,
      name: name
    }).then((data) => {
      this.setState({
        repos: _.concat([data], this.state.repos),
        repoOptions: [],
        lastRepoIdAdded: data.id
      })
    })
  }

  handleDeleteRepo(repo) {
    RepoService.delete(repo.id).then(() => {
      this.setState({ repos: _.without(this.state.repos, repo) })
    })
  }

  handleSignOutClick() {
    cookie.remove('pr_patrol')
    location.reload()
  }

  render() {
    return (
      <div>
        <div className='signOut'>
          <a onClick={this.handleSignOutClick}>Sign Out</a>
        </div>
        <div className='metrics'>
        </div>
        <div className='appBody'>
          { !this.state.repoOptions.length &&
            <button className='button addRepo' onClick={this.fetchGithubRepos}>Add Repo</button>
          }
          { !!this.state.repoOptions.length &&
            <div>
              <h5 className='subtitle u-alignCenter'>Choose a repo you want to monitor</h5>
              <div className='repoList'>
                {
                  this.state.repoOptions.map((repo) => {
                    return <div className='repoList-repo' onClick={() => this.handleCreateRepo(repo.id, repo.fullName)} key={repo.id}>{repo.fullName}</div>
                  })
                }
              </div>
              <button className='button button--cancel cancelRepo' onClick={this.handleCancelRepoClick}>Cancel</button>
            </div>
          }
          {
            this.state.repos.map((repo) => {
            const wasLastRepoAdded = (this.state.lastRepoIdAdded == repo.id)
              return <Repo key={repo.id} repo={repo} preOpenAdd={wasLastRepoAdded} onDelete={() => this.handleDeleteRepo(repo)}></Repo>
            })
          }
        </div>
      </div>
      )
    }
}

export default AppPage
