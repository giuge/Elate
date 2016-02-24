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


  it('shows the dropbox login page on click', () => {
    const onButtonClick = sinon.spy()
    const wrapper = mount(<DropboxConnect />)

    wrapper.find('.button').simulate('click')

    let title = ''
    let win = remote.BrowserWindow.getAllWindows()

    expect(win.length).toBe(2)
    win[0].destroy()
  })

})
