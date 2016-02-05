import React, { Component } from 'react'
import remote from 'remote'

import 'styles/TopBar.scss'

export default class TopBar extends Component {
  constructor(props) {
    super(props)
  }

  handleDoubleClick() {
    let currentWindow = remote.getCurrentWindow()
    let bounds = currentWindow.getBounds()
    if(bounds.width !== screen.width && bounds.height !== screen.height) {
      currentWindow.maximize()
    } else {
      currentWindow.unmaximize()
    }
  }

  render () {
    return (
      <div className='topBar' onDoubleClick={() => { this.handleDoubleClick() }}>
      </div>
    )
  }
}
