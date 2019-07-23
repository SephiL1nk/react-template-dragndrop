/** Core */
import React, { Component } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import DroppableComp from './components/DroppableComp.jsx'
/** Services */
import _ from 'lodash'
import { getSemanticAndCss } from './services/semantic.jsx'
import { getGridValues } from './services/grid.jsx'
import { Button } from '@material-ui/core'
import PopoverActions from './components/PopoverActions.jsx'
import OneBlockIcon from '@material-ui/icons/Filter1'
import TwoBlockIcon from '@material-ui/icons/Filter2'
import ThreeBlockIcon from '@material-ui/icons/Filter3'
import FourBlockIcon from '@material-ui/icons/Filter4'
import DeleteIcon from '@material-ui/icons/Clear'
import { formatPage } from './services/manager.jsx'

class Templating extends Component {
  constructor() {
    super()
    this.state = {
      page: {},
      index: 0, //Index to be able to track the number of container and always increment them, even after deleting some of them.
      parameters: {
        //Default direction parameter for the drag'n'drop context.
        direction: 'vertical',    
      }
    }
  }

  // Page structure
  createStructure = () => {
    return {
      type: 'page',
      index: [],
      structure: getSemanticAndCss({element: '.main_page', parent: 'main_template'}),
      actions: null,
      containers: {},
      blocks: {}
    }
  }

  componentDidMount = () => {
    let { page } = this.state
    
    page = {
      ...this.createStructure(),
      actions: <React.Fragment>
                    <PopoverActions>
                      <Button onClick={() => this.addItem('container', {parent: 'page'})}>Add container</Button>
                      <Button onClick={this.save}>Save template</Button>
                    </PopoverActions>
                  </React.Fragment>
    }

    this.setState({page})
  }

  componentDidUpdate = prevProps => {
    if (!_.isEqual(prevProps.page, this.props.page)) {
      //New state for the template dragndrop. Omit React Actions because it throws an error
      const page = _.omit(this.props.page, 'actions')
      if (!_.isEmpty(page) && !_.isUndefined(page.index)) {
        //Old one
        const currentPage = this.state.page
        let final = {...currentPage, ...page}
        this.setState({ page: final, index: _.size(page.containers) })
      }
    }
  }

  /**
   * MANDATORY function to call on end drag'n'drop. To be used to persist changes during the last user action.
   */
  onDragEnd = (result) => {
    const { page } = this.state
    const {destination, source, draggableId } = result
    const regexp = /^([a-zA-Z]+)[\d]*_([a-zA-Z0-9]+)_*([a-zA-Z0-9]*)/g
    const match = regexp.exec(draggableId)
    //Regular check to see if nothing has moved around or if the destination isn't outside the draggable scope
    if (!destination) {
      return null
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return null
    }

    //Case for a container
    if (!_.isNull(match) && !_.isUndefined(match[1]) && !_.isUndefined(match[2]) && match[1] === 'page') {
      let index = page.index
      index.splice(source.index, 1)
      index.splice(destination.index, 0, match[2])
      //case for a block
    } else if (!_.isNull(match) && !_.isUndefined(match[1]) && !_.isUndefined(match[2]) && !_.isUndefined(match[3]) && match[1] === 'draggable') {
      let index = page.containers[match[2]].index
      index.splice(source.index, 1)
      index.splice(destination.index, 0, match[3])
    }

    this.props.update({...this.formatTemplate(), type: 'onDragEnd'})
  }

  /**
   * Add an item to the template
   * @param type String is mandatory. Determines which type of creation to do
   * @param optional Object is optional. Pass parameters that are optionals or for a specific case (e.g blocks parameters)
   */
  addItem = (type, optional) => new Promise(resolve => {
    let newIndex = this.state.index
    let blocks = []
    switch(type) {
      case 'container': 
        newIndex = newIndex+1
        this.addContainer(newIndex, optional)
      break
      case 'block': 
        blocks = this.addBlock(optional)
      break
    }

    this.setState({
      ...this.state,
      index: newIndex
    }, () => this.props.update({...this.formatTemplate(), type: 'addItem', index: newIndex}))
  
    return resolve({...this.formatTemplate(), type: 'addItem', index: newIndex, blocks: blocks})
  }) 
    

