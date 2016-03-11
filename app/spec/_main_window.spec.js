import React from 'react'
import { render, mount } from 'enzyme'

import { fakeLibrary } from './fixtures/fake_library'
import MainWindow from './../components/main_window'


describe('Main window', () => {

  let wrapper
  beforeAll(() => {
    wrapper = mount(<MainWindow />)
    wrapper.setProps({
      library: fakeLibrary,
      previewItem: fakeLibrary[0]
    })
  })


  afterAll(() => {
    wrapper.unmount()
  })


  it('shows the preview view', () => {
    const previewView = wrapper.find('.mediaPreview')
    expect(previewView.length).toBeGreaterThan(0)
  })


  it('shows the library view', () => {
    const libraryView = wrapper.find('.listView')
    expect(libraryView.length).toBeGreaterThan(0)
  })


  it('shows the sidebar', () => {
    const sidebar = wrapper.find('.sidebar')
    expect(sidebar.length).toBeGreaterThan(0)
  })


  it('shows the topbar', () => {
    const topbar = wrapper.find('.topBar')
    expect(topbar.length).toBeGreaterThan(0)
  })

})
