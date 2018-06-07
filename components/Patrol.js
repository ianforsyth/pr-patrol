import React from 'react'
import PatrolService from 'PatrolService.js'
import PatrolInput from 'PatrolInput'
import Checkbox from 'Checkbox'

class Patrol extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false,
      regex: this.props.patrol.regex,
      isForFiles: this.props.patrol.isForFiles,
      isForDiffs: this.props.patrol.isForDiffs,
    }

    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleFilesClick = this.handleFilesClick.bind(this)
    this.handleDiffsClick = this.handleDiffsClick.bind(this)
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

  handleFilesClick() {
    PatrolService.update({ id: this.props.patrol.id, isForFiles: !this.state.isForFiles })
    this.setState({ isForFiles: !this.state.isForFiles })
  }

  handleDiffsClick() {
    PatrolService.update({ id: this.props.patrol.id, isForDiffs: !this.state.isForDiffs })
    this.setState({ isForDiffs: !this.state.isForDiffs })
  }

  handleDeleteClick() {
    PatrolService.delete(this.props.patrol.id).then(() => {
      this.props.onDelete()
    })
  }

  render() {
    return (
      <div className='patrol u-flex'>
        <div className='patrol-regex'>
          { !this.state.isEditing &&
            <div>
              {this.state.regex}
              <span className='fas fa-pencil-alt actionIcon repo-delete' onClick={this.handleEditClick}></span>
              <span className='far fa-trash-alt actionIcon repo-delete' onClick={this.handleDeleteClick}></span>
            </div>
          }
        </div>
        { !this.state.isEditing &&
          <div className='patrol-types'>
            <Checkbox className='u-inlineBlock u-m-right-sm' isActive={this.state.isForFiles} onClick={this.handleFilesClick}></Checkbox>
            <span>Files</span>
            <Checkbox className='u-inlineBlock u-m-right-sm u-m-left' isActive={this.state.isForDiffs} onClick={this.handleDiffsClick}></Checkbox>
            <span>Diffs</span>
          </div>
        }
        <div>
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
