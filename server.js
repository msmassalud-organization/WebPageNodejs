/**
 * Copyright 2016, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

//const mongodb = require('mongodb');
const mongodb = require('mongoose');
const http = require('http');
const nconf = require('nconf');
const app = require('./app');
const autoIncrement = require('mongoose-auto-increment');
// read in keys and secrets.  You can store these in a variety of ways.
// I like to use a keys.json  file that is in the .gitignore file,
// but you can also store them in environment variables
nconf.argv().env().file('keys.json');

// Connect to a MongoDB server provisioned over at
// MongoLab.  See the README for more info.

const user = nconf.get('mongoUser');
const pass = nconf.get('mongoPass');
const host = nconf.get('mongoHost');
const port = nconf.get('mongoPort');

// [START client]
let uri = `mongodb://${user}:${pass}@${host}:${port}`;

if (nconf.get('mongoDatabase')) {
  uri = `${uri}/${nconf.get('mongoDatabase')}`;
}

console.log(uri);

//mongodb.MongoClient.connect(uri, (err, db) => {
mongodb.Promise = global.Promise;
mongodb.connect(uri, (err, db) => {
  if (err) {
    throw err;
  }  
  // Create a simple little server.
  app.listen(process.env.PORT || 8080, () => {
    console.log('Magic happens in PORT 8080');
  });
});
// [END client]
