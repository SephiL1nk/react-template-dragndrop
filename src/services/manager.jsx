const formatPage = (parameters) => {
  const { name, page, save } = parameters
  let containers = {}
  let blocks = {}
  const pageTemplate = _.pick(page, ['index', 'type', 'structure'])
  _.map(page.containers, container => {  
    _.set(containers, container.id, _.pick(container, ['structure', 'type', 'index', 'id']))
  })

  /** Get only what we want in the block structure */
  _.map(page.blocks, block => {
    _.set(blocks, block.id, _.pick(block, ['id', 'content', 'grid', 'structure']))
  })


  const view = {
    page: pageTemplate,
    containers: containers,
    blocks: blocks
  }

  if (save) { 
    //Destroy every actions, as it can't be saved in DB
    _.map(page.blocks, block => {
      _.unset(block, 'action')
    })
    //Destroy every actions, as it can't be saved in DB
    _.map(page.containers, container => {
      _.unset(container, 'action')
    })
  }
  
  const template = page

  return {view, template, name}
}

export { formatPage }