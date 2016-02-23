/**
 * This is main process of Electron, started as first thing when your
 * app starts. This script is running through entire life of your application.
 * It doesn't have any windows which you can see on screen, but we can open
 * window from here.
 */

// Handle win startup events asap
let start = () => {
  if (require('electron-squirrel-startup')) return
}
start()

import { app, BrowserWindow, autoUpdater, ipcMain } from 'electron'
import windowStateKeeper from './vendor/electron_boilerplate/window_state'
import devHelper from './vendor/electron_boilerplate/dev_helper'
import env from './lib/env'

// Create a reference to the main window
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

  if (env.name === 'test') {

    mainWindow = new BrowserWindow({
      width: 1000,
      height: 600,
      title: 'Elate',
      background: '#fff',
      show: true
    })

    mainWindow.loadURL('file://' + __dirname + '/spec.html')

    // In a test env we hide every window that gets created
    ipcMain.on('tests-finished', () => {
      //app.quit()
    })

    // Pretty print test logs and update dock on errors
    let tests = 0
    ipcMain.on('test-logs', (event, message) => {
      if(message.indexOf('✗') !== -1 ) {
        console.log('\x1b[31m%s\x1b[0m', message)
        tests++
        app.dock.setBadge(`${tests}`)
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
      title: 'Elate',
      titleBarStyle: 'hidden-inset',
      background: '#181818',
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
      background: '#181818',
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
