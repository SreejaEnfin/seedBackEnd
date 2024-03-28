import { getIdColumnDecorator } from 'src/utils/helper';
import { Entity, BaseEntity, Column } from 'typeorm';

const databaseType = process.env.DB_TYPE || 'mongo';
@Entity({ database: databaseType })
export class Todo extends BaseEntity {
  @Column()
  title: string;

  @Column()
  status: string;

  @getIdColumnDecorator()
  _id: string;
}
