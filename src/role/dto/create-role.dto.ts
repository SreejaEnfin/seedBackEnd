export class AclDto {
  users: {
    viewUsers: { label: string; permission: boolean };
    addUser: { label: string; permission: boolean };
    editUser: { label: string; permission: boolean };
    deleteUser: { label: string; permission: boolean };
    exportUsers: { label: string; permission: boolean };
    importUsers: { label: string; permission: boolean };
    inviteUsers: { label: string; permission: boolean };
    loginAsUser: { label: string; permission: boolean };
    permissions: { label: string; permission: boolean };
  };
  groups: {
    viewGroups: { label: string; permission: boolean };
    editGroup: { label: string; permission: boolean };
    addGroup: { label: string; permission: boolean };
    deleteGroup: { label: string; permission: boolean };
    exportGroups: { label: string; permission: boolean };
  };
}

export class CreateRoleDto {
  name: string;
  acl: AclDto;
}
