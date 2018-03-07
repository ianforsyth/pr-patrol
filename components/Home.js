import React from 'react'
import axios from 'axios'
import queryString from 'query-string'
import cookie from 'react-cookies'
import Repo from './Repo'
import UserService from '../networking/UserService'
import RepoService from '../networking/RepoService'
import GithubRepoService from '../networking/GithubRepoService'
import _ from 'lodash'
import Pete from '../img/pete.svg'

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
        <div className='home'>
          <h1 className='title'>PR Patrol</h1>
          <h2 className='subtitle'>Monitor code that matters to you</h2>
          <div className='logo'>
            <img className='logo-img' src={Pete}></img>
            <div className='logo-shadow'></div>
          </div>
          { !this.state.userIsAuthorized &&
            <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`}>
              <button className='button'>
                <span className="fab fa-github buttonIcon"></span>
                <span>Sign In With Github</span>
              </button>
            </a>
          }
          { this.state.userIsAuthorized &&
            <button className='button' onClick={this.fetchGithubRepos}>Add Repo</button>
          }
          { !this.state.userIsAuthorized &&
            <div className='steps'>
              <div className='steps-bg'></div>
              <h3 className='steps-title'>Here's how it works...</h3>
              <div className='step'>
                <h4 className='step-title'>1. Install the GitHub App</h4>
                <p className='step-description'>
                  Head over to the GitHub marketplace and
                  <a className='link' href='https://github.com/apps/pr-patrol' target='_blank'> install </a>
                  the PR Patrol app.
                </p>
              </div>
              <div className='step'>
                <h4 className='step-title'>2. Set up patrols</h4>
                <p className='step-description'>Choose the repos you want to patrol and the files you want alerts for.</p>
              </div>
              <div className='step'>
                <h4 className='step-title'>3. Get alerts</h4>
                <p className='step-description'>You get an email anytime someone opens a PR to change the code you're monitoring</p>
              </div>
            </div>
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
        </div>
      </div>
    )
  }
}

export default Home
