import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Connected to the database!');
    } catch (e) {
      console.log('Error during connecting to the database');
      console.log(e);
      process.exit();
    }
  }
  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (e) {
      console.log('Error during disconnecting from the database');
      console.log(e);
    }
  }
}
