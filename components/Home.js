import React from 'react'
import queryString from 'query-string'
import cookie from 'react-cookies'
import UserService from '../networking/UserService'
import LandingPage from './LandingPage'
import AppPage from './AppPage'

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userIsAuthorized: typeof cookie.load('pr_patrol') != 'undefined',
      githubRedirectCode: queryString.parse(this.props.location.search).code,
    }
  }

  componentWillMount() {
    if(!this.state.userIsAuthorized && this.state.githubRedirectCode) {
      UserService.create({
        code: this.state.githubRedirectCode,
      }).then((data) => {
        cookie.save('pr_patrol', data.appAuthToken)
        this.setState({ userIsAuthorized: true })
      })
    }
  }

  render() {
    return (
      <div>
        { !this.state.userIsAuthorized && <LandingPage></LandingPage> }
        { this.state.userIsAuthorized && <AppPage></AppPage> }
        <div className='footer'>
          <p>Made with <span className='fas fa-heart'></span> by <a href='http://ianforsyth.com' target='_blank'>Ian Forsyth</a></p>
        </div>
      </div>
    )
  }
}

export default Home
