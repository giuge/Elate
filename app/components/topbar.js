import React, { Component } from 'react'
import remote from 'remote'


export default class TopBar extends Component {
  constructor(props) {
    super(props)

    this.currentWindow = remote.getCurrentWindow()
  }

  closeWindow() {
    this.currentWindow.close()
  }

  minimizeWindow() {
    this.currentWindow.minimize()
  }

  maximizeWindow() {
    this.currentWindow.maximize()
  }

  render () {
    return (
      <div className='topBar' onDoubleClick={() => { this.maximizeWindow() }}>
        <ul className={`titleBar ${process.platform}`}>
          <li className='close' onClick={() => { this.closeWindow() }} />
          <li className='minimize' onClick={() => { this.minimizeWindow() }} />
          <li className='fullscreen' onClick={() => { this.maximizeWindow() }} />
        </ul>
      </div>
    )
  }
}
