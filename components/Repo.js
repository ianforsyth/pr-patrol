import React from 'react'
import axois from 'axios'
import Patrol from './Patrol'
import PatrolService from '../networking/PatrolService'
import _ from 'lodash'

class Repo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      newRegex: '',
      patrols: this.props.repo.patrols,
      isAddingPatrol: this.props.preOpenAdd
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleAddClick = this.handleAddClick.bind(this)
    this.handleCancelClick = this.handleCancelClick.bind(this)
    this.handleAddPatrolClick = this.handleAddPatrolClick.bind(this)
  }

  handleChange(e) {
    this.setState({ newRegex: e.target.value })
  }

  handleAddClick() {
    PatrolService.create({
      repo_id: this.props.repo.id,
      regex: this.state.newRegex
    }).then((data) => {
      this.setState({ patrols: _.concat([data], this.state.patrols) })
    })
  }

  handleCancelClick() {
    this.setState({ isAddingPatrol: false })
  }

  handleAddPatrolClick() {
    this.setState({ isAddingPatrol: true })
  }

  handleDeletePatrolClick(id) {
    this.setState({ patrols: _.remove(this.state.patrols, (patrol) => patrol.id == id) })
  }

  render() {
    return (
      <div className='repo'>
        <div className='repo-head'>
          <div className='repo-title'>
            {this.props.repo.name}
            <span className='far fa-trash-alt actionIcon repo-delete' onClick={this.props.onDelete}></span>
          </div>
          <div className='repo-actions'>
            <button className='button repo-addPatrol' disabled={this.state.isAddingPatrol} onClick={this.handleAddPatrolClick}>Add Patrol</button>
          </div>
        </div>
        { this.state.isAddingPatrol &&
          <div>
            <input type='text' value={this.state.newRegex} onChange={this.handleChange}></input>
            <button onClick={this.handleAddClick}>Add</button>
            <button onClick={this.handleCancelClick}>Cancel</button>
          </div>
        }
        {
          this.state.patrols.map((patrol, index) => {
            return <Patrol patrol={patrol} key={patrol.id} onDelete={() => this.handleDeletePatrolClick(patrol.id)}></Patrol>
          })
        }
      </div>
    )
  }
}

export default Repo
