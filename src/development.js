import { render } from 'react-dom'
import React, { Component } from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Templating from './Templating.jsx'
import Preview from './preview/Preview.jsx'

export { Templating, Preview }

class Boilerplate extends Component {
  render() {
    return (<React.Fragment> <Templating /><Preview /> </React.Fragment>)
  }
}

render(<MuiThemeProvider><Boilerplate /></MuiThemeProvider>, document.getElementById('app'));
