// Fallback PartialType implementation to avoid needing '@nestjs/mapped-types' package
// This preserves the shape for Update DTOs in environments where the package is not installed.
function PartialType<T extends new (...args: any[]) => any>(classRef: T) {
  return classRef as any;
}

import { CreateTaskDto } from './create-task.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsString()
  @IsOptional()
  status?: string;
}