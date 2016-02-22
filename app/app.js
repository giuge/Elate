// This is the entry point for the renderer process.
// The actual app code starts here.

import { ipcRenderer, remote } from 'electron'
import React from 'react'
import { render } from 'react-dom'
import App from './components/app'
import buildMenu from './lib/menu'

buildMenu()


ipcRenderer.on('update-downloaded', () => {
  let shouldUpdate = confirm("An update has been downloaded. Do you want to install it?")
  if(shouldUpdate) ipcRenderer.send('updateRequired')
  return
})

render(<App />, document.getElementById('app'))
