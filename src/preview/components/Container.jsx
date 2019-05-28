/** Core */
import React, { Component } from 'react'
import _ from 'lodash'

/** Components */
import { Grid } from '@material-ui/core'
import Item from './Item.jsx'

class Container extends Component {
  constructor() {
    super()
  }

  render() {
    const { container, blocks } = this.props
    return (
      <React.Fragment>
        <Grid
          key={'grid_'+container.id}
          container
          direction={'row'}
          justify="flex-start"
          alignItems="stretch"
        >
          {!_.isEmpty(blocks) && _.map(blocks, block => {
            return <Item block={block} parent={container} key={block.id} />
          })}
        </Grid>
      </React.Fragment>
    )
  }
}

export default Container