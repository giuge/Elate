/**
 * This is the entry point for the renderer process.
 * The actual app code starts here.
 */

import { ipcRenderer, remote } from 'electron'
import React from 'react'
import { render } from 'react-dom'
import WindowLoader from './components/window_loader'
import buildMenu from './lib/menu'


// TODO: move this out of here and use main process instead
buildMenu()


render(<WindowLoader />, document.getElementById('app'))
