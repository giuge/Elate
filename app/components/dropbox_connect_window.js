import React, { Component } from 'react'
import { APP_KEY, APP_SECRET, OAUTH_REDIRECT_URL } from './../lib/constants'
import remote from 'remote'

import TopBar from './topbar'
import AccountActions from './../actions/account_actions'

let BrowserWinow = remote.BrowserWindow


export default class DropboxConnectWindow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      session: Math.random().toString(10)
    }
  }


  /**
   * Dropbox redirects to a URL (OAuth2 flow)
   * that contains the user token and various account info.
   * @param {String} url
   */
  handleCallback(url) {
    let token = /access_token=([^&]+)/.exec(url)[1] || null
    let state = /state=([^&]+)/.exec(url)[1] || null

    if(state === this.state.session && token !== null) {
      let data = {
        token: token,
        has_imported_library: false,
        account_info: null
      }
      AccountActions.saveAfterConnect(data)
    } else this.handleCallback(url)
  }


  /**
   * On click we create a new browser window
   * that opens the dropbox OAuth page that will
   * let the user connects the app to his account and will redirect
   * to the specified URL.
   */
  handleClick() {
    let currentWindow = remote.getCurrentWindow()
    let baseURL = 'https://www.dropbox.com/1/oauth2/authorize'
    let loginWindow = new BrowserWinow({
      backgroundColor: '#fff',
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      title: 'Elate',
      disablewebsecurity: true,
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
      <div className='container'>
        <TopBar />
        <div className='dropboxConnect'>
          <h2>Ready to get started?</h2>
          <a onClick={() => { this.handleClick() }} className='button'>
          Connect to Dropbox</a>
          <img src='assets/intro_logo.png' />
        </div>
      </div>
    )
  }

}
