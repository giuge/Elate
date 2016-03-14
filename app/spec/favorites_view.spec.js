import React from 'react'
import { mount } from 'enzyme'

import FavoritesView from './../components/favorites_view'


describe('Favorites view', () => {

  let wrapper
  beforeAll(() => {
    wrapper = mount(<FavoritesView />)
    wrapper.setProps({ favorites: [], emptyFavorites: true })
  })

  afterAll(() => {
    wrapper.unmount()
  })


  it('shows the empty state given no favorites', () => {
    wrapper.setProps({library: [], emptyLibrary: true})

    let location = wrapper.find('.favoritesEmpty')
    expect(location.nodes.length).toBeGreaterThan(0)
  })

})
