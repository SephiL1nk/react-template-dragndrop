import React, { Component } from 'react'
import _ from 'lodash'

class ComponentAsContent extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children}
      </React.Fragment>
    )
  }
}

ComponentAsContent.defaultProps = {
  children: null
}

export default ComponentAsContent