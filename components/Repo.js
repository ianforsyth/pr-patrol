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
      patrols: this.props.repo.patrols
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange(e) {
    this.setState({ newRegex: e.target.value })
  }

  handleClick() {
    PatrolService.create({
      repo_id: this.props.repo.id,
      regex: this.state.newRegex
    }).then((data) => {
      this.setState({ patrols: _.concat(this.state.patrols, data) })
    })
  }

  handleDeletePatrol(id) {
    this.setState({ patrols: _.remove(this.state.patrols, (patrol) => patrol.id == id) })
  }

  render() {
    return (
      <div className='repo'>
        <div className='repo-title'>{this.props.repo.name}</div>
        <input type='text' value={this.state.newRegex} onChange={this.handleChange}></input>
        <button onClick={this.handleClick}>Add</button>
        {
          this.state.patrols.map((patrol, index) => {
            return <Patrol patrol={patrol} key={patrol.id} onDelete={() => this.handleDeletePatrol(patrol.id)}></Patrol>
          })
        }
      </div>
    )
  }
}

export default Repo
