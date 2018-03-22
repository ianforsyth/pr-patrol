import React from 'react'
import UserService from 'UserService'

class EmailPrompt extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      emailIsInvalid: false
    }

    this.handleEmailSubmitClick = this.handleEmailSubmitClick.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value,
      emailIsInvalid: false
    })
  }

  handleEmailSubmitClick() {
    if(this.state.email) {
      this.props.onUpdate(this.state.email)
    } else {
      this.setState({ emailIsInvalid: true })
    }
  }

  render() {
    const invalidStyle = this.state.emailIsInvalid ? 'stateInvalid' : ''

    return (
      <div className='signUpStep'>
        <h5 className='subtitle'>Set Your Email</h5>
        <span className='fas fa-envelope noRepos-icon'></span>
        <p>
          Where would you like us to send alerts?
        </p>
        <input className={`${invalidStyle}`} type='text' placeholder='Email...' value={this.state.email} onChange={this.handleEmailChange}></input>
        <button className='button button--shine' onClick={this.handleEmailSubmitClick}>Set Email</button>
      </div>
    )
  }
}

export default EmailPrompt
