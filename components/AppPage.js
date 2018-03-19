import React from 'react'
import UserService from 'UserService'
import RepoService from 'RepoService'
import GithubRepoService from 'GithubRepoService'

import Repo from 'Repo'
import Spinner from 'Spinner'
import Settings from 'Settings'
import EmailWarning from 'EmailWarning'

import cookie from 'react-cookies'
import _ from 'lodash'

class AppPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null,
      installedRepos: [],
      selectedRepos: [],
      repoOptions: [],
      hasFetchedRepos: false,
      isLoading: true,
      settingsVisible: false
    }

    this.fetchGithubRepos = this.fetchGithubRepos.bind(this)
    this.handleCancelRepoClick = this.handleCancelRepoClick.bind(this)
    this.handleSettingsClick = this.handleSettingsClick.bind(this)
    this.handleSettingsCloseClick = this.handleSettingsCloseClick.bind(this)
  }

  componentWillMount() {
    Promise.all([this.fetchReposAndPatrols(), this.getUser()]).then(() => {
      this.setState({ isLoading: false })
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.state.settingsVisible && !nextState.settingsVisible) {
      this.getUser()
    }
  }

  fetchReposAndPatrols() {
    return RepoService.fetch().then((data) => {
      if(data.length) {
        this.setState({ selectedRepos: data })
      } else {
        return this.fetchGithubRepos()
      }
    })
  }

  getUser() {
    return UserService.get().then((data) => {
      this.setState({ user: data })
    })
  }

  fetchGithubRepos() {
    this.setState({ isLoading: true })

    return GithubRepoService.fetch().then((data) => {
      let existingRepoGithubIds = _.map(this.state.selectedRepos, 'githubId')
      this.setState({
        installedRepos: data,
        repoOptions: _.filter(data, (repo) => !_.includes(existingRepoGithubIds, repo.id)),
        isLoading: false,
        hasFetchedRepos: true
      })
    })
  }

  handleCancelRepoClick() {
    this.setState({
      hasFetchedRepos: false,
      repoOptions: []
    })
  }

  handleCreateRepo(id, name) {
    RepoService.create({
      github_id: id,
      name: name
    }).then((data) => {
      this.setState({
        selectedRepos: _.concat([data], this.state.selectedRepos),
        repoOptions: [],
        hasFetchedRepos: false,
        lastRepoIdAdded: data.id
      })
    })
  }

  handleDeleteRepo(repo) {
    RepoService.delete(repo.id).then(() => {
      this.setState({ selectedRepos: _.without(this.state.selectedRepos, repo) })
    })
  }

  handleSignOutClick() {
    cookie.remove('pr_patrol')
    location.reload()
  }

  handleSettingsClick() {
    this.setState({ settingsVisible: true })
  }

  handleSettingsCloseClick() {
    this.setState({ settingsVisible: false })
  }

  render() {
    let states = {
      initial: !this.state.isLoading && !this.state.hasFetchedRepos,
      isLoading: this.state.isLoading,
      userNeedsEmail: !this.state.isLoading && this.state.user && !this.state.user.email,
      noReposInstalled: !this.state.isLoading && this.state.hasFetchedRepos && !!this.state.installedRepos.length == 0,
      noReposLeft: !this.state.isLoading && this.state.hasFetchedRepos && !!this.state.installedRepos.length && !!this.state.repoOptions.length == 0,
      hasRepos: !this.state.isLoading && this.state.hasFetchedRepos && !!this.state.repoOptions.length,
      settingsVisible: this.state.settingsVisible
    }

    return (
      <div>
        <div className='nav'>
          <a className='nav-link' onClick={this.handleSettingsClick}>Settings</a>
          <a className='nav-link' onClick={this.handleSignOutClick}>Sign Out</a>
        </div>
        <div className='appBody'>
          { <Spinner height="100px" isVisible={this.state.isLoading}/> }
          { !this.state.isLoading && <EmailWarning user={this.state.user} onOpenSettings={this.handleSettingsClick}/> }
          { states.settingsVisible &&
            <Settings user={this.state.user} onClose={this.handleSettingsCloseClick}></Settings>
          }
          { states.noReposInstalled && !states.userNeedsEmail &&
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
          { states.noReposLeft &&
            <div className='u-alignCenter'>
              <h5 className='subtitle'>No repos left!</h5>
              <span className='fas fa-exclamation-triangle noRepos-icon'></span>
              <p>
                You're already monitoring all the repos where PR Patrol is installed. To monitor more, update your
                <a href='https://github.com/settings/installations' target='_blank' className='link'> GitHub settings</a>.
              </p>
            </div>
          }
          { states.initial &&
            <button className='button button--shine addRepo' onClick={this.fetchGithubRepos}>Add A Repo</button>
          }
          { states.hasRepos &&
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
            this.state.selectedRepos.map((repo) => {
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
