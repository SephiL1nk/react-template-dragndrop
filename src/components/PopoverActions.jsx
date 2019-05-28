import React, { Component } from 'react'
import { Button, Popover } from '@material-ui/core'
import _ from 'lodash'
class PopoverActions extends Component {
  constructor() {
    super()
    this.state = {
      open: false
    }
  }

  onClick = () => {
    this.setState({open: !this.state.open})
  }

  render() {
    const { children, actiontext } = this.props
    return (
      <React.Fragment>
        <Button onClick={this.onClick} buttonRef={node => {this.anchorEl = node}}>
          {!_.isUndefined(actiontext) ? actiontext : 'Open Popover'}
        </Button>
        <Popover 
          onClose={this.onClick}
          open={this.state.open}
          anchorEl={this.anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {!_.isUndefined(children) ? children : null}
        </Popover>
      </React.Fragment>
    )
  }
}

export default PopoverActions