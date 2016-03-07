import React, { Component } from 'react'
import remote from 'remote'

import NavigationBar from './navigation_bar'
import ActionBar from './action_bar'


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

  renderActionBar() {
    if(this.props.shouldShowActionbar) return <ActionBar />
  }

  render () {
    return (
      <div className='topBar'>
        <ul className={`titleBar ${process.platform}`}>
          <li className='close' onClick={() => { this.closeWindow() }} />
          <li className='minimize' onClick={() => { this.minimizeWindow() }} />
          <li className='fullscreen' onClick={() => { this.maximizeWindow() }} />
        </ul>
        <NavigationBar />
        {this.renderActionBar()}
      </div>
    )
  }
}
