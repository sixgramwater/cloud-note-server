import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { FileService } from 'src/file/file.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly fileService: FileService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.password === pass) {
      // bug
      user.password = '';
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      username: user.username,
      userId: user._id,
      access_token: this.jwtService.sign(payload),
      expires: Date.now() + 30000000,
    };
  }

  async register(user: any) {
    // const { username, password } = user;
    const res = await this.usersService.create(user);
    res.password = '';
    const userRootEntry = {
      fileId: randomUUID(),
      name: 'ROOT',
      userId: res._id,
      parentId: null,
      dir: true,
      type: 0,
    }
    await this.fileService.create(userRootEntry);
    return res;
  }
}
