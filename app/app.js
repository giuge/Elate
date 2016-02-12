import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import buildMenu from './lib/menu'

buildMenu()
render(<App />, document.getElementById('app'))
