import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { RolesEnum } from '../../common/enums/roles.enum';
import { Auth } from '../../common/decorators/auth.decorator';
import { SignInDto } from './dtos/sign-in.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { IRequest } from '../../common/interfaces/custom-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto, RolesEnum.USER);
  }

  @ApiBearerAuth()
  @Auth([RolesEnum.ADMIN])
  @Post('sign-up/admin')
  registerAdmin(@Body() adminRegisterDto: SignUpDto) {
    return this.authService.signUp(adminRegisterDto, RolesEnum.ADMIN);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto, RolesEnum.USER);
  }

  @Post('sign-in/admin')
  signInAdmin(@Body() adminSignInDto: SignInDto) {
    return this.authService.signIn(adminSignInDto, RolesEnum.ADMIN);
  }

  @ApiBearerAuth()
  @Auth([RolesEnum.USER, RolesEnum.ADMIN])
  @Post('change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: IRequest,
  ) {
    return this.authService.changePassword(changePasswordDto, req.user.id);
  }
}
