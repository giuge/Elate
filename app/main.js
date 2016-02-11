'use strict'

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Updater = require('electron-gh-releases')

let mainWindow
let options = {
  repo: 'giuge/Elate',
  currentVersion: app.getVersion()
}
const updater = new Updater(options)

require('crash-reporter').start()


app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    localStorage.clear()
    app.quit()
  }
})

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    backgroundColor: '#fff',
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hidden-inset',
    title: 'Elate',
    disablewebsecurity: true,
    // Avoid the white background flash
    // show: false
    // Not needed since we use light theme
  })

  mainWindow.loadURL('file://' + __dirname + '/index.html')

  updater.check((err, status) => {
    console.log(status)
    if (!err && status) {
      // Download the update
      updater.download()
    }
  })

  // Now we can show the window
  // mainWindow.webContents.on('did-finish-load', () => {
  //   setTimeout(function(){
  //     mainWindow.show()
  //   }, 40)
  // })
  // Not needed since we use light theme

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
      backgroundColor: '#fff',
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
