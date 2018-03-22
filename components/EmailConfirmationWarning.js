import React from 'react'

class EmailConfirmationWarning extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='emailWarning'>
        <p>To start receiving alerts, please confirm your email address.</p>
      </div>
    )
  }
}

export default EmailConfirmationWarning
