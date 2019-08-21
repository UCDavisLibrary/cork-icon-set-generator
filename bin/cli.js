#! /usr/bin/env node

const crawler = require('../lib/crawler');

if( process.argv.length < 4 ) {
  console.log('cork-icon-set-generator <icon-set-name> <directory>');
  return;
}

(async function() {
  let iconSet = await crawler.run(process.argv[2], process.argv[3]);
  await iconSet.write();
})();