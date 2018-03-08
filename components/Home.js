import React from 'react'
import axios from 'axios'
import queryString from 'query-string'
import cookie from 'react-cookies'
import Repo from './Repo'
import UserService from '../networking/UserService'
import RepoService from '../networking/RepoService'
import GithubRepoService from '../networking/GithubRepoService'
import _ from 'lodash'
import LandingPage from './LandingPage'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      repo_options: [],
      repos: [],
      userIsAuthorized: typeof cookie.load('pr_patrol') != 'undefined',
      githubRedirectCode: queryString.parse(this.props.location.search).code,
    }

    this.fetchGithubRepos = this.fetchGithubRepos.bind(this)
  }

  componentWillMount() {
    if(this.state.userIsAuthorized) {
      this.fetchReposAndPatrols()
    } else if(this.state.githubRedirectCode) {
      this.getUser()
    }
  }

  fetchReposAndPatrols() {
    RepoService.fetch().then((data) => {
      this.setState({ repos: data })
    })
  }

  fetchGithubRepos() {
    GithubRepoService.fetch().then((data) => {
      let existingRepoGithubIds = _.map(this.state.repos, 'githubId')
      this.setState({ repo_options: _.filter(data, (repo) => !_.includes(existingRepoGithubIds, repo.id)) })
    })
  }

  getUser() {
    UserService.create({
      code: this.state.githubRedirectCode,
    }).then((data) => {
      cookie.save('pr_patrol', data.appAuthToken)
      this.setState({ userIsAuthorized: true })
      this.fetchReposAndPatrols() //single responsibility dude!
    })
  }

  handleCreateRepo(id, name) {
    RepoService.create({
      github_id: id,
      name: name
    }).then((data) => {
      this.setState({
        repos: _.concat([data], this.state.repos),
        repo_options: [],
        lastRepoIdAdded: data.id
      })
    })
  }

  handleDeleteRepo(repo) {
    RepoService.delete(repo.id).then(() => {
      this.setState({ repos: _.without(this.state.repos, repo) })
    })
  }

  render() {
    return (
      <div>
        { this.state.userIsAuthorized &&
          <div className='nav u-clearfix'>
            <h1 className='nav-title u-floatLeft'>PR Patrol</h1>
            <a className='link u-floatRight'>Sign Out</a>
            <a className='link u-floatRight'>Contact</a>
          </div>
        }
        { !this.state.userIsAuthorized && <LandingPage></LandingPage>}
        { this.state.userIsAuthorized &&
          <button className='button' onClick={this.fetchGithubRepos}>Add Repo</button>
        }
        { !!this.state.repo_options.length &&
          <div className='repoList'>
            {
              this.state.repo_options.map((repo) => {
                return <div className='repoList-repo' onClick={() => this.handleCreateRepo(repo.id, repo.fullName)} key={repo.id}>{repo.fullName}</div>
              })
            }
          </div>
        }
        {
          this.state.repos.map((repo) => {
            const wasLastRepoAdded = (this.state.lastRepoIdAdded == repo.id)
            return <Repo key={repo.id} repo={repo} preOpenAdd={wasLastRepoAdded} onDelete={() => this.handleDeleteRepo(repo)}></Repo>
          })
        }
        <div className='footer'>
          <p>Made with <span className='fas fa-heart'></span> by <a href='http://ianforsyth.com' target='_blank'>Ian Forsyth</a></p>
        </div>
      </div>
    )
  }
}

export default Home
