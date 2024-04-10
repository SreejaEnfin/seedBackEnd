import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Action } from '../casl.enum';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export type AppAbility = MongoAbility;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    // if (user.role.includes('admin')) {
    //   can(Action.Manage, 'all'); // read-write access to everything
    // } else {
    //   can(Action.Read, 'all'); // read-only access to everything
    // }

    const aclKeys = user.acl ? Object.keys(user.acl) : [];
    for (const aclKey of aclKeys) {
      const aclFeatureKeys = Object.keys(user.acl[aclKey]);
      for (const aclFeatureKey of aclFeatureKeys) {
        if (user.acl[aclKey][aclFeatureKey].permission) {
          can(aclFeatureKey, aclKey);
        } else {
          cannot(aclFeatureKey, aclKey);
        }
      }
    }

    return build();
  }
}
