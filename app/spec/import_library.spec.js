import React from 'react'
import { render, mount } from 'enzyme'
import sinon from 'sinon'
import { fakeLibrary } from './fixtures/fake_library'

import ImportLibraryWindow from './../components/import_library_window'
import dropbox from './../lib/dropbox'


describe('Library importer', () => {

  it('fetches the user media list', () => {
    sinon.spy(dropbox, 'getFileList')
    const wrapper = mount(<ImportLibraryWindow />)
    expect(dropbox.getFileList.calledOnce).toBe(true)
  })


  it('fetches the user library on click', () => {
    sinon.spy(ImportLibraryWindow.prototype, 'handleClick')
    const wrapper = mount(<ImportLibraryWindow />)

    wrapper.setState({
      isImporting: false,
      mediaToImport: fakeLibrary
    })

    wrapper.find('.button').simulate('click')
    expect(ImportLibraryWindow.prototype.handleClick.calledOnce).toBe(true)
  })

})
