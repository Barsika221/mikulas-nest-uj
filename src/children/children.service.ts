import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChildrenService {
  constructor(private readonly prisma: PrismaService) {}

  create(createChildDto: CreateChildDto) {
    return this.prisma.child.create({ data: createChildDto });
  }

  findAll() {
    return this.prisma.child.findMany({
      include: {
        toys: { include: { toy: true } },
      },
    });
  }

  async findOne(id: number) {
    const child = await this.prisma.child.findUnique({
      where: { id },
      include: { toys: { include: { toy: true } } },
    });
    if (!child) throw new NotFoundException(`Child ${id} not found`);
    return child;
  }

  async update(id: number, updateChildDto: UpdateChildDto) {
    await this.ensureExists(id);
    return this.prisma.child.update({ where: { id }, data: updateChildDto });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    return this.prisma.child.delete({ where: { id } });
  }

  async addToy(childId: number, toyId: number) {
    await this.ensureChildAndToy(childId, toyId);

    const existing = await this.prisma.childrenToy.findFirst({ where: { childId, toyId } });
    if (existing) return existing;

    return this.prisma.childrenToy.create({ data: { childId, toyId } });
  }

  async removeToy(childId: number, toyId: number) {
    await this.ensureChildAndToy(childId, toyId);

    const link = await this.prisma.childrenToy.findFirst({ where: { childId, toyId } });
    if (!link) throw new NotFoundException(`Toy ${toyId} is not assigned to child ${childId}`);

    return this.prisma.childrenToy.delete({ where: { id: link.id } });
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.child.count({ where: { id } });
    if (!exists) throw new NotFoundException(`Child ${id} not found`);
  }

  private async ensureChildAndToy(childId: number, toyId: number) {
    const [childExists, toyExists] = await Promise.all([
      this.prisma.child.count({ where: { id: childId } }),
      this.prisma.toy.count({ where: { id: toyId } }),
    ]);
    if (!childExists) throw new NotFoundException(`Child ${childId} not found`);
    if (!toyExists) throw new NotFoundException(`Toy ${toyId} not found`);
  }
}
