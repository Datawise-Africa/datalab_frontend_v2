import { describe, test, expect, vi, beforeEach } from 'vitest';
import { validateSidebarLink } from './validate-sidebar-link';
import { AuthPerm } from '../auth/perm';
import type { SidebarLinkType } from '../types/sidebar';

// Mock AuthPerm class
vi.mock('../auth/perm', () => {
  const mockHasPermission = vi.fn();
  return {
    AuthPerm: {
      getInstance: () => ({
        hasPermission: mockHasPermission,
      }),
    },
  };
});

describe('validateSidebarLink', () => {
  const mockAuthPerm = AuthPerm.getInstance() as unknown as {
    hasPermission: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthPerm.hasPermission.mockReset();
  });

  test('should return link when authentication is not required', () => {
    const link = {
      id: 'link1',
      requiresAuth: false,
    } as unknown as SidebarLinkType;
    const result = validateSidebarLink(false, null)(link);
    expect(result).toEqual(link);
  });

  test('should return null when authentication is required but user is not authenticated', () => {
    const link = {
      id: 'link1',
      requiresAuth: true,
    } as unknown as SidebarLinkType;
    const result = validateSidebarLink(false, null)(link);
    expect(result).toBeNull();
  });

  test('should return link when authentication is required and user is authenticated without role requirement', () => {
    const link = {
      id: 'link1',
      requiresAuth: true,
    } as unknown as SidebarLinkType;
    const result = validateSidebarLink(true, 'user')(link);
    expect(result).toEqual(link);
  });

  test('should return null when required role is not met', () => {
    const link = {
      id: 'link1',
      requiresAuth: true,
      requiredRole: 'admin',
    } as unknown as SidebarLinkType;
    mockAuthPerm.hasPermission.mockReturnValue(false);

    const result = validateSidebarLink(true, 'user')(link);

    expect(mockAuthPerm.hasPermission).toHaveBeenCalledWith('admin', 'user');
    expect(result).toBeNull();
  });

  test('should return link when required role is met', () => {
    const link = {
      id: 'link1',
      requiresAuth: true,
      requiredRole: 'admin',
    } as unknown as SidebarLinkType;
    mockAuthPerm.hasPermission.mockReturnValue(true);

    const result = validateSidebarLink(true, 'admin')(link);

    expect(mockAuthPerm.hasPermission).toHaveBeenCalledWith('admin', 'admin');
    expect(result).toEqual(link);
  });

  test('should filter children based on permissions', () => {
    mockAuthPerm.hasPermission.mockImplementation(
      (required, actual) => required === actual,
    );

    const link = {
      id: 'parent',
      requiresAuth: false,
      children: [
        { id: 'child1', requiresAuth: true },
        { id: 'child2', requiresAuth: true, requiredRole: 'admin' },
        { id: 'child3', requiresAuth: false },
      ],
    } as unknown as SidebarLinkType;

    const result = validateSidebarLink(true, 'user')(link);

    expect(result).toEqual({
      id: 'parent',
      requiresAuth: false,
      children: [
        { id: 'child1', requiresAuth: true },
        { id: 'child3', requiresAuth: false },
      ],
    });
  });

  test('should return null for parent requiring auth when all children are filtered out', () => {
    mockAuthPerm.hasPermission.mockReturnValue(false);

    const link = {
      id: 'parent',
      requiresAuth: true,
      children: [
        { id: 'child1', requiresAuth: true, requiredRole: 'admin' },
        { id: 'child2', requiresAuth: true, requiredRole: 'admin' },
      ],
    } as unknown as SidebarLinkType;

    const result = validateSidebarLink(true, 'user')(link);
    expect(result).toBeNull();
  });

  test('should return parent not requiring auth even when all children are filtered out', () => {
    mockAuthPerm.hasPermission.mockReturnValue(false);

    const link = {
      id: 'parent',
      requiresAuth: false,
      children: [{ id: 'child1', requiresAuth: true, requiredRole: 'admin' }],
    } as unknown as SidebarLinkType;

    const result = validateSidebarLink(true, 'user')(link);
    expect(result).toEqual({
      id: 'parent',
      requiresAuth: false,
      children: [],
    });
  });

  test('should handle nested children correctly', () => {
    mockAuthPerm.hasPermission.mockImplementation(
      (required, actual) => required === actual,
    );

    const link = {
      id: 'grandparent',
      requiresAuth: false,
      children: [
        {
          id: 'parent1',
          requiresAuth: false,
          children: [
            { id: 'child1', requiresAuth: true },
            { id: 'child2', requiresAuth: true, requiredRole: 'admin' },
          ],
        },
        {
          id: 'parent2',
          requiresAuth: true,
          requiredRole: 'admin',
          children: [{ id: 'child3', requiresAuth: false }],
        },
      ],
    } as unknown as SidebarLinkType;

    const result = validateSidebarLink(true, 'user')(link);

    expect(result).toEqual({
      id: 'grandparent',
      requiresAuth: false,
      children: [
        {
          id: 'parent1',
          requiresAuth: false,
          children: [{ id: 'child1', requiresAuth: true }],
        },
      ],
    });
  });
});
