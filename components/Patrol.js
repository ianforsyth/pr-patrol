import React from 'react'
import PatrolService from '../networking/PatrolService.js'

class Patrol extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false,
      patrolRegex: this.props.patrol.regex
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleCancelClick = this.handleCancelClick.bind(this)
    this.handleUpdateClick = this.handleUpdateClick.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }

  handleChange(e) {
    this.setState({ patrolRegex: e.target.value })
  }

  handleEditClick() {
    this.setState({ isEditing: true })
  }

  handleCancelClick() {
    this.setState({ isEditing: false, patrolRegex: this.props.patrol.regex })
  }

  handleUpdateClick() {
    this.setState({ isEditing: false })
  }

  handleDeleteClick() {
    PatrolService.delete(this.props.patrol.id).then(() => {
      this.props.onDelete()
    })
  }

  render() {
    return (
      <div className='patrol'>
        {
          !this.state.isEditing &&
          <div>
            {this.state.patrolRegex}
            <button onClick={this.handleEditClick}>Edit</button>
            <button onClick={this.handleDeleteClick}>Delete</button>
          </div>
        }
        {
          this.state.isEditing &&
          <div>
            <input type='text' value={this.state.patrolRegex} onChange={this.handleChange}></input>
            <button onClick={this.handleUpdateClick}>Update</button>
            <button onClick={this.handleCancelClick}>Cancel</button>
          </div>
        }
      </div>
    )
  }
}

export default Patrol
