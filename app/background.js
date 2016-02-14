// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, BrowserWindow, autoUpdater, ipcMain } from 'electron'
import devHelper from './vendor/electron_boilerplate/dev_helper'
import windowStateKeeper from './vendor/electron_boilerplate/window_state'
import os from 'os'

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './lib/env'

var mainWindow

// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
  width: 1024,
  height: 650
})

app.on('ready', () => {
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

  if (env.name === 'production' && process.platform === 'darwin') {
    let updateUrl = 'https://elate.herokuapp.com/update'
    let platform = `${os.platform()}_${os.arch()}`
    let version = app.getVersion()

    autoUpdater.setFeedURL(`${updateUrl}?version=${version}&platform=osx`)
    autoUpdater.checkForUpdates()
  }

  // An update is available inform renderer process
  autoUpdater.on('update-available', () => {
    if(mainWindow)
      mainWindow.webContents.send('update-available')
  })

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.executeJavaScript("alert('Update downloaded');")
    if(mainWindow)
      mainWindow.webContents.send('update-downloaded')
  })

  autoUpdater.on('error', (error) => {
    mainWindow.webContents.executeJavaScript(`alert(${error})`)
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
