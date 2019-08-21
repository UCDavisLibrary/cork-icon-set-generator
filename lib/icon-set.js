const fs = require('fs-extra');
const path = require('path');

class IconSet {

  constructor(name) {
    if( !name ) throw new Error('You must provide a IconSet name');
    this.name = name;
    this.icons = {};
  }

  add(name, svg) {
    this.icons[name] = svg;
  }

  write(dir) {
    if( !dir ) dir = process.cwd();
    return fs.writeFile(
      path.join(dir, this.name+'.js'),
      this.generateFileContent()
    );
  }

  generateFileContent() {
    return `import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';

import {html} from '@polymer/polymer/lib/utils/html-tag.js';

const template = html\`<iron-iconset-svg name="${this.name}" size="24">
<svg><defs>
 ${Object.values(this.icons).join('\n')}
</defs></svg>
</iron-iconset-svg>\`;

document.head.appendChild(template.content);`
  }

}

module.exports = IconSet;