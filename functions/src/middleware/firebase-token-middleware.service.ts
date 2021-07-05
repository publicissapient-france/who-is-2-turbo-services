import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseTokenMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (!FirebaseTokenMiddleware.isTokenRequired(req)) {
      next();
      return;
    }
    await FirebaseTokenMiddleware.validateIdToken(req, res, next);
  }

  private static isTokenRequired(req: Request): boolean {
    return !req.originalUrl.includes('picture');
  }

  private static async validateIdToken(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      functions.logger.error(
        'No Firebase ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Firebase ID Token>',
      );
      res.status(401).send('Unauthorized');
      return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
      // No token
      res.status(401).send('Unauthorized');
      return;
    }

    try {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      if (decodedIdToken.email?.includes('publicissapient')) {
        req.body.email = decodedIdToken.email;
        next();
        return;
      } else {
        res.status(401).send('Unauthorized');
      }
    } catch (error) {
      functions.logger.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('Forbidden');
      return;
    }
  }
}
