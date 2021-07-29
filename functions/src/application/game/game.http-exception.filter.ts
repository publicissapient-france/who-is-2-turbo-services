import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MemberNotFoundException } from '../../domain/members/members.service';
import { GameTypeException } from '../../domain/game/game.service';

@Catch(GameTypeException)
export class GameTypeExceptionFilter implements ExceptionFilter {
  catch(exception: MemberNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.PRECONDITION_FAILED;

    response.status(status).json({
      statusCode: status,
    });
  }
}
