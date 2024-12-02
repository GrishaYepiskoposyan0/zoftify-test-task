import { HttpException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { PrismaService } from '../../common/database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RolesEnum } from '../../common/enums/roles.enum';
import { NotFoundException } from '../../common/exceptions/not-found.exception';
import { ForbiddenException } from '../../common/exceptions/forbidden.exception';
import { BadRequestException } from '../../common/exceptions/bad-request.exception';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { HashingService } from '../../common/utils/hashing/hashing.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly hashingService: HashingService,
  ) {}
  async signUp(signUpDto: SignUpDto, role: RolesEnum) {
    try {
      const oldUser = await this.prismaService.user.findUnique({
        where: { email: signUpDto.email },
      });
      if (oldUser) {
        throw new ForbiddenException('User with this email already exists!');
      }
      const hashedPassword: string = await this.hashingService.hashPassword(
        signUpDto.password,
      );

      await this.prismaService.user.create({
        data: {
          name: signUpDto.name,
          surname: signUpDto.surname,
          role,
          email: signUpDto.email,
          password: hashedPassword,
        },
      });
      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new BadRequestException('Something went wrong!');
    }
  }

  async signIn(signInDto: SignInDto, role: RolesEnum) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: signInDto.email, role },
      });

      if (!user) {
        throw new NotFoundException('User not found!');
      }
      const isCorrectPassword: boolean = await bcrypt.compare(
        signInDto.password,
        user.password,
      );
      if (!isCorrectPassword) {
        throw new ForbiddenException('Incorrect password!');
      }

      const accessToken: string = await this.jwtService.signAsync(
        {
          role: user.role,
          id: user.id,
          email: user.email,
        },
        {
          algorithm: 'HS512',
          secret: this.configService.get<string>('JWT_SECRET'),
          // expiresIn: '1h',
        },
      );
      return {
        success: true,
        accessToken,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new BadRequestException('Something went wrong!');
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto, id: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      const isCorrectPassword: boolean = await this.hashingService.compare(
        changePasswordDto.currentPassword,
        user.password,
      );
      if (!isCorrectPassword) {
        throw new ForbiddenException('Incorrect current password!');
      }

      const hashedPassword: string = await this.hashingService.hashPassword(
        changePasswordDto.newPassword,
      );

      await this.prismaService.user.update({
        where: { id },
        data: { password: hashedPassword },
      });

      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new BadRequestException('Something went wrong!');
    }
  }
}
