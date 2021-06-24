#! /usr/bin/env node
"use strict";
/**
 * This file automatically generates the index registries for all directories specified in `directories` below. It runs automatically when `yarn preflight` runs or you can run it via `yarn genreg`
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const camelcase_1 = __importDefault(require("camelcase"));
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
const generateLines = (directory) => fs_1.readdirSync(path_1.resolve(directory))
    .map((file) => {
    const include = '.js';
    // Only look for requested files and ignore indexes
    if (!file.match(include))
        return `export { default as ${camelcase_1.default(file, {
            pascalCase: true
        })} } from './${file}'`;
    const fileNoExt = file.replace(include, '');
    const varName = camelcase_1.default(fileNoExt);
    return `export { default as ${varName} } from './${fileNoExt}'`;
})
    .filter((item) => item)
    .toString()
    .replace(/,/g, '\n');
directories.forEach((directory) => {
    const fileContents = `${message}\n\n${generateLines(directory)}`;
    fs_1.writeFileSync(path_1.resolve(directory, `index.js`), fileContents);
});
