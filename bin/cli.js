#! /usr/bin/env node

const crawler = require('../lib/crawler');
const fontAwesomeExtractor = require("../lib/font-awesome");
const arg = require('arg');
const args = arg({
  '--label': String,
  '--ucdlib': Boolean,
  '-u': '--ucdlib',
  '--viewbox': Boolean,
  '-v': '--viewbox',
  '--html': Boolean,
  '-h': '--html'
});
const iconSetType = args['--ucdlib'] ? 'ucdlib' : 'polymer';
const useViewBox = args['--viewbox'];
const iconSetLabel = args['--label'];
const generateHTML = args['--html'];

if( args._.length < 2 ) {
  console.log('cork-icon-set-generator <icon-set-name> <directory>');
  return;
}

(async function() {
  let customIconSet = await crawler.run(args._[0], args._[1], iconSetType, useViewBox);
  console.log(`${Object.keys(customIconSet.icons).length} custom svg files processed`);
  let fontAwesomeIconSet = await fontAwesomeExtractor.run(args._[0], args._[1], iconSetType, useViewBox);
  if ( fontAwesomeIconSet ) {
    console.log(`${Object.keys(fontAwesomeIconSet.icons).length} font awesome icons processed`);
    customIconSet.merge(fontAwesomeIconSet);
    customIconSet.hasFontAwesomeIcons = true;
  }
  if ( iconSetLabel ) {
    customIconSet.iconSetLabel = iconSetLabel;
  }
  if ( generateHTML ) {
    await customIconSet.writeHTML();
  } else {
    await customIconSet.writeJs();
  }
})();