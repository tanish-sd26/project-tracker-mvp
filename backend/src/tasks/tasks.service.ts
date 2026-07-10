import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTaskDto) {
    // Check if project exists
    await this.prisma.project.findUniqueOrThrow({
      where: { id: data.projectId },
    });

    // Check if assignee exists (if provided)
    if (data.assigneeId) {
      await this.prisma.teamMember.findUniqueOrThrow({
        where: { id: data.assigneeId },
      });
    }

    return await this.prisma.task.create({
      data,
      include: { project: true, assignee: true },
    });
  }

  async findAll() {
    return await this.prisma.task.findMany({
      include: { project: true, assignee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { project: true, assignee: true },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async findByProject(projectId: number) {
    await this.prisma.project.findUniqueOrThrow({
      where: { id: projectId },
    });

    return await this.prisma.task.findMany({
      where: { projectId },
      include: { assignee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByFilter(status?: string, priority?: string, assigneeId?: number) {
    const where: any = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigneeId) where.assigneeId = assigneeId;

    return await this.prisma.task.findMany({
      where,
      include: { project: true, assignee: true },
      orderBy: { dueDate: 'asc' },
    });
  }

  async update(id: number, data: UpdateTaskDto) {
    await this.findOne(id); // Check if exists

    if (data.assigneeId) {
      await this.prisma.teamMember.findUniqueOrThrow({
        where: { id: data.assigneeId },
      });
    }

    return await this.prisma.task.update({
      where: { id },
      data,
      include: { project: true, assignee: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.task.delete({ where: { id } });
  }
}