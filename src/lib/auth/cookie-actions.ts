import { cookieOptions, REACT_PUBLIC_API_HOST } from '@/constants';
import { Cookie } from './cookie';

export async function handleRefresh() {
  // console.log('handleRefresh')

  const refreshToken = getRefreshToken();

  const token = await fetch(`${REACT_PUBLIC_API_HOST}/auth/refresh_token/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      // console.log('Response - Refresh:',json)

      if (json.access_token) {
        Cookie.set('session_access_token', json.access_token, {
          httpOnly: true,
          /* eslint-disable no-undef */
          secure: process.env.NODE_ENV !== 'production',

          maxAge: 60 * 60 * 24, // One day
          path: '/',
        });
        return json.access_token;
      } else {
        resetAuthCookies();
      }
    })
    .catch((error) => {
      console.log('Error - Refresh:', error);
      resetAuthCookies();
    });
  return token;
}
export async function handleLogin(
  id: string,
  first_name: string,
  last_name: string,
  user_role: string,
  access_token: string,
  refresh_token: string,
) {
  Cookie.set('session_userid', id, cookieOptions);

  Cookie.set('session_first_name', first_name, cookieOptions);

  Cookie.set('session_last_name', last_name, cookieOptions);

  Cookie.set('session_userrole', user_role, cookieOptions);

  Cookie.set('session_access_token', access_token, cookieOptions);

  Cookie.set('session_refresh_token', refresh_token, cookieOptions);
}

export function resetAuthCookies() {
  Cookie.set('session_user_id', '');
  Cookie.set('session_userrole', '');
  Cookie.set('session_access_token', '');
  Cookie.set('session_refresh_token', '');
}

export function getUserId() {
  const userId = Cookie.get('session_userid');
  // console.log({userId});
  return userId ? userId : null;
}

export function getUserNames() {
  const firstName = Cookie.get('session_first_name') || null;

  return firstName;
}

export function getUserRole() {
  const userRole = Cookie.get('session_userrole');
  return userRole ? userRole : null;
}

export async function getAccessToken() {
  let accessToken = Cookie.get('session_access_token');

  if (!accessToken) {
    accessToken = await handleRefresh(); // Await the refresh token logic
  }

  return accessToken || null;
}

export function getRefreshToken() {
  const refreshToken = Cookie.get('session_refresh_token');
  return refreshToken ? refreshToken : null;
}

export function handleLogout() {
  const sessionCookies = [
    'session_userid',
    'session_first_name',
    'session_last_name',
    'session_userrole',
    'session_access_token',
    'session_refresh_token',
  ];

  sessionCookies.forEach((cookieName) => {
    Cookie.remove(cookieName, { path: '/' });
  });
}
