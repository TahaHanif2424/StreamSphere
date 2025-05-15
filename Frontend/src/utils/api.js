// src/utils/api.js
export async function apiFetch(url, opts = {}) {
  const token = localStorage.getItem('accessToken');
  console.log(token);
  const options = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(opts.headers || {}),
    },
    ...opts,
  };

  let res = await fetch(url, options);

  if (res.status === 401) {
    const refresh = await fetch('/refresh', { method: 'GET', credentials: 'include' });
    if (refresh.ok) {
      const { accessToken } = await refresh.json();
      localStorage.setItem('accessToken', accessToken);
      options.headers.Authorization = `Bearer ${accessToken}`;
      res = await fetch(url, options);
    }
  }
  return res;
}
