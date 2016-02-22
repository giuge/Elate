import { app, BrowserWindow, ipcMain } from 'electron'

let testWindow

export default function handleTestWindow() {

  app.on('ready', () => {
    testWindow = new BrowserWindow({
      width: 1000,
      height: 600,
      title: 'Elate',
      background: '#fff',
      show: false
    })

    testWindow.loadURL('file://' + __dirname + '/spec.html')

    // Print test logs
    ipcMain.on('test-logs', function (event, message) {
      if(message.indexOf('✗') !== -1 ) {
        console.log('\x1b[31m%s\x1b[0m', message)
      } else if (message.indexOf('✓') !== -1) {
        console.log('\x1b[32m%s\x1b[0m', message)
      } else if (message.indexOf('#') !== -1) {
        console.log('\x1b[2m%s\x1b[0m', message)
      } else if (message.indexOf('-') !== -1) {
        console.log('\x1b[33m%s\x1b[0m', message)
      } else {
        console.log(message)
      }
    })

    testWindow.on('close', () => {
      testWindow = null
    })

  })
}
