import React from 'react'
import { shallow, mount } from 'enzyme'
import TestUtils from 'react-addons-test-utils'

import App from './../components/App.js'


describe('Main app', () => {

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
