import React, { Component } from 'react'
import remote from 'remote'

import NavigationBar from './navigation_bar'
import ActionBar from './action_bar'


const TopBar = ({shouldShowActionbar, shouldShowNavigationbar}) => {

  const currentWindow = remote.getCurrentWindow()


  const closeWindow = () => {
    currentWindow.close()
  }


  const minimizeWindow = () => {
    currentWindow.minimize()
  }


  const maximizeWindow = () => {
    currentWindow.maximize()
  }


  const renderActionBar = () => {
    if(shouldShowActionbar) return <ActionBar />
  }


  const renderNavigationBar = () => {
    if(shouldShowNavigationbar) return <NavigationBar />
  }


  return (
    <div className={`topBar ${process.platform}`}>
      <ul className='titleBar'>
        <li className='close' onClick={() => { closeWindow() }} />
        <li className='minimize' onClick={() => { minimizeWindow() }} />
        <li className='fullscreen' onClick={() => { maximizeWindow() }} />
      </ul>
      {renderNavigationBar()}
      {renderActionBar()}
    </div>
  )

}


export default TopBar
