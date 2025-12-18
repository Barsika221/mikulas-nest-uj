import { Module } from '@nestjs/common';
import { ToysService } from './toys.service';
import { ToysController } from './toys.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ToysController],
  providers: [ToysService, PrismaService],
})
export class ToysModule {}
