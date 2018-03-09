import React from 'react'
import PatrolService from '../networking/PatrolService'

class PatrolInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      regex: this.props.value || '',
      idEditing: !!this.props.value,
      isValid: true
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleAddClick = this.handleAddClick.bind(this)
  }

  handleChange(e) {
    this.setState({
      regex: e.target.value,
      isValid: true
    })
  }

  handleAddClick() {
    if(!this.state.regex) {
      this.setState({ isValid: false })
      return
    }

    PatrolService.create({
      repo_id: this.props.repoId,
      regex: this.state.regex
    }).then((data) => {
      this.props.onAdd(data)
    })
  }


  render() {
    const invalidClass = this.state.isValid ? '' : 'stateInvalid'

    return (
      <div>
        <input className={`patrolInput ${invalidClass}`} type='text' autoFocus value={this.state.regex} onChange={this.handleChange}></input>
        <button className='button -size-sm' onClick={this.handleAddClick}>
          { this.state.isEditing ? 'Update' : 'Add' } Patrol
        </button>
        <button className='button -size-sm button--subtle' onClick={this.props.onCancel}>Cancel</button>
      </div>
    )
  }
}

export default PatrolInput
