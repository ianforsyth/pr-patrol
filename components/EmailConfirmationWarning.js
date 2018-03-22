import React from 'react'

class EmailConfirmationWarning extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.user != this.state.user) {
      this.setState({ user: nextProps.user })
    }
  }

  render() {
    const user = this.props.user

    if(!user.email || (user.emailConfirmed && !user.justConfirmed)) {
      return null
    }

    return (
      <div className='emailWarning'>
        { !user.justConfirmed && <p>To start receiving alerts, please confirm your email address.</p> }
        { user.justConfirmed &&  <p>Email confirmed!</p> }
      </div>
    )
  }
}

export default EmailConfirmationWarning
