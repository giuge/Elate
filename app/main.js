'use strict'

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow


require('crash-reporter').start()

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    localStorage.clear()
    app.quit()
  }
})

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    backgroundColor: '#1E1E1E',
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hidden-inset',
    title: 'Elate',
    disablewebsecurity: true,
    // Avoid the white background flash
    show: false
  })

  mainWindow.loadURL('file://' + __dirname + '/index.html')

  // Now we can show the window
  mainWindow.webContents.on('did-finish-load', () => {
    setTimeout(function(){
      mainWindow.show()
    }, 40)
  })

  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
})

// OSX only callback - takes care of spawning
// a new app window if needed
app.on('activate', () => {
  if (mainWindow == null) {
    mainWindow = new BrowserWindow({
      backgroundColor: '#1E1E1E',
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      titleBarStyle: 'hidden-inset',
      title: 'Elate',
      disablewebsecurity: true,
      show: false
    })
    mainWindow.loadURL('file://' + __dirname + '/index.html')

    mainWindow.webContents.on('did-finish-load', () => {
      setTimeout(function(){
        mainWindow.show()
      }, 40)
    })

    mainWindow.on('closed', () => {
       mainWindow = null
    })
  }
})
