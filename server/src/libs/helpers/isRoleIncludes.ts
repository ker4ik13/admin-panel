import { IRole } from 'src/types/IRole';

export const isRoleIncludes = (
  needRoles: string[],
  roles: IRole[],
): boolean => {
  let isIncludes = false;

  roles.forEach((role) => {
    if (needRoles.includes(role.value)) {
      isIncludes = true;
    }
  });

  return isIncludes;
};
