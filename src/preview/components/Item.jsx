/** Core */
import React, { Component } from 'react'
import _ from 'lodash'
/** Components */
import { Grid } from '@material-ui/core'
import ComponentAsContent from '../../components/ComponentAsContent.jsx'

class Item extends Component {
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
    const { block } = this.props
    this.setState({grid: {...this.state.grid, ...block.grid}}) 

  }

  stringToHtml = (content) => {
    return {__html: content};
  }

  render() {
    const { block } = this.props
    const { grid } = this.state

    return (
      <React.Fragment>
        <Grid 
          key={block.id} 
          style={{maxWidth: '100%'}}
          item
          lg={grid.lg}
          md={grid.md}
          sm={grid.sm}
          xs={grid.xs}
        >
          {!_.isNull(block.content) && 
            _.isString(block.content) &&
            <React.Fragment key={'block-content-'+block.id}>
            {_.isString((content)) ?
              <div dangerouslySetInnerHTML={this.stringToHtml(content)} /> : 
              <ComponentAsContent>
                {!_.isEmpty(content) && content}
              </ComponentAsContent>}
            </React.Fragment>
          }
        </Grid>
      </React.Fragment>
    )
  }
}

export default Item