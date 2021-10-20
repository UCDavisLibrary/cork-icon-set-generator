# cork-icon-set-generator
Create iron-icon set from a folder of svg icons

Given a directory, the generator will crawl a folder for all svg files, extract their
contents, and merge them into a single ```iron-iconset-svg``` set file which can be used
by ```iron-icon```.

# Install

```npm install -g @ucd-lib/cork-icon-set-generator```

# Usage

```cork-icon-set-generator <icon-set-name> <directory>```

 - *icon-set-name*: name of the icon set, the file will be named this as well
 - *directory*: directory to crawl
 - *-u*: generate a `ucdlib-iconset` instear of `iron-iconset-svg`
 - *-v*: copy the viewbox from source svg icons if it exists.