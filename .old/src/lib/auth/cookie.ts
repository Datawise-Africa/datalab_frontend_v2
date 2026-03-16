import type { CookieOptions } from '../types/CookieOptions';

type CookieState<T extends Record<string, any> = Record<string, any>> = {
  [K in keyof T]: T[K] extends string | number | boolean | object
    ? T[K]
    : never;
};

export class Cookie<T extends Record<string, any> = Record<string, any>> {
  /**
   *
   * @param {string} name
   * @param {*} value
   * @param {CookieOptions} options
   * @returns {void}
   */
  set(name: keyof CookieState<T>, value: any, options: CookieOptions = {}) {
    const serializedValue = encodeURIComponent(JSON.stringify(value));
    const cookie = `${String(name)}=${serializedValue}`;

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
  remove(name: keyof CookieState<T>, options: CookieOptions = {}) {
    // Build the base cookie string
    let cookie = `${String(name)}=;expires=Thu, 01 Jan 1970 00:00:00 UTC`;

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
   * @param {keyof CookieState<T>} name - The name of the cookie to retrieve.
   * @returns {any} The value of the cookie, parsed as JSON, or null
   */
  get(name: keyof CookieState<T>) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${String(name)}=`)) {
        const value = cookie.substring(String(name).length + 1);
        try {
          return JSON.parse(decodeURIComponent(value));
        } catch {
          return null;
        }
      }
    }
    return null;
  }
  setCookieToken = (key: keyof CookieState<T>, payload: any) => {
    this.set(key, payload);
  };
  getCookieToken = (key: keyof CookieState<T>) => {
    return this.get(key);
  };
  removeToken = (key: keyof CookieState<T>) => {
    this.set(key, null);
  };
}
