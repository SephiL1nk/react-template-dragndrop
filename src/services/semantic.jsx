/** Imports */
import _ from 'lodash'

/** Semantic template and CSS values
 * @param {element, parent, defaultParent} 
 * @return {object} {}
 */
function getSemanticAndCss(params) {
  const { element, parent, defaultParent } = params
  let final = {
    semantic: {
      element: element,
      parent: !_.isUndefined(parent) ? parent : defaultParent
    },
    css: {}
  }

  /** @return {object} */
  return final
}

/** Exports */
export { getSemanticAndCss }