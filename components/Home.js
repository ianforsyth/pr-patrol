import React from 'react'
import queryString from 'query-string'
import cookie from 'react-cookies'
import UserService from 'UserService'

import Spinner from 'Spinner'
import LandingPage from 'LandingPage'
import AppPage from 'AppPage'

class Home extends React.Component {
  constructor(props) {
    super(props)

    const githubCode = queryString.parse(this.props.location.search).code
    const userIsAuthorized = typeof cookie.load('pr_patrol') != 'undefined'

    this.state = {
      userIsAuthorized: userIsAuthorized,
      githubRedirectCode: githubCode,
      isLoading: (!!githubCode && !userIsAuthorized),
      emailErrorMessage: false
    }

    this.dismissEmailErrorMessage = this.dismissEmailErrorMessage.bind(this)
  }

  componentWillMount() {
    if(!this.state.userIsAuthorized && this.state.githubRedirectCode) {
      UserService.create({
        code: this.state.githubRedirectCode,
      }).then((data) => {
        cookie.save('pr_patrol', data.appAuthToken)
        this.setState({ userIsAuthorized: true, isLoading: false })
      }).catch((error) => {
        if(error.response.status == 422) {
          this.setState({ isLoading: false, emailErrorMessage: true })
        } else {
          this.setState({ isLoading: false })
        }
      })
    }
  }

  dismissEmailErrorMessage() {
    this.setState({ emailErrorMessage: false })
  }

  render() {
    return (
      <div className='reactBody'>
        <div className='content'>
          { this.state.isLoading && <Spinner/> }
          { this.state.emailErrorMessage &&
            <div className='flash--error'>
              Right now, PR Patrol requires you have a public email address set in your
              <a className='flash-link' href='https://github.com/settings/profile' target='_blank'> GitHub settings</a>.
              <span className='flash-dismiss' onClick={this.dismissEmailErrorMessage}>X</span>
            </div>
          }
          { !this.state.userIsAuthorized && !this.state.isLoading && <LandingPage></LandingPage> }
          { this.state.userIsAuthorized && !this.state.isLoading && <AppPage></AppPage> }
        </div>
        <div className='footer'>
          <p>Made with <span className='fas fa-heart'></span> by <a href='http://ianforsyth.com' target='_blank'>Ian Forsyth</a></p>
        </div>
      </div>
    )
  }
}

export default Home
