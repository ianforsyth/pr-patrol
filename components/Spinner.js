import React from 'react'

class Spinner extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const isStatic = !!this.props.height ? 'isStatic' : ''
    const heightStyle = !!this.props.height ? { height: this.props.height } : {}

    return (
      <div className={`spinner-container ${isStatic}`} style={heightStyle}>
        <div className='spinner'></div>
      </div>
    )
  }
}

export default Spinner
