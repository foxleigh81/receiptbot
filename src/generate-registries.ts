#! /usr/bin/env node

/**
 * This file automatically generates the index registries for all directories specified in `directories` below. It runs automatically when `yarn preflight` runs or you can run it via `yarn genreg`
 */

import { readdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import camelCase from 'camelcase';

const directories = ['./functions'];

const message = `/***
This file is autogenerated, please do not edit it.
To generate an updated version, please run \`yarn genreg\`

If you register your helper with this index, it can be referenced more easily. 

e.g. without registering

  import fetcher from '@helpers/fetcher
  import poster from '@helpers/poster

e.g. with registering

  import { fetcher, poster } from '@helpers/index'
*/
`;

const generateLines = (directory: string) =>
  readdirSync(resolve(directory))
    .map((file: string) => {
      const include = '.js';
      // Only look for requested files and ignore indexes
      if (!file.match(include))
        return `export { default as ${camelCase(file, {
          pascalCase: true
        })} } from './${file}'`;
      const fileNoExt = file.replace(include, '');
      const varName = camelCase(fileNoExt);
      return `export { default as ${varName} } from './${fileNoExt}'`;
    })
    .filter((item: any) => item)
    .toString()
    .replace(/,/g, '\n');

directories.forEach((directory) => {
  const fileContents = `${message}\n\n${generateLines(directory)}`;
  writeFileSync(resolve(directory, `index.js`), fileContents);
});
