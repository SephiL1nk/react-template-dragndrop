import React, { Component } from 'react'
import { Grid, Paper } from '@material-ui/core'
import { Draggable } from 'react-beautiful-dnd'
import DroppableComp from './DroppableComp.jsx'
import _ from 'lodash'
import ActionsComp from './ActionsComp.jsx'
import ComponentAsContent from './ComponentAsContent.jsx'

class DraggableComp extends Component {
  constructor() {
    super()
    this.state = {
      grid: {
        lg:12,
        md:12,
        sm:12,
        xs:12,
      }
    }
  }

  componentDidMount() {
    const { grid } = this.props.item
    this.setState({grid: {...this.state.grid, ...grid}})
  }

  stringToHtml = (content) => {
    return {__html: content};
  }
  /**
   * Rendering
   */
  render() {
    const { id, action, index, type, content, parameters } = this.props.item
    const { draggableKey, actions, item, page, parentNode, containerAction } = this.props
    const { grid } = this.state

    const newIndex = id.match(/[0-9]+$/g)[0]

    console.log(parameters)

    return (
      <React.Fragment>
        {/* Grid Item */}
        <Grid 
          key={'griditem_'+id} 
          style={{maxWidth: '100%'}}
          item
          lg={grid.lg}
          md={grid.md}
          sm={grid.sm}
          xs={grid.xs}
        >
          {/* A Draggable component can be dragged around it's own Droppable container : https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/draggable.md */}
          <Draggable key={id} draggableId={draggableKey+'_'+id} index={this.props.index} >
            {(provided) => (
              <div 
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
              >
                <Paper style={{padding: '25px 25px 25px 25px', margin: '5px 5px 5px 5px'}}>
                  {/* Block/Container global Actions */}
                  <ActionsComp key={'actions_'+id} actions={actions} element={id} parent={parentNode} parameters={parameters} callbackActions={this.props.callbackActions}/>
                  {/* Block/Container specific actions (override by the developers) */}
                  {/* Page Content */}
                  {_.isNull(content) || _.isUndefined(content) && _.isEmpty(index) ? 
                    !_.isUndefined(containerAction) && type === 'container' && containerAction({newIndex}) || !_.isUndefined(action) && type === 'block' && action : 
                    <React.Fragment>
                      {_.isString((content)) ?
                      <div dangerouslySetInnerHTML={this.stringToHtml(content)} /> : 
                      <ComponentAsContent>
                        {!_.isEmpty(content) && content}
                      </ComponentAsContent>
                    }
                    </React.Fragment>
                    }
                  {/* If index is defined, it means that it can continue to go deeper and create more nested lists */}
                  {!_.isUndefined(index) && !_.isEmpty(index) && 
                    <DroppableComp
                      type={type}
                      key={type+'_'+id}
                      item={item}
                      parameters={item.parameters}
                      callbackActions={this.props.callbackActions}
                      page={page}
                    />
                  }
                </Paper>   
              </div>
            )}
          </Draggable>
        </Grid>
      </React.Fragment>
    )
  }
}

export default DraggableComp