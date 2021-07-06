import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MemberNotFoundException } from '../../domain/members/members.service';

@Catch(MemberNotFoundException)
export class MembersExceptionFilter implements ExceptionFilter {
  catch(exception: MemberNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.NOT_FOUND;

    response.status(status).json({
      statusCode: status,
    });
  }
}
