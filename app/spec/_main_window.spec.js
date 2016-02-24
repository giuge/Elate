import React from 'react'
import { render } from 'enzyme'

import { fakeLibrary } from './fixtures/fake_library'
import MainWindow from './../components/main_window'


describe('Main window', () => {

  it('shows the preview view', () => {
    const wrapper = render(
      <MainWindow library = {fakeLibrary}
        shouldShowPreview = {true}
        selectedItem = {fakeLibrary[0]} />
    )

    const previewView = wrapper.find('.mediaPreview')
    expect(previewView.length).toBeGreaterThan(0)
  })


  it('shows the library view', () => {
    const wrapper = render(<MainWindow library = {fakeLibrary} />)
    const libraryView = wrapper.find('.listView')
    expect(libraryView.length).toBeGreaterThan(0)
  })


  it('shows the sidebar', () => {
    const wrapper = render(<MainWindow library = {fakeLibrary} />)
    const sidebar = wrapper.find('.sidebar')
    expect(sidebar.length).toBeGreaterThan(0)
  })


  it('shows the topbar', () => {
    const wrapper = render(<MainWindow library = {fakeLibrary} />)
    const topbar = wrapper.find('.topBar')
    expect(topbar.length).toBeGreaterThan(0)
  })

})
