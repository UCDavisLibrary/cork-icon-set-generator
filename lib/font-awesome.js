const IconSet = require('./icon-set');
const crawler = require('./crawler');
const fs = require('fs-extra');
const path = require('path');
const YAML = require('yaml')

class FontAwesomeExtractor {
  async run(name, dir, iconSetType, useViewBox){
    const CONFIG_FILE = 'font-awesome.yaml';

    if( !path.isAbsolute(dir) ) {
      dir = path.resolve(process.cwd(), dir);
    }

    // Check config file and font-awesome exists
    let files = await fs.readdir(dir);
    if ( !files.includes(CONFIG_FILE) ) return
    if ( !files.includes('node_modules') ){
      console.warn(`${CONFIG_FILE} exists but there is no node_modules directory`);
      return;
    }
    const FONTAWESOME_DIR = path.resolve(dir, 'node_modules/@fortawesome/fontawesome-free');
    if ( !fs.pathExistsSync(path.resolve(FONTAWESOME_DIR, "package.json")) ){
      console.warn(`${CONFIG_FILE} exists but font awesome is not installed.`);
      return;
    }

    // Load config
    let file = await fs.readFile(path.resolve(dir, CONFIG_FILE), 'utf-8');
    const ICONS = YAML.parse( file );

    // Extract svgs
    let iconSet = new IconSet(name, iconSetType);
    for (let icon of ICONS.icons ) {
      for (let iconName of Object.keys(icon)){
        for ( let iconSetType of icon[iconName] ){
          let iconPath = path.resolve(FONTAWESOME_DIR, `svgs/${iconSetType}/${iconName}.svg`)
          if ( !fs.pathExistsSync(iconPath) ){
            console.warn(`${iconSetType}/${iconName} does not exist. Skipping...`)
            continue;
          }
          let name = `fa-${iconName}`;
          let svg = await crawler.getIconSvg(name, iconPath, useViewBox);
          iconSet.add(name, svg);
        }
      }
    }
    return iconSet;
    
  
  }
}

module.exports = new FontAwesomeExtractor();