import { getIdColumnDecorator } from 'src/utils/helper';
import { Entity, BaseEntity, Column } from 'typeorm';

const databaseType = process.env.DB_TYPE || 'postgres';

@Entity({ database: databaseType })
export class Role extends BaseEntity {
  @getIdColumnDecorator()
  _id: string;

  @Column()
  name: string;

  @Column('text')
  acl: string;
}
