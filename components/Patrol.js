import React from 'react'
import PatrolService from 'PatrolService.js'
import PatrolInput from 'PatrolInput'

class Patrol extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false,
      regex: this.props.patrol.regex
    }

    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleCancelClick = this.handleCancelClick.bind(this)
    this.handleUpdateClick = this.handleUpdateClick.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }

  handleEditClick() {
    this.setState({ isEditing: true })
  }

  handleCancelClick() {
    this.setState({ isEditing: false })
  }

  handleUpdateClick(data) {
    this.setState({
      isEditing: false,
      regex: data.regex
    })
  }

  handleDeleteClick() {
    PatrolService.delete(this.props.patrol.id).then(() => {
      this.props.onDelete()
    })
  }

  render() {
    return (
      <div className='patrol'>
        <div className='patrol-regex'>
          { !this.state.isEditing &&
            <div>
              {this.state.regex}
              <span className='fas fa-pencil-alt actionIcon repo-delete' onClick={this.handleEditClick}></span>
              <span className='far fa-trash-alt actionIcon repo-delete' onClick={this.handleDeleteClick}></span>
            </div>
          }
        </div>
        <div className='patrol-actions'>
          { this.state.isEditing &&
            <PatrolInput
              onCancel={this.handleCancelClick}
              onSubmit={this.handleUpdateClick}
              patrolId={this.props.patrol.id}
              value={this.state.regex}>
            </PatrolInput>
          }
        </div>
      </div>
    )
  }
}

export default Patrol
