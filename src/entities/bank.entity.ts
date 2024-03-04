import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('banks')
export class Bank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  countryCode: string;

  @Column()
  lei: string;

  @Column({ name: 'categoria' })
  categoria: string;

  @Column()
  direccion: string;

  @Column()
  informe: string;

  @Column({ name: 'entidad_matriz' })
  entidadMatriz: string;

  @Column({ name: 'codigo_supervisor' })
  codigoSupervisor: string;
}
