// use localStorage to store the authority info, which might be sent from server in actual project.
import cookie from 'cookiejs';

export function getAuthority() {
  return cookie.get('YunLe-AI-authority') || localStorage.getItem('YunLe-AI-authority') || 'guest';
}

export function setAuthority(authority) {
  cookie({ 'YunLe-AI-authority': authority }, {
    expires: 7,
    path: '/',
    domain: 'hexiao-o.com',
  });
  return localStorage.setItem('YunLe-AI-authority', authority);
}

export function getToekn() {
  return cookie.get('YunLe-AI-token') || localStorage.getItem('YunLe-AI-token') || '';
}

export function setToekn(token) {
  cookie({ 'YunLe-AI-token': token }, {
    expires: 7,
    path: '/',
    domain: 'hexiao-o.com',
  });
  return localStorage.setItem('YunLe-AI-token', token);
}
