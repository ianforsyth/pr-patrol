import React from 'react'

class Patrol extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let patrol = this.props.patrol

    return (
      <div>{patrol.regex}</div>
    )
  }
}

export default Patrol