  /**
   * Add a new container which contains at start a button to add new contents
   */
  addContainer = (newIndex, optional) => {
    /** get page, containers and the page index */
    let { page } = this.state
    let { containers, index } = page
    /** Get optional parameters */
    const { disableDelete } = optional
    /** Create a new index for the container based on the newIndex property */
    let id = 'container' + newIndex
    
    /** New container */
    const newContainer = { 
      type: 'container',
      parameters: {
        //Default direction parameter for the drag'n'drop context.
        direction: 'horizontal',
        disableDelete: !_.isNil(disableDelete) ? disableDelete : false
      },
      id: id,
      index: [],
      structure: getSemanticAndCss({element: '.'+id, defaultParent: '.main_page'}),
    }

    /**Set the container and add the index of it in the page */
    _.set(containers, id, newContainer)
    index.push(id)
    
    this.setState({
      ...this.state,
      page: {
        ...page 
      }
    }, () => this.props.update({...this.formatTemplate(), type: 'addContainer'}))
  }

  /**
   * Add a block inside a container.
   * By default : will contain a onClick for the content to add smthg inside of the block (text, image, else.)
   * @return {Object} contains : 
   * {
   * 
   * }
   * @param params given as object to pass parameters needed.
   */
  addBlock = (optional) => {
    /** get informations from the container to create a block linked to it */
    let { blockNumber, grid, containerIndex, parent } = optional
    /** Get the page blocks and containers */
    let { page } = this.state
    let { blocks, containers } = page
    /** Get optional parameters */
    const { disableDelete } = optional
    let ids = []
    /** Number of blocks to create */
    _.times(blockNumber, (index) => {
      /** Create a uniqID to avoid repetition of ID's in the blocks object */
      let uniqId = (containerIndex*10)+index
      let id = 'blocks'+uniqId
      ids.push(id)
      const newBlocks = {
        type: 'block',
        id: id,
        parameters: {
          disableDelete: !_.isNil(disableDelete) ? disableDelete : false
        },
        action: this.blockAction({optional, id}),
        content: null,
        structure: getSemanticAndCss({element: '.'+id, parent: '.'+parent, defaultParent: '.'+containerIndex}),
        grid: getGridValues(grid, id)
      }

      /** Set new block and add the reference to the index component */
      _.set(blocks, id, newBlocks)
      containers[parent].index.push(id)

      /** setState */
      this.setState({
        ...this.state,
        page: {
          ...page,
        }
      }, () => this.props.update({...this.formatTemplate(), type: 'addBlock'}))
    })

    return ids
  }

  containerAction = (params) => {
    let { addBlockText } = this.props
    let { newIndex } = params
    return (<React.Fragment>
        <PopoverActions>
          <Button onClick={() => {this.addItem('block', { parent: 'container'+newIndex, blockNumber: 1, grid: 1, containerIndex: newIndex })}}>{!_.isUndefined(addBlockText) ? addBlockText : <OneBlockIcon />}</Button> 
          <Button onClick={() => {this.addItem('block', { parent: 'container'+newIndex, blockNumber: 2, grid: 2, containerIndex: newIndex })}}>{!_.isUndefined(addBlockText) ? addBlockText : <TwoBlockIcon />}</Button> 
          <Button onClick={() => {this.addItem('block', { parent: 'container'+newIndex, blockNumber: 3, grid: 3, containerIndex: newIndex })}}>{!_.isUndefined(addBlockText) ? addBlockText : <ThreeBlockIcon />}</Button> 
          <Button onClick={() => {this.addItem('block', { parent: 'container'+newIndex, blockNumber: 4, grid: 4, containerIndex: newIndex })}}>{!_.isUndefined(addBlockText) ? addBlockText : <FourBlockIcon />}</Button> 
          <Button onClick={() => {this.addItem('block', { parent: 'container'+newIndex, blockNumber: 3, grid: 262, containerIndex: newIndex })}}>{!_.isUndefined(addBlockText) ? addBlockText : '262'}</Button> 
          <Button onClick={() => {this.addItem('block', { parent: 'container'+newIndex, blockNumber: 3, grid: 282, containerIndex: newIndex })}}>{!_.isUndefined(addBlockText) ? addBlockText : '282'}</Button> 
          <Button onClick={() => {this.addItem('block', { parent: 'container'+newIndex, blockNumber: 4, grid: 2244, containerIndex: newIndex })}}>{!_.isUndefined(addBlockText) ? addBlockText : '2244'}</Button> 
        </PopoverActions>      
      </React.Fragment>)
  }

