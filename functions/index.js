/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require('firebase-functions');
const express = require('express');
const { createRequestHandler } = require('@remix-run/express');
const path = require('path');
// const remixBuild = require('./build'); // This is the Remix app build

const app = express();

// Serve static assets from the public folder (Firebase Hosting will handle this too)
app.use(express.static(path.join(__dirname, 'public')));

// Handle all requests with Remix's createRequestHandler
app.all(
  '*',
  createRequestHandler({
    getLoadContext() {
      // This is where you can provide any context (such as Shopify API clients, session data, etc.)
      return {};
    },
    // build: remixBuild,
  })
);

exports.remixApp = functions.https.onRequest(app);
