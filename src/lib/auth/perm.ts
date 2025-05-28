import type { AuthUserRoleType } from '../types/auth-context';

/**
 * A singleton class that manages and checks authorization permissions based on user roles.
 * Uses bitwise flags for efficient permission checking and role hierarchy management.
 */
export class AuthPerm {
  private static instance: AuthPerm;

  private constructor() {}

  /**
   * Gets the singleton instance of AuthPerm
   * @returns {AuthPerm} The singleton instance
   */
  public static getInstance(): AuthPerm {
    if (!AuthPerm.instance) {
      AuthPerm.instance = new AuthPerm();
    }
    return AuthPerm.instance;
  }

  // Bitwise permission flags (1 << n is safer than 2 << n for bit flags)
  private readonly Permissions: Record<AuthUserRoleType, number> = {
    user: 1 << 0, // 1
    dataset_creator: 1 << 1, // 2
    admin: 1 << 2, // 4
  } as const;

  // Role hierarchy with inherited permissions
  private readonly permissionTable: Record<AuthUserRoleType, number[]> = {
    admin: [
      this.getRolePermissionValue('admin'),
      this.getRolePermissionValue('user'),
      this.getRolePermissionValue('dataset_creator'),
    ],
    dataset_creator: [
      this.getRolePermissionValue('dataset_creator'),
      this.getRolePermissionValue('user'),
    ],
    user: [this.getRolePermissionValue('user')],
  } as const;

  /**
   * Checks if a user role has the required permission
   * @param authRole Required role for the operation
   * @param userRole User's actual role
   * @returns True if user has permission
   */
  public hasPermission(
    authRole: AuthUserRoleType,
    userRole: AuthUserRoleType,
  ): boolean {
    if (!this.isValidRole(authRole)) {
      return false;
    }
    const userSystemRole = this.combinedPermissions(userRole);
    const userRoleToCheck = this.getRolePermissionValue(authRole);

    return (userSystemRole & userRoleToCheck) === userRoleToCheck;
  }

  /**
   * Calculates combined permission flags for a role
   * @param role Role to calculate permissions for
   * @returns Combined bitwise permission value
   */
  private combinedPermissions(role: AuthUserRoleType): number {
    return this.getRolePermissions(role).reduce(
      (acc, permission) => acc | permission,
      0,
    );
  }

  /**
   * Gets the bitwise permission value for a role
   * @param role Role to get value for
   * @returns Permission value
   */
  public getRolePermissionValue(role: AuthUserRoleType): number {
    return this.Permissions[role];
  }

  /**
   * Gets all permission flags for a role
   * @param role Role to get permissions for
   * @returns Array of permission values
   */
  public getRolePermissions(role: AuthUserRoleType): number[] {
    return this.permissionTable[role];
  }

  /**
   * Gets the complete permission hierarchy
   * @returns Record of all roles and their permissions
   */
  public getAllPermissions(): Record<AuthUserRoleType, number[]> {
    return this.permissionTable;
  }

  /**
   * Checks if user has any of the specified permissions
   * @param allowedRoles Array of acceptable roles
   * @param userRole User's role to check
   * @returns True if user has any required permission
   */
  public hasAnyPermission(
    allowedRoles: AuthUserRoleType[],
    userRole: AuthUserRoleType,
  ): boolean {
    return allowedRoles.some((role) => this.hasPermission(role, userRole));
  }

  /**
   * Gets all defined role types
   * @returns Array of all role types
   */
  public getAllRoleTypes(): AuthUserRoleType[] {
    return Object.keys(this.Permissions) as AuthUserRoleType[];
  }

  /**
   * Determines the highest privileged role from a list
   * @param roles Array of roles to evaluate
   * @returns Highest privileged role
   */
  public getHighestRole(roles: AuthUserRoleType[]): AuthUserRoleType {
    if (roles.length === 0) {
      throw new Error('Cannot determine highest role from empty array');
    }

    const roleValues = roles.map((role) => this.getRolePermissionValue(role));
    const maxValue = Math.max(...roleValues);

    const highestRole = this.getAllRoleTypes().find(
      (role) => this.getRolePermissionValue(role) === maxValue,
    );

    return highestRole as AuthUserRoleType;
  }

  /**
   * Validates if a role exists in the permission system
   * @param role Role to validate
   * @returns True if role exists
   */
  public isValidRole(role: string): role is AuthUserRoleType {
    return role in this.Permissions;
  }

  /**
   * Check if any of the provided roles are valid
   * @param roles Array of roles to check
   * @return True if any role is valid
   */
  public canAnyRole(
    roles: AuthUserRoleType[],
    userRole: AuthUserRoleType,
  ): boolean {
    return roles.some(
      (role) => this.isValidRole(role) && this.hasPermission(role, userRole),
    );
  }

  /**
   * Check if a role is a valid user role and not have acess
   * @param roles Array of roles to check
   * @return True if any role is valid and does not have access
   */
  public cannotAnyRole(
    roles: AuthUserRoleType[],
    userRole: AuthUserRoleType,
  ): boolean {
    return roles.some(
      (role) => this.isValidRole(role) && !this.hasPermission(role, userRole),
    );
  }
}