  blockAction = (params) => {
    const { optional, id } = params
    return(<div className='block_actions'>
            <PopoverActions>
              {!_.isUndefined(this.props.blockActions) ? this.props.blockActions({...optional, id: id, type: 'text'}) :
                <Button onClick={() => this.addContent({...optional, id: id, type: 'text'})}>
                {!_.isUndefined(this.props.addContentText) ? 
                  this.props.addContentText 
                  : 'Add Content'
                }
                </Button>
              }
            </PopoverActions>
          </div>)
  }

  /** Add content to specific block */
  addContent = (params) => {
    let { page } = this.state
    let block = page.blocks[params.id]
    let content = _.isFunction(this.props.addContent) ? 
      this.props.addContent(params)
      : <div>Add function addContent to add content in here.</div>
      block.content = content
     /** setState */
    this.setState({
      ...this.state,
      page: {
        ...page,
      }
    }, () => this.props.update({...this.formatTemplate(), type: 'addContent'}))
    
    return Promise.resolve(true)
  }

  /**
   * Callback action to be used 
   */
  callbackActions = (params) => {
    let newState = this.state
    switch(params.type) {
      case 'deleteAction': 
        newState = this.deleteComponent(params)
        break
      default:
        if (!_.isFunction(this.props.callbackActions)) {
          newState = this.props.callbackActions(params, this.state)
        } 
        break
    }

    this.setState({...newState})
  }

  /** Delete component function
   * Is made to delete containers and blocks.
   * @param {object} Should contain at least element targeted and parent of this element to be used.
   */
  deleteComponent = (params) => {
    /** variables */
    const { element, parent } = params
    let { page } = this.state
    let { containers } = page

    /** To delete a container or a block */
    if (parent === 'page') {
      _.pull(page.index, element) 
    } else {
      _.pull(containers[parent].index, element)
    }

    /** setState */
    this.setState({
      page: {
        ...this.state.page,
        containers: {
          ...this.state.page.containers,
          containers
        }
      }
    })
  }
  
  formatTemplate = (save = false) => {
    let { name } = this.props
    let { page } = _.cloneDeep(this.state)
    return formatPage({name, page, save})
  }

  save = () => this.props.update({...this.formatTemplate(true), type: 'save'})

  updatePage = (page) => new Promise(resolve => {
    page = _.isEmpty(page) ? this.createStructure() : page
    page = {...page, actions: <React.Fragment>
      <PopoverActions>
        <Button onClick={() => this.addItem('container', {parent: 'page'})}>Add container</Button>
        <Button onClick={this.save}>Save template</Button>
      </PopoverActions>
    </React.Fragment>}

    this.setState({page, index: _.size(page.containers)}, () => resolve)
  }) 

  /**
   * Rendering function
   */
  render() {
    const { page } = this.state

    return (
      <React.Fragment>
        <DragDropContext
          onDragEnd={(result) => this.onDragEnd(result)}
        >
          {_.isObject(page) &&
            <DroppableComp 
              key={'page'}
              item={page} 
              page={page}
              containers={page.containers}
              parameters={this.state.parameters}
              actions={page.actions}
              callbackActions={this.callbackActions}
              containerAction={this.containerAction}
            />
          }
        </DragDropContext>
      </React.Fragment>
    )
  }
}

Templating.defaultProps = {
  name: 'template',
  update: () => {},
  updatePage: () => {}
}

/**
 * Export
 */
export default Templating