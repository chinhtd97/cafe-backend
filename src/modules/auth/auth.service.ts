import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { AuthTokenService } from './auth-token.service';
import { RolesService } from '../roles/roles.service';
import { UserDocument } from '../users/schemas/users.schema';
// import { UserDocument } from '../users/schemas/user.schema';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role_id: Types.ObjectId | string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly authToken: AuthTokenService,
    private readonly roles: RolesService,
  ) {}

  async register(name: string, email: string, password: string) {
    const exists = await this.users.findByEmail(email);
    if (exists) throw new BadRequestException('Email already registered');

    const defaultRole = await this.roles.findByName('user');
    if (!defaultRole) throw new BadRequestException('Default role not found');

    const role_id = defaultRole.id;
    const userDoc = await this.users.createUser(name, email, password, role_id);
    const user = this.mapUser(userDoc);

    return { user: this.publicUser(user) };
  }

  async login(email: string, password: string) {
    const userDoc = await this.users.findByEmail(email);
    if (!userDoc) throw new UnauthorizedException('Invalid Email');

    const match = await bcrypt.compare(password, userDoc.password);
    if (!match) throw new UnauthorizedException('Invalid password');

    const user = this.mapUser(userDoc);
    const tokens = await this.issueTokens(user.id, user.email, user.role_id);

    await this.authToken.saveTokens(user.id, tokens.refreshToken);

    return { user: this.publicUser(user), ...tokens };
  }

  async logout(userId: string) {
    await this.authToken.revokeToken(userId);
    return { success: true };
  }

  async refresh(userId: string, refreshToken: string) {
    await this.authToken.validateRefreshToken(userId, refreshToken);

    const userDoc = await this.users.findById(userId);
    if (!userDoc) throw new UnauthorizedException('User not found');

    const user = this.mapUser(userDoc);

    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, role: user.role_id },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
    );

    return { accessToken, refreshToken };
  }

  private async issueTokens(
    sub: string,
    email: string,
    role_id: Types.ObjectId | string,
  ) {
    const access = await this.jwt.signAsync(
      { sub, email, role_id },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
      },
    );
    const refresh = await this.jwt.signAsync(
      { sub, email, role_id },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
      },
    );
    return { accessToken: access, refreshToken: refresh };
  }

  private publicUser(u: IUser) {
    return { id: u.id, name: u.name, email: u.email, role_id: u.role_id };
  }

  private mapUser(userDoc: UserDocument): IUser {
    return {
      id: userDoc._id?.toString() || userDoc.id,
      name: userDoc.name,
      email: userDoc.email,
      password: userDoc.password,
      role_id: userDoc.role_id,
    };
  }
}
