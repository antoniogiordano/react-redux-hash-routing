/**
 * Created by antoniogiordano on 08/06/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import _ from 'lodash'

export const SWITCH_PAGE = 'REACT_REDUX_HASH_ROUTING_SWITCH_PAGE'

class HashRouterComponent extends React.Component {
  constructor (props) {
    super (props)
    window.addEventListener("hashchange", this.executeLocation.bind(this), false)
  }

  componentDidMount () {
    this.executeLocation()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.pageKey !== nextProps.pageKey) this.executeLocation()
  }

  executeLocation () {
    const {switchPage, pageKeyStateName, children} = this.props

    if (!pageKeyStateName) return null

    let hash = (typeof window.location !== 'undefined') ? window.location.hash : '#'
    let locArray = hash.split('/')
    let locations = []
    let scores = []
    let childes = []
    let params = []
    React.Children.map(children, (child) => {
      let childArray = child.props['hash'].split('/')
      locations.push(childArray)
      scores.push(0)
      childes.push(child)
      params.push({})
    })

    const regexParam = /^{(.*)}$/
    for (let j = 0; j < locations.length; j++) {
      for (let i = 0; i < locArray, i < locations[j].length; i++) {
        if (locArray[i] === locations[j][i]) {
          scores[j] += 100
        } else if (locations[j][i].match(regexParam, '$1') !== null) {
          scores[j] += 1
          params[j][locations[j][i].match(regexParam, '$1')[1]] = locArray[i]
        }
      }
    }

    if (locations.length > 0) {
      var max = 0
      var maxId = 0
      for (let i = 0; i < scores.length; i++) {
        if (scores[i] > max) {
          max = scores[i]
          maxId = i
        }
      }

      switchPage(pageKeyStateName, childes[maxId].props.pageKey, params[maxId])
    }
  }

  render () {
    const {pageKey} = this.props
    let matchElem = null

    React.Children.map(this.props.children, (child) => {
      if (pageKey && pageKey.toString() === child.props['pageKey'].toString()) matchElem = child
    })

    return matchElem || <div></div>
  }
}

HashRouterComponent.propTypes = {
  pageKeyStateName: PropTypes.string.isRequired,
  pageKey: PropTypes.string
}

export class Route extends React.Component {
  render () {
    return this.props.children
  }
}

Route.propTypes = {
  pageKey: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired
}

class HashRouter extends React.Component {
  render () {
    const {pageKeyStateName, children} = this.props

    return React.createElement(connect((state) => { return {pageKeyStateName, pageKey: state[pageKeyStateName]} }, (dispatch) => {
      return {
        switchPage: (pageKeyStateName, pageKey, params) => {
          dispatch({
            type: SWITCH_PAGE, pageKeyStateName, pageKey, params
          })
        }
      }
    })(HashRouterComponent), null, children)
  }
}

export default HashRouter
