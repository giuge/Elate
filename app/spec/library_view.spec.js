import React from 'react'
import { render } from 'enzyme'

import { fakeLibrary } from './fixtures/fake_library'
import LibraryView from './../components/library_view'



describe('Library view', () => {

  it('shows a given library', () => {
    const wrapper = render(<LibraryView library = {fakeLibrary} />)
    let media = wrapper.find('.picture').children()
    expect(media.length).toBe(2)
  })


  it('splits the library by date', () => {
    const wrapper = render(<LibraryView library = {fakeLibrary} />)
    let date = wrapper.find('.date')
    expect(date.length).toBe(2)
  })


  it('shows the location for a chunk', () => {
    const wrapper = render(<LibraryView library = {fakeLibrary} />)
    let location = wrapper.find('.location')

    expect(location['0'].children[0].data).toBe('Barcelona - Spain')
    expect(location['1'].children[0].data).toBe('Aghir - Tunisia')
  })

})
