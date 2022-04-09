import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/users.entity';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  
  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return await this.userModel.find().skip(offset).limit(limit).exec();
  }

  async findOneByUsername(username: string) {
    const user = await this.userModel.findOne({ username: username }).exec()
    if(!user) {
      // throw new HttpException(`User #${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`User #${username} not found`);
    }
    return user;
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({ _id: id }).exec()
    if(!user) {
      // throw new HttpException(`User #${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    const { username } = createUserDto;
    const exsitingUser = await this.findOneByUsername(username);
    if(exsitingUser) {
      throw new BadRequestException(`username has been taken!`);
    }
    return user.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userModel
      .findOneAndUpdate({ _id: id }, { $set: updateUserDto }, { new: true })  // { new: true }保证了返回的是我们更新后的对象，而不是update之前的原对象(默认情况)
      .exec()

    // const existingUser = this.findOne(id);
    if(!existingUser) {
      throw new NotFoundException(`User #${id} not found`);
      // update
    }
    return existingUser;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return user.remove();
  }
}
