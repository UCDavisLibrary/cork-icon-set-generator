const fs = require('fs-extra');
const path = require('path');

class IconSet {

  constructor(name, iconSetType, iconSetLabel="") {
    if( !name ) throw new Error('You must provide a IconSet name');
    if ( !['ucdlib', 'polymer'].includes(iconSetType) ) {
      throw new Error(`${iconSetType} is not a valid iconSetType`)
    }
    this.name = name;
    this.icons = {};
    this.iconSetType = iconSetType;
    this.hasFontAwesomeIcons = false;
    this.iconSetLabel = iconSetLabel;
  }

  add(name, svg) {
    this.icons[name] = svg;
  }

  merge(iconset){
    Object.assign(this.icons, iconset.icons);
  }

  write(dir) {
    if( !dir ) dir = process.cwd();
    return fs.writeFile(
      path.join(dir, this.name+'.js'),
      this.generateFileContent()
    );
  }

  generateFileContent() {
    let faLicense = "<!-- All icons prefixed with 'fa' by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (CC BY 4.0) -->";
    if ( this.iconSetType === 'polymer'){
      return `import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';
      
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
      
const template = html\`<iron-iconset-svg name="${this.name}" size="24">
  ${this.hasFontAwesomeIcons ? faLicense : ""}
  <svg><defs>
    ${Object.values(this.icons).join('\n')}
  </defs></svg>
</iron-iconset-svg>\`;
      
document.head.appendChild(template.content);`

    } else if(this.iconSetType === 'ucdlib') {
      return `import { html } from "lit";
import { renderIconSet } from "@ucd-lib/theme-elements/ucdlib/ucdlib-icons/utils.js";

const template = html\`
  ${this.hasFontAwesomeIcons ? faLicense : ""}
  <svg><defs>
    ${Object.values(this.icons).join('\n')}
  </defs></svg>\`;

renderIconSet(template, "${this.name}", 24, "${this.iconSetLabel}");`
    }

  }

}

module.exports = IconSet;