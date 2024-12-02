import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IRequest } from '../../common/interfaces/custom-request.interface';
import { Auth } from '../../common/decorators/auth.decorator';
import { RolesEnum } from '../../common/enums/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetAllUsersDto } from './dtos/get-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Auth([RolesEnum.USER, RolesEnum.ADMIN])
  @Put('me')
  updateMe(@Body() updateUserDto: UpdateUserDto, @Req() req: IRequest) {
    return this.userService.updateUserById(updateUserDto, req.user.id);
  }

  @ApiBearerAuth()
  @Auth([RolesEnum.ADMIN])
  @Put(':id')
  updateById(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    return this.userService.updateUserById(updateUserDto, +id);
  }

  @ApiBearerAuth()
  @Auth([RolesEnum.USER, RolesEnum.ADMIN])
  @Get('me')
  getMe(@Req() req: IRequest) {
    return this.userService.getUserById(req.user.id);
  }

  @ApiBearerAuth()
  @Auth([RolesEnum.ADMIN])
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }

  @ApiBearerAuth()
  @Auth([RolesEnum.ADMIN])
  @Get()
  getAll(@Query() getAllUsersDto: GetAllUsersDto) {
    return this.userService.getAllUsers(getAllUsersDto);
  }

  @ApiBearerAuth()
  @Auth([RolesEnum.USER, RolesEnum.ADMIN])
  @Delete('me')
  deleteMe(@Req() req: IRequest) {
    return this.userService.deleteUserById(req.user.id);
  }

  @ApiBearerAuth()
  @Auth([RolesEnum.ADMIN])
  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.userService.deleteUserById(+id);
  }
}
