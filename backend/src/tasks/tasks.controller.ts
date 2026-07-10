import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get('filter')
  findByFilter(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('assigneeId') assigneeId?: string,
  ) {
    const assigneeIdNum = assigneeId ? parseInt(assigneeId) : undefined;
    return this.tasksService.findByFilter(status, priority, assigneeIdNum);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId', new ParseIntPipe()) projectId: number) {
    return this.tasksService.findByProject(projectId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.tasksService.remove(id);
  }
}