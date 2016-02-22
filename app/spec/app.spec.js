import React from 'react'
import { shallow, mount } from 'enzyme'
import TestUtils from 'react-addons-test-utils'

import { MEDIA_FOLDER } from './../lib/constants'
import App from './../components/app'


describe('Main app', () => {

  it('should use the correct Dropbox folder', () => {
    expect(MEDIA_FOLDER).toBe('/Camera Uploads')
  })

  it('should pass tests', () => {
    expect(true).toBe(true)
  })

  it('should fail tests', () => {
    expect(false).toBe(true)
  })

  xit('should skip tests', () => {
    expect(true).toBe(true)
  })

})
