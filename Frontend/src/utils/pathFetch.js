// src/utils/patchFetch.js
import { apiFetch } from './api';

export function patchFetchForAuth() {
  window.fetch = new Proxy(window.fetch, {
    apply(_, thisArg, args) {
      const [url, options] = args;

      // only intercept your backend API, skip external URLs or auth routes
      if (
        typeof url === 'string' &&
        url.startsWith('http://localhost:5000/') &&
        !url.includes('/login') &&
        !url.includes('/signup')
      ) {
        return apiFetch(url, options || {});
      }

      return Reflect.apply(window.fetch, thisArg, args);
    }
  });
}
