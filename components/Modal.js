import React from 'react'

class Modal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='modal-container'>
        <div className = 'modal'>
          <div className='modal-head'>
            <div className='modal-title'>{ this.props.title }</div>
            <div className='modal-close' onClick={this.props.onClose}>X</div>
          </div>
          <div className='modal-content'>{ this.props.children }</div>
        </div>
      </div>
    )
  }
}

export default Modal
