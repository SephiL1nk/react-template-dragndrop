/** Grid default */
const GRID = {
  1: [{
    lg:12,
    md:12,
    sm:12,
    xs:12,
  }],
  2: [{
    lg:6,
    md:6,
    sm:6,
    xs:6,
  }],
  3: [{
    lg:4,
    md:4,
    sm:4,
    xs:4,
  }],
  4: [{
    lg:3,
    md:3,
    sm:3,
    xs:3,
  }],
  262: [{
    lg:3,
    md:3,
    sm:3,
    xs:3,
  },{
    lg:6,
    md:6,
    sm:6,
    xs:6,
  },{
    lg:3,
    md:3,
    sm:3,
    xs:3,
  }],
  282: [{
    lg:2,
    md:2,
    sm:2,
    xs:2,
  },{
    lg:8,
    md:8,
    sm:8,
    xs:8,
  }, {
    lg:2,
    md:2,
    sm:2,
    xs:2,
  }],
  2244: [{
    lg:2,
    md:2,
    sm:2,
    xs:2,
  },{
    lg:2,
    md:2,
    sm:2,
    xs:2,
  }, {
    lg:4,
    md:4,
    sm:4,
    xs:4,
  },{
    lg:4,
    md:4,
    sm:4,
    xs:4,
  }]
}

/**
   * Get grid values
   * @return {object} Object
   */
function getGridValues(gridIndex, currentBlockIndex) {
  let gridValues = {}
  if (GRID[gridIndex].length === 1) {
    gridValues = GRID[gridIndex][0]
  } else {
    gridValues = GRID[gridIndex][currentBlockIndex]
  }

  return ({...gridValues})
}

export { getGridValues }