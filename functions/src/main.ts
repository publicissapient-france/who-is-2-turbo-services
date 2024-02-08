import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { WhoisTurboModule } from './whois-turbo.module';
import express from 'express';
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
      'https://whois-5d8ab.web.app',
      'https://who.thiga.co',
      /^(https:\/\/who-is-2-turbo--preview-(.*)\.web\.app)$/i,
    ],
  });

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
