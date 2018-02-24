import React from 'react'
import Patrol from './Patrol'

class Repo extends React.Component {
  constructor(props) {
    super(props)

    this.state = { newRegex: '' }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    this.setState({ newRegex: e.target.value })
  }

  render() {
    let repo = this.props.repo

    return (
      <div>
        <div>{repo.name}</div>
        <input type="text" value={this.state.newRegex} onChange={this.handleChange}></input>
      </div>
    )
  }
}

export default Repo
