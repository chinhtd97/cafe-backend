// src/modules/roles/roles.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from './schemas/roles.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel('Role') private roleModel: Model<Role>) {}

  async findByName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({ name }).exec();
  }

  async createRole(name: string, permissions: string[] = []): Promise<Role> {
    const role = new this.roleModel({ name, permissions });
    return role.save();
  }

  async findById(id: string | Types.ObjectId): Promise<Role | null> {
    return this.roleModel.findById(id).exec();
  }
}
