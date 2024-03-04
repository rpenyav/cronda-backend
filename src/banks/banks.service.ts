import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from '../entities/bank.entity';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BanksService implements OnModuleInit {
  constructor(
    @InjectRepository(Bank)
    private banksRepository: Repository<Bank>,
  ) {}

  onModuleInit() {
    this.ensureUploadsDir();
  }

  async loadCSV(filePath: string): Promise<void> {
    const stream = fs.createReadStream(filePath);
    const parser = csvParser({
      mapHeaders: ({ header }) => header.trim(),
      mapValues: ({ header, value }) => value.trim(),
    });

    for await (const row of stream.pipe(parser)) {
      try {
        // Mapeo directo del objeto row a las propiedades esperadas, corrigiendo las claves según los encabezados del CSV.
        const {
          'CÓDIGO EUROPEO': code,
          LEI: lei,
          NOMBRE: name,
          CATEGORÍA: categoria,
          DIRECCIÓN: direccion,
          INFORME: informe,
          'ENTIDAD MATRIZ': entidadMatriz,
          'CÓDIGO DE SUPERVISOR': codigoSupervisor,
        } = row;

        // Log para diagnosticar los valores procesados
        console.log(`Procesando: ${code}, ${name}`);

        // Verifica si el banco ya existe basado en el código
        let bank = await this.banksRepository.findOne({ where: { code } });

        // Si no existe, crea un nuevo banco
        if (!bank) {
          console.log(`Creando nuevo banco: ${code}`);
          bank = this.banksRepository.create({
            code,
            lei,
            name,
            categoria,
            direccion,
            informe,
            entidadMatriz: entidadMatriz || null, // Manejo de valores nulos
            codigoSupervisor: codigoSupervisor || null,
          });
        } else {
          // Actualiza los datos del banco existente
          console.log(`Actualizando banco existente: ${code}`);
          bank.lei = lei;
          bank.name = name;
          bank.categoria = categoria;
          bank.direccion = direccion;
          bank.informe = informe;
          bank.entidadMatriz = entidadMatriz || null;
          bank.codigoSupervisor = codigoSupervisor || null;
        }

        // Guarda el banco en la base de datos
        await this.banksRepository.save(bank);
      } catch (error) {
        console.error('Error al procesar la fila:', row, error);
        // Opcionalmente, detener el proceso o continuar con la siguiente fila
      }
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', filePath, err);
      } else {
        console.log('File deleted successfully:', filePath);
      }
    });

    console.log('Archivo CSV procesado y base de datos actualizada.');
  }

  private ensureUploadsDir() {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  }
}
