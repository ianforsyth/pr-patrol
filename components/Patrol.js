import React from 'react'
import PatrolService from '../networking/PatrolService.js'

class Patrol extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false,
      originalRegex: this.props.patrol.regex,
      newRegex: this.props.patrol.regex
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleCancelClick = this.handleCancelClick.bind(this)
    this.handleUpdateClick = this.handleUpdateClick.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }

  handleChange(e) {
    this.setState({ newRegex: e.target.value })
  }

  handleEditClick() {
    this.setState({ isEditing: true })
  }

  handleCancelClick() {
    this.setState({ isEditing: false, newRegex: this.state.originalRegex })
  }

  handleUpdateClick() {
    PatrolService.update({
      id: this.props.patrol.id,
      regex: this.state.newRegex
    }).then((data) => {
      this.setState({ isEditing: false, newRegex: data.regex, originalRegex: data.regex })
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
          {
            !this.state.isEditing &&
            <div>
              {this.state.newRegex}
              <span className='fas fa-pencil-alt actionIcon repo-delete' onClick={this.handleEditClick}></span>
              <span className='far fa-trash-alt actionIcon repo-delete' onClick={this.handleDeleteClick}></span>
            </div>
          }
        </div>
        <div className='patrol-actions'>
          {
            this.state.isEditing &&
            <div>
              <input className='repo-input' type='text' value={this.state.newRegex} onChange={this.handleChange}></input>
              <button className='button -size-sm' onClick={this.handleUpdateClick}>Update</button>
              <button className='button -size-sm' onClick={this.handleCancelClick}>Cancel</button>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default Patrol
