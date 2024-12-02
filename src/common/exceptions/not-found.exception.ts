import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(
      {
        success: false,
        error: 'Not Found Exception',
        message,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
