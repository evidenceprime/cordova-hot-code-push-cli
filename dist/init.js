import es6promise from 'es6-promise';

es6promise.polyfill();

import path from 'path';
import prompt from 'prompt';
import _ from 'lodash';

import { getInput, writeFile } from './utils';

const configFile = path.join(process.cwd(), 'cordova-hcp.json');

const name = {
  description: 'Enter project name (required)',
  pattern: /^[a-zA-Z\-\s0-9]+$/,
  message: 'Name must be only letters, numbers, space or dashes',
  required: true
};

const iosIdentifier = {
  description: 'IOS app identifier',
  pattern: /^[a-zA-Z\-0-9\.]+$/
};

const androidIdentifier = {
  description: 'Android app identifier',
  pattern: /^[a-zA-Z\-0-9\.]+$/
};

const update = {
  description: 'Update method (required)',
  pattern: /(start|resume|now)/,
  required: true,
  message: 'Needs to be one of start, resume or now',
  default: 'resume'
};

const contentUrl = {
  description: 'Enter full URL to directory where cordova-hcp build result will be uploaded',
  message: 'Must supply URL',
  required: true
};

const schema = {
  properties: {
    name,
    ios_identifier: iosIdentifier,
    android_identifier: androidIdentifier,
    update,
    content_url: contentUrl
  }
};

export function execute(context) {
  prompt.override = context.argv;
  prompt.message = 'Please provide';
  prompt.delimiter = ': ';
  prompt.start();

  getInput(prompt, schema).then(content => writeFile(configFile, content)).then(done);
}

function done(err) {
  if (err) {
    return console.log(err);
  }
  console.log('Project initialized and cordova-hcp.json file created.');
  console.log('If you wish to exclude files from being published, specify them in .chcpignore');
}