import React from 'react'
import RepoService from '../networking/RepoService'
import GithubRepoService from '../networking/GithubRepoService'

import Repo from './Repo'
import Spinner from './Spinner'

import cookie from 'react-cookies'
import _ from 'lodash'

class AppPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      repoOptions: [],
      repos: [],
      hasRepos: true,
      isLoading: true
    }

    this.fetchGithubRepos = this.fetchGithubRepos.bind(this)
    this.handleCancelRepoClick = this.handleCancelRepoClick.bind(this)
  }

  componentWillMount() {
    this.fetchReposAndPatrols()
  }

  fetchReposAndPatrols() {
    RepoService.fetch().then((data) => {
      if(data.length) {
        this.setState({ repos: data, isLoading: false })
      } else {
        this.fetchGithubRepos()
      }
    })
  }

  fetchGithubRepos() {
    this.setState({ isLoading: true })

    GithubRepoService.fetch().then((data) => {
      if(data.length) {
        let existingRepoGithubIds = _.map(this.state.repos, 'githubId')
        this.setState({
          repoOptions: _.filter(data, (repo) => !_.includes(existingRepoGithubIds, repo.id)),
          isLoading: false
        })
      } else {
        this.setState({
          hasRepos: false,
          isLoading: false
        })
      }
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
          <Spinner isVisible={this.state.isLoading}/>
          { !this.state.hasRepos && !this.state.isLoading &&
            <div className='u-alignCenter'>
              <h5 className='subtitle'>You haven't installed PR Patrol yet!</h5>
              <span className='fas fa-exclamation-triangle noRepos-icon'></span>
              <p>
                To start monitoring your code, head over to the
                <a href='https://github.com/apps/pr-patrol' target='_blank' className='link'> GitHub marketplace </a>
                and install the PR Patrol app on one of your repos.
              </p>
            </div>
          }
          { !this.state.repoOptions.length && this.state.hasRepos && !this.state.isLoading &&
            <button className='button button--shine addRepo' onClick={this.fetchGithubRepos}>Add A Repo</button>
          }
          { !!this.state.repoOptions.length && !this.state.isLoading &&
            <div>
              <h5 className='subtitle u-alignCenter'>Choose a repo you want to monitor</h5>
              <div className='repoList'>
                {
                  this.state.repoOptions.map((repo) => {
                    return <div className='repoList-repo' onClick={() => this.handleCreateRepo(repo.id, repo.fullName)} key={repo.id}>{repo.fullName}</div>
                  })
                }
              </div>
              <button className='button button--subtle cancelRepo' onClick={this.handleCancelRepoClick}>Cancel</button>
            </div>
          }
          {
            this.state.repos.map((repo) => {
              const wasLastRepoAdded = (this.state.lastRepoIdAdded == repo.id)
              return <Repo key={repo.id} repo={repo} openPatrolPrompt={wasLastRepoAdded} onDelete={() => this.handleDeleteRepo(repo)}></Repo>
            })
          }
        </div>
      </div>
      )
    }
}

export default AppPage
