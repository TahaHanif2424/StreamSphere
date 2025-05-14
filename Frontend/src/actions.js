// src/routes/AuthRoute.jsx
import { redirect } from 'react-router-dom';
import store from '../store/index';
import { userActions } from '../store/user-slice';

export async function authAction({ request }) {
  const form = await request.formData();
  const mode = new URL(request.url).searchParams.get('mode');
  const endpoint = mode === 'signup' ? '/user/signup' : '/user/login';

  const res = await fetch(endpoint, {
    method: 'POST',
    credentials: 'include',                 // so refresh cookie is set
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(form))
  });
  if (!res.ok) throw new Error('Auth failed');

  if (mode === 'login') {
    const { accessToken } = await res.json();
    // Decode minimal user from the JWT payload
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const user = {
      _id: payload.userId,
      email: payload.email,
      channelName: payload.channelName,
      channelImageURL: payload.channelImageURL
    };
    localStorage.setItem('accessToken', accessToken);
    store.dispatch(userActions.addUser(user));
    return redirect('/');
  } else {
    return redirect('/auth?mode=login');
  }
}
