import { getIdColumnDecorator } from 'src/utils/helper';
import { Entity, BaseEntity, Column } from 'typeorm';

const databaseType = process.env.DB_TYPE || 'postgres';
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

  @Column({ type: 'text', nullable: true })
  acl: string;

  @Column({ type: 'simple-array', nullable: true })
  roleIds: string[];
}
