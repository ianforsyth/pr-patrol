import React from 'react'

class Checkbox extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const activeClass = this.props.isActive ? 'stateActive' : ''
    return (
      <div className={`checkbox ${activeClass} ${this.props.className}`} onClick={this.props.onClick}>
        <i className='fas fa-check'></i>
      </div>
    )
  }
}

export default Checkbox

