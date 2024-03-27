import { ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";
import { PostgresModule } from "src/databases/postgres.module";
import { MongoModule } from "src/databases/mongo.module";

export const getIdColumnDecorator = () => {
  if (process.env.DB_TYPE === 'mongo') {
    return ObjectIdColumn();
  } else {
    return PrimaryGeneratedColumn('uuid');
  }
}

export const determineDatabaseModule = () => {
  return process.env.DB_TYPE === 'postgres' ? PostgresModule : MongoModule;
}