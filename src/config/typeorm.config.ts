import { DataSource } from 'typeorm';
import { Class } from '../classes/entities/class.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'sports_complex',
  entities: [Class],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
}); 