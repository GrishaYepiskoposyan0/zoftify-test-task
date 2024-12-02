import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(message?: string) {
    super(
      {
        success: false,
        error: 'Bad Request Exception',
        message,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
