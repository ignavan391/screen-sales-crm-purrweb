import { ConnectionOptions } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASS, DB_USER } from './constants';

export const ormConfig: ConnectionOptions = {
  type: 'postgres',
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  synchronize: true,
  migrationsRun: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{ts,js}'],
};
