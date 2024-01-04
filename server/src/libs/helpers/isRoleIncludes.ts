import { IRole } from 'src/types/IRole';

export const isRoleIncludes = (needRole: string, roles: IRole[]): boolean => {
  let isIncludes = false;

  roles.forEach((role) => {
    if (role.value === needRole) {
      isIncludes = true;
    }
  });

  return isIncludes;
};
