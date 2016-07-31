/* Various properties of the current BetterSimplify build */

module.exports = {
  // Version of the extension for both browsers
  browsers: {
    chrome: {
      name: 'BetterSimplify.chromeextension',
      version: '1.0.0',
    }
  },

  // Output build directory
  buildDir: './build',

  // Players directory contains all the players
  playersDir: './players',

  // Skeleton directory
  skeletonDir: './skeleton',

  // Simplify engine script
  simplifyCoreScript: './simplify.js'
}
