import { app, BrowserWindow, autoUpdater, ipcMain } from 'electron'
import devHelper from './vendor/electron_boilerplate/dev_helper'
import env from './lib/env'

import handleTestWindow from './browser/test_window'
import handleMainWindow from './browser/main_window'



// Handle win startup events
// This operation needs to be done asap!
let start = () => {
  if (require('electron-squirrel-startup')) return
}
start()


// Show the right window
if (env.name === 'test') {
  handleTestWindow()
} else {
  handleMainWindow()
}
