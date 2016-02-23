import React from 'react'
import { ipcRenderer, remote } from 'electron'
import sinon from 'sinon'
import { render, mount } from 'enzyme'

import DropboxConnect from './../components/dropbox_connect'


describe('Dropbox login', () => {

  it('shows a login button', () => {
    const wrapper = render(<DropboxConnect />)
    let button = wrapper.find('.button')
    expect(button.length).toBeGreaterThan(0)
  })


  it('shows the dropbox login page on click', (done) => {
    const onButtonClick = sinon.spy()
    const wrapper = mount(<DropboxConnect />)

    wrapper.find('.button').simulate('click')

    let title = ''
    let win = remote.BrowserWindow.getAllWindows()

    setTimeout(() => {
      title = win[0].getTitle()
      expect(title).toBe('Dropbox - API Request Authorization - Sign in')
      win[0].destroy()
      done()
    }, 3000)

  })

})
