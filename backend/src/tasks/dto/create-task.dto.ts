import {
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  projectId!: number;

  @IsInt()
  @IsOptional()
  assigneeId?: number;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}