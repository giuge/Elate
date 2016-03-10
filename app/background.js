/**
 * This is main process of Electron, started as first thing when your
 * app starts. This script is running through entire life of your application.
 * It doesn't have any windows which you can see on screen, but we can open
 * window from here.
 */

// Handle win startup events asap
setTimeout(() => { if (require('electron-squirrel-startup')) return }, 0)
// Log uncaught exceptions
process.on('uncaughtException', error => console.error(error.stack))


import { app, BrowserWindow, autoUpdater, ipcMain } from 'electron'
import windowStateKeeper from './vendor/electron_boilerplate/window_state'
import devHelper from './vendor/electron_boilerplate/dev_helper'
import env from './lib/env'

// Create a reference to the main window
let mainWindow
let mainWindowState = windowStateKeeper('main', {
  width: 1000,
  height: 600,
  minWidth: 950,
  minHeight: 550,
  backgroundColor: '#1E1E1E'
})

app.on('ready', () => {
  if(env.name == 'production') {
    let platform = process.platform
    let updateUrl = `http://updates.elateapp.com/updates/${platform}/latest?${app.getVersion()}`

    autoUpdater.setFeedURL(updateUrl)
    autoUpdater.checkForUpdates()
  }

  if (env.name === 'test') {

    mainWindow = new BrowserWindow({
      width: 1000,
      height: 600,
      title: 'Elate',
      backgroundColor: '#fff',
      show: true
    })

    mainWindow.loadURL('file://' + __dirname + '/spec.html')

    // Quit the app when tests are finished
    ipcMain.on('tests-finished', () => {
      //app.quit()
    })

    // Pretty print test logs
    ipcMain.on('test-logs', (event, message) => {
      if(message.indexOf('✗') !== -1 ) {
        console.log('\x1b[31m%s\x1b[0m', message)
      } else if (message.indexOf('✓') !== -1) {
        console.log('\x1b[32m%s\x1b[0m', message)
      } else if (message.indexOf('#') !== -1) {
        console.log('\x1b[2m%s\x1b[0m', message)
      } else if (message.indexOf('-') !== -1) {
        console.log('\x1b[33m%s\x1b[0m', message)
      } else {
        console.log('\x1b[1m%s\x1b[0m', message)
      }
    })
  } else {
    mainWindow = new BrowserWindow({
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height,
      minWidth: 950,
      minHeight: 550,
      title: 'Elate',
      //titleBarStyle: 'hidden-inset',
      backgroundColor: '#1E1E1E',
      frame: false,
      // Avoid the white background flash since it's a dark UI
      show: false
    })

    if (mainWindowState.isMaximized) {
      mainWindow.maximize()
    }

    mainWindow.loadURL('file://' + __dirname + '/app.html')

    // Avoid the white background flash since it's a dark UI
    mainWindow.webContents.on('did-finish-load', () => {
      setTimeout(function(){
        mainWindow.show()
      }, 40)
    })

    if (env.name !== 'production' && env.name !== 'test') {
      mainWindow.openDevTools({detached: true})
    }

    // An update is available inform renderer process
    autoUpdater.on('update-downloaded', () => {
      if(mainWindow)
        mainWindow.webContents.send('update-downloaded')
    })

    autoUpdater.on('error', (error) => {
      mainWindow.webContents.executeJavaScript("console.log('Error')")
    })

    ipcMain.on('updateRequired', () => {
      autoUpdater.quitAndInstall()
    })

    mainWindow.on('close', () => {
      mainWindowState.saveState(mainWindow)
      mainWindow = null
    })
  }
})

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit()
  }
})


/**
 * OSX only callback - takes care of spawning
 * a new app window if needed
 */
app.on('activate', () => {
  if (mainWindow == null) {
    mainWindow = new BrowserWindow({
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height,
      title: 'Elate',
      titleBarStyle: 'hidden-inset',
      backgroundColor: '#181818',
      frame: false,
      // Avoid the white background flash since it's a dark UI
      show: false
    })

    if (mainWindowState.isMaximized) {
      mainWindow.maximize()
    }

    mainWindow.loadURL('file://' + __dirname + '/app.html')

    // Avoid the white background flash since it's a dark UI
    mainWindow.webContents.on('did-finish-load', () => {
      setTimeout(function(){
        mainWindow.show()
      }, 40)
    })

    if (env.name !== 'production') {
      mainWindow.openDevTools()
    }

    mainWindow.on('close', () => {
      mainWindowState.saveState(mainWindow)
      mainWindow = null
    })
  }
})
