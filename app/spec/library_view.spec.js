import React from 'react'
import { mount } from 'enzyme'

import { fakeLibrary } from './fixtures/fake_library'
import LibraryView from './../components/library_view'


describe('Library view', () => {

  let wrapper
  beforeAll(() => {
    wrapper = mount(<LibraryView />)
    wrapper.setProps({ library: fakeLibrary })
  })

  afterAll(() => {
    wrapper.unmount()
  })


  it('shows a given library', () => {
    let media = wrapper.find('.picture').children()
    expect(media.length).toBeGreaterThan(0)
  })


  it('splits the library by date', () => {
    let date = wrapper.children().find('.date')
    expect(date.length).toBe(2)
  })


  it('shows the location for a chunk', () => {
    let location = wrapper.children().find('.location')
    expect(location.nodes[0].textContent).toBe('Barcelona - Spain')
    expect(location.nodes[1].textContent).toBe('Aghir - Tunisia')
  })

})
