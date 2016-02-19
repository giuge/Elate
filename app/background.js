// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

// Handle win startup events
// This operation needs to be done asap!
let start = () => {
  if (require('electron-squirrel-startup')) return
}

start()

import { app, BrowserWindow, autoUpdater, ipcMain } from 'electron'
import devHelper from './vendor/electron_boilerplate/dev_helper'
import windowStateKeeper from './vendor/electron_boilerplate/window_state'

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './lib/env'

// Preserver of the window size and position between app launches.
let mainWindow
let mainWindowState = windowStateKeeper('main', {
  width: 1024,
  height: 650
})

app.on('ready', () => {
  if(env.name == 'production') {
    let platform = process.platform
    let updateUrl = `http://updates.elateapp.com/updates/${platform}/latest?${app.getVersion()}`

    autoUpdater.setFeedURL(updateUrl)
    autoUpdater.checkForUpdates()
  }

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    title: 'Elate',
    titleBarStyle: 'hidden-inset',
    background: '#181818',
    // Avoid the white background flash
    show: false
  })

  if (mainWindowState.isMaximized) {
    mainWindow.maximize()
  }

  if (env.name === 'test') {
    mainWindow.loadURL('file://' + __dirname + '/spec.html')
  } else {
    mainWindow.loadURL('file://' + __dirname + '/app.html')
  }

  // Now we can show the window
  mainWindow.webContents.on('did-finish-load', () => {
    setTimeout(function(){
      mainWindow.show()
    }, 40)
  })

  if (env.name !== 'production') {
    devHelper.setDevMenu()
    mainWindow.openDevTools({detached: true})
  }

  // An update is available inform renderer process
  autoUpdater.on('update-downloaded', () => {
    if(mainWindow)
      mainWindow.webContents.send('update-downloaded')
  })

  autoUpdater.on('error', (error) => {
    mainWindow.webContents.executeJavaScript("console.log('Error');")
  })

  ipcMain.on('updateRequired', () => {
    autoUpdater.quitAndInstall()
  })

  mainWindow.on('close', () => {
    mainWindowState.saveState(mainWindow)
    mainWindow = null
  })


})

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit()
  }
})


// OSX only callback - takes care of spawning
// a new app window if needed
app.on('activate', () => {
  if (mainWindow == null) {
    mainWindow = new BrowserWindow({
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height,
      title: 'Elate',
      titleBarStyle: 'hidden-inset',
      background: '#181818',
      // Avoid the white background flash
      show: false
    })

    if (mainWindowState.isMaximized) {
      mainWindow.maximize()
    }

    if (env.name === 'test') {
      mainWindow.loadURL('file://' + __dirname + '/spec.html')
    } else {
      mainWindow.loadURL('file://' + __dirname + '/app.html')
    }

    // Now we can show the window
    mainWindow.webContents.on('did-finish-load', () => {
      setTimeout(function(){
        mainWindow.show()
      }, 40)
    })

    if (env.name !== 'production') {
      devHelper.setDevMenu()
      mainWindow.openDevTools()
    }

    mainWindow.on('close', () => {
      mainWindowState.saveState(mainWindow)
      mainWindow = null
    })
  }
})
