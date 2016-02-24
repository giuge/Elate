import React from 'react'
import { render, mount } from 'enzyme'
import sinon from 'sinon'
import { fakeLibrary } from './fixtures/fake_library'

import ImportLibrary from './../components/import_library'
import dropbox from './../lib/dropbox'


describe('Library importer', () => {

  it('fetches the user media list', () => {
    sinon.spy(dropbox, 'getFileList')
    const wrapper = mount(<ImportLibrary />)
    expect(dropbox.getFileList.calledOnce).toBe(true)
  })


  it('fetches the user library on click', () => {
    sinon.spy(ImportLibrary.prototype, 'handleClick')
    const wrapper = mount(<ImportLibrary />)

    wrapper.setState({
      isImporting: false,
      mediaToImport: fakeLibrary
    })

    wrapper.find('.button').simulate('click')
    expect(ImportLibrary.prototype.handleClick.calledOnce).toBe(true)
  })

})
