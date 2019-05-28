import React, { Component } from 'react'
import Container from './components/Container.jsx'
import _ from 'lodash'

class Preview extends Component {
  constructor() {
    super()
    this.state = {
      template: {}
    }
  }

  /** If values are already loaded */
  componentWillMount() {
    const { template } = this.props
    this.setState({template})
  }

  /** If the template needs to be dynamically previewed */
  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps, this.props)) {
      const { template } = this.props
      this.setState({template})
    }
  }
  render() {
    const { template } = this.state
    const { page, containers, blocks } = template

    return ( 
      <React.Fragment>
        {!_.isEmpty(template) && !_.isEmpty(page.index) && 
          (
            <div className='main_template' style={{width: '100%', flexGrow: '1'}}>
              {_.map(page.index, containerIndex => {
                {return (!_.isUndefined(containers[containerIndex]) && 
                  <Container blocks={_.pick(blocks, containers[containerIndex].index)} container={containers[containerIndex]} key={containerIndex}/>
                )}  
              })}
            </div>
          )
        }
      </React.Fragment>
    )
  }
}

export default Preview