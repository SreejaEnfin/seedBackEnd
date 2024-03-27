import { getIdColumnDecorator } from 'src/utils/helper';
import {
  Entity,
  BaseEntity,
  Column,
} from 'typeorm';

const databaseType = 'mongo';
@Entity({ database: databaseType })
export class User extends BaseEntity {
  @getIdColumnDecorator()
  _id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;
}