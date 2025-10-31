import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shift, ShiftSchema } from './schemas/shift.schema';
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Shift.name, schema: ShiftSchema }])],
  providers: [ShiftsService],
  controllers: [ShiftsController],
})
export class ShiftsModule {}
