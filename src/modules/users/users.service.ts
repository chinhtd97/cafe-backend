import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    role_id: Types.ObjectId,
  ): Promise<UserDocument> {
    const hashed = await bcrypt.hash(password, 10);
    const user = new this.userModel({ name, email, password: hashed, role_id });
    return user.save();
  }

  async updateRefreshTokenHash(
    userId: string,
    hash: string | null,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { refreshTokenHash: hash }, { new: true })
      .exec();
  }
}
