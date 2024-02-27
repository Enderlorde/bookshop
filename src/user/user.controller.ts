import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  async getAllUsers(
    @Query('first_name') first_name?: string,
    @Query('last_name') last_name?: string,
    @Query('birthday') birth_day?: Date,
  ): Promise<User[]> {
    const birthday = birth_day ? new Date(birth_day) : undefined;
    return await this.userService.findAll({
      first_name,
      last_name,
      birthday,
    });
  }

  @Get(':id')
  async getOneUser(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne({ id: +id });
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(
      { id: +id },
      { ...updateUserDto, birthday: new Date(updateUserDto.birthday) },
    );
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string): Promise<User> {
    return await this.userService.remove({ id: +id });
  }
}
