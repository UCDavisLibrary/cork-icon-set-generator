#! /usr/bin/env node

const crawler = require('../lib/crawler');
const fontAwesomeExtractor = require("../lib/font-awesome");
const arg = require('arg');
const args = arg({
  '--ucdlib': Boolean,
  '-u': '--ucdlib',
  '--viewbox': Boolean,
  '-v': '--viewbox'
});
const iconSetType = args['--ucdlib'] ? 'ucdlib' : 'polymer';
const useViewBox = args['--viewbox'];

if( args._.length < 2 ) {
  console.log('cork-icon-set-generator <icon-set-name> <directory>');
  return;
}

(async function() {
  let customIconSet = await crawler.run(args._[0], args._[1], iconSetType, useViewBox);
  let fontAwesomeIconSet = await fontAwesomeExtractor.run(args._[0], args._[1], iconSetType, useViewBox);
  if ( fontAwesomeIconSet ) {
    customIconSet.merge(fontAwesomeIconSet);
    customIconSet.hasFontAwesomeIcons = true;
  }
  await customIconSet.write();
})();