import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanksModule } from './banks/banks.module';
import { Bank } from './entities/bank.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'cronda',
      entities: [Bank],
      synchronize: true,
      logging: ['query', 'error'],
    }),
    BanksModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // directorio donde se guardarán los archivos
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
