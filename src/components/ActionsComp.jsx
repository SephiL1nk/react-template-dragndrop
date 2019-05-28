import React, { Component } from 'react'
import _ from 'lodash'
import { Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Clear'
class ActionsComp extends Component {
  constructor() {
    super()
    this.state = {
      actions: [
        {
          type: 'delete',
          icon: <DeleteIcon />
        }
      ]
    }
  }

  componentWillMount() {
    const { actions } = this.props

    if (!_.isUndefined(actions) && _.isObject(actions)) {
      _.merge(this.state.actions, actions)
    }
    
  }

  updateElementAction = (params) => {
    if (_.isFunction(this.props.callbackActions)) {
      this.props.callbackActions(params)
    }
  }
  render() {
    const { actions } = this.state
    const { element, parent } = this.props
    return (
      <React.Fragment>
        {!_.isUndefined(actions) && _.isObject(actions) ? 
          _.map(actions, (action, index) => {
            return (
              <Button key={'buttonAction'+index} onClick={() => this.updateElementAction({...action, element, parent})}>{action.icon}</Button>
            )
          }) : null
        }
      </React.Fragment>
    )
  }
}

export default ActionsComp