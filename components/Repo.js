import React from 'react'
import axois from 'axios'
import Patrol from './Patrol'
import PatrolService from '../networking/PatrolService'

class Repo extends React.Component {
  constructor(props) {
    super(props)

    this.state = { newRegex: '' }
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
      console.log(data)
    })
  }

  render() {
    return (
      <div>
        <div>{this.props.repo.name}</div>
        <input type="text" value={this.state.newRegex} onChange={this.handleChange}></input>
        <button onClick={this.handleClick}>Add</button>
      </div>
    )
  }
}

export default Repo
