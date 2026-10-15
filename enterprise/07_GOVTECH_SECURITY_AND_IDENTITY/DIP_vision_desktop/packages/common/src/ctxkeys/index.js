/**
 * Aura v1: Context Keys Primitives
 * Standard keys used for AsyncLocalStorage and Request Context.
 */

export const ContextKey = Object.freeze({
  CORRELATION_ID: 'correlation_id',
  ORGANIZATION_ID: 'organization_id',
  LOCATION_ID: 'location_id',
  USER_ID: 'user_id',
  USER_ROLES: 'user_roles',
  USER_EMAIL: 'user_email',
  IS_SUPER_ADMIN: 'is_super_admin',
});
