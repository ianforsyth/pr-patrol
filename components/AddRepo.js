import React from 'react'
import GithubRepoService from 'GithubRepoService'
import RepoService from 'RepoService'
import Spinner from 'Spinner'

class AddRepo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedRepos: this.props.selectedRepos,
      installedRepos: [],
      repoOptions: [],
      isLoading: true
    }

    this.fetchGithubRepos = this.fetchGithubRepos.bind(this)
  }

  componentDidMount() {
    this.fetchGithubRepos()
  }

  fetchGithubRepos() {
    this.setState({ isLoading: true })

    GithubRepoService.fetch().then((data) => {
     let existingRepoGithubIds = _.map(this.state.selectedRepos, 'githubId')

      this.setState({
        installedRepos: data,
        repoOptions: _.filter(data, (repo) => !_.includes(existingRepoGithubIds, repo.id)),
        isLoading: false
      })
    })
  }

  handleCreateRepo(id, name) {
    RepoService.create({
      github_id: id,
      name: name
    }).then((data) => {
      this.props.onCreate(data)
    })
  }

  render() {
    if(this.state.isLoading) {
      return <Spinner height="100px" isVisible={true}/>
    }

    let states = {
      noReposInstalled: this.state.installedRepos.length == 0,
      noReposLeft: !!this.state.installedRepos.length && this.state.repoOptions.length == 0,
      hasRepos: !!this.state.repoOptions.length
    }

    return (
      <div>
        { states.noReposInstalled &&
          <div className='signUpStep'>
            <h5 className='subtitle'>Install PR Patrol</h5>
            <span className='fas fa-download noRepos-icon'></span>
            <p>
              To start monitoring your code, head over to the
              <a href='https://github.com/apps/pr-patrol' target='_blank' className='link'> GitHub marketplace </a>
              and install the PR Patrol app on one of your repos.
            </p>
            <button className='button button--shine' onClick={this.fetchGithubRepos}>Installed It</button>
          </div>
        }
        { states.hasRepos &&
          <div className='signUpStep'>
            <h5 className='subtitle'>Choose a repo you want to monitor</h5>
            <span className='fas fa-tasks noRepos-icon'></span>
            <p>
              These are the repos you've installed PR Patrol on. Choose one to get started setting up your patrols.
            </p>
            <div className='repoList'>
              {
                this.state.installedRepos.map((repo) => {
                  return <div className='repoList-repo' onClick={() => this.handleCreateRepo(repo.id, repo.fullName)} key={repo.id}>{repo.fullName}</div>
                })
              }
            </div>
            <button className='button button--subtle cancelRepo' onClick={this.props.onCancel}>Cancel</button>
          </div>
        }
        { states.noReposLeft &&
          <div className='signUpStep'>
            <h5 className='subtitle'>No repos left!</h5>
            <span className='fas fa-exclamation-triangle noRepos-icon'></span>
            <p>
              You're already monitoring all the repos that have PR Patrol installed. To monitor more, update your
              <a href='https://github.com/settings/installations' target='_blank' className='link'> GitHub settings</a>.
            </p>
            <button className='button button--subtle cancelRepo' onClick={this.props.onCancel}>Cancel</button>
          </div>
        }
      </div>
    )
  }
}

export default AddRepo
