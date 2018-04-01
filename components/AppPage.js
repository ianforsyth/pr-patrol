import React from 'react'
import UserService from 'UserService'
import RepoService from 'RepoService'
import GithubRepoService from 'GithubRepoService'
import SlackService from 'SlackService'

import Repo from 'Repo'
import Spinner from 'Spinner'
import Settings from 'Settings'

import EmailConfirmationWarning from 'EmailConfirmationWarning'
import EmailPrompt from 'EmailPrompt'
import AddRepo from 'AddRepo'

import queryString from 'query-string'
import cookie from 'react-cookies'
import _ from 'lodash'

class AppPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: this.props.user,
      repos: [],
      isLoading: false,
      settingsVisible: false,
      isAddingRepo: false
    }

    this.handleAddRepoClick = this.handleAddRepoClick.bind(this)
    this.handleCancelRepoClick = this.handleCancelRepoClick.bind(this)
    this.handleCreateRepo = this.handleCreateRepo.bind(this)
    this.handleSettingsClick = this.handleSettingsClick.bind(this)
    this.handleSettingsCloseClick = this.handleSettingsCloseClick.bind(this)
    this.handleEmailPromptUpdate = this.handleEmailPromptUpdate.bind(this)
    this.handleSettingsUpdate = this.handleSettingsUpdate.bind(this)
  }

  componentWillMount() {
    const stateParam = queryString.parse(this.props.location.search).state
    const codeParam = queryString.parse(this.props.location.search).code

    if(codeParam && stateParam == 'slack') {
      this.setState({ isLoading: true })

      SlackService.create({ code: codeParam}).then((data) => {
        this.setState({
          user: data,
          isLoading: false,
          settingsVisible: true
        })
      })
    }
  }

  componentDidMount() {
    if(this.state.user.email) {
      this.fetchReposAndPatrols()
    }
  }

  fetchReposAndPatrols() {
    this.setState({ isLoading: true })

    RepoService.fetch().then((data) => {
      this.setState({
        repos: data,
        isAddingRepo: !data.length,
        isLoading: false
      })
    })
  }

  handleAddRepoClick() {
    this.setState({ isAddingRepo: true })
  }

  handleCancelRepoClick() {
    this.setState({ isAddingRepo: false })
  }

  handleCreateRepo(repo) {
    this.setState({
      repos: _.concat([repo], this.state.repos),
      lastRepoIdAdded: repo.id,
      isAddingRepo: false
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

  handleSettingsClick() {
    this.setState({ settingsVisible: true })
  }

  handleSettingsCloseClick() {
    this.setState({ settingsVisible: false })
  }

  handleEmailPromptUpdate(email) {
    this.setState({ isLoading: true })

    UserService.update({
      id: this.state.user.id,
      email: email
    }).then((data) => {
      this.setState({
        user: data,
        isLoading: false,
        isAddingRepo: true
      })
      this.fetchReposAndPatrols()
    })
  }

  handleSettingsUpdate(user) {
    this.setState({ user: user })
  }

  render() {
    if(this.state.isLoading) {
      return <Spinner height="100px" isVisible={this.state.isLoading}/>
    }

    return (
      <div>
        <div className='nav'>
          <a className='nav-link' onClick={this.handleSettingsClick}>Settings</a>
          <a className='nav-link' onClick={this.handleSignOutClick}>Sign Out</a>
        </div>
        <div className='appBody'>
          { <EmailConfirmationWarning user={this.state.user}/> }
          { !this.state.user.email && <EmailPrompt user={this.state.user} onUpdate={this.handleEmailPromptUpdate}/> }
          { this.state.isAddingRepo && <AddRepo onCreate={this.handleCreateRepo} selectedRepos={this.state.repos} onCancel={this.handleCancelRepoClick}/> }
          { this.state.user.email && !this.state.isAddingRepo &&
            <button className='button button--shine addRepo -size-lg' onClick={this.handleAddRepoClick}>Add A Repo</button>
          }
          {
            this.state.repos.map((repo) => {
              const wasLastRepoAdded = (this.state.lastRepoIdAdded == repo.id)
              return <Repo key={repo.id} repo={repo} openPatrolPrompt={wasLastRepoAdded} onDelete={() => this.handleDeleteRepo(repo)}></Repo>
            })
          }
          { this.state.settingsVisible && <Settings user={this.state.user} onClose={this.handleSettingsCloseClick} onUpdate={this.handleSettingsUpdate}/> }
        </div>
      </div>
      )
    }
}

export default AppPage
