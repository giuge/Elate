import React from 'react'
import { render } from 'enzyme'
import TestUtils from 'react-addons-test-utils'

import { MEDIA_FOLDER } from './../lib/constants'
import { App } from './../components/app'


describe('Elate', () => {
  
  it('uses the correct Dropbox folder', () => {
    expect(MEDIA_FOLDER).toBe('/Camera Uploads')
  })


  it('shows the login window', () => {
    const wrapper = render(<App has_token={false} has_imported_library={false} />)
    const login = wrapper.find('.dropboxConnect').children()
    expect(login.length).toBeGreaterThan(0)
  })


  it('shows the import library window', () => {
    const wrapper = render(<App has_token={true} has_imported_library={false} />)
    const library = wrapper.find('.welcome').children()
    expect(library.length).toBeGreaterThan(0)
  })


  it('shows the user media window', () => {
    const wrapper = render(<App has_token={true} has_imported_library={true} />)
    const mediaView = wrapper.find('.listView').children()
    expect(mediaView.length).toBeGreaterThan(0)
  })

})
