import React from 'react'
import queryString from 'query-string'
import cookie from 'react-cookies'
import UserService from '../networking/UserService'

import Spinner from './Spinner'
import LandingPage from './LandingPage'
import AppPage from './AppPage'

class Home extends React.Component {
  constructor(props) {
    super(props)

    const githubCode = queryString.parse(this.props.location.search).code
    const userIsAuthorized = typeof cookie.load('pr_patrol') != 'undefined'

    this.state = {
      userIsAuthorized: userIsAuthorized,
      githubRedirectCode: githubCode,
      isLoading: (!!githubCode && !userIsAuthorized),
    }
  }

  componentWillMount() {
    if(!this.state.userIsAuthorized && this.state.githubRedirectCode) {
      UserService.create({
        code: this.state.githubRedirectCode,
      }).then((data) => {
        cookie.save('pr_patrol', data.appAuthToken)
        this.setState({ userIsAuthorized: true, isLoading: false })
      }).catch((error) => {
        this.setState({ isLoading: false })
      })
    }
  }

  render() {
    return (
      <div>
        <Spinner isVisible={this.state.isLoading}/>
        { !this.state.userIsAuthorized && !this.state.isLoading && <LandingPage></LandingPage> }
        { this.state.userIsAuthorized && !this.state.isLoading && <AppPage></AppPage> }
        <div className='footer'>
          <p>Made with <span className='fas fa-heart'></span> by <a href='http://ianforsyth.com' target='_blank'>Ian Forsyth</a></p>
        </div>
      </div>
    )
  }
}

export default Home
