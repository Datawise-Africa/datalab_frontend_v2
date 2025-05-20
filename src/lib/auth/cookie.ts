import type { CookieOptions } from '../types/CookieOptions';

export class Cookie {
  /**
   *
   * @param {string} name
   * @param {*} value
   * @param {CookieOptions} options
   * @returns {void}
   */
  static set(name: string, value: any, options: CookieOptions = {}) {
    const serializedValue = encodeURIComponent(JSON.stringify(value));
    const cookie = `${name}=${serializedValue}`;

    let expires = options.expires;
    if (expires instanceof Date) {
      expires = expires.toUTCString();
    } else if (typeof expires === 'number') {
      const d = new Date();
      d.setTime(d.getTime() + expires * 24 * 60 * 60 * 1000);
      expires = d.toUTCString();
    }

    const path = options.path ? `;path=${options.path}` : '';
    const domain = options.domain ? `;domain=${options.domain}` : '';
    const secure = options.secure ? ';secure' : '';

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
  static remove(name: string, options: CookieOptions = {}) {
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
  static get(name: string) {
    const cookies = document.cookie.split(';');
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
  static setCookieToken = (key: string, payload: any) => {
    Cookie.set(key, payload);
  };
  static getCookieToken = (key: string) => {
    return Cookie.get(key);
  };
  static removeToken = (key: string) => {
    Cookie.set(key, null);
  };
}
