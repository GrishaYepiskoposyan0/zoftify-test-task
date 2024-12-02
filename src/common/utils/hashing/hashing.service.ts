import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class HashingService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  compare(password, encrypted): Promise<boolean> {
    return bcrypt.compare(password, encrypted);
  }
}
