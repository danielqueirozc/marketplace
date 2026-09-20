import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import type { Login } from '../../@types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
    
  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successfull' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() login: Login) {
    return this.authService.login(login)
  }

  @Post('/register')
  @HttpCode(201)
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'Registration successfull' })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
  async register(@Body() register: any) {
    return this.authService.login(register)
  }
}
