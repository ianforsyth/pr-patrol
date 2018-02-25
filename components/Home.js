import React from 'react'
import axios from 'axios'
import queryString from 'query-string'
import cookie from 'react-cookies'

import Repo from './Repo'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      repo_options: [],
      repos: []
    }
  }


  componentWillMount() {
    let params = queryString.parse(this.props.location.search)
    if(params.code) {
      this.retrieveAuthToken(params.code)
    }
  }

  retrieveAuthToken(code) {
    axios.post(`${process.env.API_URL}/user`, {
      code: code,
    }).then((response) => {
      console.log(response)
      this.setState({ repo_options: response.data })
    })
  }

  addRepo(id, name) {
    axios.post(`${process.env.API_URL}/user_repo`, {
      github_id: id,
      name: name
    }).then((response) => {
      this.setState({ repos: this.state.repos.concat([{ id, name }]) })
    })
  }

  render() {
    console.log(this.state.repo_options)
    return (
      <div>
        <h1>Hello World</h1>
        <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`}>Login with github</a>
          {
            this.state.repo_options.map((repo) => {
              return <div onClick={() => this.addRepo(repo.id, repo.full_name)} key={repo.id}>{repo.full_name}</div>
            })
          }
          {
            this.state.repos.map((repo) => {
              return <Repo key={repo.id} repo={repo}></Repo>
            })
          }
      </div>
    )
  }
}

export default Home
