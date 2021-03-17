import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {NestFactory} from '@nestjs/core';
import {ExpressAdapter} from '@nestjs/platform-express';
import {WhoisTurboModule} from './whois-turbo.module';
import express from 'express';
import {Express} from "express-serve-static-core";

admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

const server = express();

const createNestServer = async (expressInstance: Express) => {
  const app = await NestFactory.create(
      WhoisTurboModule,
      new ExpressAdapter(expressInstance),
  );

  return app.init();
};

createNestServer(server)
.then(v => console.log('Nest Ready'))
.catch(err => console.error('Nest broken', err));

export const api = functions.https.onRequest(server);

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.status(400);
  response.send({nom: "toto"});
});

export const listPersons = functions.https.onRequest(
    async (request, response) => {
      functions.logger.info("List all persons", {structuredData: true});
      const readResult = await admin.firestore()
      .collection("persons")
      .listDocuments();
      const json = await Promise.all(
          readResult.map(async (it) => {
            const doc = await it.get();
            return {
              firstName: doc.get("firstName"),
              lastName: doc.get("lastName"),
            } as Person;
          }));

      response.status(200);
      response.send(json);
    });

type Person = {
  firstName: string;
  lastName: string;
}
