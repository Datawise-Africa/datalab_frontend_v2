import { REACT_PUBLIC_API_HOST } from "../../constants";
import { cookieOptions } from "../../constants";

export class Cookie {
    /**
     * 
     * @param {string} name 
     * @param {*} value 
     * @param {import("./actions").CookieOptions} options 
     * @returns {void}
     */
    static set(
      name,
      value,
      options = {}
    ) {
      const serializedValue = encodeURIComponent(JSON.stringify(value));
      const cookie = `${name}=${serializedValue}`;
  
      let expires = options.expires;
      if (expires instanceof Date) {
        expires = expires.toUTCString();
      } else if (typeof expires === "number") {
        const d = new Date();
        d.setTime(d.getTime() + expires * 24 * 60 * 60 * 1000);
        expires = d.toUTCString();
      }
  
      const path = options.path ? `;path=${options.path}` : "";
      const domain = options.domain ? `;domain=${options.domain}` : "";
      const secure = options.secure ? ";secure" : "";
  
      if (expires) {
        expires = new Date(expires);
        document.cookie = `${cookie};expires=${expires.toUTCString()}${path}${domain}${secure}`;
      } else {
        document.cookie = `${cookie}${path}${domain}${secure}`;
      }
    }
    /**
 * Removes a cookie by setting its expiration date to a past date.
 * 
 * @param {string} name - The name of the cookie to remove.
 * @param {import("./actions").CookieOptions} options - Options to ensure correct path and domain.
 * @returns {void}
 */
static remove(name, options = {}) {
  // Build the base cookie string
  let cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC`;

  // Append optional path
  if (options.path) {
    cookie += `;path=${options.path}`;
  }

  // Append optional domain
  if (options.domain) {
    cookie += `;domain=${options.domain}`;
  }

  // Append the cookie to document.cookie to overwrite it with a past expiration
  document.cookie = cookie;
}
    /**
     * 
     * @param {string} name 
     * @returns {string | null | undefined}
     */
    static get(name) {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
          const value = cookie.substring(name.length + 1);
          try {
            return JSON.parse(decodeURIComponent(value));
          } catch {
            return null;
          }
        }
      }
      return null;
    }
    static setCookieToken = (key, payload) => {
      Cookie.set(key, payload);
    };
    static getCookieToken = (
      key
    ) => {
      return Cookie.get(key);
    };
    static removeToken = (key) => {
      Cookie.set(key, {});
    };
  }
    




export async function handleRefresh() {
    // console.log('handleRefresh')

    const refreshToken =  getRefreshToken();

    const token = await fetch(`${REACT_PUBLIC_API_HOST}/auth/refresh_token/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            refresh_token: refreshToken
        })
    })
    .then(response => response.json())
    .then((json) => {
        // console.log('Response - Refresh:',json)

        if (json.access_token) {
            Cookie.set('session_access_token', json.access_token, {
                httpOnly: true,
                /* eslint-disable no-undef */
                secure: process.env.NODE_ENV !== 'production',
                 
                maxAge: 60 * 60 * 24, // One day
                path: '/'
            });
            return json.access_token;
        } else {
            resetAuthCookies();
        }
    })
    .catch((error) => {
        console.log('Error - Refresh:',error)
        resetAuthCookies();
    });
    return token;
}
export async function handleLogin(id, first_name, last_name, user_role, access_token, refresh_token) {
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
    'session_refresh_token'
  ];

  sessionCookies.forEach((cookieName) => {
    Cookie.remove(cookieName, { path: '/' });
  });
}