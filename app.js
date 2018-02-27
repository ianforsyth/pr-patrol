import './styles/style.scss'

import React from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Home from './components/Home'

ReactDOM.render(
  <Router>
    <Route path="/" component={Home}>
    </Route>
  </Router>,

  document.getElementById('app')
)
