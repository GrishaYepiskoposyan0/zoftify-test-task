import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(message?: string) {
    super(
      {
        success: false,
        error: 'Forbidden Exception',
        message,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
