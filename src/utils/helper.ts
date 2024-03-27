import { ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

export const getIdColumnDecorator = () => {
  if ('mongo' === 'mongo') {
    return ObjectIdColumn();
  } else {
    return PrimaryGeneratedColumn('uuid');
  }
}