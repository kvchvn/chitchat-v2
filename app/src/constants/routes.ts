export const SIGN_IN_ROUTE_BASE = '/sign-in';

export const ROUTES = {
  signIn: SIGN_IN_ROUTE_BASE,
  signInWelcome: `${SIGN_IN_ROUTE_BASE}/welcome`,
  signInError: `${SIGN_IN_ROUTE_BASE}/error`,
  signInUsername: `${SIGN_IN_ROUTE_BASE}/username`,
  profile: '/profile',
  profileSettings: '/profile/settings',
  chats: '/',
} as const;
