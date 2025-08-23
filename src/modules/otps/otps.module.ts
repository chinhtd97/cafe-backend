import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OTPSchema } from './schemas/otps.schema';
import { OtpsService } from './otps.service';
import { OtpsController } from './otps.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Otps', schema: OTPSchema }])],
  controllers: [OtpsController],
  providers: [OtpsService],
  exports: [OtpsService],
})
export class OtpsModule {}
