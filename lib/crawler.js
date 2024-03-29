const IconSet = require('./icon-set');
const fs = require('fs-extra');
const path = require('path');
const parseXmlString = require('xml2js').parseString;
const XmlBuilder = require('xml2js').Builder;
const xmlBuilder = new XmlBuilder();

class IconCrawler {

  async run(name, dir, iconSetType, useViewBox) {
    let iconSet = new IconSet(name, iconSetType);

    if( !path.isAbsolute(dir) ) {
      dir = path.resolve(process.cwd(), dir);
    }
    iconSet.dir = dir;
    iconSet.useViewBox = useViewBox;

    await this._crawl(dir, iconSet);
    return iconSet;
  }

  async _crawl(dir, iconSet) {
    if ( dir.includes('node_modules') ) return;
    let files = await fs.readdir(dir);
    for( let file of files ) {
      let fullpath = path.join(dir, file);
      let stat = await fs.lstat(fullpath);
      if( stat.isDirectory() ) {
        await this._crawl(fullpath, iconSet);
      } else if( path.parse(fullpath).ext === '.svg' ) {
        let name = this.getIconName(fullpath);
        let svg = await this.getIconSvg(name, fullpath, iconSet.useViewBox);
        iconSet.add(name, svg);
      }
    }
  }

  async getIconSvg(name, file, useViewBox) {
    let content = await fs.readFile(file, 'utf-8');
    return new Promise((resolve, reject) => {
      parseXmlString(content,(err, result) => {
        if( err ) return reject(err);
        let xml = result.svg;
        xml.$ = xml.$ ? xml.$ : {};
        let viewBox = xml.$.viewBox;
        xml.$ = {id: name};
        if ( useViewBox && viewBox ) xml.$.viewBox = viewBox;
        xml = {g : xml};
        xml = xmlBuilder.buildObject(xml)
          .split('\n')
          .filter((item, i) => i !== 0)
          .join('\n')

        resolve(xml);
      });
    });
  }

  getIconName(file) {
    let info = path.parse(file);
    return info.name.replace(/^icon-/i, '').replace(/ /g, '-').toLowerCase();
  }

}

module.exports = new IconCrawler();