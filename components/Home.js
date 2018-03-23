import React from 'react'
import queryString from 'query-string'
import cookie from 'react-cookies'
import UserService from 'UserService'

import Spinner from 'Spinner'
import EmailConfirmationWarning from 'EmailConfirmationWarning'
import LandingPage from 'LandingPage'
import AppPage from 'AppPage'

import _ from 'lodash'

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
      isLoading: false,
    }
  }

  componentWillMount() {
    const userHasCookie = _.isString(cookie.load('pr_patrol'))
    const emailConfirmationToken = queryString.parse(this.props.location.search).email_confirmation_token
    const githubAuthCode = queryString.parse(this.props.location.search).code

    if(emailConfirmationToken) {
      this.confirmUserEmail(emailConfirmationToken)
    } else if(userHasCookie) {
      this.getUser(githubAuthCode)
    } else if(githubAuthCode) {
      this.createUser(githubAuthCode)
    }
  }

  createUser(githubAuthCode) {
    this.setState({ isLoading: true })

    UserService.create({
      code: githubAuthCode,
    }).then((data) => {
      cookie.save('pr_patrol', data.appAuthToken)
      this.setState({ user: data, isLoading: false })
    }).catch((error) => {
      this.setState({ isLoading: false })
    })
  }

  confirmUserEmail(token) {
    this.setState({ isLoading: true })

    UserService.update({
      emailConfirmationToken: token
    }).then((data) => {
      cookie.save('pr_patrol', data.appAuthToken)
      this.setState({
        isLoading: false,
        user: _.merge(data, { justConfirmed: true }),
        confirmedEmail: true
      })
    }).catch((error) => {
      this.setState({ isLoading: false })
    })
  }

  getUser(githubAuthCode) {
    this.setState({ isLoading: true })

    UserService.get().then((data) => {
      this.setState({ user: data, isLoading: false })
    }).catch((error) => {
      if(githubAuthCode)
        this.createUser(githubAuthCode)
      else
        this.setState({ isLoading: false })
    })
  }

  render() {
    return (
      <div className='reactBody'>
        <div className='content'>
          { this.state.isLoading && <Spinner isVisible={true}/> }
          { !this.state.isLoading && _.isEmpty(this.state.user) && <LandingPage></LandingPage> }
          { !this.state.isLoading && !_.isEmpty(this.state.user) && <AppPage user={this.state.user}></AppPage> }
        </div>
        <div className='footer'>
          <p>Made with <span className='fas fa-heart'></span> by <a href='http://ianforsyth.com' target='_blank'>Ian Forsyth</a></p>
        </div>
      </div>
    )
  }
}

export default Home
