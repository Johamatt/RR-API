// src/users/users.controller.ts

import { Controller, Param, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';

import { UpdateCountryDto } from 'src/dto/UpdateCountryDto';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id/country')
  async updateCountry(
    @Param('id') id: number,
    @Body() updateCountryDto: UpdateCountryDto,
  ): Promise<User> {
    return this.usersService.updateCountry(id, updateCountryDto);
  }
}
