import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ObjectIdColumn,
} from 'typeorm';

const databaseType = 'mongo';
@Entity({ database: databaseType })
export class Todo extends BaseEntity {
  @Column()
  title: string;

  @Column()
  status: string;

  @getIdColumnDecorator()
  _id: string;
}
function getIdColumnDecorator() {
  if ('mongo' === 'mongo') {
    return ObjectIdColumn();
  } else {
    return PrimaryGeneratedColumn('uuid');
  }
}
