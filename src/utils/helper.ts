import { ObjectIdColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PostgresModule } from 'src/databases/postgres.module';
import { MongoModule } from 'src/databases/mongo.module';
import * as dotenv from 'dotenv';

dotenv.config();
export const determineDB = () => {
  return process.env.DB_TYPE;
};

export const getIdColumnDecorator = () => {
  if (process.env.DB_TYPE === 'postgres') {
    return PrimaryGeneratedColumn('uuid');
  } else {
    return ObjectIdColumn();
  }
};

export const determineDatabaseModule = () => {
  return process.env.DB_TYPE === 'postgres' ? PostgresModule : MongoModule;
};
