import React from 'react'

class EmailWarning extends React.Component {
  constructor(props) {
    super(props)

    this.warningText = this.warningText.bind(this)
  }

  warningText() {
    if(!this.props.user.email) {
      return(
        <p>
          We couldn't find an email associated with your GitHub account.
          To receive alerts, please go to the settings and
          <span> </span>
          <a className='emailWarning-link' onClick={this.props.onOpenSettings}>set your email.</a>
        </p>
      )
    } else if(!this.props.user.emailConfirmed) {
      return(<p>Make sure to confirm your email</p>)
    }
  }

  render() {
    if(!this.props.user) { return null }
    if(this.props.user.email && this.props.user.emailConfirmed) { return null }

    return(
      <div className='emailWarning'>
        { this.warningText() }
      </div>
    )
  }
}

export default EmailWarning
