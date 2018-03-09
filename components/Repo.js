import React from 'react'
import axois from 'axios'
import PatrolService from '../networking/PatrolService'

import Patrol from './Patrol'
import PatrolInput from './PatrolInput'

import _ from 'lodash'

class Repo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      patrols: this.props.repo.patrols,
      isAddingPatrol: this.props.openPatrolPrompt
    }

    this.handleAddClick = this.handleAddClick.bind(this)
    this.handleCancelClick = this.handleCancelClick.bind(this)
    this.handleAddPatrolClick = this.handleAddPatrolClick.bind(this)
  }

  handleAddClick(patrol) {
    this.setState({
      patrols: _.concat([patrol], this.state.patrols),
      isAddingPatrol: false
    })
  }

  handleCancelClick() {
    this.setState({ isAddingPatrol: false })
  }

  handleAddPatrolClick() {
    this.setState({ isAddingPatrol: true })
  }

  handleDeletePatrolClick(id) {
    this.setState({ patrols: _.reject(this.state.patrols, (patrol) => patrol.id == id) })
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
            { !this.state.isAddingPatrol &&
              <button className='button -size-sm' onClick={this.handleAddPatrolClick}>Add Patrol</button>
            }
          </div>
        </div>
        { this.state.isAddingPatrol &&
          <div className='repo-patrolPrompt'>
            <p className='repo-patrolDescription'>
              Patrols are substrings of filenames. When a PR makes changes to a file and
              the filename includes your patrol, you'll receive an email alert.
            </p>
            <PatrolInput
              onCancel={this.handleCancelClick}
              onSubmit={this.handleAddClick}
              repoId={this.props.repo.id}
              value={this.state.newRegex}>
            </PatrolInput>
          </div>
        }
        {
          this.state.patrols.map((patrol) => {
            return <Patrol patrol={patrol} key={patrol.id} onDelete={() => this.handleDeletePatrolClick(patrol.id)}></Patrol>
          })
        }
      </div>
    )
  }
}

export default Repo
