import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeSchema } from '../../domain/entities/employee.entity';
import { EmployeeService } from '../../application/services/employee.service';
import { EmployeeController } from '../controllers/employee.controller';
import { EmployeeRepository } from '../repositories/employee.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Employee', schema: EmployeeSchema }]),
  ],
  providers: [EmployeeService, EmployeeRepository],
  controllers: [EmployeeController],
  exports: [EmployeeService],
})
export class EmployeeModule {}
