import React, { Component } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import _ from 'lodash'
import DraggableComp from './DraggableComp.jsx'
import { Grid } from '@material-ui/core'

class DroppableComp extends Component {
  constructor() {
    super()
  }

  /**
   * Rendering
   */
  render() {
    const { item, actions, page, containerAction } = this.props
    const target = item.type === 'page' ? page.containers : page.blocks
    const { direction } = this.props && !_.isUndefined(this.props.parameters) && this.props.parameters

    return (
      <React.Fragment>
        {!_.isUndefined(item.actions) && item.actions}
        {/* Droppable provide the container for the draggables components https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/droppable.md  */}
        <Droppable type={!_.isUndefined(item.id) ? 'droppable_'+item.id : 'droppable'} droppableId={!_.isUndefined(item.id) ? item.id : 'page'} direction={!_.isUndefined(direction) ? direction : 'vertical' }>
          {(provided) => (
            <div
              ref = {provided.innerRef}
              {...provided.droppableProps}
            >
              {/* Grid used to determine which direction the items are taking (vertical or horizontal) */}
              <Grid
                key={'grid_'+item.id}
                container
                direction={!_.isUndefined(direction) && direction === 'vertical' ? 'column' : 'row'}
                justify="flex-start"
                alignItems="stretch"
              >
                {!_.isEmpty(item.index) && !_.isEmpty(target) && _.map(item.index, ((elementIndex, index) => {
                  return (
                    <DraggableComp 
                      key={target[elementIndex].id} 
                      item={target[elementIndex]} 
                      draggableKey={!_.isUndefined(item.id) ? 'draggable_'+item.id : 'page'} 
                      parentNode={!_.isUndefined(item.id) ? item.id : 'page'}
                      index={index} 
                      actions={actions} 
                      callbackActions={this.props.callbackActions}
                      page={page}
                      containerAction={containerAction}
                    />)
                }))}
              </Grid>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </React.Fragment>
    )
  }
}

export default DroppableComp