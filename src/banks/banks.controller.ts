// src/banks/banks.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BanksService } from './banks.service';
import { Bank } from '../entities/bank.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  // @Post()
  // create(@Body() createBankDto: any): Promise<Bank> {
  //   return this.banksService.create(createBankDto);
  // }

  @Post('upload-massive')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const originalName = file.originalname
            .replace(/\s+/g, '-')
            .toLowerCase();
          callback(null, `${uniqueSuffix}-${originalName}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    if (!file) {
      throw new Error('File upload failed: No file uploaded');
    }
    await this.banksService.loadCSV(file.path);
    return { message: 'File has been successfully processed.' };
  }
}
