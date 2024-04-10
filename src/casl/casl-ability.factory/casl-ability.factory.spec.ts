import { CaslAbilityFactory } from './casl-ability.factory';

describe('CaslAbilityFactory', () => {
  let caslAbilityFactory: CaslAbilityFactory;

  beforeEach(() => {
    caslAbilityFactory = new CaslAbilityFactory();
  });

  it('should grant correct permissions to user based on acl', () => {
    const user: any = {
      // Assuming User has an id and acl property for this example
      id: '1',
      acl: {
        'article': {
          'read': { permission: true },
          'write': { permission: false }
        }
      }
    };

    const ability = caslAbilityFactory.createForUser(user);
    expect(ability.can('read', 'article')).toBe(true);
    expect(ability.can('write', 'article')).toBe(false);
  });

  // Add more tests here to cover other scenarios, such as users with different roles or no acl defined
});