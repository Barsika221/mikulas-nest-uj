import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateToyDto } from './dto/create-toy.dto';
import { UpdateToyDto } from './dto/update-toy.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ToysService {
  constructor(private readonly prisma: PrismaService) {}

  create(createToyDto: CreateToyDto) {
    return this.prisma.toy.create({ data: createToyDto });
  }

  findAll() {
    return this.prisma.toy.findMany({
      include: {
        children: {
          include: { child: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const toy = await this.prisma.toy.findUnique({
      where: { id },
      include: { children: { include: { child: true } } },
    });
    if (!toy) throw new NotFoundException(`Toy ${id} not found`);
    return toy;
  }

  async update(id: number, updateToyDto: UpdateToyDto) {
    await this.ensureExists(id);
    return this.prisma.toy.update({ where: { id }, data: updateToyDto });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    return this.prisma.toy.delete({ where: { id } });
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.toy.count({ where: { id } });
    if (!exists) throw new NotFoundException(`Toy ${id} not found`);
  }
}
