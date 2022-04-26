import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async findUserByToken(@Req() req) {
    const { userId } = req.user;
    // console.log(userId);
    const user = await this.usersService.findOne(userId);
    if(user) {
      user.password = '';
      return user;
    } else {
      throw new NotFoundException('User Not Found');
    }
  }
  // @Get()
  // findAll(@Query() paginationQuery: PaginationQueryDto) {
  //   return this.usersService.findAll(paginationQuery);
  // }

  // @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    user.password = '';
    if(user) {
      return user;
    }
    // return this.usersService.findOne(id);
    // let userTemp: any;
    // const user = await this.usersService.findOne(id);
    // Object.assign(userTemp, user);
    // delete userTemp.password;
    // return userTemp;
  }

  
  // @Get('/username:username')
  // findOneByUserName(@Param('username') username: string) {
  //   return this.usersService.findOneByUsername(username)
  // }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateUserDto) {
    return this.usersService.update(id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  // @Post('login')
  // login(@Body() loginDto: LoginDto) {
  //   // const { username, password } = loginDto;
    
  // }

  // @Post('register')
  // register(@Body() registerDto: RegisterDto) {

  // }
}
