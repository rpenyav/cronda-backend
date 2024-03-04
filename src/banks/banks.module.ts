// src/banks/banks.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';
import { Bank } from '../entities/bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],
  controllers: [BanksController],
  providers: [BanksService],
})
export class BanksModule {}
