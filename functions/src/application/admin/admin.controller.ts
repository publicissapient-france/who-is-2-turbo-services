import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as admin from 'firebase-admin';
import uuid from 'short-uuid';
import { ApiCreatedResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  @ApiCreatedResponse({
    description: "Rotate picture's token for all members",
  })
  @ApiInternalServerErrorResponse()
  @Post('resetPictureTokens')
  async resetPictureTokens(@Res() res: Response) {
    const querySnapshot = await admin.firestore().collection('members').get();
    await Promise.all(
      querySnapshot.docs.map(
        async (doc) =>
          await doc.ref.update({
            pictureGallery: uuid.generate(),
            pictureGame: uuid.generate(),
          }),
      ),
    );
    res.status(200).send();
  }
}
