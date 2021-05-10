import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { WhoisTurboModule } from './whois-turbo.module';
import express, { Request, Response } from 'express';
import { Express } from 'express-serve-static-core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

admin.initializeApp();

const server = express();

const createNestServer = async (expressInstance: Express) => {
  const app = await NestFactory.create(WhoisTurboModule, new ExpressAdapter(expressInstance));

  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:8000',
      'https://whois.publicissapient.fr',
    ],
  });
  app.use(validateFirebaseIdToken);
  const config = new DocumentBuilder()
    .setTitle('Who Is Turbo V2')
    .setDescription('The Who Is Turbo V2 API description')
    .setVersion('1.0')
    .addTag('ps')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  return app.init();
};

createNestServer(server)
  .then(() => {
    console.log('Nest Ready');
  })
  .catch((err) => console.error('Nest broken', err));

export const api = functions.region('europe-west1').https.onRequest(server);

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = async (req: Request, res: Response, next: Function) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    functions.logger.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
    );
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    // No token
    res.status(403).send('Unauthorized');
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.body.email = decodedIdToken.email;
    next();
    return;
  } catch (error) {
    functions.logger.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
    return;
  }
};
