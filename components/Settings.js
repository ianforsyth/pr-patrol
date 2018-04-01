import React from 'react'
import UserService from 'UserService'
import Modal from 'Modal'
import Checkbox from 'Checkbox'
import _ from 'lodash'

class Settings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: this.props.user.email,
      receivesSlack: this.props.user.receivesSlack,
      receivesEmail: this.props.user.receivesEmail,
      isInvalid: false,
      isSuccessful: false
    }

    this.updateUser = this.updateUser.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleUpdateClick = this.handleUpdateClick.bind(this)
    this.handleEmailClick = this.handleEmailClick.bind(this)
    this.handleSlackClick = this.handleSlackClick.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.receivesEmail != this.state.receivesEmail || prevState.receivesSlack != this.state.receivesSlack) {
      this.updateUser()
    }
  }

  handleChange(e) {
    this.setState({
      email: e.target.value,
      isInvalid: false,
      isSuccessful: false
    })
  }

  handleEmailClick() {
    this.setState({ receivesEmail: !this.state.receivesEmail })
  }

  handleSlackClick() {
    this.setState({ receivesSlack: !this.state.receivesSlack })
  }

  handleUpdateClick() {
    this.updateUser()
  }

  updateUser() {
    if(!this.state.email) {
      this.setState({ isInvalid: true })
    } else {
      UserService.update({
        id: this.props.user.id,
        email: this.state.email,
        receivesEmail: this.state.receivesEmail,
        receivesSlack: this.state.receivesSlack
      }).then((data) => {
        if(this.props.user.email != data.email) {
          this.setState({ isSuccessful: true })
        }

        this.props.onUpdate(data)
      })
    }
  }

  render() {
    const invalidClass = this.state.isInvalid ? 'stateInvalid' : ''
    console.log(this.props)

    return(
      <Modal title='Settings' onClose={this.props.onClose}>
        <Checkbox className='u-inlineBlock u-m-right' isActive={this.state.receivesEmail} onClick={this.handleEmailClick}></Checkbox>
        <div className='u-m-bottom u-inlineBlock'>I want to receive alerts by email</div>
        <div style={{display: 'flex'}}>
          <input className={`${invalidClass}`} placeholder='Email address...' onChange={this.handleChange} value={this.state.email} type='text'></input>
          <button onClick={this.updateUser} className='button -size-sm u-m-left'>Update</button>
        </div>
        { this.state.isSuccessful && <div className='input-success'>Confirmation sent.</div> }
        <Checkbox className='u-inlineBlock u-m-right' isActive={this.state.receivesSlack} onClick={this.handleSlackClick}></Checkbox>
        <div className='u-m-top-xl u-m-bottom u-inlineBlock'>I want to receive alerts in slack</div>
        { !this.props.user.slackIntegrated ?
          <a className='u-block'
            href={`https://slack.com/oauth/authorize?scope=incoming-webhook&client_id=327766817426.328614046646&redirect_uri=${process.env.APP_URL}&state=slack`}>
            <img
              alt="Add to Slack"
              height="40"
              width="139"
              src="https://platform.slack-edge.com/img/add_to_slack.png"
              srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x">
            </img>
          </a>
            :
          <a
            className='u-block'
            href={`https://slack.com/oauth/authorize?scope=incoming-webhook&client_id=327766817426.328614046646&redirect_uri=${process.env.APP_URL}&state=slack`}>
              <button className='button'>
                <span className='fab fa-slack buttonIcon'></span>
                Update Slack Integration
              </button>
          </a>
        }
      </Modal>
    )
  }
}

export default Settings
