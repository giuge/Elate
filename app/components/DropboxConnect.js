import React, { Component } from 'react'
import { APP_KEY, APP_SECRET, OAUTH_REDIRECT_URL } from 'lib/costants'
import remote from 'remote'

import AccountActions from 'actions/AccountActions'

let BrowserWinow = remote.BrowserWindow


export default class DropboxConnect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      session: Math.random().toString(10)
    }
  }

  handleCallback(url) {
    let token = /access_token=([^&]+)/.exec(url)[1] || null
    let state = /state=([^&]+)/.exec(url)[1] || null

    if(state === this.state.session) {
      let accessToken = { token }
      AccountActions.saveUserInfo(accessToken)
    }

    return
  }

  handleClick() {
    let currentWindow = remote.getCurrentWindow()
    let baseURL = 'https://www.dropbox.com/1/oauth2/authorize'
    let loginWindow = new BrowserWinow({
      backgroundColor: '#fff',
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      titleBarStyle: 'hidden-inset',
      title: 'Elate',
      disablewebsecurity: false,
      nodeIntegration: false,
      show: false
    })

    loginWindow.loadURL(`${baseURL}?client_id=${APP_KEY}&redirect_uri=${OAUTH_REDIRECT_URL}&state=${this.state.session}&response_type=token`)

    currentWindow.hide()
    loginWindow.show()

    loginWindow.on('closed', () => {
      loginWindow = null
      currentWindow.show()
    })

    loginWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
      event.preventDefault()
      loginWindow.destroy()
      loginWindow = null
      this.handleCallback(newUrl)
    })

  }

  render () {
    return (
      <a onClick={() => { this.handleClick() }}>
      Login to Dropbox</a>
    )
  }
}
