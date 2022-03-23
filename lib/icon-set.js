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
    this.faLicense = "<!-- All icons prefixed with 'fa' by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (CC BY 4.0) -->";
  }

  add(name, svg) {
    this.icons[name] = svg;
  }

  merge(iconset){
    Object.assign(this.icons, iconset.icons);
  }

  writeJs(dir) {
    if( !dir ) dir = process.cwd();
    return fs.writeFile(
      path.join(dir, this.name+'.js'),
      this.generateJsFileContent()
    );
  }

  writeHTML(dir) {
    if( !dir ) dir = process.cwd();
    return fs.writeFile(
      path.join(dir, this.name+'.html'),
      this.generateHTMLFileContent()
    );
  }

  _generateElementInnerContent(){
    return `${this.hasFontAwesomeIcons ? this.faLicense : ""}
    <svg><defs>
      ${Object.values(this.icons).join('\n')}
    </defs></svg>`;
  }

  generateJsFileContent() {
    if ( this.iconSetType === 'polymer'){
      return `import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';
      
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
      
const template = html\`<iron-iconset-svg name="${this.name}" size="24">
${this._generateElementInnerContent()}</iron-iconset-svg>\`;
      
document.head.appendChild(template.content);`

    } else if(this.iconSetType === 'ucdlib') {
      return `import { html } from "lit";
import { renderIconSet } from "@ucd-lib/theme-elements/ucdlib/ucdlib-icons/utils.js";

const template = html\`${this._generateElementInnerContent()}\`;

renderIconSet(template, "${this.name}", 24, "${this.iconSetLabel}");`
    }

  }

  generateHTMLFileContent(){
    if ( this.iconSetType === 'polymer'){
      return `<iron-iconset-svg name="${this.name}" size="24">${this._generateElementInnerContent()}</iron-iconset-svg>`;
    } else if(this.iconSetType === 'ucdlib') {
      return `<ucdlib-iconset name="${this.name}" size="24" label="${this.iconSetLabel}" style="display:none;">${this._generateElementInnerContent()}</ucdlib-iconset>`;
    }
  }

}

module.exports = IconSet;