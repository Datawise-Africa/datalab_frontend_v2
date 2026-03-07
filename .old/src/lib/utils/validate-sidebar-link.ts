import { AuthPerm } from '../auth/perm';
import type { AuthUserRoleType } from '../types/auth-context';
import type { SidebarLinkType } from '../types/sidebar';

const permAuth = AuthPerm.getInstance();
/**
 * Creates a validation function for sidebar links based on user authentication status and role.
 *
 * This function returns a higher-order function that filters sidebar links according to
 * the user's authentication status and role permissions. It recursively validates child links
 * and prunes branches where the user lacks appropriate permissions.
 *
 * @param isAuthenticated - Indicates whether the user is authenticated
 * @param userRole - The role of the authenticated user, or null if not applicable
 *
 * @returns A function that takes a sidebar link and returns either:
 *   - The original link (possibly with filtered children) if the user has permission
 *   - Null if the user doesn't have permission to see the link
 *
 * @example
 * // Create a validator function for an authenticated admin user
 * const validateLink = validateSidebarLink(true, 'admin');
 *
 * // Apply the validator to a sidebar link structure
 * const validatedLinks = sidebarLinks.map(validateLink).filter(Boolean);
 */
export function validateSidebarLink(
  isAuthenticated: boolean,
  userRole: AuthUserRoleType | null,
) {
  return (link: SidebarLinkType): SidebarLinkType | null => {
    // First check permissions for the current link
    if (link.requiresAuth) {
      if (!isAuthenticated) return null;
      if (link.requiredRole) {
        if (!userRole || !permAuth.hasPermission(link.requiredRole, userRole)) {
          return null;
        }
      }
    }

    // Process children if they exist
    if (Array.isArray(link.children) && link.children.length > 0) {
      const filteredChildren = link.children
        .map((child) => validateSidebarLink(isAuthenticated, userRole)(child))
        .filter((child): child is SidebarLinkType => child !== null);

      // Only return the link if it has children or is explicitly allowed
      if (filteredChildren.length > 0 || !link.requiresAuth) {
        return {
          ...link,
          children: filteredChildren,
        };
      }
      return null;
    }

    // Return the leaf node if it passed permissions
    return link;
  };
}
