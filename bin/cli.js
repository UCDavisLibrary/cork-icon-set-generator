#! /usr/bin/env node

const crawler = require('../lib/crawler');
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
  let iconSet = await crawler.run(process.argv[2], process.argv[3], iconSetType, useViewBox);
  await iconSet.write();
})();