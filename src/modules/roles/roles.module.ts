import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema } from './schemas/roles.schema';
import { RolesService } from './roles.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }])],
  controllers: [],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
