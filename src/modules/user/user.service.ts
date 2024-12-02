import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma/prisma.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { BadRequestException } from '../../common/exceptions/bad-request.exception';
import { NotFoundException } from '../../common/exceptions/not-found.exception';
import { GetAllUsersDto } from './dtos/get-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateUserById(updateUserDto: UpdateUserDto, id: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: {
          email: updateUserDto.email,
          name: updateUserDto.name,
          surname: updateUserDto.surname,
        },
        select: {
          email: true,
          name: true,
          surname: true,
        },
      });
      return {
        success: true,
        data: updatedUser,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new BadRequestException('Something went wrong!');
    }
  }

  async getUserById(id: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        select: {
          email: true,
          name: true,
          surname: true,
          role: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      return {
        success: true,
        data: {
          id,
          ...user,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new BadRequestException('Something went wrong!');
    }
  }

  async getAllUsers(getAllUsersDto: GetAllUsersDto) {
    try {
      if (getAllUsersDto.role) {
        getAllUsersDto.role = +getAllUsersDto.role;
      }
      const users = await this.prismaService.user.findMany({
        where: getAllUsersDto,
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
          role: true,
        },
      });

      return {
        success: true,
        data: users,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new BadRequestException('Something went wrong!');
    }
  }

  async deleteUserById(id: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      await this.prismaService.user.delete({ where: { id } });
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
