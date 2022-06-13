import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import moment from 'moment';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  DEFAULT_TIMEZONE = 'Asia/Seoul';
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const err = exception.getResponse() as
      | { message: any; statusCode: number }
      | {
          error: string;
          statusCode: number;
          message: string[];
        };
    if (typeof err !== 'string') {
      return response.status(status).json({
        success: false,
        code: status,
        data: err.message,
        timestamp: moment().format(),
      });
    }
    response.status(status).json({
      success: false,
      code: status,
      data: err,
      timestamp: moment().format(),
    });
  }
}
