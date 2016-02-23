import jetpack from 'fs-jetpack'
import path from 'path'
import React from 'react'
import { render } from 'enzyme'

import { MEDIA_FOLDER, USER_DATA } from './../lib/constants'
import { WindowLoader } from './../components/window_loader'


describe('Elate', () => {

  it('fetches media from the correct folder', () => {
    expect(MEDIA_FOLDER).toBe('/Camera Uploads')
  })


  it('has an account database', () => {
    const accountDBPath = path.join(USER_DATA, 'account.db')
    const db = jetpack.exists(accountDBPath)
    expect(db).not.toBe(false)
  })


  it('has a library database', () => {
    const libraryDBPath = path.join(USER_DATA, 'library.db')
    const db = jetpack.exists(libraryDBPath)
    expect(db).not.toBe(false)
  })


  it('shows the login window', () => {
    const wrapper = render(
      <WindowLoader has_token = {false}
        has_imported_library = {false} />
    )
    const login = wrapper.find('.dropboxConnect')
    expect(login.length).toBeGreaterThan(0)
  })


  it('shows the import library window', () => {
    const wrapper = render(
      <WindowLoader has_token = {true}
        has_imported_library = {false} />
    )
    const library = wrapper.find('.welcome')
    expect(library.length).toBeGreaterThan(0)
  })


  it('shows the user media window', () => {
    const wrapper = render(
      <WindowLoader has_token = {true}
        has_imported_library = {true} />
    )
    const mediaView = wrapper.find('.listView')
    expect(mediaView.length).toBeGreaterThan(0)
  })

})
