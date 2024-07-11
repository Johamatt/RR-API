import {
  Controller,
  Param,
  Patch,
  Body,
  UseGuards,
  Put,
  ForbiddenException,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateCountryDto } from 'src/dto/UpdateCountryDto';
import { User } from './users.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('country')
  async updateCountry(
    @Request() req,
    @Body() updateCountryDto: UpdateCountryDto,
  ): Promise<User> {
    const id = updateCountryDto.user_id;

    if (req.user.user_id !== id) {
      throw new ForbiddenException('You can only edit your own user');
    }

    return this.usersService.updateCountry(id, updateCountryDto);
  }
}

// @UseGuards(JwtAuthGuard)
// @Put(':id')
// async updateUser(
//   @Request() req,
//   @Param('id') id: number,
//   @Body() updateUserDto: any,
// ): Promise<User> {
//   if (req.user.user_id !== +id) {
//     throw new ForbiddenException('You can only edit your own user.');
//   }
//   return this.usersService.updateUser(id, updateUserDto);
// }
