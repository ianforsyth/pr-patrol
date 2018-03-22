import React from 'react'
import UserService from 'UserService'
import Modal from 'Modal'
import _ from 'lodash'

class Settings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: _.get(this.props.user, 'email') || '',
      isInvalid: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
  }

  handleChange(e) {
    this.setState({
      email: e.target.value,
      isInvalid: false
    })
  }

  handleSubmitClick() {
    if(!this.state.email) {
      this.setState({ isInvalid: true })
    } else {
      UserService.update({
        id: this.props.user.id,
        email: this.state.email
      }).then((data) => {
        this.props.onUpdate(data)
      })
    }
  }

  render() {
    const invalidClass = this.state.isInvalid ? 'stateInvalid' : ''

    return(
      <Modal title='Settings' onClose={this.props.onClose}>
        <div className='u-m-bottom'>Where do you want to receive alerts?</div>
        <input className={`emailPrompt-input ${invalidClass}`} placeholder='Email address...' onChange={this.handleChange} value={this.state.email} type='text'></input>
        <div className='u-m-top-lg u-alignRight'>
          <button onClick={this.handleSubmitClick} className='button -size-sm'>Update</button>
        </div>
      </Modal>
    )
  }
}

export default Settings
