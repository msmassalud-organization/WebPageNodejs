// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const Storage = require('@google-cloud/storage');
const config = require('../config');

const CLOUD_BUCKET = config.CLOUD_BUCKET;

const storage = Storage({
  projectId: config.GCLOUD_PROJECT
});
const bucket = storage.bucket(CLOUD_BUCKET);
const randToken = require('rand-token')

// Returns the public, anonymously accessable URL to a given Cloud Storage
// object.
// The object's ACL has to be set to public read.
// [START public_url]
function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}
// [END public_url]

// Express middleware that will automatically pass uploads to Cloud Storage.
// req.file is processed and will have two new properties:
// * ``cloudStorageObject`` the object name in cloud storage.
// * ``cloudStoragePublicUrl`` the public url to the object.
// [START process]
function sendUploadToGCS(req, res, next) {
  if (!req.file) {
    return next();
  }
  console.log(req.file);
  const fileName = randToken.generate(18);
  const gcsname = Date.now() + fileName;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    file.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
      next();
    });
  });

  stream.end(req.file.buffer);
}
// [END process]

// Multer handles parsing multipart/form-data requests.
// This instance is configured to store images in memory.
// This makes it straightforward to upload to Cloud Storage.
// [START multer]
const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});
// [END multer]

function removeProfilePhoto(req, res, next) {
  //Si existe una imagen, la borramos
  if (req.user.pictureURL) {
    console.log(req.user.pictureURL.split("/")[4]);
    let tokens = req.user.pictureURL.split("/")[4];
    if (tokens.length >= 5) {
      const oldFile = bucket.file(req.user.pictureURL.split("/")[4]);
      //Borramos la foto de perfil vieja
      oldFile.delete((err, apiResponse) =>{
        if (err) {
          console.log(err);
        } else {
          console.log("Deleted successfully");
        }
      });
    }
  }
  next();
}

module.exports = {
  getPublicUrl,
  sendUploadToGCS,
  removeProfilePhoto,
  multer
};
