import { getIdColumnDecorator } from 'src/utils/helper';
import { Entity, BaseEntity, Column } from 'typeorm';
import { AclDto } from '../dto/create-role.dto';

const databaseType = process.env.DB_TYPE || 'postgres';

export enum RoleType {
  ADMIN = 'admin',
  ENDUSER = 'enduser',
}

@Entity({ database: databaseType })
export class Role extends BaseEntity {
  @getIdColumnDecorator()
  _id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: RoleType })
  roleType: RoleType;

  @Column('text')
  acl: AclDto;
}
