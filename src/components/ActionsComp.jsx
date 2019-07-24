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
          type: 'deleteAction',
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
    const { element, parent, parameters } = this.props
    const { disableDelete } = parameters
    return (
      <React.Fragment>
        {!_.isUndefined(actions) && _.isObject(actions) ? 
          _.map(actions, (action, index) => {
            if (action.type === 'deleteAction') {
              return (
                <Button key={'buttonAction'+index} disabled={!_.isNil(disableDelete) ? disableDelete : false} onClick={() => this.updateElementAction({...action, element, parent})}>{action.icon}</Button>
              )
            } else {
              return (<Button key={'buttonAction'+index} disabled={!_.isNil(action.disabled) ? action.disabled : false} onClick={() => this.updateElementAction({...action, element, parent})}>{action.icon}</Button>)
            } 
          }) : null
        }
      </React.Fragment>
    )
  }
}

ActionsComp.defaultProps = {
  parameters: {}
}

export default ActionsComp