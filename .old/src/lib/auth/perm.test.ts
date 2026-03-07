import { describe, it, expect, beforeEach } from 'vitest';
import { AuthPerm } from './perm';
// import type { AuthUserRoleType } from '../types/auth-context';

describe('AuthPerm', () => {
  describe('Singleton pattern', () => {
    it('should return the same instance on multiple calls', () => {
      const instance1 = AuthPerm.getInstance();
      const instance2 = AuthPerm.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Permission values', () => {
    let authPerm: AuthPerm;

    beforeEach(() => {
      authPerm = AuthPerm.getInstance();
    });

    it('should have correct permission values for each role', () => {
      expect(authPerm.getRolePermissionValue('user')).toBe(1);
      expect(authPerm.getRolePermissionValue('dataset_creator')).toBe(2);
      expect(authPerm.getRolePermissionValue('admin')).toBe(4);
    });
  });

  describe('Role permissions and hierarchy', () => {
    let authPerm: AuthPerm;

    beforeEach(() => {
      authPerm = AuthPerm.getInstance();
    });

    it('should return correct permissions for user role', () => {
      const permissions = authPerm.getRolePermissions('user');
      expect(permissions).toEqual([1]);
    });

    it('should return correct permissions for dataset_creator role', () => {
      const permissions = authPerm.getRolePermissions('dataset_creator');
      expect(permissions).toEqual([2, 1]);
    });

    it('should return correct permissions for admin role', () => {
      const permissions = authPerm.getRolePermissions('admin');
      expect(permissions).toEqual([4, 1, 2]);
    });

    it('should return all permissions correctly', () => {
      const allPermissions = authPerm.getAllPermissions();
      expect(Object.keys(allPermissions)).toEqual([
        'admin',
        'dataset_creator',
        'user',
      ]);
      expect(allPermissions.user).toEqual([1]);
      expect(allPermissions.dataset_creator).toEqual([2, 1]);
      expect(allPermissions.admin).toEqual([4, 1, 2]);
    });

    it('should return all role types correctly', () => {
      const allRoleTypes = authPerm.getAllRoleTypes();
      expect(allRoleTypes).toContain('user');
      expect(allRoleTypes).toContain('dataset_creator');
      expect(allRoleTypes).toContain('admin');
      expect(allRoleTypes.length).toBe(3);
    });
  });

  describe('Permission checking', () => {
    let authPerm: AuthPerm;

    beforeEach(() => {
      authPerm = AuthPerm.getInstance();
    });

    it('should check if user has user permission correctly', () => {
      expect(authPerm.hasPermission('user', 'user')).toBe(true);
      expect(authPerm.hasPermission('user', 'dataset_creator')).toBe(true);
      expect(authPerm.hasPermission('user', 'admin')).toBe(true);
    });

    it('should check if user has dataset_creator permission correctly', () => {
      expect(authPerm.hasPermission('dataset_creator', 'user')).toBe(false);
      expect(authPerm.hasPermission('dataset_creator', 'dataset_creator')).toBe(
        true,
      );
      expect(authPerm.hasPermission('dataset_creator', 'admin')).toBe(true);
    });

    it('should check if user has admin permission correctly', () => {
      expect(authPerm.hasPermission('admin', 'user')).toBe(false);
      expect(authPerm.hasPermission('admin', 'dataset_creator')).toBe(false);
      expect(authPerm.hasPermission('admin', 'admin')).toBe(true);
    });

    it('should check if user has any of the specified permissions correctly', () => {
      expect(authPerm.hasAnyPermission(['user'], 'user')).toBe(true);
      expect(authPerm.hasAnyPermission(['dataset_creator'], 'user')).toBe(
        false,
      );
      expect(
        authPerm.hasAnyPermission(
          ['user', 'dataset_creator'],
          'dataset_creator',
        ),
      ).toBe(true);
      expect(
        authPerm.hasAnyPermission(
          ['user', 'dataset_creator', 'admin'],
          'admin',
        ),
      ).toBe(true);
      expect(
        authPerm.hasAnyPermission(['dataset_creator', 'admin'], 'user'),
      ).toBe(false);
    });
  });

  describe('Utility methods', () => {
    let authPerm: AuthPerm;

    beforeEach(() => {
      authPerm = AuthPerm.getInstance();
    });

    it('should get highest role correctly', () => {
      expect(authPerm.getHighestRole(['user'])).toBe('user');
      expect(authPerm.getHighestRole(['user', 'dataset_creator'])).toBe(
        'dataset_creator',
      );
      expect(authPerm.getHighestRole(['user', 'admin'])).toBe('admin');
      expect(
        authPerm.getHighestRole(['user', 'dataset_creator', 'admin']),
      ).toBe('admin');
      expect(authPerm.getHighestRole(['dataset_creator', 'admin'])).toBe(
        'admin',
      );
    });

    it('should throw error when getting highest role from empty array', () => {
      expect(() => authPerm.getHighestRole([])).toThrow(
        'Cannot determine highest role from empty array',
      );
    });

    it('should validate roles correctly', () => {
      expect(authPerm.isValidRole('user')).toBe(true);
      expect(authPerm.isValidRole('dataset_creator')).toBe(true);
      expect(authPerm.isValidRole('admin')).toBe(true);
      expect(authPerm.isValidRole('invalid_role')).toBe(false);
    });
  });
});
